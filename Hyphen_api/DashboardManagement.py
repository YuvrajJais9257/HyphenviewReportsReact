import os
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from db_connect_details import get_mysql_connection
import json
class DashboardManagement:
    def __init__(self, conf):
        self.conf = conf
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.base_dir = os.getcwd()
        self.logfilepath = os.path.join(self.base_dir, 'logs')
        self.configfilepath = os.path.join(os.getcwd(), 'Cfg/config.json')
        self.app = FastAPI()
        self.setup_middleware()
        self.mysql_database_url = {
            "host": self.conf["mysql_host"],
            "port": self.conf["mysql_port"],
            "username": self.conf["mysql_username"],
            "password": self.conf["mysql_password"],
            "schema": self.conf["mysql_new_schema"]
        }
    def setup_middleware(self):
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        
    def list_frame(self,detail):
        print(detail,"detail")
        customer_id = detail["customer_id"]
        group_id = int(detail["group_id"])
        database_mysql = get_mysql_connection(self.mysql_database_url)
        try:
            with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
                select_query = "SELECT dashboard_report_id,dashboard_json_frame_data,dashboard_report_name, group_id, customer_id FROM dashboard_report_frame WHERE customer_id=%s and group_id = %s"
                cursor.execute(select_query,(customer_id,group_id))
                frame_result = cursor.fetchone()
                if frame_result is None:
                    return {"status": "success", "frame":[],"report_excluded":[]}
                report_included = tuple(report["chartType"] for report in json.loads(frame_result["dashboard_json_frame_data"]))
                print(report_included)
                if len(report_included) == 1:
                    report_included = tuple(report_included[0])
                print(report_included)
                report_select_query = f"SELECT report_template_name FROM view_report_access_group WHERE customer_id='{customer_id}' and group_id = {group_id} and report_template_name not in {report_included}"
                if len(report_included) == 0:
                    report_select_query = f"SELECT report_template_name FROM view_report_access_group WHERE customer_id='{customer_id}' and group_id = {group_id}"
                print(report_select_query)
                cursor.execute(report_select_query)
                # Commit the transaction
                result = cursor.fetchall()
                print(result)
                report_excluded = []
                if len(result) > 0:
                    report_excluded = [report["report_template_name"] for report in result]
                    print(report_excluded)
                database_mysql.commit()
            print("---------------",frame_result)
            return {"status": "success", "frame":json.loads(frame_result["dashboard_json_frame_data"]),"report_excluded":report_excluded }
        except HTTPException as unexpected_exception:
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
        except Exception as exception:
            return {"status":"Failed","message":f"Unable to get the JSON frame due to {exception}"}
    
    def multi_list_frame(self,detail):
        customer_id = detail["customer_id"]
        group_id = detail["group_id"]
        database_mysql = get_mysql_connection(self.mysql_database_url)
        try:
            with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
                select_query = "SELECT dashboard_report_name,dashboard_json_frame_data,customer_id FROM combined_dashboard_view WHERE customer_id=%s and group_id=%s and access != 'null'"
                cursor.execute(select_query,(customer_id,group_id))
                frame_result = cursor.fetchall()
                if frame_result is None:
                    return {"status": "success", "frame":[],"report_excluded":[]}
                frames = []
                for frame in frame_result:
                    report_included = tuple(report["chartType"] for report in json.loads(frame["dashboard_json_frame_data"]))
                    if len(report_included) == 1:
                        report_included = str(report_included).replace(",","")
                    report_select_query = f"SELECT report_template_name,report_type,chart_type FROM view_report_access_group WHERE customer_id='{customer_id}' and group_id='{group_id}' and access_mask != 'null' and report_template_name not in {report_included}"
                    if len(report_included) == 0:
                        report_select_query = f"SELECT report_template_name,report_type,chart_type FROM view_report_access_group WHERE customer_id='{customer_id}' and group_id='{group_id}' and access_mask != 'null'"
                    cursor.execute(report_select_query)
                    # Commit the transaction
                    result = cursor.fetchall()
                    report_excluded = []
                    if len(result) > 0:
                        # report = {"report_name":report["report_template_name"],"report_type":report["report_type"],"chart_type":report["chart_type"]}
                        report_excluded = [{"report_name":report["report_template_name"],
                                            "report_type":report["report_type"],
                                            "chart_type":report["chart_type"]} for report in result]
 
                    ## Get Access
                    access_query = (f"SELECT access from combined_dashboard_view WHERE customer_id='{customer_id}' "
                                    f"and group_id='{group_id}' and dashboard_report_name ='{frame['dashboard_report_name']}'")
                    cursor.execute(access_query)
                    # Commit the transaction
                    access_result = cursor.fetchone()
                    dashboard_frame = {"frame": json.loads(frame["dashboard_json_frame_data"]),
                                       "dashboard_name":frame["dashboard_report_name"],
                                       "dashboard_access":access_result['access'],
                                       "report_excluded": report_excluded}
                    frames.append(dashboard_frame)
                database_mysql.commit()
            return {"status": "success", "frames": frames}
        except HTTPException as unexpected_exception:
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
        except Exception as exception:
            return {"status":"Failed","message":f"Unable to get the JSON frame due to {exception}"}
    
    def edit_frame(self,detail):
        customer_id = detail["customer_id"]
        group_id = detail["group_id"]
        dashboard_name = detail["dashboard_name"]
        database_mysql = get_mysql_connection(self.mysql_database_url)
        try:
            with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
                select_query = "SELECT dashboard_report_name,dashboard_json_frame_data,customer_id FROM combined_dashboard_view WHERE customer_id=%s and group_id=%s and dashboard_report_name=%s"
                cursor.execute(select_query,(customer_id,group_id,dashboard_name))
                frame_result = cursor.fetchall()
                if frame_result is None:
                    return {"status": "success", "frame":[],"report_excluded":[]}
                frames = []
                for frame in frame_result:
                    report_included = tuple(report["chartType"] for report in json.loads(frame["dashboard_json_frame_data"]))
                    if len(report_included) == 1:
                        report_included = str(report_included).replace(",","")
                    report_select_query = f"SELECT report_template_name,report_type,chart_type FROM view_report_access_group WHERE customer_id='{customer_id}' and group_id='{group_id}' and access_mask != 'null' and report_template_name not in {report_included}"
                    if len(report_included) == 0:
                        report_select_query = f"SELECT report_template_name,report_type,chart_type FROM view_report_access_group WHERE customer_id='{customer_id}' and group_id='{group_id}' and access_mask != 'null'"
                    cursor.execute(report_select_query)
                    # Commit the transaction
                    result = cursor.fetchall()
                    report_excluded = []
                    if len(result) > 0:
                        # report = {"report_name":report["report_template_name"],"report_type":report["report_type"],"chart_type":report["chart_type"]}
                        report_excluded = [{"report_name":report["report_template_name"],
                                            "report_type":report["report_type"],
                                            "chart_type":report["chart_type"]} for report in result]
 
                    ## Get Access
                    access_query = (f"SELECT access from combined_dashboard_view WHERE customer_id='{customer_id}' "
                                    f"and group_id='{group_id}' and dashboard_report_name ='{frame['dashboard_report_name']}'")
                    cursor.execute(access_query)
                    # Commit the transaction
                    access_result = cursor.fetchone()
                    dashboard_frame = {"frame": json.loads(frame["dashboard_json_frame_data"]),
                                       "dashboard_name":frame["dashboard_report_name"],
                                       "dashboard_access":access_result['access'],
                                       "report_excluded": report_excluded}
                    frames.append(dashboard_frame)
                database_mysql.commit()
            return {"status": "success", "frames": frames}
        except HTTPException as unexpected_exception:
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
        except Exception as exception:
            return {"status":"Failed","message":f"Unable to get the JSON frame due to {exception}"}
    
    def update_in_db(self,detail):
        database_mysql = get_mysql_connection(self.mysql_database_url)
        dashboard_json_frame_data = detail["dashboard_json_frame_data"]
        json_data = json.dumps(dashboard_json_frame_data)
        customer_id = detail["customer_id"]
        dashboard_report_name = detail["dashboard_report_name"]
        print(detail,"detail")
        try:
            with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
                select_query = "SELECT dashboard_report_name FROM dashboard_report_frame WHERE dashboard_report_name=%s and customer_id=%s"
                cursor.execute(select_query, (dashboard_report_name, customer_id))
                result = cursor.fetchone()
                print(result,"result")
                if result is None:
                    return {"status": "success", "message": f"No JsonFrame exist with name {dashboard_report_name}"}
                update_query = "UPDATE dashboard_report_frame SET dashboard_json_frame_data=%s WHERE dashboard_report_name=%s and customer_id=%s"
                print(update_query)
                cursor.execute(update_query,(json_data, dashboard_report_name,customer_id))
               
                # Commit the transactio
                database_mysql.commit()
            return {"status": "success", "message": "JsonFrame Updated Successfully!"}
        except HTTPException as unexpected_exception:
            print(f"Unexpected error: {unexpected_exception}")
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
        except Exception as exception:
            print(exception)
            return {"status":"Failed","message":f"Unable to updated the JSON frame due to {exception}"}
    
    
    def delete_frame(self,detail):
        customer_id = detail["customer_id"]
        frame_name = detail["frame_name"]
        database_mysql = get_mysql_connection(self.mysql_database_url)
        try:
            with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
                select_query = "SELECT dashboard_report_id,dashboard_json_frame_data,dashboard_report_name,customer_id FROM dashboard_report_frame WHERE customer_id=%s and dashboard_report_name=%s"
                cursor.execute(select_query,(customer_id,frame_name))
                frame_result = cursor.fetchone()
                if frame_result is None:
                    return {"status": "success", "message": "No frame exist for customer_id {}".format(customer_id)}
                delete_query = "DELETE FROM dashboard_report_frame WHERE customer_id=%s and dashboard_report_name=%s"
                cursor.execute(delete_query, (customer_id,frame_name))
                database_mysql.commit()
                access_delete_query = "DELETE FROM dashboard_access_right WHERE customer_id=%s and dashboard_report_name=%s"
                cursor.execute(access_delete_query, (customer_id,frame_name))
                database_mysql.commit()
                return {"status": "success", "message": "Removed frame for customer_id {}".format(customer_id)}
        except HTTPException as unexpected_exception:
            print(f"Unexpected error: {unexpected_exception}")
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
        except Exception as exception:
            print(exception)
            return {"status":"Failed","message":f"Unable to delete the JSON frame due to {exception}"}
        finally:
            if "cursor" and "database_mysql" in locals():
                cursor.close()
                database_mysql.close()
    
    def check_frame(self,details):
        dataframe_name = details['dashboard_report_name']
        customer_id = details['customer_id']
        database_mysql = get_mysql_connection(self.mysql_database_url)
        try:
            with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
                select_query = "SELECT dashboard_report_name FROM dashboard_report_frame WHERE dashboard_report_name=%s and customer_id=%s "
                cursor.execute(select_query,(dataframe_name,customer_id,))
                frame_result = cursor.fetchone()
                if frame_result is None:
                    return {"status": "success", "message": "No frame exist with name {}".format(dataframe_name),
                            "verify":0}
                return {"status": "success", "message": "Frame exist with name {}".format(dataframe_name),
                        "verify":1}
        except HTTPException as unexpected_exception:
            print(f"Unexpected error: {unexpected_exception}")
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
        except Exception as exception:
            print(exception)
            return {"status":"Failed","message":f"Unable to find the JSON frame due to {exception}"}
        finally:
            if "cursor" and "database_mysql" in locals():
                cursor.close()
                database_mysql.close()
    
    # def insert_in_db(self,detail):
    #     print(detail,"detail")
    #     database_mysql = get_mysql_connection(self.mysql_database_url)
    #     dashboard_json_frame_data = detail["dashboard_json_frame_data"]
    #     json_data = json.dumps(dashboard_json_frame_data)
    #     group_id = detail["group_id"]
    #     customer_id = detail["customer_id"]
    #     dashboard_report_name = detail["dashboard_report_name"]
    #     try:
    #         with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
    #             insert_query = "INSERT INTO dashboard_report_frame (dashboard_json_frame_data, customer_id, dashboard_report_name, group_id) VALUES (%s, %s, %s, %s)"
    #             cursor.execute(insert_query,(json_data, customer_id, dashboard_report_name, group_id))
    #             # Commit the transaction
    #             database_mysql.commit()
    #         return {"status": "success", "message": "JsonFrame Added Successfully!"}
    #     except HTTPException as unexpected_exception:
    #         print(f"Unexpected error: {unexpected_exception}")
    #         raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
    #     except Exception as exception:
    #         print(exception)
    #         return {"status":"Failed","message":f"Unable to add the JSON frame due to {exception}"}
    
    def insert_in_db(self,detail):
        database_mysql = get_mysql_connection(self.mysql_database_url)
        dashboard_json_frame_data = detail["dashboard_json_frame_data"]
        json_data = json.dumps(dashboard_json_frame_data)
        customer_id = detail["customer_id"]
        dashboard_report_name = detail["dashboard_report_name"]
        dashboard_description = detail["dashboard_description"]
        #
        default_access = "r"
        group_id = detail["group_id"]
        if str(group_id) == "1":
            default_access = "rw"
        try:
            with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
                insert_query = "INSERT INTO dashboard_report_frame (dashboard_json_frame_data, customer_id, dashboard_report_name,dashboard_description) VALUES (%s, %s, %s, %s)"
                cursor.execute(insert_query,(json_data, customer_id, dashboard_report_name,dashboard_description))
                # Commit the transaction
                database_mysql.commit()
                access_insert_query = "INSERT INTO dashboard_access_right (group_id, dashboard_report_name,access,customer_id) VALUES (%s, %s, %s,%s)"
                cursor.execute(access_insert_query,(group_id,dashboard_report_name,default_access,customer_id))
                database_mysql.commit()
            return {"status": "success", "message": "JsonFrame Added Successfully!"}
        except HTTPException as unexpected_exception:
            print(f"Unexpected error: {unexpected_exception}")
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
        except Exception as exception:
            print(exception)
            return {"status":"Failed","message":f"Unable to add the JSON frame due to {exception}"}
        
    def list_access(self,detail):
        database_mysql = get_mysql_connection(self.mysql_database_url)
        # json_data = json.dumps(dashboard_json_frame_data)
        customer_id = detail["customer_id"]
        group_id = detail["group_id"]
        try:
            with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
                select_query = "SELECT group_id,dashboard_report_name,access,customer_id FROM dashboard_access_right WHERE customer_id=%s and group_id=%s"
                cursor.execute(select_query,(customer_id,group_id))
                frame_result = cursor.fetchall()
                print(frame_result,"frame_result")
                database_mysql.commit()
                return {"status": "success", "frame":frame_result}
        except HTTPException as unexpected_exception:
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
        except Exception as exception:
            return {"status":"Failed","message":f"Unable to get the JSON frame due to {exception}"}
 
    def get_list_dashboards(self,detail):
        database_mysql = get_mysql_connection(self.mysql_database_url)
        customer_id = detail["customer_id"]
        try:
            with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
                select_query = "SELECT dashboard_report_name,customer_id,group_id,access,dashboard_description,groupname FROM combined_dashboard_view WHERE customer_id=%s"
                cursor.execute(select_query, (customer_id,))
                frame_result = cursor.fetchall()
                database_mysql.commit()
                return {"status": "success", "dashboards": frame_result}
        except HTTPException as unexpected_exception:
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
        except Exception as exception:
            return {"status": "Failed", "message": f"Unable to get the dashboard list due to {exception}"}
        
        
    def get_list_dashboards_name(self,detail):
        database_mysql = get_mysql_connection(self.mysql_database_url)
        customer_id = detail["customer_id"]
        try:
            with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
                select_query = "SELECT DISTINCT dashboard_report_name,customer_id,dashboard_description FROM hyphenview_new_release_test.combined_dashboard_view WHERE customer_id=%s"
                cursor.execute(select_query, (customer_id,))
                frame_result = cursor.fetchall()
                database_mysql.commit()
                return {"status": "success", "dashboards": frame_result}
        except HTTPException as unexpected_exception:
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
        except Exception as exception:
            return {"status": "Failed", "message": f"Unable to get the dashboard list due to {exception}"}
        
    
    def update_access(self,detail):
        #{group_id:"1",customer_id:"",dashboard_access:{"abc":r,"bcs":"rw}}
        database_mysql = get_mysql_connection(self.mysql_database_url)
        customer_id = detail["customer_id"]
        group_id = detail["group_id"]
        print(dict(detail["dashboard_access"]).items())
        try:
            with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
                for dashboard,access in dict(detail["dashboard_access"]).items():
                    print(dashboard,access)
                    select_query = "SELECT dashboard_report_name FROM dashboard_access_right WHERE dashboard_report_name=%s and customer_id=%s and group_id=%s"
                    cursor.execute(select_query, (dashboard, customer_id,group_id))
                    result = cursor.fetchone()
                    print(result)
                    if access == '':
                        access = 'null'
                    if result is None:
                        print("Insert...")
                        insert_query = "INSERT INTO dashboard_access_right (group_id, dashboard_report_name,access,customer_id) VALUES (%s, %s, %s,%s)"
                        cursor.execute(insert_query, (group_id, dashboard, access, customer_id))
                        database_mysql.commit()
                        # return {"status": "success", "message": f"Access updated successfully."}
                    update_query = "UPDATE dashboard_access_right SET access=%s WHERE dashboard_report_name=%s and customer_id=%s and group_id=%s"
                    cursor.execute(update_query,(access, dashboard,customer_id,group_id))
                    # Commit the transaction
                    database_mysql.commit()
            return {"status": "success", "message": "Access updated successfully."}
        except HTTPException as unexpected_exception:
            print(f"Unexpected error: {unexpected_exception}")
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
        except Exception as exception:
            print(exception)
            return {"status":"Failed","message":f"Unable to update dashboard access due to {exception}"}
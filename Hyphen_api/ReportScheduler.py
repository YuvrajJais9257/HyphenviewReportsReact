import json
import os
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from db_connect_details import get_mysql_connection
 
class ReportScheduler:
    def __init__(self, conf):
        self.conf = conf
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
 
    def insert_scheduler(self, details: dict):
        print(details)
        try:
            report_title, report_attachment = details["reportTitle"], details["reportattachment"]
            reportIDEB, scheduledtime = details["selectedreport"], details["scheduledTime"]
            emailid, emailcc = json.dumps(details["emailTo"]), json.dumps(details["emailCC"])
            emailbody, SchedulerPeriod = details["emailBody"], details["interval"]
            startDate, customer_id = details["startDate"], details["customer_id"]
            interval_days = {"daily":1,"weekly":7,"monthly":30}
            json_data = json.dumps(report_attachment)
            print(json_data,"**")
            # if database_type == "mysql":
            database_mysql = get_mysql_connection(self.mysql_database_url)
            with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
                # Insert into dashboard_schedulerinfo
                cursor.execute("INSERT INTO dashboard_schedulerinfo (`scheduledtime`, `scheduledIntervalDays`, "
                               "`scheduledIntervalTime`, `status`, `emailid`, `SchedulerPeriod`, `customer_id`, "
                               "`emailcc`, `startDate`, `reportTitle`, `reportIDEB`, `emailBodyContent`, `reportattachment`) "
                               "VALUES (%s, %s, %s, %s, %s, %s, %s,%s,%s,%s,%s,%s,%s)",
                               (scheduledtime,interval_days[str(SchedulerPeriod).lower()],"1","1",emailid,SchedulerPeriod,customer_id,
                                emailcc,startDate,report_title,reportIDEB,emailbody,json_data))
            # Commit the transaction
            database_mysql.commit()
            return {"status": "success", "message": "Scheduler Added Successfully!"}
        except HTTPException as unexpected_exception:
            print(f"Unexpected error: {unexpected_exception}")
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
        except Exception as exception:
            return {"status": "Failed", "message": "Unable to insert the scheduler!"}
 
    def list_scheduler(self, details: dict):
        try:
            customer_id = details["customer_id"]
            database_mysql = get_mysql_connection(self.mysql_database_url)
            with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
                cursor.execute("SELECT `scheduleid`,`scheduledtime`, `scheduledIntervalDays`, "
                               "`scheduledIntervalTime`, `status`, `emailid`, `SchedulerPeriod`, `customer_id`, "
                               "`emailcc`, `startDate`, `reportTitle`, `reportIDEB`, `emailBodyContent`, `reportattachment` "
                               "FROM dashboard_schedulerinfo WHERE `customer_id`= %s",(customer_id,))
                Schedulers = cursor.fetchall()
            # Commit the transaction
            database_mysql.commit()
            return {"status": "success", "Schedulers": Schedulers}
        except HTTPException as unexpected_exception:
            print(f"Unexpected error: {unexpected_exception}")
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
        except Exception as exception:
            return {"status": "Failed", "message": "Unable to list the scheduler!"}
        


    def update_scheduler(self, details: dict):
        print(details)
        try:
            interval_days = {"daily": 1, "weekly": 7, "monthly": 30}
            current_value = {
                "scheduleid":details["scheduleid"],
                "scheduledtime":details["scheduledTime"],
                "scheduledIntervalDays":interval_days[str(details["interval"]).lower()],
                "scheduledIntervalTime":"1",
                "status":"1",
                "emailid":json.dumps(details["emailTo"]),
                "SchedulerPeriod":details["interval"],
                "customer_id":details["customer_id"],
                "emailcc": json.dumps(details["emailCC"]),
                "startDate":details["startDate"],
                "reportTitle":details["reportTitle"],
                "reportIDEB":details["selectedreport"],
                "emailBodyContent":details["emailBody"],
                "reportattachment":json.dumps(details["reportattachment"])
            }
            
            print(current_value['scheduleid'],current_value['customer_id'])
 
            database_mysql = get_mysql_connection(self.mysql_database_url)
            with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
                # Insert into dashboard_schedulerinfo
                cursor.execute("SELECT `scheduleid`,`scheduledtime`, `scheduledIntervalDays`, "
                               "`scheduledIntervalTime`, `status`, `emailid`, `SchedulerPeriod`, `customer_id`, "
                               "`emailcc`, `startDate`, `reportTitle`, `reportIDEB`, `emailBodyContent`, `reportattachment`"
                               " FROM dashboard_schedulerinfo WHERE scheduleid=%s and customer_id=%s",
                               (current_value['scheduleid'],current_value['customer_id'],))
                result = cursor.fetchone()
                print(result,"result")
                if result:
                    differences = self.compare_dictionaries(result, current_value)
                    del differences["values_diff"]["scheduleid"]
                    update_query = self.generate_update_query("dashboard_schedulerinfo",differences["values_diff"],
                                                              "scheduleid",current_value["scheduleid"])
                    update_query = update_query + f" and customer_id={current_value['customer_id']}"
                    print(update_query)
                    cursor.execute(update_query)
            database_mysql.commit()
            return {"status": "success", "message": "Scheduler Updated Successfully!"}
        except HTTPException as unexpected_exception:
            print(f"Unexpected error: {unexpected_exception}")
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
        except Exception as exception:
            return {"status": "Failed", "message": "Unable to update the scheduler!"}
 
    def delete_scheduler(self, details: dict):
        try:
            customer_id = details["customer_id"]
            scheduleid = details["scheduleid"]
            database_mysql = get_mysql_connection(self.mysql_database_url)
            with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
                cursor.execute("SELECT `scheduleid` FROM dashboard_schedulerinfo WHERE scheduleid=%s and customer_id=%s",
                               (scheduleid,customer_id,))
                result = cursor.fetchone()
                if result:
                    delete_query = "DELETE FROM dashboard_schedulerinfo WHERE scheduleid=%s and customer_id=%s"
                    cursor.execute(delete_query,(scheduleid,customer_id))
                    database_mysql.commit()
                    return {"status": "success", "message": "Scheduler Deleted Successfully!"}
                else:
                    database_mysql.commit()
                    return {"status": "failed", "message": "Scheduler not exist."}
        except HTTPException as unexpected_exception:
            print(f"Unexpected error: {unexpected_exception}")
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
        except Exception as exception:
            return {"status": "Failed", "message": "Unable to delete the scheduler!"}
        
    
    def compare_dictionaries(self,dict_db, dict_current):
        differences = {}
        values_diff = {}
        for key in dict_current.keys():
            if key in dict_db:
                if dict_db[key] != dict_current[key]:
                    # Handle special case for datetime objects
                    if isinstance(dict_db[key], datetime):
                        db_value = dict_db[key].strftime('%Y-%m-%d %H:%M:%S')
                        print(db_value)
                        current_value = dict_current[key]
                        if current_value != db_value:
                            values_diff[key] = (current_value)
                    else:
                        values_diff[key] = (dict_current[key])
 
        differences['values_diff'] = values_diff
 
        return differences
    
    def generate_update_query(self,table_name, values_diff, condition_column, condition_value):
        update_query = f"UPDATE {table_name} SET "
        print(update_query)
        for key, value in values_diff.items():
            print(key,value)
            update_query += f"{key} = '{value}', "
        update_query = update_query[:-2]  # Remove the trailing comma and space
        update_query += f" WHERE {condition_column} = '{condition_value}'"
        return update_query
    
    
    def list_scheduler_by_id(self, details: dict):
        try:
            customer_id = details["customer_id"]
            scheduleid = details["scheduleid"]
            database_mysql = get_mysql_connection(self.mysql_database_url)
            with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
                cursor.execute("SELECT `scheduleid`,`scheduledtime`, `scheduledIntervalDays`, "
                               "`scheduledIntervalTime`, `status`, `emailid`, `SchedulerPeriod`, `customer_id`, "
                               "`emailcc`, `startDate`, `reportTitle`, `reportIDEB`, `emailBodyContent`, `reportattachment` "
                               "FROM dashboard_schedulerinfo WHERE `scheduleid`=%s and `customer_id`= %s",(scheduleid,customer_id))
                Schedulers = cursor.fetchone()
            database_mysql.commit()
            return {"status": "success", "Schedulers": Schedulers}
        except HTTPException as unexpected_exception:
            print(f"Unexpected error: {unexpected_exception}")
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
        except Exception as exception:
            return {"status": "Failed", "message": "Unable to list the scheduler!"}
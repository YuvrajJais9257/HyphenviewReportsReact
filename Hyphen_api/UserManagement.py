import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from db_connect_details import get_mysql_connection
from datetime import datetime

class UserManagement:
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

    def get_password_hash(self, password: str) -> str:
        return self.pwd_context.hash(password)

    def save_user(self, details: dict):
        try:
            database_type = details.get("database_type")
            new_user_email = details.get("new_user_email")
            password = details.get("password")
            email = details.get("email")
            group_id = details.get("group_id")
            date = datetime.now()
            if database_type == "mysql":
                database_mysql = get_mysql_connection(self.mysql_database_url)
                with database_mysql.cursor(dictionary=True,buffered=True) as cursor:
                    # Fetch customer_id
                    cursor.execute("SELECT customer_id FROM user_account WHERE user_email_id = %s", (email,))
                    customer_result = cursor.fetchone()
                    if customer_result:
                        customer_id = customer_result["customer_id"]
                    else:
                        # Handle case where no customer found for the given email
                        return {"status":401,"message":"No customer found for email: {}".format(email)}
 
                    hashed_password = self.get_password_hash(password)
 
                    # Insert into user_account
                    cursor.execute("INSERT INTO user_account VALUES (%s, %s, %s, %s, %s, %s, %s)",
                        (new_user_email, hashed_password, customer_id, group_id, 'Active', 'N', date))

                    cursor.execute("INSERT INTO user_group_map (user_email_id,group_id,created_at) VALUES (%s, %s, %s)",
                        (new_user_email, group_id, date))
                # Commit the transaction
                database_mysql.commit()
            return {"status": "success", "message": "User Added Successfully!"}
        except HTTPException as unexpected_exception:
            print(f"Unexpected error: {unexpected_exception}")
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
        except Exception as exception:
            return {"status":"Failed","message":"User All Ready Exist !"}
        


    def fetch_details(self, details: dict):
        email = details["email"]
        database_type = details.get("database_type")
        if database_type == "mysql":
            database_mysql = get_mysql_connection(self.mysql_database_url)
            with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
                cursor.execute("SELECT customer_id FROM user_account WHERE user_email_id = %s", (email,))
                customer_result = cursor.fetchone()
                if customer_result:
                    customer_id = customer_result["customer_id"]
                else:
                    # Handle case where no customer found for the given email
                    return {"status":404,"message":"No customer found for email: {}".format(email)}
 
                cursor.execute("SELECT group_id, groupname,customer_id FROM user_group WHERE customer_id=%s", (customer_id,))
                group_result = cursor.fetchall() 
 
                #Report Associated with this group
                reports = {}
                if group_result:
                    for group in group_result:
                        print(group)
                        cursor.execute("SELECT report_id FROM group_report_map WHERE group_id=%s",
                                       (group['group_id'],))
                        reports_id = cursor.fetchall()
                        print(reports_id)
                        if len(reports_id)>0:
                            for report_id in reports_id:
                                cursor.execute("SELECT report_id,report_template_name, defined_query FROM report_template WHERE report_id=%s",
                                               (report_id['report_id'],))
                                report = cursor.fetchall()
                                reports[group['groupname']] = report
                        else:
                            reports[group['groupname']] = []
 
            return {"status": "success", "group_names": group_result, "assigned_reports":reports}
        

    # def edit_user(self,details: dict):
    #     try:
    #         current_password = details.get("current_password")
    #         new_password = details.get("new_password")
    #         database_type = details.get("database_type")
    #         email = details.get("email")
    #         if database_type == "mysql":
    #             database_mysql = get_mysql_connection(self.mysql_database_url)
    #             with database_mysql.cursor(dictionary=True,buffered=True) as cursor:
    #                 # Fetch customer_id
    #                 cursor.execute("SELECT user_email_id, password, group_id FROM user_account WHERE user_email_id = %s", (email,))
    #                 customer_result = cursor.fetchone()
    #                 print(customer_result)
    #                 if customer_result:
    #                     match_password = self.verify_password(current_password,customer_result['password'])
    #                     if match_password:
    #                         hashed_password = self.get_password_hash(new_password)
    #                         cursor.execute("UPDATE user_account SET password=%s WHERE user_email_id = %s",(hashed_password,email,))
    #                         database_mysql.commit()
    #                         return {"status": "success", "message": "Password Reset Successfully!"}
    #                     else:
    #                         return {"status":401,"message":"Current Password is not matched."}
    #                 else:
    #                     return {"status":404,"message":f"No customer found for email: {email}"}
    #     except Exception as unexpected_exception:
    #         raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))

    # def verify_password(self, plain_password: str, hashed_password: str) -> bool:
    #     return self.pwd_context.verify(plain_password, hashed_password)
    
    
    # def delete_user(self,details: dict):
    #     try:
    #         database_type = details.get("database_type")
    #         # new_user_email = details.get("new_user_email")
    #         email = details.get("email")
    #         print(database_type,email)
    #         if database_type == "mysql":
    #             database_mysql = get_mysql_connection(self.mysql_database_url)
    #             with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
    #                 # Fetch customer_id
    #                 cursor.execute(
    #                     "SELECT user_email_id, password, group_id  FROM user_account WHERE user_email_id = %s",
    #                     (email,))
    #                 customer_result = cursor.fetchone()
    #                 print(customer_result)
    #                 if customer_result:
    #                     cursor.execute("DELETE FROM `user_group_map` WHERE (`user_email_id` = %s)", (email,))
    #                     cursor.execute("DELETE FROM `user_account` WHERE (`user_email_id` = %s)",(email,))
    #                 else:
    #                     # Handle case where no customer found for the given email
    #                     return {"status":404,"message":f"No customer found for email: {email}"}
    #             database_mysql.commit()
    #             return {"status":200, "message": "User Removed Successfully!"}
    #     except Exception as unexpected_exception:
    #         print(f"Unexpected error: {unexpected_exception}")
    #         raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
    
    def edit_user(self,details: dict):
        try:
            # current_password = details.get("current_password")
            new_password = details.get("new_password")
            database_type = details.get("database_type")
            email = details.get("email")
            if database_type == "mysql":
                database_mysql = get_mysql_connection(self.mysql_database_url)
                with database_mysql.cursor(dictionary=True,buffered=True) as cursor:
                    # Fetch customer_id
                    cursor.execute("SELECT user_email_id, password, group_id FROM user_account WHERE user_email_id = %s", (email,))
                    customer_result = cursor.fetchone()
                    print(customer_result)
                    if customer_result:
                        # match_password = self.verify_password(current_password,customer_result['password'])
                        # if match_password:
                        hashed_password = self.get_password_hash(new_password)
                        cursor.execute("UPDATE user_account SET password=%s WHERE user_email_id = %s",(hashed_password,email,))
                        database_mysql.commit()
                        return {"status": "success", "message": "Password Reset Successfully!"}
                        # else:
                        #     return {"status":401,"message":"Current Password is not matched."}
                    else:
                        return {"status":404,"message":f"No customer found for email: {email}"}
        except Exception as unexpected_exception:
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))


    
    def assignGroup(self, details: dict):
        try:
            customer_id = details["customer_id"]
            # customer_email = details["email"]
            user_details = details["user_details"]
            print(customer_id,user_details)
            # database_type = details.get("database_type")
            # if database_type == "mysql":
            database_mysql = get_mysql_connection(self.mysql_database_url)
            with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
                for user in user_details:
                    group_id = user["group_id"]
                    user_email = user["user_email"]
                    cursor.execute("SELECT group_id from user_account WHERE customer_id=%s and user_email_id=%s", (customer_id,user_email))
                    result = cursor.fetchone()
                    print(result)
                    if result:
                        if result["group_id"] != group_id:
                            cursor.execute("UPDATE user_group_map SET group_id = %s WHERE user_email_id=%s", (group_id,user_email))
                            cursor.execute("UPDATE user_account SET group_id = %s WHERE customer_id=%s and user_email_id=%s", (group_id,customer_id,user_email))
            database_mysql.commit()
            return {"status": "success", "message":"Group Updated Successfully."}
        except Exception as exception:
            return {"status": "failed", "message":f"Failed to update group due to {exception}"}


    
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from passlib.context import CryptContext
from lib import commonutility as common

class AuthenticationManager:
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.base_dir = os.getcwd()
        self.logfilepath = os.path.join(self.base_dir, 'logs')
        self.configfile = os.path.join(os.getcwd(), 'config')
        self.configfilepath = os.path.join(os.getcwd(), 'Cfg/config.json')
        self.conf = common.read_config(self.configfilepath)
        self.db_config = {
            "host": self.conf["mysql_host"],
            "port": self.conf["mysql_port"],
            "username": self.conf["mysql_username"],
            "password": self.conf["mysql_password"],
            "database": self.conf["mysql_new_schema"]
        }
        self.app = FastAPI()
        self.setup_middleware()
        # self.setup_routes()

    def setup_middleware(self):
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)

    def validate_login(self, user_email, password):
        print(user_email, password,"login_data")
        try:
            connection = mysql.connector.connect(**self.db_config)
            cursor = connection.cursor()
            query = "SELECT * FROM `user_account` WHERE user_email_id = %s"
            cursor.execute(query, (user_email,))
            user = cursor.fetchone()
            if user and self.verify_password(password, user[1]):
                return {'validate': True,'status_code':200,'message': 'username is valid'}
            else:
                return {'validate': False,'status_code':400,'message': 'Invalid username or password'}
        except Exception as e:
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(e))
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    def authorization(self, email, database_type):
        print(email,database_type,"database_type")
        try:
            if database_type == "mysql":
                connection = mysql.connector.connect(**self.db_config)
                cursor = connection.cursor(dictionary=True)
                query = "SELECT * FROM user_account WHERE user_email_id = %s"
                cursor.execute(query, (email,))
                user_details = cursor.fetchall()
                group_id = user_details[0]["group_id"]
                print(group_id)
                if user_details:
                    cursor.execute("select user_email_id,accessmask,customer_id, customer_name, group_id, groupname, feature_id,feature_logo, featurename from view_user_access_group where group_id = %s and user_email_id = %s and accessmask != 'null'",(group_id,email,))
                    result = cursor.fetchall()
                    print(result,'-------------------')
                    if result:
                        modified_data = {}
                        for item in result:
                            user_email_id = item["user_email_id"]
                            customer_id = item["customer_id"]
                            group_id = item["group_id"]
                            groupname = item["groupname"]
                            feature_id = item["feature_id"]
                            featurename = item["featurename"]
                            customer_name = item["customer_name"]
                            accessmask = item["accessmask"]
                            feature_logo = item["feature_logo"]
                            if (customer_id, group_id, groupname) not in modified_data:
                                modified_data[(customer_id, group_id, groupname)] = {"user_email_id":user_email_id, "customer_id": customer_id, "customer_name":customer_name, "group_id": group_id, "groupname": groupname, "features": []}
                            modified_data[(customer_id, group_id, groupname)]["features"].append({"feature_id": feature_id, "featurename": featurename,"accessmask":accessmask,"feature_lcon":feature_logo})
                        modified_data_list = list(modified_data.values())
                        return {"user_data": modified_data_list[0],'status_code':200,'message': 'user is authoriz'}
                    else:
                        return {'status_code':400,"message":"Not Assigned any Features"}
                else:
                    return {'status_code':404,'message': 'No User Found'}
        except Exception as e:
            return {'message': str(e)}
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()



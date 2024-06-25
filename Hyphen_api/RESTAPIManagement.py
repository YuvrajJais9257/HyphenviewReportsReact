import json
import os
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from db_connect_details import get_mysql_connection
 
class RESTAPIManagement:
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
 
    def insert_in_db(self,detail):
        print(detail)
        database_mysql = get_mysql_connection(self.mysql_database_url)
        data_source = detail["api_details"]["DataSource"]
        request_type= detail["api_details"]["RequestType"]
        api_url= detail["api_details"]["ApiURL"]
        customer_id = detail["api_details"]["customer_id"]
        del detail["api_details"]["DataSource"]
        del detail["api_details"]["customer_id"]
        del detail["api_details"]["RequestType"]
        del detail["api_details"]["ApiURL"]
        auth_details = detail["api_details"]
        json_data = json.dumps(auth_details)
        print(json_data)
        try:
            with database_mysql.cursor(dictionary=True, buffered=True) as cursor:
                insert_query = "INSERT INTO rest_api_details (api_url, api_method, auth_type,data_source,customer_id) VALUES (%s, %s, %s,%s,%s)"
                cursor.execute(insert_query,(api_url,request_type,json_data,data_source,customer_id))
                # Commit the transaction
                database_mysql.commit()
            return {"status": "success", "message": "API Details Added Successfully!"}
        except HTTPException as unexpected_exception:
            print(f"Unexpected error: {unexpected_exception}")
            raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
        except Exception as exception:
            print(exception)
            return {"status":"Failed","message":f"Unable to add the API Details due to {exception}"}
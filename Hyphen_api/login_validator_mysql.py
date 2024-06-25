# import os
# from fastapi import FastAPI, Request, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# import mysql.connector
# from lib import commonutility as common

# app = FastAPI()

# base_dir = os.getcwd()
# logfilepath = os.path.join(base_dir, 'logs')
# configfile = os.path.join(os.getcwd(), 'config')
# configfilepath = os.path.join(os.getcwd(), 'Cfg/config.json')
# conf = common.read_config(configfilepath)

# # CORS configuration
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# db_config = {
#     "host": conf["mysql_host"],
#     "port": conf["mysql_port"],
#     "username": conf["mysql_username"],
#     "password": conf["mysql_password"],
#     "database": conf["mysql_new_schema"]
# }

# def validate_login(user_email, password):
#     print(user_email,password)
#     try:
#         connection = mysql.connector.connect(**db_config)
#         cursor = connection.cursor()

#         query = "SELECT * FROM user_account WHERE user_email_id = %s AND password = %s"
#         cursor.execute(query, (user_email, password))

#         user = cursor.fetchone()
#         if user:
#             return {'validate': True}
#         else:
#             return {'validate': False, 'message': 'Invalid username or password'}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail="Internal server error: {}".format(e))

#     finally:
#         if cursor:
#             cursor.close()
#         if connection:
#             connection.close()

# def authorization(email,database_type):
#     try:
#         if database_type == "mysql":
#             connection = mysql.connector.connect(**db_config)
#             cursor = connection.cursor(dictionary=True)

#             query = "SELECT * FROM user_account WHERE user_email_id = %s"
#             cursor.execute(query, (email,))
#             user_details = cursor.fetchall()
#             print(user_details)
#             group_id = user_details[0]["group_id"]
#             print(group_id,"-----------------------------------------------------")
#             if user_details:
#                 cursor.execute("select user_email_id,accessmask,customer_id, customer_name, group_id, groupname, feature_id, featurename from view_user_access_group")
#                 result = cursor.fetchall()
#                 if result:
#                     modified_data = {}
#                     for item in result:
#                         user_email_id = item["user_email_id"]
#                         customer_id = item["customer_id"]
#                         group_id = item["group_id"]
#                         groupname = item["groupname"]
#                         feature_id = item["feature_id"]
#                         featurename = item["featurename"]
#                         customer_name = item["customer_name"]
#                         accessmask = item["accessmask"]
#                         if (customer_id, group_id, groupname) not in modified_data:
#                             modified_data[(customer_id, group_id, groupname)] = {"user_email_id":user_email_id, "customer_id": customer_id, "customer_name":customer_name, "group_id": group_id, "groupname": groupname, "features": []}

#                         modified_data[(customer_id, group_id, groupname)]["features"].append({"feature_id": feature_id, "featurename": featurename,"accessmask":accessmask})
#                         modified_data_list = list(modified_data.values())
#                     return {"user_data": modified_data_list[0]}
#                 else:
#                     return {"message":"Not Assigned any Features"}
#             else:
#                 response = {'message': 'No User Found'}

#     except Exception as e:
#         response = {'message': str(e)}
#     finally:
#         if cursor:
#             cursor.close()
#         if connection:
#             connection.close()

#     return response

# @app.post('/authorization', response_model=dict)
# async def auth(request: Request):
#     data = await request.json()
#     database_type = data.get("database_type")
#     email = data.get('username')
#     if email:
#         response = authorization(email,'mysql')
#         return response
#     else:
#         return {'validate': False, 'message': 'Invalid request format'}

# @app.post('/validate-login', response_model=dict)
# async def validate_login_api(request: Request):
#     data = await request.json()
#     email = data.get('username')
#     password = data.get('password')
#     response = validate_login(email, password)
#     return response
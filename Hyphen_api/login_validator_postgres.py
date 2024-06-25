# import os
# from fastapi import FastAPI, Request
# from fastapi.middleware.cors import CORSMiddleware
# import psycopg2
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
#     "host": conf["postgres_host"],
#     "port": conf["postgres_port"],
#     "username": conf["postgres_username"],
#     "password": conf["postgres_password"],
#     "schema": conf["postgres_schema"]
# }

# def validate_login(username, password):
#     try:
#         connection = psycopg2.connect(**db_config)
#         cursor = connection.cursor()

#         query = "SELECT * FROM user_account WHERE user_name = %s AND user_password = %s"
#         cursor.execute(query, (username, password))

#         user = cursor.fetchone()
#         print(user)
#         if user:
#             return {'validate': True}
#         else:
#             print('------------------------------------')
#             return {'validate': False, 'message':'Invalid username or password'}

#     except Exception as e:
#         response = {'validate': False, 'message': str(e)}

#     finally:
#         if cursor:
#             cursor.close()
#         if connection:
#             connection.close()

# def authorization_login(username):
#     print(username,"username")
#     try:
#         connection = psycopg2.connect(**db_config)

#         cursor = connection.cursor()

#         query = "SELECT email_id FROM user_account WHERE user_name = %s"
#         cursor.execute(query, (username,))

#         user = cursor.fetchone()
#         if user:
#             email_id = user[0]

#             # Fetch user details based on email_id
#             query = "SELECT * FROM user_account WHERE email_id = %s"
#             cursor.execute(query, (email_id,))
#             user_details = cursor.fetchone()

#             if user_details:
#                 role_id = user_details[2]

#                 # Fetch user role information
#                 query = "SELECT * FROM user_role a, access_group b WHERE a.group_id = b.group_id AND role_id = %s"
#                 cursor.execute(query, (role_id,))
#                 role_info = cursor.fetchall()

#                 if role_info:
#                     response_format = role_info[0][1]
#                     response = {'validate': True, 'message': 'User is valid', 'loginuser': response_format}
#                 else:
#                     response = {'validate': False, 'message': 'Role information not found'}
#             else:
#                 response = {'validate': False, 'message': 'User details not found'}
#         else:
#             response = {'validate': False, 'message': 'Invalid username or password'}

#     except Exception as e:
#         response = {'validate': False, 'message': str(e)}

#     finally:
#         if cursor:
#             cursor.close()
#         if connection:
#             connection.close()

#     return response

# @app.post('/authorization', response_model=dict)
# async def authorization(request: Request):
#     data = await request.json()
#     username = data.get('username')
#     password = data.get('password')
#     print(username, password, "username")
#     if username and password:
#         response = authorization_login(username)
#         return response
#     else:
#         return {'validate': False, 'message': 'Invalid request format'}

# @app.post('/validate-login', response_model=dict)
# async def validate_login_api(request: Request):
#     data = await request.json()
#     username = data.get('username')
#     password = data.get('password')
#     response = validate_login(username, password)
#     return response

# if __name__ == '__main__':
#     import uvicorn

#     uvicorn.run(app, host='127.0.0.1', port=3002, debug=True)

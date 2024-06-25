import os
from mimetypes import guess_extension
from fastapi import FastAPI, HTTPException
import mysql.connector
from typing import Optional
import psycopg2
from fastapi.middleware.cors import CORSMiddleware
from lib import commonutility as common
from datetime import datetime
from fastapi import FastAPI, HTTPException,UploadFile,File,Form
import json
import base64
from pathlib import Path
app = FastAPI()

# allow_origins=["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

base_dir = os.getcwd()
logfilepath = os.path.join(base_dir, 'logs')
configfile = os.path.join(os.getcwd(), 'config')
configfilepath = os.path.join(os.getcwd(), 'Cfg/config.json')
conf = common.read_config(configfilepath)
mysql_data_types = {
  0: "DECIMAL",
  1: "TINYINT",
  2: "INT",
  3: "INTEGER",
  4: "FLOAT",
  5: "DOUBLE",
  6: "NULL",
  7: "TIMESTAMP",
  8: "INT",
  9: "INT",
  10: "DATE",
  11: "TIME",
  12: "DATETIME",
  13: "YEAR",
  14: "NEWDATE",
  15: "VARCHAR",
  16: "BIT",
  245: "JSON",
  246: "NEWDECIMAL",
  247: "ENUM",
  248: "SET",
  249: "TINYBLOB",
  250: "MEDIUMBLOB",
  251: "LONGBLOB",
  252: "BLOB",
  253: "VARCHAR",
  254: "CHAR",
  255: "GEOMETRY"
}
postgresql_data_types = {
  16: "BOOLEAN",
  17: "BYTEA",
  18: "CHAR",
  19: "NAME",
  20: "INT",
  21: "INT",
  22: "INT2VECTOR",
  23: "INT",
  24: "REGPROC",
  25: "TEXT",
  26: "OID",
  27: "TID",
  28: "XID",
  29: "CID",
  30: "OIDVECTOR",
  114: "JSON",
  142: "XML",
  194: "PG_NODE_TREE",
  700: "FLOAT",
  701: "FLOAT",
  790: "MONEY",
  829: "MACADDR",
  869: "INET",
  1033: "ACLITEM",
  1042: "BPCHAR",
  1043: "VARCHAR",
  1082: "DATE",
  1083: "TIME",
  1114: "TIMESTAMP",
  1184: "TIMESTAMPTZ",
  1186: "INTERVAL",
  1266: "TIMETZ",
  1560: "BIT",
  1562: "VARBIT",
  1700: "NUMERIC",
  1790: "REFCURSOR",
  2202: "REGPROCEDURE",
  2203: "REGOPER",
  2204: "REGOPERATOR",
  2205: "REGCLASS",
  2206: "REGTYPE",
  2950: "UUID",
  3802: "JSONB",
  3904: "INT4RANGE",
  3906: "NUMRANGE",
  3910: "TSRANGE",
  3912: "TSTZRANGE",3926: "INT8RANGE"}
def get_mysql_connection(database_url):
    return mysql.connector.connect(
        host=database_url["host"],
        user=database_url["username"],
        password=database_url["password"],
        port=database_url["port"],
        database=database_url["schema"]
    )

def get_postgres_connection(database_url):
    return psycopg2.connect(
        host=database_url["host"],
        user=database_url["username"],
        password=database_url["password"],
        port=database_url["port"],
        database=database_url["schema"]
    )

def check_and_create_table(connection, create_query):
    with connection.cursor() as cursor:
        cursor.execute(create_query)
    connection.commit()

def get_customerId(connection, active_user):
    user = active_user[0]
    sql_query = "SELECT customer_id FROM user_account WHERE user_email_id = %s"

    with connection.cursor() as cursor:
        cursor.execute(sql_query, (user,))
        result = cursor.fetchall()
        print(result,"result")
    return result[0][0]

def check_connection(details,type):
    print(details,type,"details")
    if type == 'mysql':
        try:
            connection = mysql.connector.connect(
                host=details.get("host"),
                user=details.get("username"),
                password=details.get("password"),
                port=details.get("port"),
                database=details.get("schema")
            )
            connection.close()
            return True
        except mysql.connector.Error as e:
            raise HTTPException(status_code=500, detail="MySQL database connection is not valid.")
        
    elif type == 'postgres':
        try:
            connection = psycopg2.connect(
                host=details.get("host"),
                user=details.get("username"),
                password=details.get("password"),
                port=details.get("port"),
                database=details.get("schema")
            )
            connection.close()
            return True
        except psycopg2.Error as e:
            raise HTTPException(status_code=500, detail="Postgres database connection is not valid.")

@app.post("/save_connection")
async def save_connection(details: dict):
    try:
        database_mysql = None
        connection_type = details.get("connection_type")
        database_postgres = None
        database_type = details.get("database_type")
        host = details.get("host")
        port = details.get("port")
        username = details.get("username")
        password = details.get("password")
        schema = details.get("schema")
        active_user = details.get("active_user")
        save = details.get("save")
        if database_type == "mysql":
            mysql_database_url = {
                "host": conf["mysql_host"],
                "port": conf["mysql_port"],
                "username": conf["mysql_username"],
                "password": conf["mysql_password"],
                "schema": conf["mysql_new_schema"]
            }

            if check_connection(details,connection_type):
                database_mysql = get_mysql_connection(mysql_database_url)
                customer_id = get_customerId(database_mysql, (active_user,))
                print(database_mysql,customer_id,"database_mysql")
                with database_mysql.cursor() as cursor:
                    cursor.execute(
                        "SELECT * FROM database_details WHERE rdbms_name = %s AND domain_name = %s AND db_port = %s AND db_user_name = %s AND db_password = %s AND db_schema_name = %s AND customer_id = %s",
                        (connection_type, host, port, username, password, schema, customer_id)
                    )
                    existing_details = cursor.fetchone()
                if existing_details:
                    return {"status_code":400, "detail":"Database details already exist."}
                else:
                    if save=="yes":
                        with database_mysql.cursor() as cursor:
                            cursor.execute(
                                "INSERT INTO database_details (rdbms_name, domain_name, db_port, db_user_name, db_password, db_schema_name, customer_id) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                                (connection_type, host, port, username, password, schema, customer_id)
                            )
                        database_mysql.commit()
                        return {"status": "success", "message": "Connection details saved successfully."}

                    elif save=="no":
                        return {"status":"valid", "detail":"Valid Connection"}
            else:
                raise HTTPException(status_code=500, detail="Database connection is not valid.")
            database_mysql.close()
            
        elif database_type == "postgres":
            postgres_database_url = {
                "host": conf["postgres_host"],
                "port": conf["postgres_port"],
                "username": conf["postgres_username"],
                "password": conf["postgres_password"],
                "schema": conf["postgres_schema"]
            }

            if check_connection(details,'postgres'):
                database_postgres = get_postgres_connection(postgres_database_url)
                customer_id = get_customerId(database_postgres, (active_user,))
                with database_postgres.cursor() as cursor:
                    cursor.execute(
                        "SELECT * FROM database_details WHERE rdbms_name = %s AND domain_name = %s AND db_port = %s AND db_user_name = %s AND db_password = %s AND db_schema_name = %s AND customer_id = %s",
                        (database_type, host, port, username, password, schema, customer_id)
                    )
                    existing_details = cursor.fetchone()
                if existing_details:
                    return {"status_code":400, "detail":"Database details already exist."}
                else:
                    if save=="yes":
                        with database_postgres.cursor() as cursor:
                            cursor.execute(
                                "INSERT INTO database_details (rdbms_name, domain_name, db_port, db_user_name, db_password, db_schema_name, customer_id) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                                (database_type, host, port, username, password, schema, customer_id)
                            )
                        database_postgres.commit()
                        return {"status": "success", "message": "Connection details saved successfully."}

                    elif save=="no":
                        return {"status":"valid", "detail":"Valid Connection"}
            else:
                raise HTTPException(status_code=500, detail="Database connection is not valid.")
            database_postgres.close()
        else:
            raise HTTPException(status_code=400, detail="Invalid database type")

    except HTTPException as http_exception:
        return http_exception

    except Exception as unexpected_exception:
        print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error.")

@app.post("/getSchema")
async def get_schema(user_details:dict):
    try:
        email = user_details.get("email")
        database_type = user_details.get("database_type")
        connection_type = user_details.get("connection_type")
        print(email,database_type)
        if database_type == "mysql":
            mysql_database_url = {
                "host": conf["mysql_host"],
                "port": conf["mysql_port"],
                "username": conf["mysql_username"],
                "password": conf["mysql_password"],
                "schema": conf["mysql_new_schema"]
            }
            database_mysql = get_mysql_connection(mysql_database_url)
            with database_mysql.cursor(dictionary=True) as cursor:
                cursor.execute(
                    "select customer_id, group_id from user_account where user_email_id = %s",(email,)
                )
                result = cursor.fetchall()
                customer_id = result[0]["customer_id"]
                group_id = result[0]["group_id"]
                cursor.execute("select groupname from user_group where group_id = %s",(group_id,))
                result = cursor.fetchall()
                groupname = result[0]["groupname"]
                if len(groupname) > 0:
                    print('yes')
                    cursor.execute("select db_schema_name from database_details where customer_id = %s and rdbms_name = %s",(customer_id,connection_type))
                    result = cursor.fetchall()
                    schema_names = [item['db_schema_name'] for item in result]
                    database_mysql.close()
                    return schema_names
                else:
                    database_mysql.close()
                    return "No Schema Found"
        
    except Exception as unexpected_exception:
        print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))

@app.post("/getSchemaMetadata")
async def access_schema(schema:dict):
    try:
        schema_name = schema.get('schema_name')
        database_type = schema.get('database_type')
        email = schema.get("email")
        if database_type == "mysql":
            mysql_database_url = {
                "host": conf["mysql_host"],
                "port": conf["mysql_port"],
                "username": conf["mysql_username"],
                "password": conf["mysql_password"],
                "schema": conf["mysql_new_schema"]
            }
            database_mysql = get_mysql_connection(mysql_database_url)
            with database_mysql.cursor(dictionary=True) as cursor:
                cursor.execute("select customer_id from user_account where user_email_id = %s",(email,))
                result = cursor.fetchall()
              
                customer_id = result[0]["customer_id"]
                cursor.execute("SELECT domain_name, db_port, db_user_name, db_password FROM database_details WHERE db_schema_name = %s AND customer_id = %s",(schema_name,customer_id))
                result = cursor.fetchall()
                print(result)
                secondary_mysql_database_url = {
                "host": result[0]["domain_name"],
                "port": result[0]["db_port"],
                "username": result[0]["db_user_name"],
                "password": result[0]["db_password"],
                "schema": schema_name
                }
                
                secondary_database_mysql = get_mysql_connection(secondary_mysql_database_url)
                with secondary_database_mysql.cursor(dictionary=True) as cursor:
                    cursor.execute("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = %s",(schema_name,))
                    result = cursor.fetchall()
                   
                    secondary_database_mysql.close()
            database_mysql.close()
            return(result)
    except Exception as unexpected_exception:
        print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))

# @app.post("/save_report_template")
# async def save_report_template(report_template_details:dict):
#     print(report_template_details)
#     try:
#         report_template_name = report_template_details.get("report_template_name")
#         report_type = report_template_details.get("report_type")
#         chart_type = report_template_details.get("chart_type")
#         defined_query = report_template_details.get("defined_query")
#         enable_drilldown = report_template_details.get("enable_drilldown")
#         auto_update_interval = report_template_details.get("auto_update_interval")
#         time_period = report_template_details.get("time_period")
#         start_date = report_template_details.get("start_date")
#         end_date = report_template_details.get("end_date")
#         # show_in_dashboard = report_template_details.get("show_in_dashboard")
#         email = report_template_details.get("email")
#         database_type = report_template_details.get("database_type")
#         schema_name = report_template_details.get("schema")
#         display_order = report_template_details.get("display_order")
#         # background_colour = report_template_details.get("background_colour")
#         # chart_react_colour = report_template_details.get("chart_react_colour")
#         if database_type == "mysql":
#             mysql_database_url = {
#                 "host": conf["mysql_host"],
#                 "port": conf["mysql_port"],
#                 "username": conf["mysql_username"],
#                 "password": conf["mysql_password"],
#                 "schema": conf["mysql_new_schema"]
#             }
#             database_mysql = get_mysql_connection(mysql_database_url)
#             with database_mysql.cursor(dictionary=True) as cursor:
#                 cursor.execute(
#                     "select customer_id,group_id from user_account where user_email_id = %s",(email,)
#                 )
#                 result = cursor.fetchall()
#                 customer_id = result[0]["customer_id"]
#                 group_id = result[0]["group_id"]
#                 cursor.execute(
#                     "select db_details_id from database_details where customer_id = %s and db_schema_name = %s",(customer_id,schema_name)
#                 )
#                 result = cursor.fetchall()
#                 db_details_id = result[0]["db_details_id"]
#                 cursor.execute("select * from report_template where customer_id = %s",(customer_id,))
#                 result2 = cursor.fetchall()
#                 report_template_names = [i["report_template_name"] for i in result2]
#                 if report_template_name in report_template_names:
#                     database_mysql.close()
#                     return {"status": "fail", "message": "Report Template name already exists, try with another one."}
#                 else:
#                     if report_type.lower() == 'chart' and chart_type.lower() == 'box':
#                         cursor.execute(
#                         "INSERT INTO report_template (report_template_name, report_type, chart_type, defined_query, enable_drilldown, auto_update_interval, time_period, start_date, end_date, customer_id, db_details_id, display_order) VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s)",
#                         (report_template_name, report_type, chart_type, defined_query, enable_drilldown, auto_update_interval, time_period, start_date, end_date, customer_id, db_details_id, display_order)
#                     )
#                     else:
#                         cursor.execute(
#                             "INSERT INTO report_template (report_template_name, report_type, chart_type, defined_query, enable_drilldown, auto_update_interval, time_period, start_date, end_date, customer_id, db_details_id, display_order) VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s)",
#                             (report_template_name, report_type, chart_type, defined_query, enable_drilldown, auto_update_interval, time_period, start_date, end_date, customer_id, db_details_id, display_order)
#                         )
#                     database_mysql.commit()
#                     cursor.execute(
#                             "select groupname from user_group where customer_id = %s and group_id = %s",(customer_id,group_id)
#                         )
#                     result = cursor.fetchall()
#                     group_name = result[0]["groupname"]
#                     if group_name=='Admin':
#                         cursor.execute(
#                             "select report_id from report_template where customer_id = %s and report_template_name = %s",(customer_id,report_template_name)
#                         )
#                         result = cursor.fetchall()
#                         report_id = result[0]["report_id"]
#                         cursor.execute(
#                             "insert into group_report_map (group_id,report_id,created_at,access_mask) values(%s,%s,%s,%s)",(group_id,report_id,datetime.now(),'pedv')
#                         )
#                         database_mysql.commit()
                   
#                     database_mysql.close()
#                     return {"status": "success", "message": "Report Template saved successfully."}


#     except Exception as unexpected_exception:
#         print(f"Unexpected error: {unexpected_exception}")
#         raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))


@app.post("/save_report_template")
async def save_report_template(report_template_name: str = Form(...), file: Optional[UploadFile] = None):
    print(report_template_name)
    try:
        report_template_details = json.loads(report_template_name)
        report_template_name = report_template_details.get("report_template_name")
        font_size_title = report_template_details.get("font_size_title")
        font_size_value = report_template_details.get("font_size_value")
        icon_path = None
        if file is not None:
            file_content = await file.read()
            base64_data = base64.b64encode(file_content)
            base64_data_str = base64_data.decode('utf-8')
            icon_path = base64_data_str
            # content= await file.read()
            # original_path = Path(base_dir)
            # parent_path = original_path.parent
            # print(parent_path, "upload")
            # icon_path = '/reportIcon'
            # # full_path = os.path.join(parent_path, 'hyphenview', icon_path)
            # full_path = str(parent_path) + '/hyphenview/public' + icon_path
            # print(full_path,"******")
            # uploads_directory = Path(full_path)
            # uploads_directory.mkdir(parents=True, exist_ok=True)
            # file_extension = guess_extension(file.content_type)
            # file_name = f"{report_template_name}{file_extension}"
            # print(file_name)
            # icon_path += '/{}'.format(file_name)
            # file_path = uploads_directory / file_name
            # print(file_path,full_path)
            # with open(file_path,"wb") as buffer:
            #     buffer.write(content)
        report_type = report_template_details.get("report_type")
        chart_type = report_template_details.get("chart_type")
        defined_query = report_template_details.get("defined_query")
        enable_drilldown = report_template_details.get("enable_drilldown")
        auto_update_interval = report_template_details.get("auto_update_interval")
        time_period = report_template_details.get("time_period")
        start_date = report_template_details.get("start_date")
        end_date = report_template_details.get("end_date")
        # show_in_dashboard = report_template_details.get("show_in_dashboard")
        email = report_template_details.get("email")
        database_type = report_template_details.get("database_type")
        schema_name = report_template_details.get("schema")
        display_order = report_template_details.get("display_order")
        if database_type == "mysql":
            mysql_database_url = {
                "host": conf["mysql_host"],
                "port": conf["mysql_port"],
                "username": conf["mysql_username"],
                "password": conf["mysql_password"],
                "schema": conf["mysql_new_schema"]
            }
            database_mysql = get_mysql_connection(mysql_database_url)
            with database_mysql.cursor(dictionary=True) as cursor:
                cursor.execute(
                    "select customer_id,group_id from user_account where user_email_id = %s", (email,)
                )
                result = cursor.fetchall()
                customer_id = result[0]["customer_id"]
                group_id = result[0]["group_id"]
                cursor.execute(
                    "select db_details_id from database_details where customer_id = %s and db_schema_name = %s",
                    (customer_id, schema_name)
                )
                result = cursor.fetchall()
                db_details_id = result[0]["db_details_id"]
                cursor.execute("select * from report_template where customer_id = %s", (customer_id,))
                result2 = cursor.fetchall()
                report_template_names = [i["report_template_name"] for i in result2]
                if report_template_name in report_template_names:
                    database_mysql.close()
                    return {"status": "fail", "message": "Report Template name already exists, try with another one."}
                else:
                    if report_type.lower() == 'box':
                        background_colour = report_template_details.get("background_colour")
                        chart_react_colour = report_template_details.get("chart_react_colour")
                        print(icon_path)
                        cursor.execute(
                            "INSERT INTO report_template (report_template_name, report_type, chart_type, defined_query, enable_drilldown, auto_update_interval, time_period, start_date, end_date, customer_id, db_details_id, display_order,upload_logo,background_colour,chart_react_colour,font_size_title,font_size_value) VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s,%s,%s,%s,%s,%s)",
                            (report_template_name, report_type, chart_type, defined_query, enable_drilldown,
                             auto_update_interval, time_period, start_date, end_date, customer_id, db_details_id,
                             display_order, icon_path,background_colour,chart_react_colour,font_size_title,font_size_value)
                        )
                    else:
                        cursor.execute(
                            "INSERT INTO report_template (report_template_name, report_type, chart_type, defined_query, enable_drilldown, auto_update_interval, time_period, start_date, end_date, customer_id, db_details_id, display_order) VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s)",
                            (report_template_name, report_type, chart_type, defined_query, enable_drilldown,
                             auto_update_interval, time_period, start_date, end_date, customer_id, db_details_id,
                             display_order)
                        )
                    database_mysql.commit()
                    cursor.execute(
                        "select groupname from user_group where customer_id = %s and group_id = %s", (customer_id, group_id)
                    )
                    result = cursor.fetchall()
                    group_name = result[0]["groupname"]
                    if group_name == 'Admin':
                        cursor.execute(
                            "select report_id from report_template where customer_id = %s and report_template_name = %s",
                            (customer_id, report_template_name)
                        )
                        result = cursor.fetchall()
                        report_id = result[0]["report_id"]
                        cursor.execute(
                            "insert into group_report_map (group_id,report_id,created_at,access_mask) values(%s,%s,%s,%s)",
                            (group_id, report_id, datetime.now(), 'pedv')
                        )
                        database_mysql.commit()
                    database_mysql.close()
                    return {"status": "success", "message": "Report Template saved successfully."}
    except Exception as unexpected_exception:
        print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))


@app.post("/checkQuery")
async def chek_query(query_details:dict):
    try:
        defined_query = query_details.get("query")
        database_type = query_details.get("database_type")
        schema_name = query_details.get("schema")
        email = query_details.get("email")
        connection_type = query_details.get("connection_type")
        
        if database_type == "mysql":
            mysql_database_url = {
                "host": conf["mysql_host"],
                "port": conf["mysql_port"],
                "username": conf["mysql_username"],
                "password": conf["mysql_password"],
                "schema": conf["mysql_new_schema"]
            }
            database_mysql = get_mysql_connection(mysql_database_url)
            with database_mysql.cursor(dictionary=True) as cursor:
                cursor.execute(
                    "select customer_id, group_id from user_account where user_email_id = %s",(email,)
                )
                result = cursor.fetchall()
                customer_id = result[0]["customer_id"]
                cursor.execute(
                    "select domain_name, db_port, db_user_name, db_password from database_details where customer_id = %s and db_schema_name = %s and rdbms_name = %s",(customer_id,schema_name,connection_type)
                )
                result = cursor.fetchall()
                secondary_host = result[0]["domain_name"]
                secondary_port = result[0]["db_port"]
                secondary_username = result[0]["db_user_name"]
                secondary_password = result[0]["db_password"]
                secondary_database_url = {
                "host": secondary_host,
                "port": secondary_port,
                "username": secondary_username,
                "password": secondary_password,
                "schema": schema_name
                }
                if connection_type == "mysql":
                    secondary_database = get_mysql_connection(secondary_database_url)
                elif connection_type == "postgres":
                    secondary_database = get_postgres_connection(secondary_database_url)
                with secondary_database.cursor() as cursor:
                    try:
                        cursor.execute(defined_query)
                        result = cursor.fetchall()
                        if len(result)>0:
                            column_count = len(cursor.description)
                            for desc in cursor.description:
                                print("Loop")
                                print(desc[1])
                            col_name = [i for i,desc in enumerate(cursor.description,start=1)]
                            col_type = []
                            if connection_type == "mysql":
                                col_type = []
                                for desc in cursor.description:
                                    col_type.append(mysql_data_types[desc[1]] if desc[1] in mysql_data_types else desc[1])
                            elif connection_type == 'postgres':
                                col_type = []
                                for desc in cursor.description:
                                    col_type.append(postgresql_data_types[desc[1]] if desc[1] in postgresql_data_types else desc[1])
                            col_datatype = dict(zip(col_name,col_type))
                            if column_count == 1:
                                if len(result) == 1 and (type(result[0][0]) in [int,float,str]):
                                    return {"status_code":200, "detail":"The query is compiled successfully and it is suitable only for BOX and Gauge Chart Report Type.","column_count":column_count,"column_type":col_datatype}
                                else:
                                    return{"status_code":200,"detail":f"The query output is not structured properly and the column should be a number, current type Column1 Datatype :({type(result[0][0])})","column_count":column_count,"column_type":col_datatype}
                            elif column_count>1:
                                    return{"status_code":200,"detail":"Valid Query","column_count":column_count,"column_type":col_datatype}
                            else:
                                return{"status_code":200,"detail":"Invalid Query","column_count":column_count,"column_type":col_datatype}
                            # elif column_count <2 or column_count>2:
                            #     if column_count == 3:
                            #         return{"status_code":200,"detail":"The query is compiled successfully.","options":["Chart","Table","Matrix"]}
                            #     else:
                            #         return{"status_code":200,"detail":"The query output is not structured properly to create the chart.","options":["Table","Matrix"]}              
                            # elif column_count>=2:
                            #     return{"status_code":200,"detail":"The query is compiled successfully.","options":["Chart","Table","Matrix"]}
                        else:
                            return {"status_code":200, "detail":"No data Found."}
                    except Exception as e:
                        return {"status_code":400, "detail":"Invalid Query. {}".format(e)}
                secondary_database.close()
            database_mysql.close()

    except Exception as unexpected_exception:
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))

@app.post("/addGroup")
async def addGroup(details:dict):
    try:
        database_type = details.get("database_type")
        group_name = details.get("group_name")
        date = datetime.now()
        customer_id = details.get("customer_id")
        if database_type == "mysql":
            mysql_database_url = {
                "host": conf["mysql_host"],
                "port": conf["mysql_port"],
                "username": conf["mysql_username"],
                "password": conf["mysql_password"],
                "schema": conf["mysql_new_schema"]
            }
            database_mysql = get_mysql_connection(mysql_database_url)
            with database_mysql.cursor(dictionary=True) as cursor:
                cursor.execute(
                    "SELECT * FROM user_group WHERE groupname = %s AND customer_id = %s",
                    (group_name, customer_id)
                )
                existing_group = cursor.fetchone()
 
                if existing_group:
                    return {"status":"failed","message":f"Groupname '{group_name}' already exists for customer ID {customer_id}."}
                else:
                    # If the groupname doesn't exist, execute the insert query
                    cursor.execute(
                        "INSERT INTO user_group (groupname, customer_id, created_at) VALUES (%s, %s, %s)",
                        (group_name, customer_id, date)
                    )
                    database_mysql.commit()
                    return {"status":"success","message":f"Groupname '{group_name}' added for customer ID {customer_id}."}
 
    except Exception as unexpected_exception:
        print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))


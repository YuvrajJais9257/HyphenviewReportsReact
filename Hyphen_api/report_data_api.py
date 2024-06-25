import os
import json
import re
import ast
from fastapi.responses import JSONResponse
from fastapi import FastAPI, HTTPException
import mysql.connector
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from lib import commonutility as common
from fastapi import FastAPI, HTTPException,UploadFile,File,Form
from pathlib import Path
from psycopg2.extras import DictCursor
from werkzeug.utils import secure_filename
from datetime import datetime
import base64
from typing import Optional
from mimetypes import guess_extension
app = FastAPI()

base_dir = os.getcwd()
logfilepath = os.path.join(base_dir, 'logs')
configfile = os.path.join(os.getcwd(), 'config')
configfilepath = os.path.join(os.getcwd(), 'Cfg/config.json')
conf = common.read_config(configfilepath)

# allow_origins=["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    sql_query = "SELECT customer_id FROM user_account WHERE email_id = %s"

    with connection.cursor() as cursor:
        cursor.execute(sql_query, (user,))
        result = cursor.fetchall()
    return result[0][0]

def check_connection(details,type):
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

def count_group_by_columns(sql_query):
    # Use regular expressions to find the GROUP BY clause
    pattern = re.compile(r'\bGROUP BY\b\s*([\s\S]+?)(?:\s*\bHAVING\b|\s*\bORDER BY\b|\s*\bLIMIT\b|;|$)', re.IGNORECASE)
    match = pattern.search(sql_query)
    # match = re.search(r'\bGROUP BY\b\s*(.+?)(?:\s*\bHAVING\b|\s*\bORDER BY\b|\s*\bLIMIT\b|;|$)', sql_query, re.IGNORECASE)
    if not match:
        return 0
    
    # Extract the columns within the GROUP BY clause
    group_by_clause = match.group(1)
    
    # Split the columns by commas and strip whitespace
    columns = [col.strip() for col in group_by_clause.split(',')]
    result = {
        "length":len(columns),
        "columns":columns
    }
    return result

@app.post("/getReportTemplates")
async def get_report(user_details:dict):
    try:
        customer_id = user_details.get("customer_id")
        email = user_details.get("email")
        database_type = user_details.get("database_type")
        group_id = user_details.get("group_id")
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
                report_templates = []
                cursor.execute("select * from view_report_access_group where customer_id = %s and group_id = %s and access_mask != 'null' ORDER BY report_id DESC",(customer_id,group_id))
                # cursor.execute("select report_id, report_template_name, report_type, chart_type, enable_drilldown from report_template where customer_id = %s and report_id = %s ORDER BY report_id DESC",(customer_id,i))
                result = cursor.fetchall()
                #print(result)
                for item in result:
                    report_templates.append({"report_id":item['report_id'],"report_name":item['report_template_name'],"report_type":item['report_type'],"chart_type":item['chart_type'],"drilldown":item['enable_drilldown'], "access_mask":item['access_mask']})
                if len(report_templates)>=0:
                    database_mysql.close()
                    #print(report_templates,"report_templates")
                    return report_templates
                else:
                    database_mysql.close()
                    return "No Templates Found"
        
    except Exception as unexpected_exception:
        #print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
 
@app.post("/getReportTemplatealldetail")
async def get_report(user_details:dict):
    try:
        email = user_details.get("email")
        database_type = user_details.get("database_type")
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
                # cursor.execute(
                #     "select customer_id, role_id, user_id from user_account where email_id = %s",(email,)
                # )
                cursor.execute(
                    "select customer_id, group_id from user_account where user_email_id = %s",(email,)
                )
                result = cursor.fetchall()
                customer_id = result[0]["customer_id"]
                # role_id = result[0]["role_id"]
                # user_id = result[0]["user_id"]
                group_id = result[0]["group_id"]
                # user_id = result[0]["user_id"]
                cursor.execute("select groupname from user_group where group_id = %s",(group_id,))
                result = cursor.fetchall()
                #print(result,"result")
                groupname = result[0]["groupname"]
                if groupname in ['Admin']:
                    cursor.execute("select * from report_template where customer_id = %s ORDER BY report_id DESC",(customer_id,))
                    result = cursor.fetchall()
                    report_templates = [{"report_id":item['report_id'],"report_name":item['report_template_name'],"report_type":item['report_type'],"chart_type":item['chart_type'],"drilldown":item['enable_drilldown'],"query":item['defined_query'],"start_date":item['start_date'],"end_date":item['end_date'],"enable_drilldown":item['enable_drilldown'],"auto_update_interval":item['auto_update_interval'],"time_period":item['time_period'],"show_in_dashboard":item['show_in_dashboard']} for item in result]
                    database_mysql.close()
                    return report_templates
                elif groupname:
                    report_templates = []
                    # cursor.execute("select * from user_report_map where user_email_id = %s",(email,))
                    cursor.execute("select * from group_report_map where group_id = %s",(group_id,))
                    result = cursor.fetchall()
                    report_template_ids = [data["report_id"] for data in result]
                    for i in report_template_ids:
                        cursor.execute("select report_id, report_template_name, report_type, chart_type, enable_drilldown from report_template where customer_id = %s and report_id = %s ORDER BY report_id DESC",(customer_id,i))
                        result = cursor.fetchall()
                        report_templates.append({"report_id":result[0]['report_id'],"report_name":result[0]['report_template_name'],"report_type":result[0]['report_type'],"chart_type":result[0]['chart_type'],"drilldown":result[0]['enable_drilldown']})
                    database_mysql.close()
                    return report_templates
 
                else:
                    database_mysql.close()
                    return "No Templates Found"
       
    except Exception as unexpected_exception:
        #print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))   
    
@app.post("/getReportAccesses")
async def get_access(user_details:dict):
    try:
        group_id = user_details.get("group_id")
        customer_id = user_details.get("customer_id")
        database_type = user_details.get("database_type")
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
                cursor.execute("select * from view_report_access_group where group_id = %s and customer_id = %s",(group_id,customer_id))
                result = cursor.fetchall()
            database_mysql.close()
            return result

    except Exception as unexpected_exception:
        #print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))

#### To Get List of Reports along with their meta-data Based on Group ID ####

@app.post("/getReportDetail")
async def get_report_detail(user_details:dict):
    try:
        report_id = user_details.get("report_id")
        database_type = user_details.get("database_type")
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
                    "select report_id, db_details_id, report_template_name, report_type, chart_type, defined_query, start_date, end_date, time_period, show_in_dashboard, enable_drilldown, auto_update_interval, background_colour, chart_react_colour,font_size_title,font_size_value,upload_logo from report_template where report_id = %s",(report_id,)
                )
                result = cursor.fetchall()
                db_details_id =result[0]["db_details_id"]
                cursor.execute(
                    "select rdbms_name, db_schema_name from database_details where db_details_id = %s",(db_details_id,)
                )
                res = cursor.fetchall()
                rdbms_name = res[0]['rdbms_name']
                schema_name = res[0]['db_schema_name']
            database_mysql.close()
            result[0]["rdbms_name"] = rdbms_name
            result[0]["schema_name"] = schema_name
            #print(result,'----------------------')
            return {"data": result[0]}
 
    except Exception as unexpected_exception:
        database_mysql.close()
        #print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))

@app.post("/getGroupwiseReports")
async def getGroupwiseReports(user_details: dict):
    group_id = user_details.get("group_id")
    #print(group_id)
    database_type = user_details.get("database_type")
    
    if database_type == "mysql":
        mysql_database_url = {
            "host": conf["mysql_host"],
            "port": conf["mysql_port"],
            "username": conf["mysql_username"],
            "password": conf["mysql_password"],
            "schema": conf["mysql_new_schema"]
        }
        
        database_mysql = get_mysql_connection(mysql_database_url)
        #print("ok1")
        
        try:
            with database_mysql.cursor(dictionary=True) as cursor:
                cursor.execute("SELECT * FROM hyphenview_new_release_test.view_report_access_group WHERE group_id = %s", (group_id,))
                result = cursor.fetchall()
                # for row in result:
                #     #print(row)
            return result
        except Exception as e:
            print(f"Error executing database query: {e}")
        finally:
            database_mysql.close()

@app.post("/getReportData")
async def get_report_data(report_details:dict):
    try:
        report_title = report_details.get("report_title")
        email = report_details.get("email")
        database_type = report_details.get("database_type")
        # #print(report_title,email,database_type)
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
                    "select customer_id from user_account where user_email_id = %s",(email,)
                )
                result = cursor.fetchall()
                customer_id = result[0]["customer_id"]
                cursor.execute("select * from report_template where report_template_name = %s and customer_id = %s",(report_title,customer_id))
                result = cursor.fetchall()
                # #print(result)
                report_type = result[0]["report_type"]
                query = result[0]["defined_query"]
                chart_type = result[0]["chart_type"]
                enable_drilldowm = result[0]["enable_drilldown"]
                auto_update_interval = result[0]["auto_update_interval"]
                db_details_id = result[0]["db_details_id"]
                logo_path = result[0]["upload_logo"]
                background_color = result[0]["background_colour"]
                chart_react_color = result[0]["chart_react_colour"]
                font_size_title = result[0]["font_size_title"]
                font_size_value = result[0]["font_size_value"]
                cursor.execute("SELECT * FROM database_details WHERE db_details_id = %s",(db_details_id,))
                result = cursor.fetchall()
                # #print(result,"result")
                db_type = result[0]['rdbms_name']
                if result[0]['rdbms_name'] == 'mysql':
                    secondary_mysql_database_url = {
                    "host": result[0]["domain_name"],
                    "port": result[0]["db_port"],
                    "username": result[0]["db_user_name"],
                    "password": result[0]["db_password"],
                    "schema": result[0]["db_schema_name"]
                    }
                    secondary_database_mysql = get_mysql_connection(secondary_mysql_database_url)
                    # #print(secondary_database_mysql,"secondary_database_mysql")
                    with secondary_database_mysql.cursor(dictionary=True) as cursor:
                        cursor.execute(query)
                        result = cursor.fetchall()
                    secondary_database_mysql.close()
                    if len(cursor.description) == 3:
                        if report_type.lower() == "chart":
                            if chart_type.lower(): #in ['line','bar','column','gause','area','radial']:
                                columns = [desc[0] for desc in cursor.description]
                                temp = {}
                                for col in columns:
                                    temp[col] = []
                                    for i in result:
                                        if i[col] in temp[col]:
                                            continue
                                        else:
                                            temp[col].append(i[col])
                                        # names = list(result[''].keys())
                                series = []
                                for item in temp[columns[1]]:
                                    ele = {"data":[],"name":item}
                                    for element in result:
                                        if element[columns[1]] == item:
                                            ele["data"].append(element[columns[2]])
                                    series.append(ele)
                                # #print(series)
                                with open ("sample_chart.json","r") as f:
                                    data = f.read()
                                    json_data = json.loads(data)
                                    json_data["series"] = series
                                    json_data["title"] = report_title
                                    json_data["chart_type"] = chart_type.lower()
                                    json_data["report_type"] = report_type.lower()
                                    json_data["xAxis"][0]["categories"] = temp[columns[0]]
                                    json_data["drilldown"] = enable_drilldowm.lower()
                                database_mysql.close()
                                # #print('---------------------',json_data,'--------------------')
                                return json_data
                elif result[0]['rdbms_name'] == 'postgres':
                    secondary_postgres_database_url = {
                    "host": result[0]["domain_name"],
                    "port": result[0]["db_port"],
                    "username": result[0]["db_user_name"],
                    "password": result[0]["db_password"],
                    "schema": result[0]["db_schema_name"]
                    }
                    secondary_database_postgres = get_postgres_connection(secondary_postgres_database_url)
                    # #print(secondary_database_mysql,"secondary_database_mysql")
                    with secondary_database_postgres.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
                        cursor.execute(query)
                        result = cursor.fetchall()
                        # #print(result,"result")
                        # #print(result[0]['PRIORITY'])
                    secondary_database_postgres.close()
                    #print(len(cursor.description))
                    if len(cursor.description) == 3:
                        if report_type.lower() == "chart":
                            if chart_type.lower(): #in ['line','bar','column','gause','area','radial']:
                                columns = [desc[0] for desc in cursor.description]
                                temp = {}
                                for col in columns:
                                    temp[col] = []
                                    for i in result:
                                        if i[col] in temp[col]:
                                            continue
                                        else:
                                            temp[col].append(i[col])
                                        # names = list(result[''].keys())
                                series = []
                                for item in temp[columns[1]]:
                                    ele = {"data":[],"name":item}
                                    for element in result:
                                        if element[columns[1]] == item:
                                            ele["data"].append(element[columns[2]])
                                    series.append(ele)
                                # #print(series)
                                with open ("sample_chart.json","r") as f:
                                    data = f.read()
                                    json_data = json.loads(data)
                                    json_data["series"] = series
                                    json_data["title"] = report_title
                                    json_data["chart_type"] = chart_type.lower()
                                    json_data["report_type"] = report_type.lower()
                                    json_data["xAxis"][0]["categories"] = temp[columns[0]]
                                    json_data["drilldown"] = enable_drilldowm.lower()
                                database_mysql.close()
                                # #print('---------------------',json_data,'--------------------')
                                return json_data
            database_mysql.close()
            if report_type.lower() == "chart":
                if chart_type.lower(): #in ['line','bar','column','gause','area','radial']:
                    names = list(result[0].keys())
                    #print(names)
                    transposed_data = list(zip(*[item.values() for item in result]))
                    series = [{"data": metric_data, "name": name} for name, metric_data in zip(names, transposed_data)]
                    with open ("sample_chart.json","r") as f:
                        data = f.read()
                        json_data = json.loads(data)
                        json_data["series"] = series
                        json_data["title"] = report_title
                        json_data["chart_type"] = chart_type.lower()
                        json_data["report_type"] = report_type.lower()
                        json_data["xAxis"][0]["categories"] = series[0]['data']
                        json_data["drilldown"] = enable_drilldowm.lower()
                    #print('---------------------',json_data,'--------------------')                      
                    return(json_data)
            elif report_type.lower() == "box":
                report_key = next(iter(result[0]))
                report_value = result[0][report_key]
                box_value = {"box_value": report_value,"backgroung_color":background_color,"chart_react_color":chart_react_color,"font_size_title":font_size_title,"font_size_value":font_size_value, "report_type": report_type.lower(),"report_title" : report_title,"logo_path":logo_path,"drilldown":enable_drilldowm.lower()}
                return (box_value)
            elif report_type.lower() == "table":
                final_result = {}
                if db_type == 'mysql':
                    res = cursor.description
                    column_names = [column[0] for column in res]
                    final_result["column_names"] = column_names
                    final_result["data"] = result
                    final_result["report_type"] = report_type.lower()
                    return final_result
                elif db_type == 'postgres':
                    res = cursor.description
                    column_names = [column.name for column in res]
                    final_result["column_names"] = column_names
                    final_result["data"] = result
                    final_result["report_type"] = report_type.lower()
                    return final_result
 
    except Exception as unexpected_exception:
        #print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))

@app.post("/reportPreview")
async def getPreview(report_details:dict):
    #print(report_details)
    try:
        report_name = report_details.get("report_name")
        report_type = report_details.get("report_type")
        chart_type = report_details.get("chart_type")
        defined_query = report_details.get("query")
        email = report_details.get("email")
        database_type = report_details.get("database_type")
        connection_type = report_details.get("connection_type")
        schema_name = report_details.get("schema")
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
                    "select customer_id from user_account where user_email_id = %s",(email,)
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
                    with secondary_database.cursor(dictionary=True) as cursor:
                        cursor.execute(defined_query)
                        result = cursor.fetchall()
                    secondary_database.close()
                    if len(cursor.description) == 3:
                        if report_type.lower() == "chart":
                            if chart_type.lower(): #in ['line','bar','column','gause','area','radial']:
                                columns = [desc[0] for desc in cursor.description]
                                temp = {}
                                for col in columns:
                                    temp[col] = []
                                    for i in result:
                                        if i[col] in temp[col]:
                                            continue
                                        else:
                                            temp[col].append(i[col])
                                        # names = list(result[''].keys())
                                series = []
                                for item in temp[columns[1]]:
                                    ele = {"data":[],"name":item}
                                    for element in result:
                                        if element[columns[1]] == item:
                                            ele["data"].append(element[columns[2]])
                                    series.append(ele)
                                # #print(series)
                                with open ("sample_chart.json","r") as f:
                                    data = f.read()
                                    json_data = json.loads(data)
                                    json_data["series"] = series
                                    json_data["title"] = report_name
                                    json_data["chart_type"] = chart_type.lower()
                                    json_data["report_type"] = report_type.lower()
                                    json_data["xAxis"][0]["categories"] = temp[columns[0]]
                                database_mysql.close()
                                # #print('---------------------',json_data,'--------------------')
                                return json_data
                   
                elif connection_type == "postgres":
                    secondary_database = get_postgres_connection(secondary_database_url)
                    with secondary_database.cursor(cursor_factory=DictCursor) as cursor:
                        cursor.execute(defined_query)
                        result = cursor.fetchall()
                    secondary_database.close()
                    if len(cursor.description) == 3:
                        if report_type.lower() == "chart":
                            if chart_type.lower(): #in ['line','bar','column','gause','area','radial']:
                                columns = [desc[0] for desc in cursor.description]
                                temp = {}
                                for col in columns:
                                    temp[col] = []
                                    for i in result:
                                        if i[col] in temp[col]:
                                            continue
                                        else:
                                            temp[col].append(i[col])
                                        # names = list(result[''].keys())
                                series = []
                                for item in temp[columns[1]]:
                                    ele = {"data":[],"name":item}
                                    for element in result:
                                        if element[columns[1]] == item:
                                            ele["data"].append(element[columns[2]])
                                    series.append(ele)
                                # #print(series)
                                with open ("sample_chart.json","r") as f:
                                    data = f.read()
                                    json_data = json.loads(data)
                                    json_data["series"] = series
                                    json_data["title"] = report_name
                                    json_data["chart_type"] = chart_type.lower()
                                    json_data["report_type"] = report_type.lower()
                                    json_data["xAxis"][0]["categories"] = temp[columns[0]]
                                database_mysql.close()
                                # #print('---------------------',json_data,'--------------------')
                                return json_data
            database_mysql.close()
            if report_type.lower() == "chart":
                if chart_type.lower():
                    names = list(result[0].keys())
                    transposed_data = list(zip(*[item.values() for item in result]))
                    series = [{"data": list(metric_data), "name": name} for name, metric_data in zip(names, transposed_data)]
                    with open ("sample_chart.json","r") as f:
                        data = f.read()
                        json_data = json.loads(data)
                        json_data["series"] = series
                        json_data["title"] = report_name
                        json_data["xAxis"][0]["categories"] = series[0]['data']
                    #print(json_data,"##########")
                    return(json_data)
            elif report_type.lower() == "box":
                #print(result,'----------')
                report_key = next(iter(result[0]))
                if type(result[0]) == dict:
                    report_value = result[0][report_key]
                else:
                    report_value = result[0][0]
                return (report_value)
            elif report_type.lower() == "table":
                final_result = {}
                if connection_type == 'mysql':
                    res = cursor.description
                    column_names = [column[0] for column in res]
                    final_result["column_names"] = column_names
                    final_result["data"] = result
                    final_result["report_type"] = report_type.lower()
                    return final_result
                elif connection_type == 'postgres':
                    res = cursor.description
                    column_names = [column.name for column in res]
                    final_result["column_names"] = column_names
                    final_result["data"] = result
                    final_result["report_type"] = report_type.lower()
                    return final_result
    except Exception as unexpected_exception:
        #print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))

@app.post("/getAssignedReports")
async def getAssignedReports(report_details:dict):
    try:
        database_type = report_details.get("database_type")
        customer_id = report_details.get("customer_id")
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
                cursor.execute("SELECT grm.group_id,grm.report_id,rt.report_template_name,grm.access_mask FROM hyphenview_new_release_test.group_report_map as grm inner join hyphenview_new_release_test.report_template as rt on grm.report_id=rt.report_id and grm.access_mask != 'null' and rt.customer_id=%s",(customer_id,))
                result = cursor.fetchall()
            database_mysql.close()
            return result
    except Exception as unexpected_exception:
        #print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))

@app.post("/getUsers")
async def getUsers(user_details:dict):
    try:
        email = user_details.get("email")
        database_type = user_details.get("database_type")
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
                # user_id = result[0]["user_id"]
                cursor.execute("select groupname from user_group where group_id = %s",(group_id,))
                result = cursor.fetchall()
                groupname = result[0]["groupname"]
                # if groupname in ['Admin','Super Admin','Guest','Emplyess']:
                if groupname == 'Admin':
                    cursor.execute("select user_email_id, group_id, user_status, user_creation_date from user_account ORDER BY user_creation_date DESC")
                    result = cursor.fetchall()
                else:
                    cursor.execute("select user_email_id, group_id, user_status, user_creation_date from user_account where group_id != 1 ORDER BY user_creation_date DESC")
                    result = cursor.fetchall()
                for items in result:
                    cursor.execute("select groupname from user_group where group_id = %s",(items["group_id"],))
                    temp_res = cursor.fetchall()
                    result[result.index(items)]["groupname"] = temp_res[0]["groupname"]
                database_mysql.close()
                #print(result)
                return result

                # else:
                #     database_mysql.close()
                #     return "Not Authorised"

    except Exception as unexpected_exception:
        #print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))

@app.post("/deleteReport")
async def delete(report_details:dict):
    try:
        report_id = report_details.get("report_id")
        database_type = report_details.get("database_type")
        customer_id = report_details.get("customer_id")
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
                cursor.execute("select * from report_template where report_id = %s",(report_id,))
                result = cursor.fetchall()
                report_name =result[0]['report_template_name']
                if result:
                    cursor.execute("delete from group_report_map where report_id = %s",(report_id,))
                    cursor.execute("delete from report_template where report_id = %s",(report_id,))
                    database_mysql.commit()
                    cursor.execute("select * from dashboard_report_frame where customer_id = %s",(customer_id,))
                    result = cursor.fetchall()
                    if len(result) > 0:
                        for dashboard in result:
                            dashboard_json_frame_data_str = dashboard['dashboard_json_frame_data']
                            dashboard_name = dashboard['dashboard_report_name']
                            dashboard_json_frame_data_list = json.loads(dashboard_json_frame_data_str)
                            dashboard_json_frame_data = dashboard_json_frame_data_list
                            if isinstance(dashboard_json_frame_data, list):
                                for chart_data in dashboard_json_frame_data:
                                    if chart_data['chartType'] == report_name:
                                        dashboard_json_frame_data.remove(chart_data)
                                        cursor.execute("update dashboard_report_frame set dashboard_json_frame_data = %s where customer_id = %s and dashboard_report_name = %s",(json.dumps(dashboard_json_frame_data),customer_id,dashboard_name))
                                        database_mysql.commit()
                    database_mysql.close()
                    return {"Status":"Deleted"}
                else:
                    database_mysql.close()
                    return {"Status":"Not Found"}
    except Exception as unexpected_exception:
        print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
    
@app.post("/getReportDataId")
async def get_report_data_id(report_details:dict):
    #print(report_details)
    try:
        report_id = report_details.get("report_id")
        email = report_details.get("email")
        database_type = report_details.get("database_type")
        # #print(report_title,email,database_type)
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
                    "select customer_id from user_account where user_email_id = %s",(email,)
                )
                result = cursor.fetchall()
                customer_id = result[0]["customer_id"]
                cursor.execute("select * from report_template where report_id = %s and customer_id = %s",(report_id,customer_id))
                result = cursor.fetchall()
                report_type = result[0]["report_type"]
                query = result[0]["defined_query"]
                chart_type = result[0]["chart_type"]
                enable_drilldowm = result[0]["enable_drilldown"]
                auto_update_interval = result[0]["auto_update_interval"]
                report_template_name = result[0]["report_template_name"]
                db_details_id = result[0]["db_details_id"]
                logo_path = result[0]["upload_logo"]
                background_colour = result[0]["background_colour"]
                chart_react_colour = result[0]["chart_react_colour"]
                font_size_title = result[0]["font_size_title"]
                font_size_value = result[0]["font_size_value"]
                report_title = result[0]["report_template_name"]
               
                   
                cursor.execute("SELECT * FROM database_details WHERE db_details_id = %s",(db_details_id,))
                result = cursor.fetchall()
                #print(result[0]["rdbms_name"])
                db_type = result[0]['rdbms_name']
                if result[0]["rdbms_name"] == 'mysql':
                    secondary_mysql_database_url = {
                    "host": result[0]["domain_name"],
                    "port": result[0]["db_port"],
                    "username": result[0]["db_user_name"],
                    "password": result[0]["db_password"],
                    "schema": result[0]["db_schema_name"]
                    }
                    secondary_database_mysql = get_mysql_connection(secondary_mysql_database_url)
                    with secondary_database_mysql.cursor(dictionary=True) as cursor:
                        cursor.execute(query)
                        result = cursor.fetchall()
                    secondary_database_mysql.close()
                    if len(cursor.description) == 3:
                        if report_type.lower() == "chart":
                            if chart_type.lower(): #in ['line','bar','column','gause','area','radial']:
                                columns = [desc[0] for desc in cursor.description]
                                temp = {}
                                for col in columns:
                                    temp[col] = []
                                    for i in result:
                                        if i[col] in temp[col]:
                                            continue
                                        else:
                                            temp[col].append(i[col])
                                        # names = list(result[''].keys())
                                series = []
                                for item in temp[columns[1]]:
                                    ele = {"data":[],"name":item}
                                    for element in result:
                                        if element[columns[1]] == item:
                                            ele["data"].append(element[columns[2]])
                                    series.append(ele)
                                # #print(series)
                                with open ("sample_chart.json","r") as f:
                                    data = f.read()
                                    json_data = json.loads(data)
                                    json_data["series"] = series
                                    json_data["title"] = report_title
                                    json_data["chart_type"] = chart_type.lower()
                                    json_data["report_type"] = report_type.lower()
                                    json_data["xAxis"][0]["categories"] = temp[columns[0]]
                                database_mysql.close()
                                # #print('---------------------',json_data,'--------------------')
                                return json_data
 
                elif result[0]['rdbms_name'] == 'postgres':
                    secondary_postgres_database_url = {
                    "host": result[0]["domain_name"],
                    "port": result[0]["db_port"],
                    "username": result[0]["db_user_name"],
                    "password": result[0]["db_password"],
                    "schema": result[0]["db_schema_name"]
                    }
                    secondary_database_postgres = get_postgres_connection(secondary_postgres_database_url)
                    # #print(secondary_database_mysql,"secondary_database_mysql")
                    with secondary_database_postgres.cursor(cursor_factory=DictCursor) as cursor:
                        cursor.execute(query)
                        result = cursor.fetchall()
                    secondary_database_postgres
                    if len(cursor.description) == 3:
                        if report_type.lower() == "chart":
                            if chart_type.lower(): #in ['line','bar','column','gause','area','radial']:
                                columns = [desc[0] for desc in cursor.description]
                                temp = {}
                                for col in columns:
                                    temp[col] = []
                                    for i in result:
                                        if i[col] in temp[col]:
                                            continue
                                        else:
                                            temp[col].append(i[col])
                                        # names = list(result[''].keys())
                                series = []
                                for item in temp[columns[1]]:
                                    ele = {"data":[],"name":item}
                                    for element in result:
                                        if element[columns[1]] == item:
                                            ele["data"].append(element[columns[2]])
                                    series.append(ele)
                                # #print(series)
                                with open ("sample_chart.json","r") as f:
                                    data = f.read()
                                    json_data = json.loads(data)
                                    json_data["series"] = series
                                    json_data["title"] = report_title
                                    json_data["chart_type"] = chart_type.lower()
                                    json_data["report_type"] = report_type.lower()
                                    json_data["xAxis"][0]["categories"] = temp[columns[0]]
                                database_mysql.close()
                                # #print('---------------------',json_data,'--------------------')
                                return json_data
 
            database_mysql.close()
            if report_type.lower() == "chart":
                if chart_type.lower():
                    names = list(result[0].keys())
                    transposed_data = list(zip(*[item.values() for item in result]))
                    series = [{"data": metric_data, "name": name} for name, metric_data in zip(names, transposed_data)]
                    with open ("sample_chart.json","r") as f:
                        data = f.read()
                        json_data = json.loads(data)
                        json_data["series"] = series
                        json_data["title"] = report_template_name
                        json_data["chart_type"] = chart_type.lower()
                        json_data["xAxis"][0]["categories"] = series[0]['data']
                    return(json_data)
               
            elif report_type.lower() == "box":
                report_key = next(iter(result[0]))
                # report_value = result[0][0]
                if type(result[0]) == dict:
                    report_value = result[0][report_key]
                else:
                    report_value = result[0][0]
                box_value_id = {"box_value_id": report_value,"backgroung_color":background_colour,"chart_react_color":chart_react_colour,"font_size_title":font_size_title,"font_size_value":font_size_value, "report_type": report_type.lower(),"report_title" : report_title,"logo_path":logo_path}
                return (box_value_id)
            elif report_type.lower() == "table":
                final_result = {}
                if db_type == 'mysql':
                    res = cursor.description
                    column_names = [column[0] for column in res]
                    final_result["column_names"] = column_names
                    final_result["data"] = result
                    final_result["report_type"] = report_type.lower()
                    return final_result
                elif db_type == 'postgres':
                    res = cursor.description
                    column_names = [column.name for column in res]
                    final_result["column_names"] = column_names
                    final_result["data"] = result
                    final_result["report_type"] = report_type.lower()
                    return final_result
    except Exception as unexpected_exception:
        #print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))

@app.post("/getReportDataId2")
async def get_report_data_id(report_details:dict):
    print(report_details)
    try:
        report_id = report_details.get("report_id")
        email = report_details.get("email")
        database_type = report_details.get("database_type")
        # print(report_title,email,database_type)
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
                    "select customer_id from user_account where user_email_id = %s",(email,)
                )
                result = cursor.fetchall()
                customer_id = result[0]["customer_id"]
                cursor.execute("select * from report_template where report_id = %s and customer_id = %s",(report_id,customer_id))
                result = cursor.fetchall()
                report_type = result[0]["report_type"]
                query = result[0]["defined_query"]
                chart_type = result[0]["chart_type"]
                enable_drilldowm = result[0]["enable_drilldown"]
                auto_update_interval = result[0]["auto_update_interval"]
                report_template_name = result[0]["report_template_name"]
                db_details_id = result[0]["db_details_id"]
                background_colour = result[0]["background_colour"]
                chart_react_colour = result[0]["chart_react_colour"]
                report_title = result[0]["report_template_name"]
               
                   
                cursor.execute("SELECT * FROM database_details WHERE db_details_id = %s",(db_details_id,))
                result = cursor.fetchall()
                print(result[0]["rdbms_name"])
               
                if result[0]["rdbms_name"] == 'mysql':
                    secondary_mysql_database_url = {
                    "host": result[0]["domain_name"],
                    "port": result[0]["db_port"],
                    "username": result[0]["db_user_name"],
                    "password": result[0]["db_password"],
                    "schema": result[0]["db_schema_name"]
                    }
                    secondary_database_mysql = get_mysql_connection(secondary_mysql_database_url)
                    with secondary_database_mysql.cursor(dictionary=True) as cursor:
                        cursor.execute(query)
                        result = cursor.fetchall()
                        print(result,"result")
                    secondary_database_mysql.close()
                elif result[0]['rdbms_name'] == 'postgres':
                    secondary_postgres_database_url = {
                    "host": result[0]["domain_name"],
                    "port": result[0]["db_port"],
                    "username": result[0]["db_user_name"],
                    "password": result[0]["db_password"],
                    "schema": result[0]["db_schema_name"]
                    }
                    secondary_database_postgres = get_postgres_connection(secondary_postgres_database_url)
                    # print(secondary_database_mysql,"secondary_database_mysql")
                    with secondary_database_postgres.cursor(cursor_factory=DictCursor) as cursor:
                        cursor.execute(query)
                        result = cursor.fetchall()
                        print(result,"result")
                    secondary_database_postgres
            database_mysql.close()
            if report_type.lower() == "chart":
                if chart_type.lower():
                    names = list(result[0].keys())
                    transposed_data = list(zip(*[item.values() for item in result]))
                    series = [{"data": metric_data, "name": name} for name, metric_data in zip(names, transposed_data)]
                    with open ("sample_chart.json","r") as f:
                        data = f.read()
                        json_data = json.loads(data)
                        json_data["series"] = series
                        json_data["title"] = report_template_name
                        json_data["chart_type"] = chart_type.lower()
                        json_data["xAxis"]["categories"] = series[0]['data']
                        print(json_data,"55555")
                    return(json_data)
               
            elif report_type.lower() == "box":
                report_key = next(iter(result[0]))
                print(report_key)
                # report_value = result[0][report_key]
                box_value_id = {"box_value_id": report_key,"backgroung_color":background_colour,"chart_react_color":chart_react_colour, "report_type": report_type.lower(),"report_title" : report_title}
                return (box_value_id)
            elif report_type.lower() == "table":
                result.append({"report_type":report_type.lower()})
                return (result)
    except Exception as unexpected_exception:
        print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
    
@app.post("/updateReport")
async def updateReport(details: str = Form(...), file: Optional[UploadFile] = None):
    #print(details)
    user_details = json.loads(details)
    try:
        report_id = user_details.get("report_id")
        # field_values = user_details.get("report_details")
        # #print(field_values)
        database_type = user_details.get("database_type")
        report_template_name = user_details.get("report_template_name")
        font_size_title = user_details.get("font_size_title")
        font_size_value = user_details.get("font_size_value")
        # #print(type(field_values), "///")
        if not all([report_id, database_type]):
            raise HTTPException(status_code=400, detail="Invalid request payload")
 
        if database_type == "mysql":
            icon_path = None
            if file is not None:
                file_content = await file.read()
                base64_data = base64.b64encode(file_content)
                base64_data_str = base64_data.decode('utf-8')
                icon_path = base64_data_str
            # original_path = Path(base_dir)
            # #print(original_path, "original_path")
            # parent_path = original_path.parent
            # icon_path = '/reportIcon'
            # # full_path = os.path.join(parent_path, 'hyphenview', icon_path)
            # full_path = str(parent_path) + '/hyphenview/public' + icon_path
            # uploads_directory = Path(full_path)
            # #print(uploads_directory, "uploads_directory")
            # uploads_directory.mkdir(parents=True, exist_ok=True)
            # file_extension = guess_extension(file.content_type)
            # file_name = f"{report_template_name}{file_extension}"
 
            # icon_path += '/{}'.format(file_name)
            # file_path = uploads_directory / file_name
            # if os.path.exists(file_path):
            #     os.remove(file_path)
            # with open(file_path, "wb") as buffer:
            #     # buffer.write(await file.read())
            #     shutil.copyfileobj(file.file, buffer)
            mysql_database_url = {
                "host": conf["mysql_host"],
                "port": conf["mysql_port"],
                "username": conf["mysql_username"],
                "password": conf["mysql_password"],
                "schema": conf["mysql_new_schema"]
            }
            database_mysql = get_mysql_connection(mysql_database_url)
            with database_mysql.cursor(dictionary=True) as cursor:
                query = "SELECT * FROM report_template where report_id = %s"
                cursor.execute(query, (report_id,))
                db_values = cursor.fetchone()
                if db_values is not None:
                    for key, value in user_details.items():
                        if key in db_values.keys() and db_values[key] != value and key not in ['report_id']:
                            update_query = f"UPDATE report_template SET {key} = %s WHERE report_id = {report_id}"
                            cursor.execute(update_query, (value,))
                            if key == "report_template_name":
                                cursor.callproc('UpdateReportName', (db_values[key], value))
                            database_mysql.commit()
                    if icon_path is not None:
                        update_query = f"UPDATE report_template SET upload_logo = %s WHERE report_id = {report_id}"
                        cursor.execute(update_query, (icon_path,))
                        database_mysql.commit()
                    return {"status": "success", "message": "Database updated successfully!"}
                else:
                    return {"status": "error", "message": "Report not found with the given report_id"}
    except Exception as unexpected_exception:
        #print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
    finally:
        if 'cursor' and "connection" in locals():
            cursor.close()
            database_mysql.close()
            
@app.post("/getFeatures")
async def getFeatures(details:dict):
    try:
        database_type = details.get("database_type")
        email = details.get("email")
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
                    "select customer_id from user_account where user_email_id = %s",(email,)
                )
                result = cursor.fetchall()
                customer_id = result[0]["customer_id"]
                cursor.execute(
                    "select feature_id, featurename from features where customer_id = %s",(customer_id,)
                )
                result = cursor.fetchall()
            database_mysql.close()
            return result
    except Exception as unexpected_exception:
        #print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
    
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif','pdf','txt','xlsx', 'docx', 'pptx', 'pptm', 'ppt','xlsm'])
 
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS   

@app.post("/addFeature")
async def upload_image(file: UploadFile = File(...), feature_name: str = Form(...), customer_id: str = Form(...), database_type: str = Form(...)):
    try:
        original_path = Path(base_dir)
        parent_path = original_path.parent
        # print(parent_path,"upload")
        icon_path = '/featureIcon'
        full_path = os.path.join(parent_path, 'hyphenview',icon_path)
        uploads_directory = Path(full_path)
        uploads_directory.mkdir(parents=True, exist_ok=True)
        file_extension = guess_extension(file.content_type)
        file_name = f"{customer_id}_{feature_name}{file_extension}"
        icon_path+='/{}'.format(file_name)
        file_path = uploads_directory / file_name
        with file_path.open("wb") as buffer:
            buffer.write(await file.read())

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
                    "INSERT INTO features (featurename, customer_id, created_at, feature_logo) VALUES (%s, %s, %s, %s)",
                    (feature_name, customer_id, datetime.now(), icon_path)
                )
                database_mysql.commit()

        return {"status": "success", "message": f"Feature '{feature_name}' added for customer ID {customer_id}."}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

@app.post("/assignReports")
async def assignReports(details:dict):
    try:
        database_type = details.get("database_type")
        group_id = details.get("group_id")
        report_ids = details.get("report_ids")
        access_masks = details.get("access_masks")
        date = datetime.now()
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
                for report_id in report_ids:
                    access_mask = access_masks[report_ids.index(report_id)]
                    #print(report_id,access_mask)
                    select_query = "SELECT * FROM group_report_map WHERE group_id = %s AND report_id = %s"
                    cursor.execute(select_query, (group_id, report_id))
                    existing_entry = cursor.fetchone()
                    

                    if existing_entry:
                        # If the combination exists, update the values
                        update_query = "UPDATE group_report_map SET created_at = %s, access_mask = %s WHERE group_id = %s AND report_id = %s"
                        cursor.execute(update_query, (date, access_mask, group_id, report_id))
                    else:
                        # If the combination does not exist, insert a new entry
                        insert_query = "INSERT INTO group_report_map (group_id, report_id, created_at, access_mask) VALUES (%s, %s, %s, %s)"
                        cursor.execute(insert_query, (group_id, report_id, date, access_mask))
            database_mysql.commit()
            database_mysql.close()
            return {"status":"success","message":"Report Assigned Successfully!"}
 
    except Exception as unexpected_exception:
        #print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
 
@app.post("/assignFeatures")
async def assignFeatures(details:dict):
    #print(details,"details2")
    try:
        database_type = details.get("database_type")
        feature_names = details.get("feature_names")
        group_id = details.get("group_id")
        access_masks = details.get("access_masks")
        date = details.get("date")
        email = details.get("email")
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
                    "select customer_id from user_account where user_email_id = %s",(email,)
                )
                result = cursor.fetchall()
                customer_id = result[0]["customer_id"]
                for feature_name in feature_names:
                    access_mask = access_masks[feature_names.index(feature_name)]
                    cursor.execute("select feature_id from features where featurename = %s and customer_id = %s ",(feature_name,customer_id))
                    result = cursor.fetchone()
                    feature_id = result["feature_id"]
                    select_query = "SELECT * FROM group_accessrights WHERE group_id = %s AND feature_id = %s"
                    cursor.execute(select_query, (group_id, feature_id))
                    existing_entry = cursor.fetchone()

                    if existing_entry:
                        # If the combination exists, update the values
                        update_query = "UPDATE group_accessrights SET created_at = %s, accessmask = %s WHERE group_id = %s AND feature_id = %s"
                        cursor.execute(update_query, (date, access_mask, group_id, feature_id))
                    else:
                        # If the combination does not exist, insert a new entry
                        insert_query = "INSERT INTO group_accessrights (group_id, feature_id, created_at, accessmask) VALUES (%s, %s, %s, %s)"
                        cursor.execute(insert_query, (group_id, feature_id, date, access_mask))
            database_mysql.commit()
            database_mysql.close()
            return {"status":"success","message":"Features Updated Successfully!"}
 
    except Exception as unexpected_exception:
        #print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
    
@app.post('/getaccessaccordingtogroupid')
async def accessmask(details: dict):
    #print(details)
    try:
        group_id = details.get('group_id')
        
        mysql_database_url = {
            "host": conf["mysql_host"],
                "port": conf["mysql_port"],
                "username": conf["mysql_username"],
                "password": conf["mysql_password"],
                "schema": conf["mysql_new_schema"]
            }
        database_mysql = get_mysql_connection(mysql_database_url)
        with database_mysql.cursor(dictionary=True) as cursor:
            cursor.execute("select featurename, accessmask from view_user_access_group where group_id=%s and accessmask != 'null'",(group_id,))
            result = cursor.fetchall()
        database_mysql.close()
        return result
 
    except Exception as unexpected_exception:
        #print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))

@app.post('/getTags')
async def gettags(details:dict):
    try:
        customer_id = details.get('customer_id')
        # database_details_id = details.get('database_details_id')
        connection_type = details.get("connection_type")
        schema_name = details.get("schema")
        mysql_database_url = {
            "host": conf["mysql_host"],
                "port": conf["mysql_port"],
                "username": conf["mysql_username"],
                "password": conf["mysql_password"],
                "schema": conf["mysql_new_schema"]
            }
        database_mysql = get_mysql_connection(mysql_database_url)
        for_master_report = details.get('for_master_report')
        if for_master_report == 'yes':
            query = details.get('query')
            with database_mysql.cursor(dictionary=True) as cursor:
                cursor.execute("select rdbms_name,domain_name,db_port,db_user_name,db_password,db_schema_name from database_details where customer_id = %s and db_schema_name = %s and rdbms_name = %s",(customer_id,schema_name,connection_type))
                result = cursor.fetchall()
                secondary_host = result[0]["domain_name"]
                secondary_port = result[0]["db_port"]
                secondary_username = result[0]["db_user_name"]
                secondary_password = result[0]["db_password"]
                schema_name = result[0]["db_schema_name"]
                connection_type = result[0]["rdbms_name"]
                secondary_database_url = {
                "host": secondary_host,
                "port": secondary_port,
                "username": secondary_username,
                "password": secondary_password,
                "schema": schema_name
                }
                if connection_type == "mysql":
                    secondary_database = get_mysql_connection(secondary_database_url)
                    with secondary_database.cursor(dictionary=True) as cursor:
                        cursor.execute(query)
                        result = cursor.description
                        column_names = [column[0] for column in result]
                        secondary_database.close()
                elif connection_type == "postgres":
                    secondary_database = get_postgres_connection(secondary_database_url)
                    with secondary_database.cursor() as cursor:
                        cursor.execute(query)
                        result = cursor.description
                        column_names = [column.name for column in result]
                        secondary_database.close()
            # res = count_group_by_columns(query)
            # group_by_columns = res["columns"]
            # filtered_columns = [col for col in column_names if col in group_by_columns]
            # print('master_report',filtered_columns,column_names)
            filtered_columns = [column_names[0],column_names[1]]
        elif for_master_report == 'no':
            report_title = details.get('report_title')
            with database_mysql.cursor(dictionary=True) as cursor:
                cursor.execute("select defined_query,db_details_id from report_template where report_template_name = %s and customer_id = %s",(report_title,customer_id))
                result = cursor.fetchone()
                query = result["defined_query"]
                db_details_id = result["db_details_id"]
                cursor.execute("select rdbms_name,domain_name,db_port,db_user_name,db_password,db_schema_name from database_details where customer_id = %s and db_details_id = %s",(customer_id,db_details_id))
                result = cursor.fetchall()
                secondary_host = result[0]["domain_name"]
                secondary_port = result[0]["db_port"]
                secondary_username = result[0]["db_user_name"]
                secondary_password = result[0]["db_password"]
                schema_name = result[0]["db_schema_name"]
                connection_type = result[0]["rdbms_name"]
                secondary_database_url = {
                "host": secondary_host,
                "port": secondary_port,
                "username": secondary_username,
                "password": secondary_password,
                "schema": schema_name
                }
                if connection_type == "mysql":
                    secondary_database = get_mysql_connection(secondary_database_url)
                    with secondary_database.cursor(dictionary=True) as cursor:
                        cursor.execute(query)
                        result = cursor.description
                        column_names = [column[0] for column in result]
                        secondary_database.close()
                elif connection_type == "postgres":
                    secondary_database = get_postgres_connection(secondary_database_url)
                    with secondary_database.cursor() as cursor:
                        cursor.execute(query)
                        result = cursor.description
                        column_names = [column.name for column in result]
                        secondary_database.close()
            filtered_columns = column_names
            print(report_title,filtered_columns,"drill_down report")
        database_mysql.close()
        return filtered_columns
 
    except Exception as unexpected_exception:
        print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))

@app.post('/checkDrillDown')
async def check(details:dict):
    try:
        query = details.get('query')
        chart_type = details.get('type')
        if chart_type.lower() == 'box':
            response = {
                    "drilldown":"yes",
                    "column_mapping":1
                }
        elif 'group by' in query or 'GROUP BY' in query:
            res = count_group_by_columns(query)
            if res != 0:
                count_of_group_by_columns = int(res["length"])
                if count_of_group_by_columns <3:
                    response = {
                        "drilldown":"yes",
                        "column_mapping":count_of_group_by_columns
                    }
                else:
                    response = {
                        "drilldown":"no",
                        "message":"Invalid Query for DrillDown : Count of columns in 'GROUP BY' clause should not be more than 2 for drilldown."
                    }
            else:
                response = {
                    "drilldown":"no",
                    "message":"Invalid Query"
                }
        else:
            response = {
                    "drilldown":"no",
                    "message":"Invalid Query for DrillDown : 'GROUP BY' clause having upto 2 columns is required for drilldown."
                }
        return response

    except Exception as unexpected_exception:
        print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))

@app.post('/saveDrillDownReport')
async def save(details: dict):
    try:
        customer_id = details.get('customer_id')
        master_report = details.get('master_report')
        drilldown_report = details.get('drilldown_report')
        master_column = str(details.get('Master_Column'))
        drilldown_column = str(details.get('DrillDown_Column'))
        print(master_column,drilldown_column)
        mysql_database_url = {
            "host": conf["mysql_host"],
            "port": conf["mysql_port"],
            "username": conf["mysql_username"],
            "password": conf["mysql_password"],
            "schema": conf["mysql_new_schema"]
        }
        database_mysql = get_mysql_connection(mysql_database_url)
 
        with database_mysql.cursor(dictionary=True) as cursor:
            # Check if the combination already exists
            cursor.execute("SELECT COUNT(*) as count FROM detailed_report WHERE master_report = %s AND drilldown_report = %s AND master_column = %s AND drilldown_column = %s AND customer_id = %s", (master_report, drilldown_report, master_column, drilldown_column, customer_id))
            result = cursor.fetchone()
 
            if result['count'] == 0:
                cursor.execute("INSERT INTO detailed_report (master_report, drilldown_report, master_column, drilldown_column, customer_id) VALUES (%s, %s, %s, %s, %s)", (master_report, drilldown_report, master_column, drilldown_column, customer_id))
                database_mysql.commit()
                return{"message":"Saved successfully"}
            else:
                return {"message": "Combination already exists"}
 
    except Exception as unexpected_exception:
        print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
 
    finally:
        if "cursor" in locals() and cursor:
            cursor.close()
        if "database_mysql" in locals() and database_mysql:
            database_mysql.close()

@app.post('/getDrillDownData')
async def getdata(details:dict):
    #print(details)
    try:
        customer_id = details.get('customer_id')
        master_report = details.get('master_report')
        filter_value = details.get('filter_value')
        selectedSeriesName = details.get('selectedSeriesName')
 
        mysql_database_url = {
            "host": conf["mysql_host"],
            "port": conf["mysql_port"],
            "username": conf["mysql_username"],
            "password": conf["mysql_password"],
            "schema": conf["mysql_new_schema"]
        }
        database_mysql = get_mysql_connection(mysql_database_url)
 
        with database_mysql.cursor(dictionary=True) as cursor:
            cursor.execute("select * from detailed_report where master_report = %s and customer_id = %s",(master_report,customer_id))
            result = cursor.fetchone()
            drilldown_report = result["drilldown_report"]
            drilldown_column = ast.literal_eval(result["drilldown_column"])
            cursor.execute("select * from report_template where report_template_name = %s and customer_id = %s",(drilldown_report,customer_id))
            result = cursor.fetchall()
            report_type = result[0]["report_type"]
            query = result[0]["defined_query"]
            chart_type = result[0]["chart_type"]
            enable_drilldowm = result[0]["enable_drilldown"]
            auto_update_interval = result[0]["auto_update_interval"]
            db_details_id = result[0]["db_details_id"]
            logo_path = result[0]["upload_logo"]
            backgroung_color = result[0]["background_colour"]
            chart_react_color = result[0]["chart_react_colour"]
            cursor.execute("SELECT * FROM database_details WHERE db_details_id = %s",(db_details_id,))
            result = cursor.fetchall()
            # #print(result,"result")
            db_type = result[0]['rdbms_name']
            if db_type == 'mysql':
                secondary_mysql_database_url = {
                "host": result[0]["domain_name"],
                "port": result[0]["db_port"],
                "username": result[0]["db_user_name"],
                "password": result[0]["db_password"],
                "schema": result[0]["db_schema_name"]
                }
                secondary_database_mysql = get_mysql_connection(secondary_mysql_database_url)
                with secondary_database_mysql.cursor(dictionary=True) as cursor:
                    if filter_value == '':
                        query = query
                    else:
                        if len(drilldown_column) == 1:
                            condition = f" WHERE `{drilldown_column[0]}` = '{filter_value}'"
                        elif len(drilldown_column) == 2:
                            condition = f" WHERE `{drilldown_column[0]}` = '{filter_value}' AND `{drilldown_column[1]}` = '{selectedSeriesName}'"
                        query = f"Select * from ({query}) main" + condition
                        # if "GROUP BY" in query or "group by" in query:
                        #     condition = f" WHERE \"{drilldown_column}\" = '{filter_value}'"
                        #     split_query = re.split(r'\bGROUP BY\b', query, flags=re.IGNORECASE)
                        #     query = split_query[0].strip() + ' ' + condition
                        # if "ORDER BY" in query or "order by" in query:
                        #     condition = f" WHERE \"{drilldown_column}\" = '{filter_value}'"
                        #     split_query = re.split(r'\bORDER BY\b', query, flags=re.IGNORECASE)
                        #     query = split_query[0].strip() + ' ' + condition
                        # if "WHERE" in query or "where" in query:
                        #     condition = f" WHERE \"{drilldown_column}\" = '{filter_value}'"
                        #     split_query = re.split(r'\bWHERE\b', query, flags=re.IGNORECASE)
                        #     query = split_query[0].strip() + ' ' + condition
                        # if "ORDER BY" in query or "order by" in query:
                        #     condition = f" WHERE \"{drilldown_column}\" = '{filter_value}'"
                        #     split_query = re.split(r'\bORDER BY\b', query, flags=re.IGNORECASE)
                        #     query = split_query[0].strip() + ' ' + condition + ' ORDER BY ' + split_query[1].strip()
                        #     # #print(query)
                        # elif "GROUP BY" in query or "group by" in query:
                        #     condition = f" WHERE \"{drilldown_column}\" = '{filter_value}'"
                        #     split_query = re.split(r'\bGROUP BY\b', query, flags=re.IGNORECASE)
                        #     query = split_query[0].strip() + ' ' + condition + ' GROUP BY ' + split_query[1].strip()
                        #     # #print(query)
                        # else:
                        #     condition = f" WHERE \"{drilldown_column}\" = '{filter_value}'"
                        #     query = query+condition
                    # print(query)
                    cursor.execute(query)
                    result = cursor.fetchall()
                secondary_database_mysql.close()
                if len(cursor.description) == 3:
                        if report_type.lower() == "chart":
                            if chart_type.lower(): #in ['line','bar','column','gause','area','radial']:
                                columns = [desc[0] for desc in cursor.description]
                                temp = {}
                                for col in columns:
                                    temp[col] = []
                                    for i in result:
                                        if i[col] in temp[col]:
                                            continue
                                        else:
                                            temp[col].append(i[col])
                                series = []
                                for item in temp[columns[1]]:
                                    ele = {"data":[],"name":item}
                                    for element in result:
                                        if element[columns[1]] == item:
                                            ele["data"].append(element[columns[2]])
                                    series.append(ele)
                                with open ("sample_chart.json","r") as f:
                                    data = f.read()
                                    json_data = json.loads(data)
                                    json_data["series"] = series
                                    json_data["title"] = drilldown_report
                                    json_data["chart_type"] = chart_type.lower()
                                    json_data["report_type"] = report_type.lower()
                                    json_data["xAxis"][0]["categories"] = temp[columns[0]]
                                database_mysql.close()
                                return json_data
 
            elif db_type == 'postgres':
                secondary_postgres_database_url = {
                "host": result[0]["domain_name"],
                "port": result[0]["db_port"],
                "username": result[0]["db_user_name"],
                "password": result[0]["db_password"],
                "schema": result[0]["db_schema_name"]
                }
                secondary_database_postgres = get_postgres_connection(secondary_postgres_database_url)
               
                with secondary_database_postgres.cursor(cursor_factory=DictCursor) as cursor:
                    if filter_value == '':
                        query = query
                    else:
                        if len(drilldown_column) == 1:
                            condition = f" WHERE \"{drilldown_column[0]}\" = '{filter_value}'"
                        elif len(drilldown_column) == 2:
                            condition = f" WHERE \"{drilldown_column[0]}\" = '{filter_value}' AND \"{drilldown_column[1]}\" = '{selectedSeriesName}'"
                        query = f"Select * from ({query}) main" + condition
                        # print(query,'-----------------')
                        # if "GROUP BY" in query or "group by" in query:
                        #     condition = f" WHERE \"{drilldown_column}\" = '{filter_value}'"
                        #     split_query = re.split(r'\bGROUP BY\b', query, flags=re.IGNORECASE)
                        #     query = split_query[0].strip() + ' ' + condition
                        # if "ORDER BY" in query or "order by" in query:
                        #     condition = f" WHERE \"{drilldown_column}\" = '{filter_value}'"
                        #     split_query = re.split(r'\bORDER BY\b', query, flags=re.IGNORECASE)
                        #     query = split_query[0].strip() + ' ' + condition
                        # if "WHERE" in query or "where" in query:
                        #     condition = f" WHERE \"{drilldown_column}\" = '{filter_value}'"
                        #     split_query = re.split(r'\bWHERE\b', query, flags=re.IGNORECASE)
                        #     query = split_query[0].strip() + ' ' + condition
                        # if "ORDER BY" in query or "order by" in query:
                        #     condition = f" WHERE \"{drilldown_column}\" = '{filter_value}'"
                        #     split_query = re.split(r'\bORDER BY\b', query, flags=re.IGNORECASE)
                        #     query = split_query[0].strip() + ' ' + condition + ' ORDER BY ' + split_query[1].strip()
                        #     # #print(query)
                        # elif "GROUP BY" in query or "group by" in query:
                        #     condition = f" WHERE \"{drilldown_column}\" = '{filter_value}'"
                        #     split_query = re.split(r'\bGROUP BY\b', query, flags=re.IGNORECASE)
                        #     query = split_query[0].strip() + ' ' + condition + ' GROUP BY ' + split_query[1].strip()
                            # #print(query)
                        # elif "WHERE" in query or "where" in query:
                        #     condition = f" AND \"{drilldown_column}\" = '{filter_value}'"
                        #     query = query+condition
                        #     # #print(query)
                        # else:
                        #     condition = f" WHERE \"{drilldown_column}\" = '{filter_value}'"
                        #     query = query+condition
                    # print(query)
                    cursor.execute(query)
                    result = cursor.fetchall()
                secondary_database_postgres.close()
                if len(cursor.description) == 3:
                        if report_type.lower() == "chart":
                            if chart_type.lower(): #in ['line','bar','column','gause','area','radial']:
                                columns = [desc[0] for desc in cursor.description]
                                temp = {}
                                for col in columns:
                                    temp[col] = []
                                    for i in result:
                                        if i[col] in temp[col]:
                                            continue
                                        else:
                                            temp[col].append(i[col])
                                        # names = list(result[''].keys())
                                series = []
                                for item in temp[columns[1]]:
                                    ele = {"data":[],"name":item}
                                    for element in result:
                                        if element[columns[1]] == item:
                                            ele["data"].append(element[columns[2]])
                                    series.append(ele)
                                # #print(series)
                                with open ("sample_chart.json","r") as f:
                                    data = f.read()
                                    json_data = json.loads(data)
                                    json_data["series"] = series
                                    json_data["title"] = drilldown_report
                                    json_data["chart_type"] = chart_type.lower()
                                    json_data["report_type"] = report_type.lower()
                                    json_data["xAxis"][0]["categories"] = temp[columns[0]]
                                database_mysql.close()
                                # #print('---------------------',json_data,'--------------------')
                                return json_data
        database_mysql.close()
        if report_type.lower() == "chart":
            if chart_type.lower():
                names = list(result[0].keys())
                transposed_data = list(zip(*[item.values() for item in result]))
                series = [{"data": metric_data, "name": name} for name, metric_data in zip(names, transposed_data)]
                with open ("sample_chart.json","r") as f:
                    data = f.read()
                    json_data = json.loads(data)
                    json_data["series"] = series
                    json_data["title"] = drilldown_report
                    json_data["chart_type"] = chart_type.lower()
                    json_data["xAxis"][0]["categories"] = series[0]['data']
                return(json_data)
        elif report_type.lower() == "box":
            report_key = next(iter(result[0]))
            # report_value = result[0][report_key]
            box_value = {"box_value": report_key,"backgroung_color":backgroung_color,"chart_react_color":chart_react_color, "report_type": report_type.lower(),"report_title" : drilldown_report,"logo_path":logo_path}
            return (box_value)
        elif report_type.lower() == "table":
            final_result = {}
            if db_type == 'mysql':
                res = cursor.description
                column_names = [column[0] for column in res]
                final_result["column_names"] = column_names
                final_result["data"] = result
                final_result["report_type"] = report_type.lower()
                return final_result
            elif db_type == 'postgres':
                res = cursor.description
                column_names = [column.name for column in res]
                final_result["column_names"] = column_names
                final_result["data"] = result
                final_result["report_type"] = report_type.lower()
                return final_result
    except Exception as unexpected_exception:
        print(f"Unexpected error: {unexpected_exception}")
        raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
 
    finally:
        if "cursor" in locals() and cursor:
            cursor.close()
        if "database_mysql" in locals() and database_mysql:
            database_mysql.close()
 
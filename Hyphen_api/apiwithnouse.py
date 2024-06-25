# @app.post("/reportPreview")
# async def getPreview(report_details:dict):
#     print(report_details)
#     try:
       
#         report_name = report_details.get("report_name")
#         report_type = report_details.get("report_type")
#         chart_type = report_details.get("chart_type")
#         defined_query = report_details.get("query")
#         email = report_details.get("email")
#         database_type = report_details.get("database_type")
#         connection_type = report_details.get("connection_type")
#         schema_name = report_details.get("schema")
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
#                     "select customer_id from user_account where user_email_id = %s",(email,)
#                 )
#                 result = cursor.fetchall()
#                 customer_id = result[0]["customer_id"]
#                 cursor.execute(
#                     "select domain_name, db_port, db_user_name, db_password from database_details where customer_id = %s and db_schema_name = %s and rdbms_name = %s",(customer_id,schema_name,connection_type)
#                 )
#                 result = cursor.fetchall()
#                 secondary_host = result[0]["domain_name"]
#                 secondary_port = result[0]["db_port"]
#                 secondary_username = result[0]["db_user_name"]
#                 secondary_password = result[0]["db_password"]
#                 secondary_database_url = {
#                 "host": secondary_host,
#                 "port": secondary_port,
#                 "username": secondary_username,
#                 "password": secondary_password,
#                 "schema": schema_name
#                 }
#                 if connection_type == "mysql":
#                     secondary_database = get_mysql_connection(secondary_database_url)
#                     with secondary_database.cursor(dictionary=True) as cursor:
#                         cursor.execute(defined_query)
#                         result = cursor.fetchall()
#                         print(result)
#                 elif connection_type == "postgres":
#                     secondary_database = get_postgres_connection(secondary_database_url)
#                     with secondary_database.cursor(cursor_factory=DictCursor) as cursor:
#                         cursor.execute(defined_query)
#                         result = cursor.fetchall()
#                 secondary_database.close()
#             database_mysql.close()
#             if report_type.lower() == "chart":
#                 if chart_type.lower():
#                     names = list(result[0].keys())
#                     transposed_data = list(zip(*[item.values() for item in result]))
#                     series = [{"data": list(metric_data), "name": name} for name, metric_data in zip(names, transposed_data)]
#                     with open ("sample_chart.json","r") as f:
#                         data = f.read()
#                         json_data = json.loads(data)
#                         json_data["series"] = series
#                         json_data["title"] = report_name
#                         json_data["xAxis"]["categories"] = series[0]['data']
#                     print(json_data,"##########")
#                     return(json_data)
#             elif report_type.lower() == "box":
#                 print(result,'----------')
#                 report_key = next(iter(result[0]))
#                 # print(report_key,"---------------------")
#                 # report_value = result[0][report_key]
#                 return (report_key)
#             elif report_type.lower() == "table":
#                 return (result)
#     except Exception as unexpected_exception:
#         print(f"Unexpected error: {unexpected_exception}")
#         raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))

# @app.post("/deleteReport")
# async def delete(report_details:dict):
#     try:
#         report_id = report_details.get("report_id")
#         database_type = report_details.get("database_type")
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
#                 cursor.execute("select * from report_template where report_id = %s",(report_id,))
#                 result = cursor.fetchall()
#                 if result:
#                     cursor.execute("delete from group_report_map where report_id = %s",(report_id,))
#                     cursor.execute("delete from report_template where report_id = %s",(report_id,))
#                     database_mysql.commit()
#                     database_mysql.close()
#                     return {"Status":"Deleted"}
#                 else:
#                     database_mysql.close()
#                     return {"Status":"Not Found"}
#     except Exception as unexpected_exception:
#         print(f"Unexpected error: {unexpected_exception}")
#         raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))

# @app.post("/getReportData")
# async def get_report_data(report_details:dict):
#     try:
#         report_title = report_details.get("report_title")
#         email = report_details.get("email")
#         database_type = report_details.get("database_type")
#         # print(report_title,email,database_type)
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
#                     "select customer_id from user_account where user_email_id = %s",(email,)
#                 )
#                 result = cursor.fetchall()
#                 customer_id = result[0]["customer_id"]
#                 cursor.execute("select * from report_template where report_template_name = %s and customer_id = %s",(report_title,customer_id))
#                 result = cursor.fetchall()
#                 report_type = result[0]["report_type"]
#                 query = result[0]["defined_query"]
#                 chart_type = result[0]["chart_type"]
#                 enable_drilldowm = result[0]["enable_drilldown"]
#                 auto_update_interval = result[0]["auto_update_interval"]
#                 db_details_id = result[0]["db_details_id"]
#                 logo_path = result[0]["upload_logo"]
#                 backgroung_color = result[0]["background_colour"]
#                 chart_react_color = result[0]["chart_react_colour"]
#                 cursor.execute("SELECT * FROM database_details WHERE db_details_id = %s",(db_details_id,))
#                 result = cursor.fetchall()
#                 # print(result,"result")

#                 if result[0]['rdbms_name'] == 'mysql':
#                     secondary_mysql_database_url = {
#                     "host": result[0]["domain_name"],
#                     "port": result[0]["db_port"],
#                     "username": result[0]["db_user_name"],
#                     "password": result[0]["db_password"],
#                     "schema": result[0]["db_schema_name"]
#                     }
#                     secondary_database_mysql = get_mysql_connection(secondary_mysql_database_url)
#                     # print(secondary_database_mysql,"secondary_database_mysql")
#                     with secondary_database_mysql.cursor(dictionary=True) as cursor:
#                         cursor.execute(query)
#                         result = cursor.fetchall()
#                         print(result,"result")
#                     secondary_database_mysql.close()
#                 elif result[0]['rdbms_name'] == 'postgres':
#                     secondary_postgres_database_url = {
#                     "host": result[0]["domain_name"],
#                     "port": result[0]["db_port"],
#                     "username": result[0]["db_user_name"],
#                     "password": result[0]["db_password"],
#                     "schema": result[0]["db_schema_name"]
#                     }
#                     secondary_database_postgres = get_postgres_connection(secondary_postgres_database_url)
#                     # print(secondary_database_mysql,"secondary_database_mysql")
#                     with secondary_database_postgres.cursor(cursor_factory=DictCursor) as cursor:
#                         cursor.execute(query)
#                         result = cursor.fetchall()
#                         print(result,"result")
#                     secondary_database_postgres.close()
#             database_mysql.close()
#             if report_type.lower() == "chart":
#                 if chart_type.lower(): #in ['line','bar','column','gause','area','radial']:
#                     names = list(result[0].keys())
#                     transposed_data = list(zip(*[item.values() for item in result]))
#                     series = [{"data": metric_data, "name": name} for name, metric_data in zip(names, transposed_data)]
#                     with open ("sample_chart.json","r") as f:
#                         data = f.read()
#                         json_data = json.loads(data)
#                         json_data["series"] = series
#                         json_data["title"] = report_title
#                         json_data["chart_type"] = chart_type.lower()
#                         json_data["report_type"] = report_type.lower()
#                         json_data["xAxis"]["categories"] = series[0]['data']  
#                     print('---------------------',json_data,'--------------------')                      
#                     return(json_data)
#             elif report_type.lower() == "box":
#                 report_key = next(iter(result[0]))
#                 # report_value = result[0][report_key]
#                 box_value = {"box_value": report_key,"backgroung_color":backgroung_color,"chart_react_color":chart_react_color, "report_type": report_type.lower(),"report_title" : report_title,"logo_path":logo_path}
#                 return (box_value)
#             elif report_type.lower() == "table":
#                 result.append({"report_type":report_type.lower()})
#                 return (result)

#     except Exception as unexpected_exception:
#         print(f"Unexpected error: {unexpected_exception}")
#         raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))


# @app.post("/getReportList")
# async def getReportList(user_details:dict):
#     try:
#         email = user_details.get("email")
#         group_id = user_details.get("group_id")
#         database_type = user_details.get("database_type")
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
#                 # cursor.execute(
#                 #     "select customer_id, role_id, user_id from user_account where email_id = %s",(email,)
#                 # )
#                 cursor.execute(
#                     "select customer_id, group_id from user_account where user_email_id = %s",(email,)
#                 )
#                 result = cursor.fetchall()
#                 customer_id = result[0]["customer_id"]
#                 # role_id = result[0]["role_id"]
#                 # user_id = result[0]["user_id"]
#                 # user_id = result[0]["user_id"]
#                 cursor.execute("select groupname from user_group where group_id = %s",(group_id,))
#                 result = cursor.fetchall()
#                 print(result,"result")
#                 groupname = result[0]["groupname"]
#                 if groupname in ['Admin']:
#                     cursor.execute("select * from report_template where customer_id = %s ORDER BY report_id DESC",(customer_id,))
#                     result = cursor.fetchall()
#                     report_templates = [{"report_id":item['report_id'],"report_name":item['report_template_name'],"report_type":item['report_type'],"chart_type":item['chart_type'],"drilldown":item['enable_drilldown'],"query":item['defined_query'],"start_date":item['start_date'],"end_date":item['end_date'],"enable_drilldown":item['enable_drilldown'],"auto_update_interval":item['auto_update_interval'],"time_period":item['time_period'],"show_in_dashboard":item['show_in_dashboard']} for item in result]
#                     database_mysql.close()
#                     return report_templates
#                 elif groupname:
#                     report_templates = []
#                     # cursor.execute("select * from user_report_map where user_email_id = %s",(email,))
#                     cursor.execute("select * from group_report_map where group_id = %s",(group_id,))
#                     result = cursor.fetchall()
#                     report_template_ids = [data["report_id"] for data in result]
#                     for i in report_template_ids:
#                         cursor.execute("select report_id, report_template_name, report_type, chart_type, enable_drilldown from report_template where customer_id = %s and report_id = %s ORDER BY report_id DESC",(customer_id,i))
#                         result = cursor.fetchall()
#                         report_templates.append({"report_id":result[0]['report_id'],"report_name":result[0]['report_template_name'],"report_type":result[0]['report_type'],"chart_type":result[0]['chart_type'],"drilldown":result[0]['enable_drilldown']})
#                     database_mysql.close()
#                     return report_templates

#                 else:
#                     database_mysql.close()
#                     return "No Templates Found"
        
#     except Exception as unexpected_exception:
#         print(f"Unexpected error: {unexpected_exception}")
#         raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))

# @app.post("/getReportDataId")
# async def get_report_data_id(report_details:dict):
#     print(report_details)
#     try:
#         report_id = report_details.get("report_id")
#         email = report_details.get("email")
#         database_type = report_details.get("database_type")
#         # print(report_title,email,database_type)
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
#                     "select customer_id from user_account where user_email_id = %s",(email,)
#                 )
#                 result = cursor.fetchall()
#                 customer_id = result[0]["customer_id"]
#                 cursor.execute("select * from report_template where report_id = %s and customer_id = %s",(report_id,customer_id))
#                 result = cursor.fetchall()
#                 report_type = result[0]["report_type"]
#                 query = result[0]["defined_query"]
#                 chart_type = result[0]["chart_type"]
#                 enable_drilldowm = result[0]["enable_drilldown"]
#                 auto_update_interval = result[0]["auto_update_interval"]
#                 report_template_name = result[0]["report_template_name"]
#                 db_details_id = result[0]["db_details_id"]
#                 background_colour = result[0]["background_colour"]
#                 chart_react_colour = result[0]["chart_react_colour"]
#                 report_title = result[0]["report_template_name"]
                
				    
#                 cursor.execute("SELECT * FROM database_details WHERE db_details_id = %s",(db_details_id,))
#                 result = cursor.fetchall()
#                 print(result[0]["rdbms_name"])
                
#                 if result[0]["rdbms_name"] == 'mysql':
#                     secondary_mysql_database_url = {
#                     "host": result[0]["domain_name"],
#                     "port": result[0]["db_port"],
#                     "username": result[0]["db_user_name"],
#                     "password": result[0]["db_password"],
#                     "schema": result[0]["db_schema_name"]
#                     }
#                     secondary_database_mysql = get_mysql_connection(secondary_mysql_database_url)
#                     with secondary_database_mysql.cursor(dictionary=True) as cursor:
#                         cursor.execute(query)
#                         result = cursor.fetchall()
#                         print(result,"result")
#                     secondary_database_mysql.close()
#                 elif result[0]['rdbms_name'] == 'postgres':
#                     secondary_postgres_database_url = {
#                     "host": result[0]["domain_name"],
#                     "port": result[0]["db_port"],
#                     "username": result[0]["db_user_name"],
#                     "password": result[0]["db_password"],
#                     "schema": result[0]["db_schema_name"]
#                     }
#                     secondary_database_postgres = get_postgres_connection(secondary_postgres_database_url)
#                     # print(secondary_database_mysql,"secondary_database_mysql")
#                     with secondary_database_postgres.cursor(cursor_factory=DictCursor) as cursor:
#                         cursor.execute(query)
#                         result = cursor.fetchall()
#                         print(result,"result")
#                     secondary_database_postgres
#             database_mysql.close()
#             if report_type.lower() == "chart":
#                 if chart_type.lower():
#                     names = list(result[0].keys())
#                     transposed_data = list(zip(*[item.values() for item in result]))
#                     series = [{"data": metric_data, "name": name} for name, metric_data in zip(names, transposed_data)]
#                     with open ("sample_chart.json","r") as f:
#                         data = f.read()
#                         json_data = json.loads(data)
#                         json_data["series"] = series
#                         json_data["title"] = report_template_name
#                         json_data["chart_type"] = chart_type.lower()
#                         json_data["xAxis"]["categories"] = series[0]['data']
#                         print(json_data,"55555")
#                     return(json_data)
                
#             elif report_type.lower() == "box":
#                 report_key = next(iter(result[0]))
#                 print(report_key)
#                 # report_value = result[0][report_key]
#                 box_value_id = {"box_value_id": report_key,"backgroung_color":background_colour,"chart_react_color":chart_react_colour, "report_type": report_type.lower(),"report_title" : report_title}
#                 return (box_value_id)
#             elif report_type.lower() == "table":
#                 result.append({"report_type":report_type.lower()})
#                 return (result)
#     except Exception as unexpected_exception:
#         print(f"Unexpected error: {unexpected_exception}")
#         raise HTTPException(status_code=500, detail="Internal server error: {}".format(unexpected_exception))
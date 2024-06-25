import json
import os
import mysql.connector
from datetime import datetime
import logging
import time
 
import pandas as pd
from sqlalchemy import create_engine
 
from lib.commonutility import read_config
from SendEmailOffice365 import SendEmailOffice365
from GeneratePDFandExcel import generate_pdf_report,generate_excel_report
 
# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
 
configfilepath = os.path.join(os.getcwd(), 'Cfg/config.json')
 
class ScheduledTask:
    def __init__(self):
        self.conn = None
        self.cursor = None
        self.resFlag = True
        self.dashQuery = False
        self.now = None
        self.actualTime = None
        self.conf = read_config(configfilepath)
        self.from_email = "notify@erasmith.com"
        self.password = "Mahesh@007"
        self.smtp = "outlook.office365.com"
        self.port = 587

    def connect_to_database(self):
        self.conn = mysql.connector.connect(
            host=self.conf["mysql_host"],
            port=self.conf["mysql_port"],
            user=self.conf["mysql_username"],
            password=self.conf["mysql_password"],
            database=self.conf["mysql_new_schema"]
        )
        self.cursor = self.conn.cursor(dictionary=True, buffered=True)
 
    def close_database_connection(self):
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.close()
 
    def run(self):
        while True:
            try:
                self.connect_to_database()
                self.now = datetime.now()
                self.actualTime = datetime.now()
                logger.info("Start Time is: %s", self.now)
 
                # RPTQuery = "select scheduleid, scheduledtime, scheduledIntervalDays, scheduledIntervalTime, status, emailid, " \
                #            "SchedulerPeriod, customer_id, emailcc, startDate, reportTitle, reportIDEB, emailBodyContent,reportattachment " \
                #            "from dashboard_schedulerinfo"
                DashboardQuery = "select * from dashboard_schedulerinfo"
 
                # if self.resFlag:
                #     logger.info("Inside RPTQuery dataset")
                #     self.dashQuery = False
                #     self.cursor.execute(RPTQuery)
                #     self.initiatingScheduler(self.cursor, self.dashQuery)
 
                if self.resFlag:
                    logger.info("Inside DASHQuery dataset")
                    self.dashQuery = True
                    self.cursor.execute(DashboardQuery)
                    self.initiatingScheduler(self.cursor, self.dashQuery)
 
                logger.info("End Time is: %s", self.now)
 
                self.close_database_connection()
 
            except Exception as e:
                logger.info("Exception in mail: %s", e)
 
            time.sleep(60)  # Wait for 60 seconds before running again
 
    def trigger_email(self,actual_time, scheduled_time, interval, to_address, ccAddress,
                      reportIds,startDateReport, reportTitle, scheduleid, reportIDEB, emailBodyContent, dashQuery):
        print(actual_time,scheduled_time)
        if actual_time > scheduled_time or actual_time == scheduled_time:
            print(reportIds)
            print("------")
            if interval.lower() in ["daily", "dailymtd"]:
                print("inside daily check actualTime->", actual_time, scheduled_time)
                print(actual_time.hour)
                if actual_time.hour == scheduled_time.hour:
                    print("inside actualTime & scheduledtime check")
                    if actual_time.minute == scheduled_time.minute:
                        print("Mail is going to be triggered", scheduled_time.hour)
                        # self.send_email(to_address,reportIds, interval, ccAddress, startDateReport, reportTitle,
                        #            scheduleid, reportIDEB, emailBodyContent, dashQuery)
            elif interval.lower() == "weekly":
                if actual_time.weekday() == scheduled_time.weekday():
                    if actual_time.hour == scheduled_time.hour:
                        if actual_time.minute == scheduled_time.minute:
                            print("Mail is going to be triggered Weekly", scheduled_time.hour)
                            # self.send_email(to_address, reportIds, interval, ccAddress, startDateReport,
                            #            reportTitle, scheduleid, reportIDEB, emailBodyContent, dashQuery)
            elif interval.lower() == "monthly":
                if actual_time.day == scheduled_time.day:
                    if actual_time.hour == scheduled_time.hour:
                        if actual_time.minute == scheduled_time.minute:
                            print("Mail is going to be triggered Monthly", scheduled_time.hour)
                            # self.send_email(to_address, reportIds, interval, ccAddress, startDateReport,
                            #            reportTitle, scheduleid, reportIDEB, emailBodyContent, dashQuery)
 
    def fetchandsendemail(self,cursor,reportattachment,emailid, emailcc,emailBodyContent):
        data,report_query,db_config,db_type = self.fetch_data_from_database(cursor, reportattachment)
        print(data)
        local_folder = "local_reports/"
        attachments = []
       
        for format_type, report_data in data.items():
            for report_id, df in report_data.items():
                if format_type == 'pdf':
                    filename = f"{local_folder}{report_id}.pdf"
                    print("Generating pdf...")
                    generate_pdf_report(report_query, filename, db_config,report_id,db_type)
                    # with open(filename, 'rb') as f:
                    #     pdf_data = f.read()
                    attachments.append(filename)
                elif format_type == 'xlsx':
                    filename = f"{local_folder}{report_id}.xlsx"
                    print("Generating excel...")
                    generate_excel_report(df, filename, report_id)
                    # with open(filename, 'rb') as f:
                    #     excel_data = f.read()
                    attachments.append(filename)
 
        print(attachments)
        # exit()
        print("Sending Email.....")
        emailer = SendEmailOffice365(self.from_email, self.password, self.smtp, self.port)
        emailer.send_email_with_attachments(emailid, emailcc,
                                            f"Scheduled Report - {datetime.now().strftime('%Y-%m-%d')}",
                                            emailBodyContent, attachments)
 
    def initiatingScheduler(self, cursor, dashQuery):
        logger.info("dashquery flag--> %s", dashQuery)
        rows = cursor.fetchall()
        print(rows)
        # print(len(rows[0]))
        for res in rows:
            scheduleid = res['scheduleid']
            scheduledtime = res['scheduledtime']
            Interval = res['scheduledIntervalDays']
            IntervalTime = res["scheduledIntervalTime"]
            status = res["status"]
            emailid = json.loads(res["emailid"])
            emailcc = json.loads(res["emailcc"])
            interval = res["SchedulerPeriod"]
            customer_id = res["customer_id"]
            startDate = res["startDate"]
            reportTitle,reportIDEB = res["reportTitle"],res["reportIDEB"]
            emailBodyContent,reportattachment = res["emailBodyContent"],json.loads(res["reportattachment"])
            print(scheduledtime)
            print(reportattachment)
            actual_time = self.actualTime
            if actual_time > scheduledtime or actual_time == scheduledtime:
                if interval.lower() in ["daily", "dailymtd"]:
                    print("inside daily check actualTime->", actual_time, scheduledtime)
                    print(actual_time.hour)
                    if actual_time.hour == scheduledtime.hour:
                        print("inside actualTime & scheduledtime check")
                        if actual_time.minute == scheduledtime.minute:
                            print("Mail is going to be triggered", scheduledtime.hour)
                            self.fetchandsendemail(cursor,reportattachment,emailid,emailcc,emailBodyContent)
                elif interval.lower() == "weekly":
                    if actual_time.weekday() == scheduledtime.weekday():
                        if actual_time.hour == scheduledtime.hour:
                            if actual_time.minute == scheduledtime.minute:
                                print("Mail is going to be triggered Weekly", scheduledtime.hour)
                                self.fetchandsendemail(cursor, reportattachment, emailid, emailcc, emailBodyContent)
                elif interval.lower() == "monthly":
                    if actual_time.day == scheduledtime.day:
                        if actual_time.hour == scheduledtime.hour:
                            if actual_time.minute == scheduledtime.minute:
                                print("Mail is going to be triggered Monthly", scheduledtime.hour)
                                self.fetchandsendemail(cursor, reportattachment, emailid, emailcc, emailBodyContent)
        # self.resFlag = False
 
    def fetch_data_from_database(self,cursor,report_ids):
        # Fetch data based on report IDs
        data = {}
        for format_type, ids in report_ids.items():
            data[format_type] = {}
            for report_id in ids:
                query = f"SELECT * FROM report_template WHERE report_id = %s"
                cursor.execute(query,(report_id,))
                rows = cursor.fetchall()
                df = pd.DataFrame(rows, columns=cursor.column_names)
                print(df)
                print("_____s")
                if not df.empty:
                    db_details_id = df.at[0, "db_details_id"]
                    customer_id = df.at[0, "customer_id"]
                    report_query = df.at[0, "defined_query"]
                    report_name = df.at[0, "report_template_name"]
                    db_query = f"SELECT * FROM database_details WHERE db_details_id= %s AND customer_id= %s"
                    cursor.execute(db_query, (str(db_details_id), str(customer_id),))
                    db_rows = cursor.fetchall()
                    print(db_rows)
                    db_df = pd.DataFrame(db_rows, columns=cursor.column_names)
                    print(db_df)
                    if not db_df.empty:
                        db_detail = dict(zip(db_df.columns, db_df.values[0]))
                        db_config = {
                                'host': db_detail['domain_name'],
                                'user': db_detail['db_user_name'],
                                'password': db_detail['db_password'],
                                'database': db_detail['db_schema_name'],
                                'port' : db_detail['db_port']
                            }
                        db_type = db_detail["rdbms_name"]
                        if str(db_detail["rdbms_name"]).lower() == "mysql":
                            DATABASE_CONNECTION = f"mysql://{db_detail['db_user_name']}:{db_detail['db_password']}@" \
                                                  f"{db_detail['domain_name']}/{db_detail['db_schema_name']}"
                            try:
                                db_engine = create_engine(DATABASE_CONNECTION)
                                report_data = pd.read_sql_query(report_query, db_engine)
                                data[format_type][report_name] = report_data
                            except Exception as err:
                                print(f"Errgeneor while connecting to the DataBase.")
                        elif str(db_detail["rdbms_name"]).lower() == "postgres":
                            DATABASE_CONNECTION = f"postgresql+psycopg2://{db_detail['db_user_name']}:{db_detail['db_password']}@" \
                                                  f"{db_detail['domain_name']}:{db_detail['db_port']}/{db_detail['db_schema_name']}"
                            try:
                                db_engine = create_engine(DATABASE_CONNECTION)
                                report_data = pd.read_sql_query(report_query, db_engine)
                                print(report_data)
                                print("-----+")
                                data[format_type][report_name] = report_data
                            except Exception as err:
                                print(f"Error fetching data for report_id {report_name}: {err}")
                                print("Error while connecting to the DataBase.")
                        else:
                            print("Unsupported database type.")
                    else:
                        print(f"No database details found for report_id {report_name}.")
                else:
                    print(f"No report template found for report_id {report_id}.")
 
        return data,report_query,db_config,db_type
 
    def send_email(self, dashQuery, toAddress, reportTitle, reportIDEB, emailBodyContent):
        logger.info("Mail Triggered TO: %s", toAddress)
        # Implement your email sending logic here
 
 
# Usage
task = ScheduledTask()
task.run()
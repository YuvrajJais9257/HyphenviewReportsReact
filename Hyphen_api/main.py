import os
import uvicorn
from fastapi import FastAPI,Request
from DashboardManagement import DashboardManagement
from UserManagement import UserManagement
from fastapi.middleware.cors import CORSMiddleware
from LoginValidator import AuthenticationManager
from RESTAPIManagement import RESTAPIManagement
from ReportScheduler import ReportScheduler
from lib import commonutility as common
configfilepath = os.path.join(os.getcwd(), 'Cfg/config.json')
conf = common.read_config(configfilepath)

app = FastAPI()
# Define endpoint

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/saveUser")
async def save_user_endpoint(details: dict):
    user_management = UserManagement(conf)
    return user_management.save_user(details)

@app.post('/authorization', response_model=dict)
async def auth(request: Request):
    data = await request.json()
    database_type = data.get("database_type")
    email = data.get('username')
    if email:
        auth = AuthenticationManager()
        return auth.authorization(email, 'mysql')
    else:
        return {'validate': False, 'message': 'Invalid request format'}
    
@app.post('/validate-login', response_model=dict)
async def validate_login_api(request: Request):
    auth = AuthenticationManager()
    data = await request.json()
    email = data.get('username')
    password = data.get('password')
    return auth.validate_login(email, password)


@app.post("/getGroup")
async def get_group_names(details: dict):
    user_management = UserManagement(conf)
    return user_management.fetch_details(details)

@app.post("/resetPassword")
async def reset_password_endpoint(details: dict):
    user_management = UserManagement(conf)
    return user_management.edit_user(details)

@app.post("/deleteUser")
async def delete_user_endpoint(details: dict):
    user_management = UserManagement(conf)
    return user_management.delete_user(details)

@app.put("/assignGroup")
async def assignGroup(details: dict):
    print(details,"json_data")
    user_management = UserManagement(conf)
    return user_management.assignGroup(details["formData"])

@app.post("/saveFrame")
async def save_frame(details: dict):
    user_management = DashboardManagement(conf)
    return user_management.insert_in_db(details)

@app.post("/getFrame")
async def get_frame(details: dict):
    dashboard_management = DashboardManagement(conf)
    return dashboard_management.list_frame(details)

@app.post("/saveRESTdetail")
async def save_rest_info(details: dict):
    dashboard_management = RESTAPIManagement(conf)
    return dashboard_management.insert_in_db(details)

@app.post("/saveScheduler")
async def saveScheduler(details: dict):
    report_scheduler = ReportScheduler(conf)
    return report_scheduler.insert_scheduler(details)
 
@app.post("/listScheduler")
async def listScheduler(details: dict):
    report_scheduler = ReportScheduler(conf)
    return report_scheduler.list_scheduler(details)


@app.post("/updateFrame")
async def update_frame(details: dict):
    dashboard_management = DashboardManagement(conf)
    return dashboard_management.update_in_db(details)


@app.post("/updateScheduler")
async def updateScheduler(details: dict):
    report_scheduler = ReportScheduler(conf)
    return report_scheduler.update_scheduler(details)
 
@app.post("/deleteScheduler")
async def deleteScheduler(details: dict):
    report_scheduler = ReportScheduler(conf)
    return report_scheduler.delete_scheduler(details)

@app.post("/getSchedulerbyId")
async def getSchedulerById(details: dict):
    report_scheduler = ReportScheduler(conf)
    return report_scheduler.list_scheduler_by_id(details)

@app.post("/getMultiFrame")
async def get_frame(details: dict):
    dashboard_management = DashboardManagement(conf)
    return dashboard_management.multi_list_frame(details)

@app.post("/findFrame")
async def find_frame(details: dict):
    dashboard_management = DashboardManagement(conf)
    return dashboard_management.check_frame(details)

@app.post("/deleteFrame")
async def delete_frame_endpoint(details: dict):
    dash_management = DashboardManagement(conf)
    return dash_management.delete_frame(details)

@app.post("/listAccess")
async def list_access(details: dict):
    dashboard_management = DashboardManagement(conf)
    return dashboard_management.list_access(details)
 
@app.post("/listDashboard")
async def list_dashboard(details: dict):
    dashboard_management = DashboardManagement(conf)
    return dashboard_management.get_list_dashboards(details)

@app.post("/listDashboardname")
async def list_dashboard(details: dict):
    dashboard_management = DashboardManagement(conf)
    return dashboard_management.get_list_dashboards_name(details)



@app.post("/updateAccess")
async def update_access(details: dict):
    dashboard_management = DashboardManagement(conf)
    return dashboard_management.update_access(details)

@app.post("/editFrame")
async def edit_frame(details: dict):
    dashboard_management = DashboardManagement(conf)
    return dashboard_management.edit_frame(details)
# HyphenView

HyphenView is a self-service Business Intelligence & Data Visualization Platform. It empowers businesses to analyze big and disparate datasets and provides the capability to create customizable dashboards and reports. The platform is compatible with both cloud and on-premises deployments.

## Features & Functionality

- **Quick Data Preparation and Analysis**: Prepare and analyze your data within minutes to create stunning data visualizations.
- **Multi-tenant Architecture**: HyphenView's architecture allows a single instance to serve multiple tenants, enabling common access users with specific privileges to access shared resources.
- **Self-service Reporting Framework**: Users can create a background and understand the basics of their questions, enabling them to create better queries for data scientists to find specific answers.
- **Support for Multiple Data Sources**:
  - PostgreSQL
  - DB2
  - Oracle
  - Vertica
  - MySQL
  - MS SQL Server
- **Drilldown**: Instantly shift from an overview of data to a more detailed and granular view within the same dataset by clicking on a metric in a dashboard or report. This feature allows users to explore specific information in a report from different angles by stepping down from one level of a predefined data hierarchy to the next.
- **Enforced Access Controls**: Role-based access control restricts access based on a person's role within an organization and is a primary method for advanced access control.
- **Scheduled Reports**: Automatically send reports to clients at specified times. You can specify what is to be included, who should receive the report, and how often it will be sent.
- **Dashboard View for Analysis**: Dashboards compile data and visualize trends and occurrences, allowing all users to understand the analytics and the analysis process.

## Screenshots

### Dashboard Management
1. Create Dashboard Page
![DashboardCreation](screenShots/DashbaordManagement/DashboardCreation.png)
2. Dashboard Management Page
![DashboardManagement](screenShots/DashbaordManagement/DashboardManagement.png)
3. Dashboard Overview Page/ HomePage
![DashboardOverview](screenShots/DashbaordManagement/DashboardSideBar.png)

### Report Management

1. Create New Report Connection (Via Databases)

RegisterNewConnection
![CreateNewReportConnection](screenShots/ReportManagement/NewReportCreation/CreateNewReportConnection.png)

NewMySQLConnection
![NewMySQLConnection](screenShots/ReportManagement/NewReportCreation/NewMysqlConnection.png)

AvailableReportConnections
![TypesOfReportConnections](screenShots/ReportManagement/NewReportCreation/TypesOfReportConnection.png)

RESTAPIConnection
![RESTAPIConnection](screenShots/ReportManagement/NewReportCreation/RestApiModuleDataPagination.png)

2. Create New Report Connection (Via REST API Module)

RESTAPIModuleOverview
![RESTAPIPage](screenShots/ReportManagement/NewReportCreation/RestApiModuleDataPagination.png)

GET_POSTMethod
![GETPOST](screenShots/ReportManagement/RestAPIModule/Get_Post_RequestMethods.png)

SpecifyHeaders
![Headers](screenShots/ReportManagement/RestAPIModule/RestAPIModuleSpecifyHeadersTab.png)

SpecifyParams
![Params](screenShots/ReportManagement/RestAPIModule/RestApiModulePostman.png)

SpecifyBody
![Body](screenShots/ReportManagement/RestAPIModule/RESTAPIModule.png)

SpecifyAuthentication
![Authentication](screenShots/ReportManagement/RestAPIModule/RestAuthentication.png)

SpecifyFormData
![SpecifyFormData](screenShots/ReportManagement/RestAPIModule/SpecifyFromData.png)

SpecifyBodyJSON
![RAWBody](screenShots/ReportManagement/RestAPIModule/SpecifyRawBodyJson.png)

UIToJSONFromDataPage
![UIToJSONFromData](screenShots/ReportManagement/RestAPIModule/UIToJsonFromDataPage.png)

3. Report Preview

BoxReportPreview
![BoxReport](screenShots/ReportManagement/TablePreview/BoxPreview.png)
![BoxReportPreviewTwo](screenShots/ReportManagement/TablePreview/BoxPreview2.png)

ChartReportPreview
![ChartReport](screenShots/ReportManagement/TablePreview/ChartPreview.png)

TableReportPreview
![TableReportPreview](screenShots/ReportManagement/TablePreview/TablePreview_Aka_Download.png)

FilterReportsTool
![FilterReport](screenShots/ReportManagement/TablePreview/FilterReports.png)

MultiSortReportsTool
![MultiSortReport](screenShots/ReportManagement/TablePreview/MultiSortTableReport.png)

ShowSelectiveColumns
![ShowSelectiveColumnsReport](screenShots/ReportManagement/TablePreview/ShowSelectiveColumnsTableReport.png)

TableReportDownload
![TableReportDownload](screenShots/ReportManagement/TablePreview/DownloadTableReport.png)

4. Assign Reports To Group
![AssignReportToGroup](screenShots/ReportManagement/AssignReportsToGroup.png)

5. Custom Query Report Creation
![CustomQueryReport](screenShots/ReportManagement/CustomQueryReportCreation.png)

6. Build Query Report Creation
![Report](screenShots/ReportManagement/BuildQueryPage1.png)
![BuildQueryReport](screenShots/ReportManagement/BuildQueryPage2.png)

7. Edit Report Page
![EditReport](screenShots/ReportManagement/EditReportPage.png)

8. Report Management Page
![ReportManagement](screenShots/ReportManagement/ReportManagement.png)

### Report Scheduler
![ReportScheduler](screenShots/ReportScheduler/ReportScheduler.png)

### User Management

1. AccessNewFeature
![AccessNewFeature](screenShots/UserManagement/AccessnewFeature.png)

2. AssignDashboardToGroups
![AssignDashboardToGroups](screenShots/UserManagement/AssignDashboardToGroups.png)

3. Create New Feature
![CreateNewFeature](screenShots/UserManagement/CreateNewFeature.png)

4. Create New Group
![NewGroupCreation](screenShots/UserManagement/NewGroupCreation.png)

5. User Management Overview
![UserManagement](screenShots/UserManagement/UserManagement.png)

6. Register New User
![RegisterNewUser](screenShots/UserManagement/registerNewUser.png)

### Others
1. Available Features
![AvailableFeatures](screenShots/Others/Features.png)

2. AppLoginPage
![AppLoginPage](screenShots/Others/LoginPage.png)

3. UserProfilePage
![UserProfilePage](screenShots/Others/ProfilePage.png)

## Uses

1. **Server Monitoring**: HyphenView monitors server details such as CPU usage, data source monitoring, networking, operating system, and more. The details can be displayed in table view or in various pictorial forms including pie charts, donut charts, stacked charts, bar charts, and more.
2. **CCTV Analysis and Visualization**: HyphenView analyzes and visualizes CCTV data. Reports generated by HyphenView can be seen in either table view or pictorial view, providing insights into the working of CCTV cameras.
3. **Single Reporting Platform**: HyphenView creates a unified reporting platform for server data and network data, generating reports in table format for specific time periods.

## Roadmap

Below are a few features that we plan to add in upcoming releases to improve the efficiency and productivity of the application:

- **Elastic Search**: 
  - Data from multiple external compatible RDBMS, NoSQL, Rest API, Log files, CSVs, and JSON sources will be pulled by connectors into Elastic DB. The pulled data will be processed as per requirements and exposed to the frontend using APIs.
- **API Compatibility**:
  - APIs will help ensure the application functions correctly and seamlessly when connecting external data sources. It will be compatible with multiple sources of APIs for data pulling and populating onto the dashboard.
- **Lightweight UI**:
  - As a Single Page Application (SPA) built on top of React technology, it will increase user experience, making the application more interactive and faster. This will include features focusing on using minimal system resources to provide a fast and responsive user experience.

## Installation

### Backend Setup (Django)

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/hyphenview.git
    cd hyphenview
    ```

2. Create and activate a virtual environment:
    ```sh
    python -m venv env
    source env/bin/activate  # On Windows, use `env\Scripts\activate`
    ```

3. Install the required packages:
    ```sh
    pip install -r requirements.txt
    ```

4. Apply migrations:
    ```sh
    python manage.py migrate
    ```

5. Start the Django development server:
    ```sh
    python manage.py runserver
    ```

### Frontend Setup (React)

1. Navigate to the frontend directory:
    ```sh
    cd frontend
    ```

2. Install the required packages:
    ```sh
    npm install
    ```

3. Start the React development server:
    ```sh
    npm start
    ```

## Usage

Ensure you are in the project directory. If not, navigate to it first:
```sh
cd path/to/hyphenview
```
steps to run the frontend and backend servers:
1. Frontend: Open the first terminal and run:
   ```sh
   cd hyphenview
   npm start
   ```
2. Backend - API 1: Open the second terminal and run:
   ```sh
   cd hyphenview/Hyphen_api
   uvicorn db_connect_details:app --reload
   ```
3. Backend - API 2: Open the third terminal and run:
   ```sh
   cd hyphenview/Hyphen_api
   uvicorn main:app --host 0.0.0.0 --port 3001 --reload
   ```
4. Backend - API 3: Open the fourth terminal and run:
   ```sh
   cd hyphenview/Hyphen_api
   uvicorn report_data_api:app --port 3002 --reload
   ```

import './App.css';
import Login from './Components/Login/Login';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard/Dashboard';
import '@mdi/font/css/materialdesignicons.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@coreui/coreui/dist/css/coreui.min.css';
import SideBar from './Components/SideBar/SideBar';
import SplitView from './Components/Splitcheck/SplitView';
import "bootstrap/dist/css/bootstrap.min.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ApexChart from './Components/ReportManagement/ApexChart';
import Preview from './Components/Splitcheck/Preview';
import PieChart from './Components/HighCharts/PieChart';
import HighCharts from './Components/HighCharts/HighCharts';
import CustomQuery from './Components/QueryType/CustomQuery';
import UpdateCutomQuery from './Components/QueryType/UpdateCutomQuery';
import ListOfReports from './Components/ReportManagement/ListOfReports';
import PreviewPage from './Components/ReportManagement/PreviewPage';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import BuildQueryNew from './Components/QueryType/QuerybuilderNew';
import ReportTable from './Components/ReportTypeTable/ReportTable';
import ConnectionForm from './Components/ReportManagement/ConnectionForm';
import UserManagementList from './Components/UserManagement/UserManagementList';
import NewUser from './Components/UserManagement/NewUser';
import ReportSchedulerList from './Components/ReportScheduler/ReportSchedulerList';
import ReportSchedulerAddNewRtp from './Components/ReportScheduler/ReportSchedulerAddNewRtp';
import GenerateReport from './Components/ReportManagement/GenerateReport';
import NewFeature from './Components/Dashboard/NewFeature';
import ReportAsination from './Components/UserManagement/ReportAsination';
import AssignationAndFeature from './Components/UserManagement/AssignationAndFeature';
import ResetPassword from './Components/UserManagement/ResetPassword';
import FeatureAssign from './Components/UserManagement/FeatureAssign';
import ModifiedCanvasPage from './Components/ModifiedCanvas/ModifiedCanvasPage';
import DataProvider from './Components/RestApiSection/Components/DataProvider';
import HomePage from './Components/RestApiSection/Components/HomePage';
import ReportSchedulerUpdate from './Components/ReportScheduler/ReportSchedulerUpdate';
import ReportSchedulerNew from './Components/ReportScheduler/ReportSchedulerNew';
import TableRow from './Components/UserManagement/TableRow';
import TestQery from './Components/TestFolder/TestQery';
import FeatureAssignpage from './Components/TestFolder/FeatureAssignpage';
import ShowChartReport from './Components/ReportManagement/ShowChartReport';
import ShowBoxchart from './Components/ReportManagement/ShowBoxchart';
import { FormStateProvider } from './Components/ReportManagement/FormStateContext';
import DataFromBackPage from './Components/QueryType/DataFromBackPage'
import ConvertToCSV from './Components/RestApiSection/Components/ConvertToCSV'
import Profile from './Components/Profile'
import SampleQueryForDrilldown from './Components/QueryType/SampleQueryForDrilldown'
import DrillDown from './Components/HighCharts/DrillDown';
import DashboardManagement from './Components/DashboardManagement/DashboardManagement'
import ListOfDashboardCanvas from './Components/DashboardManagement/ListOfDashboardCanvas'
import Geomap from './Components/HighCharts/geomap';
import NewDashboard from './Components/NewDashboard/NewDashboard';
import ProtectedRoute from './Components/utils/ProtectedRoute';

// import ReportDashBoardNew from './Components/DefaultPage/ReportDashBoardNew';





function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />  
        <Route path="/Dashboard" element={<ProtectedRoute Component = {Dashboard}/>} />
        <Route path="/ApexChart" element={<ApexChart />} />
        <Route path="/SplitView" element={<DndProvider backend={HTML5Backend}><SplitView key={SplitView} /></DndProvider>} />
        <Route path="/Preview" element={<Preview />} />
        <Route path="/HighCharts" element={<HighCharts />} />
        <Route path="/CustomQuery" element={<CustomQuery />} />    
        <Route path="/UpdateReportPage" element={<UpdateCutomQuery />} />    
        <Route path="/ListOfReports" element={<ListOfReports />} />
        <Route path="/PreviewPage" element={<PreviewPage />} />
        <Route path="/BuildQueryNew" element={<BuildQueryNew />} />
        <Route path="/ReportTable" element={<ReportTable />} />
        <Route path="/ConnectionForm" element={<ConnectionForm />} />
        <Route path="/UserManagementList" element={<UserManagementList />} />
        <Route path="/NewUser" element={<NewUser/>} />
        <Route path="/ReportSchedulerList" element={<ReportSchedulerList/>} />
        <Route path="/ReportSchedulerAddNewRtp" element={<ReportSchedulerAddNewRtp/>} />
        <Route path="/GenerateReport" element={<GenerateReport/>} />
        <Route path="/NewFeature" element={<NewFeature/>} />
        <Route path="/ReportAsination" element={<ReportAsination/>} />
        <Route path="/AssignationAndFeature" element={<AssignationAndFeature/>}/>
        <Route path="/ResetPassword" element={<ResetPassword/>}/>
        <Route path="/FeatureAssign" element={<FeatureAssign/>}/>
        <Route path="/ModifiedCanvasPage" element={<ModifiedCanvasPage/>}/>
        <Route path="/HomePage" element={<DataProvider><HomePage /></DataProvider>} />
        <Route path="/ReportSchedulerUpdate" element={<ReportSchedulerUpdate/>}/>
        <Route path="/ReportSchedulerNew" element={<ReportSchedulerNew/>}/>
        <Route path="/TableRow" element={<TableRow/>}/>
        <Route path="/TestQery" element={<TestQery/>}/>
        <Route path="/FeatureAssignpage" element={<FeatureAssignpage/>}/>
        <Route path="/ShowChartReport" element={<ShowChartReport/>}/>
        <Route path="/PieChart" element={<PieChart/>}/>
        <Route path="/ShowBoxchart" element={<ShowBoxchart/>}/>
        <Route path="/DataFromBackPage" element={<DataFromBackPage/>}/>
        <Route path="/json-to-ui" element={<ConvertToCSV/>}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/SampleQueryForDrilldown" element={<SampleQueryForDrilldown/>}/>
        <Route path="/drillDown" element={<DrillDown/>} />
        <Route path="/DashboardManagement" element={<DashboardManagement />} />
        <Route path="/Geomap" element={<Geomap />} />
        <Route path="/NewDashboard" element={<NewDashboard />} />
        <Route path="/ListOfDashboardCanvas" element={<ListOfDashboardCanvas />} />
        {/* <Route path="/ReportDashBoardNew" element={<ReportDashBoardNew/>}/> */}
      </Routes>
    </div>
  );
}

export default App;

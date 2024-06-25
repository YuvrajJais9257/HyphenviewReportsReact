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
import BuildQuery from './Components/QueryType/BuildQuery';
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
// import NewDashboard from './Components/NewDasboard/NewDashboard';
import ProtectedRoute from './Components/utils/ProtectedRoute';

// import ReportDashBoardNew from './Components/DefaultPage/ReportDashBoardNew';





function App() {

  return (
    <div>
      <Routes>
        <Route path="/hyphenview" element={<Login />} />  
        <Route path="/hyphenview/Dashboard" element={<ProtectedRoute Component = {Dashboard}/>} />
        <Route path="/hyphenview/ApexChart" element={<ApexChart />} />
        <Route path="/hyphenview/SplitView" element={<DndProvider backend={HTML5Backend}><SplitView key={SplitView} /></DndProvider>} />
        <Route path="/hyphenview/Preview" element={<Preview />} />
        <Route path="/hyphenview/HighCharts" element={<HighCharts />} />
        <Route path="/hyphenview/BuildQuery" element={<BuildQuery />} />
        <Route path="/hyphenview/CustomQuery" element={<CustomQuery />} />    
        <Route path="/hyphenview/UpdateReportPage" element={<UpdateCutomQuery />} />    
        <Route path="/hyphenview/ListOfReports" element={<ListOfReports />} />
        <Route path="/hyphenview/PreviewPage" element={<PreviewPage />} />
        <Route path="/hyphenview/BuildQuery" element={<BuildQuery />} />
        <Route path="/hyphenview/BuildQueryNew" element={<BuildQueryNew />} />
        <Route path="/hyphenview/ReportTable" element={<ReportTable />} />
        <Route path="/hyphenview/ConnectionForm" element={<ConnectionForm />} />
        <Route path="/hyphenview/UserManagementList" element={<UserManagementList />} />
        <Route path="/hyphenview/NewUser" element={<NewUser/>} />
        <Route path="/hyphenview/ReportSchedulerList" element={<ReportSchedulerList/>} />
        <Route path="/hyphenview/ReportSchedulerAddNewRtp" element={<ReportSchedulerAddNewRtp/>} />
        <Route path="/hyphenview/GenerateReport" element={<GenerateReport/>} />
        <Route path="/hyphenview/NewFeature" element={<NewFeature/>} />
        <Route path="/hyphenview/ReportAsination" element={<ReportAsination/>} />
        <Route path="/hyphenview/AssignationAndFeature" element={<AssignationAndFeature/>}/>
        <Route path="/hyphenview/ResetPassword" element={<ResetPassword/>}/>
        <Route path="/hyphenview/FeatureAssign" element={<FeatureAssign/>}/>
        <Route path="/hyphenview/ModifiedCanvasPage" element={<ModifiedCanvasPage/>}/>
        <Route path="/hyphenview/HomePage" element={<DataProvider><HomePage /></DataProvider>} />
        <Route path="/hyphenview/ReportSchedulerUpdate" element={<ReportSchedulerUpdate/>}/>
        <Route path="/hyphenview/ReportSchedulerNew" element={<ReportSchedulerNew/>}/>
        <Route path="/hyphenview/TableRow" element={<TableRow/>}/>
        <Route path="/hyphenview/TestQery" element={<TestQery/>}/>
        <Route path="/hyphenview/FeatureAssignpage" element={<FeatureAssignpage/>}/>
        <Route path="/hyphenview/ShowChartReport" element={<ShowChartReport/>}/>
        <Route path="/hyphenview/PieChart" element={<PieChart/>}/>
        <Route path="/hyphenview/ShowBoxchart" element={<ShowBoxchart/>}/>
        <Route path="/hyphenview/DataFromBackPage" element={<DataFromBackPage/>}/>
        <Route path="/hyphenview/json-to-ui" element={<ConvertToCSV/>}/>
        <Route path="/hyphenview/profile" element={<Profile />} />
        <Route path="/hyphenview/SampleQueryForDrilldown" element={<SampleQueryForDrilldown/>}/>
        <Route path="/hyphenview/drillDown" element={<DrillDown/>} />
        <Route path="/hyphenview/DashboardManagement" element={<DashboardManagement />} />
        <Route path="/hyphenview/Geomap" element={<Geomap />} />
        {/* <Route path="/hyphenview/NewDasboard" element={<NewDashboard />} /> */}
        <Route path="/hyphenview/ListOfDashboardCanvas" element={<ListOfDashboardCanvas />} />
        {/* <Route path="/hyphenview/ReportDashBoardNew" element={<ReportDashBoardNew/>}/> */}
      </Routes>
    </div>
  );
}

export default App;

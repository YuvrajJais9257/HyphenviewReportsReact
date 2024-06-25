import axios from "axios";
const apiUrlEndPoint1 = process.env.REACT_APP_API_URL1;
const apiUrlEndPoint2 = process.env.REACT_APP_API_URL2;
const apiUrlEndPoint3 = process.env.REACT_APP_API_URL3;

export const logIn = (formData) => axios.post(`${apiUrlEndPoint1}/validate-login/`, formData);
export const auth = (formData) => axios.post(`${apiUrlEndPoint1}/authorization/`, formData);
export const databaseconnection = (formData) => axios.post(`${apiUrlEndPoint3}/save_connection/`, formData);
export const validateConnection = (formData) => axios.post(`${apiUrlEndPoint3}/getSchema/`, formData);
export const schemametaData = (formData) => axios.post(`${apiUrlEndPoint3}/getSchemaMetadata/`, formData);
export const savereportTemplate = (formData) => axios.post(`${apiUrlEndPoint3}/save_report_template/`, formData);
export const getreporttitlefromondashbaord = (formData) => axios.post(`${apiUrlEndPoint2}/getReportTemplates/`, formData);
export const customPreviewChartData = (formData) => axios.post(`${apiUrlEndPoint2}/reportPreview/`, formData);
// export const getreportformateddata = (formData) => axios.post(`${apiUrlEndPoint2}/getReportData/`, formData);
export const testquryonCustompage = (formData) => axios.post(`${apiUrlEndPoint3}/checkQuery/`, formData);
export const testquryonCustompagefordrilldown = (formData) => axios.post(`${apiUrlEndPoint3}/checkQuery/`, formData);
export const listOfuser = (formData) => axios.post(`${apiUrlEndPoint2}/getUsers/`, formData);
export const removereport = (formData) => axios.post(`${apiUrlEndPoint2}/deleteReport/`, formData);
export const updateReportdetail = (formData) => axios.post(`${apiUrlEndPoint2}/updateReport/`, formData);
export const generateReportId = (formData) => axios.post(`${apiUrlEndPoint2}/getReportDataId/`, formData);
export const listofgroup = (formData) => axios.post(`${apiUrlEndPoint1}/getGroup/`, formData);
export const saveUser = (formData) => axios.post(`${apiUrlEndPoint1}/saveUser/`, formData);
export const featureName = (formData) => axios.post(`${apiUrlEndPoint2}/getFeatures/`, formData);
export const addGroup = (formData) => axios.post(`${apiUrlEndPoint3}/addGroup/`, formData);
export const resetPassword = (formData) => axios.post(`${apiUrlEndPoint1}/resetPassword/`, formData);
export const deleteUser = (formData) => axios.post(`${apiUrlEndPoint1}/deleteUser/`, formData);
export const assigngrouptouser = (formData) => axios.put(`${apiUrlEndPoint1}/assignGroup/`, { 
    formData,
    headers: {
        'Content-Type': 'application/json',
        
    },
});
export const uploadicon = (formData) => axios.post(`${apiUrlEndPoint2}/addFeature/`, formData);
export const assignreporttothegroup = (formData) => axios.post(`${apiUrlEndPoint2}/assignReports/`, formData);
export const assignfeaturetothegroup = (formData) => axios.post(`${apiUrlEndPoint2}/assignFeatures/`, formData);
export const savecanvasframedata = (formData) => axios.post(`${apiUrlEndPoint1}/saveFrame/`, formData);
export const canvashframedataformodification = (formData) => axios.post(`${apiUrlEndPoint1}/getMultiFrame/`, formData);
export const getReportDetailonbasisOFgroupid = (formData) => axios.post(`${apiUrlEndPoint2}/getAssignedReports/`, formData);
export const getReportDetailByID = (formData) => axios.post(`${apiUrlEndPoint2}/getReportDetail/`, formData);
export const restapidetailsave = (formData) => axios.post(`${apiUrlEndPoint1}/saveRESTdetail/`, formData);
export const listofSchedulereport = (formData) => axios.post(`${apiUrlEndPoint1}/listScheduler/`, formData);
export const savenewSchedulereport = (formData) => axios.post(`${apiUrlEndPoint1}/saveScheduler/`, formData);
export const updatecanvashframedataformodification = (formData) => axios.post(`${apiUrlEndPoint1}/updateFrame/`, formData);
export const getfeatureaccessmask = (formData) => axios.post(`${apiUrlEndPoint2}/getaccessaccordingtogroupid/`, formData);
export const getschedulereportdetailforupdate = (formData) => axios.post(`${apiUrlEndPoint1}/getSchedulerbyId/`, formData);
export const updatescheduleinfo = (formData) => axios.post(`${apiUrlEndPoint1}/updateScheduler/`, formData);
export const removeschedulereport = (formData) => axios.post(`${apiUrlEndPoint1}/deleteScheduler/`, formData);
export const getreportaccessonbasisofgroupid = (formData) => axios.post(`${apiUrlEndPoint2}/getReportAccesses/`, formData);
export const getreportdetailwithaccessforassignreport = (formData) => axios.post(`${apiUrlEndPoint2}/getReportTemplatealldetail/`, formData);
export const generateChartTypeReport = (formData) => axios.post(`${apiUrlEndPoint2}/getReportDataId/`, formData);
export const generateBoxTypeReport = (formData) => axios.post(`${apiUrlEndPoint2}/getReportDataId/`, formData);
export const deletecanvashframe = (formData) => axios.post(`${apiUrlEndPoint1}/deleteFrame/`, formData);
export const checkdashboardcanvasname = (formData) => axios.post(`${apiUrlEndPoint1}/findFrame/`, formData);
export const getlistofcolumnformappingfirst = (formData) => axios.post(`${apiUrlEndPoint2}/getTags/`, formData);
export const getlistofcolumnformappingsecond = (formData) => axios.post(`${apiUrlEndPoint2}/getTags/`, formData);
export const saveMapDataForDrillDown = (formData) => axios.post(`${apiUrlEndPoint2}/saveDrillDownReport/`, formData);
export const getdataforDrilldown = (formData) => axios.post(`${apiUrlEndPoint2}/getDrillDownData/`, formData);
export const checkdrilldown = (formData) => axios.post(`${apiUrlEndPoint2}/checkDrillDown/`, formData);
export const listofdashboardframename = (formData) => axios.post(`${apiUrlEndPoint1}/listDashboard/`, formData);
export const listofdashboardframenamewithdistiinct = (formData) => axios.post(`${apiUrlEndPoint1}/listDashboardname/`, formData);
export const listofaccessmask = (formData) => axios.post(`${apiUrlEndPoint1}/listAccess/`, formData);
export const updateaccessofdashboard = (formData) => axios.post(`${apiUrlEndPoint1}/updateAccess/`, formData);
export const getreportframedatabygroupid = (formData) => axios.post(`${apiUrlEndPoint1}/editFrame/`, formData);
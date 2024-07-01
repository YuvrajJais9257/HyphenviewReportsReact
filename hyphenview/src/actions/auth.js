import { LOGIN,AUTH,DB_CONNECTION, VALIDATE_CONNECTION,SCHEMA_DATA,REPORT_TEMPLATE_DATA_SAVE,GET_REPORT_FORMATE_DATA,
TEST_QUERY_CUSTOM,CUSTOM_PREVIEW_DATA_TABLE,CUSTOM_PREVIEW_DATA_CHART,LIST_OF_FEATURE,RESET_TEST_QUERY_CUSTOM,DATA_WITH_BACK_BUTTON,RESET_DATA_WITH_BACK_BUTTON,
ASSIGN_GROUP_ID_TO_USER,CUSTOM_PREVIEW_DATA_BOX,BOX_COLOR_DATA_SAVE,DB_CONNECTION_SET_DEFAULT,TEST_QUERY_CUSTOM_MESSAGE_TYPE,LOGIN_MESSAGE,TEST_QUERY_CUSTOM_DRILL_DOWN,RESET_TEST_QUERY_CUSTOM_DRILL_DOWN, IS_AUTHORIZE_USER } from "../constants/actionTypes";
import * as api from '../api/index.js';

import logMessage from "../logserver.js";


export const auth = (formData, router) => async (dispatch) => {
    try{
        const { data } = await api.auth(formData);
        dispatch({ type: AUTH, test : data}); 
        if(data?.validate != false){
            logMessage(data?.user_data.user_email_id,data?.status_code,data?.message);
            if(data?.status_code==400){
                alert('User Have Not Assign Any Feature !')
            }
            else{
                router('/Dashboard')
            }
        }else{ 
            router('/Homepage')
        }
    }catch (error) {
        console.log(error);
      }
}


export const login = (formData, router) => async (dispatch) => {
    try {
        const {data} = await api.logIn(formData);
        dispatch({ type: LOGIN, data });
        if (data?.validate && data?.status_code === 200) {
            logMessage(formData.username,data?.status_code,data?.message);
           dispatch(auth(formData, router));
        }else if(data?.status_code === 400){
            logMessage(formData.username,data?.status_code,data?.message);
           router("",{state:{message:"Invalid username or password"}})
        }else {
            logMessage(formData.username,data?.status_code,data?.message);
            router("",{state:{message:"Invalid username or password"}})
        }
    }catch (error) {
        console.log(error.message);
      }
}

export const loginmessage = () => async (dispatch) =>{
    dispatch({ type: LOGIN_MESSAGE });
}

export const databaseconnection = (formData, router) => async (dispatch) => {
    
    try {
        const {data} = await api.databaseconnection(formData);
        if (data?.status==='valid') {
            dispatch({ type: DB_CONNECTION, data });
        //    dispatch(auth(formData, router));
        }else if(data?.status==='success') {
            console.log(data, "response");
            router('/ApexChart')
            dispatch({ type: DB_CONNECTION, data });
           
        }
    }catch (error) {
        console.log(error.message);
      }
}

export const databaseconnectionsetdefault = (formData, router) => async (dispatch) => {
    try {
        dispatch({ type: DB_CONNECTION_SET_DEFAULT,formData});
        }
    catch (error) {
        console.log(error.message);
      }
}

export const validateConnection = (formData, router) => async (dispatch) => {
    try {
        const {data} = await api.validateConnection(formData);
        dispatch({ type: VALIDATE_CONNECTION, data });
        // if (data?.validate) {
        //    dispatch(auth(formData, router));
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error) {
        console.log(error.message);
    }
}

export const schemametaData = (formData, router) => async (dispatch) => {
    try {
        const {data} = await api.schemametaData(formData);
        dispatch({ type: SCHEMA_DATA, data });
        // if (data?.validate) {
        //    dispatch(auth(formData, router));
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error) {
        console.log(error.message);
      }
}

export const savereportTemplate = (formData, router) => async (dispatch) => {
    try {
        const {data} = await api.savereportTemplate(formData);
        dispatch({ type: REPORT_TEMPLATE_DATA_SAVE, data });
        if (data?.message==='Report Template saved successfully.') {
            localStorage.removeItem("customeDetailOfReport");
            localStorage.removeItem("uploadLogo")
            router('/ListOfReports')
        }else {
            alert(data?.message);
        }
    }catch (error) {
        console.log(error.message);
      }
}

export const savetheboxdata = (formData, router) => async (dispatch) => {
    try {
        dispatch({ type: BOX_COLOR_DATA_SAVE, formData});
    }catch (error) {
        console.log("xyz");
      }
}



export const  customPreviewChartData= (formData, router) => async (dispatch) => {
    try {
        if(formData.report_type === "Table"){
            const {data} = await api.customPreviewChartData(formData);
            dispatch({ type: CUSTOM_PREVIEW_DATA_TABLE, data });
        }else if(formData.report_type === "Chart"){
            const {data} = await api.customPreviewChartData(formData);
            dispatch({ type: CUSTOM_PREVIEW_DATA_CHART, data });
        }else if(formData.report_type === "Box"){
            const {data} = await api.customPreviewChartData(formData);
            dispatch({ type: CUSTOM_PREVIEW_DATA_BOX, data });
        }
    }catch (error) {
        console.log(error.message);
      }
}

export const  testquryonCustompagefordrilldown= (formData, router) => async (dispatch) => {
    try {
        const {data} = await api.testquryonCustompagefordrilldown(formData);
        dispatch({ type: TEST_QUERY_CUSTOM_DRILL_DOWN, data });
        // if (data?.validate) {
        //    dispatch(auth(formData, router));
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error) {
        console.log(error.message);
      }
}

export const  testquryonCustompage= (formData, router) => async (dispatch) => {
    try {
        const {data} = await api.testquryonCustompage(formData);
        dispatch({ type: TEST_QUERY_CUSTOM, data });
        // if (data?.validate) {
        //    dispatch(auth(formData, router));
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error) {
        console.log(error.message);
      }
}

// export const  testqueryoncustompageforresponse= () => async (dispatch) => {
//     console.log("getreport",formData)
//     try {
//         dispatch({ type: TEST_QUERY_CUSTOM_MESSAGE_TYPE, data });
//         // if (data?.validate) {
//         //    dispatch(auth(formData, router));
//         // }else {
//         //     alert("User is not valid");
//         // }
//     }catch (error) {
//         console.log(error.message);
//       }
// }

export const  resettestquryonCustompage= () => async (dispatch) => {
    
        dispatch({ type: RESET_TEST_QUERY_CUSTOM});
        // if (data?.validate) {
        //    dispatch(auth(formData, router));
        // }else {
        //     alert("User is not valid");
        // }
}

export const  resettestquryonCustompagefordrilldown= () => async (dispatch) => { 
    dispatch({ type: RESET_TEST_QUERY_CUSTOM_DRILL_DOWN});
}

export const  backtocustomquerypagewithdata= (formData, router) => async (dispatch) => {
    
    dispatch({ type: DATA_WITH_BACK_BUTTON,formData});
}

export const  resetbacktocustomquerypagewithdata= () => async (dispatch) => {
    dispatch({ type: RESET_DATA_WITH_BACK_BUTTON});
}



export const featureName = (formData, router) => async (dispatch) => {
    try {
        const {data} = await api.featureName(formData);
        dispatch({ type: LIST_OF_FEATURE, data });
        // if (data?.message === 'User Added Successfully!') {
        //     setTimeout("alert(User Added Successfully)", 2000);
        //     router("/NewUser",{state:{message:"User Added Successfully!"}})     
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error) {
        console.log(error.message);
      }
}


export const assigngrouptouser = (formData, router) => async (dispatch) => {
    const user = JSON.parse(localStorage.getItem('profile'))
   
    try {
        const {data} = await api.assigngrouptouser(formData);
        dispatch({ type: ASSIGN_GROUP_ID_TO_USER, data });
        if (data?.status === 'success') {
            alert(data?.message);
            if(user?.user_email_id === formData?.user_email){
                router("",{state:{message:"Group Added Successfully!"}})   
            }  
        }else {
            alert(data?.message);
        }
    }catch (error) {
        console.log(error.message);
      }
}

export const uploadicon = (formData, router) => async (dispatch) => {
    try {
        const {data} = await api.uploadicon(formData);
        dispatch({ type: ASSIGN_GROUP_ID_TO_USER, data });
        if (data?.status === 'success') {
            alert(data?.message);
            router("/AssignationAndFeature",{state:{message:"Added feature with Icon Successfully!"}})     
        }else {
            alert(data?.message);
        }
    }catch (error) {
        console.log(error.message);
      }
}

// export const  getreportformateddata= (formData, router) => async (dispatch) => {
//     console.log("getreport",formData)
//     try {
//         const {data} = await api.getreportformateddata(formData);
//         console.log(data, "response");
//         dispatch({ type: GET_REPORT_FORMATE_DATA, data });
//         // if (data?.validate) {
//         //    dispatch(auth(formData, router));
//         // }else {
//         //     alert("User is not valid");
//         // }
//     }catch (error) {
//         console.log(error.message);
//       }
// }
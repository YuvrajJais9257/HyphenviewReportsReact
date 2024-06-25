import { GET_REPORT_ON_DASHBOARD,REMOVE_REPORT,UPDATE_REPORT,GENERATE_REPORT_BY_ID,LOADED,LOADING,GET_REPORT_DETAIL_BY_ID,GET_REPORTS_ACCESS_GROUP_ID,GET_REPORT_ACCESS_DETAIL,
    GET_CHART_REPORT_DETAIL_BY_ID,GET_BOX_REPORT_DETAIL_BY_ID,GET_LIST_OF_COLUMN_FIRST,GET_LIST_OF_COLUMN_SECOND,REMOVE_LIST_OF_COLUMN_FIRST,REMOVE_LIST_OF_COLUMN_SECOND,
    SAVE_MAP_DATA_FOR_DRILLDOWN,GET_DRILL_DOWN_DATA,INITIAL_GET_DRILL_DOWN_DATA,CHECK_DRILL_DOWN,DEFAULT_CHECK_DRILL_DOWN} from "../constants/actionTypes";
import * as api from '../api/index.js';

export const  getreporttitlefromondashbaord= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.getreporttitlefromondashbaord(formData);
        
        dispatch({ type: GET_REPORT_ON_DASHBOARD, data });
        dispatch({type: LOADED });
        // if (data?.validate) {
        //    dispatch(auth(formData, router));
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error){
        console.log(error.message);
    }
}

export const  getreportdetailwithaccessforassignreport= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.getreportdetailwithaccessforassignreport(formData);

        dispatch({ type: GET_REPORT_ACCESS_DETAIL, data });
        dispatch({type: LOADED });
        // if (data?.validate) {
        //    dispatch(auth(formData, router));
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error){
        console.log(error.message);
    }
}

export const  checkdrilldown= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.checkdrilldown(formData);

        dispatch({ type: CHECK_DRILL_DOWN, data });
        dispatch({type: LOADED });
        // if (data?.validate) {
        //    dispatch(auth(formData, router));
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error){
        console.log(error.message);
    }
}

export const  defaultcheckdrilldown= () => async (dispatch) => {
    try{
        dispatch({ type: DEFAULT_CHECK_DRILL_DOWN,});
        dispatch({type: LOADED });
    }catch (error){
        console.log(error.message);
    }
}


export const  getdataforDrilldown= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.getdataforDrilldown(formData);
        console.log(data,"$$$$$")
        dispatch({ type: GET_DRILL_DOWN_DATA, data });
        dispatch({type: LOADED });
        // if (data?.validate) {
        //    dispatch(auth(formData, router));
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error){
        console.log(error.message);
    }
}

export const  drilldowninsitialvalue= () => async (dispatch) => {
    
        dispatch({ type: INITIAL_GET_DRILL_DOWN_DATA, });
       
}



export const  getReportDetailByID= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.getReportDetailByID(formData);

        dispatch({ type: GET_REPORT_DETAIL_BY_ID, data });
        dispatch({type: LOADED });
        // if (data?.validate) {
        //    dispatch(auth(formData, router));
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error) {
        console.log(error.message);
      }
}

export const  removereport = (formData, router) => async (dispatch) => {
    try {
        const {data} = await api.removereport(formData);
        if (data?.Status === "Deleted") {
            dispatch({ type: REMOVE_REPORT, formData }); 
        }else {
            alert("User is not valid");
        }
    }catch (error) {
        console.log(error.message);
      }
}

export const  updateReportdetail = (formData, router) => async (dispatch) => {
    try {
        const {data} = await api.updateReportdetail(formData);
        if (data?.status === "success") {
            localStorage.removeItem("customeDetailOfReport");
            localStorage.removeItem("uploadLogo");
            dispatch({ type: UPDATE_REPORT, data });
            router('/hyphenview/ListOfReports')
        }else {
            alert(data?.message);
        }
    }catch (error) {
        console.log(error.message);
    }
}

export const  saveMapDataForDrillDown = (formData, router) => async (dispatch) => {
    try {
        const {data} = await api.saveMapDataForDrillDown(formData);
        dispatch({ type: SAVE_MAP_DATA_FOR_DRILLDOWN, data });
        // if (data?.Status === "Deleted") {
        //     router("/ListOfReports",{state:{message:"report is deleted"}})     
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error) {
        console.log(error.message);
      }
}

export const  generateReportId = (formData, router) => async (dispatch) => {
    try {
        const {data} = await api.generateReportId(formData);
        dispatch({ type: GENERATE_REPORT_BY_ID, data });
        // if (data?.Status === "Deleted") {
        //     router("/ListOfReports",{state:{message:"report is deleted"}})     
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error) {
        console.log(error.message);
      }
}

export const getlistofcolumnformappingfirst = (formData, router) => async (dispatch) => {
    try {
        const {data} = await api.getlistofcolumnformappingfirst(formData);
        dispatch({ type: GET_LIST_OF_COLUMN_FIRST, data });
        // if (data?.Status === "Deleted") {
        //     router("/ListOfReports",{state:{message:"report is deleted"}})     
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error) {
        console.log(error.message);
      }

}

export const removelistofcolumnformappingfirst = () => async (dispatch) => {
        dispatch({ type: REMOVE_LIST_OF_COLUMN_FIRST});

}
export const removelistofcolumnformappingsecond = () => async (dispatch) => {
    
        dispatch({ type: REMOVE_LIST_OF_COLUMN_SECOND});

}


export const getlistofcolumnformappingsecond = (formData, router) => async (dispatch) => {

    try {
        const {data} = await api.getlistofcolumnformappingsecond(formData);
        dispatch({ type: GET_LIST_OF_COLUMN_SECOND, data });
        // if (data?.Status === "Deleted") {
        //     router("/ListOfReports",{state:{message:"report is deleted"}})     
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error) {
        console.log(error.message);
      }


}

export const  generateChartTypeReport= (formData, router) => async (dispatch) => {
    // dispatch({type: LOADING});
    try {
        const {data} = await api.generateChartTypeReport(formData);
        console.log(data,"agandawi")
        dispatch({ type: GET_CHART_REPORT_DETAIL_BY_ID, data });
        dispatch({type: LOADED });
        // if (data?.validate) {
        //    dispatch(auth(formData, router));
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error) {
        console.log(error.message);
      }
}

export const  generateBoxTypeReport= (formData, router) => async (dispatch) => {
    try {
        const {data} = await api.generateBoxTypeReport(formData);

        dispatch({ type: GET_BOX_REPORT_DETAIL_BY_ID, data });
        dispatch({type: LOADED });
        // if (data?.validate) {
        //    dispatch(auth(formData, router));
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error) {
        console.log(error.message);
      }
}

export const  getreportaccessonbasisofgroupid = (formData, router) => async (dispatch) => {
    try {
        const {data} = await api.getreportaccessonbasisofgroupid(formData);
        dispatch({ type: GET_REPORTS_ACCESS_GROUP_ID, data });
        // if (data?.Status === "Deleted") {
        //     router("/ListOfReports",{state:{message:"report is deleted"}})     
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error) {
        console.log(error.message);
      }
}
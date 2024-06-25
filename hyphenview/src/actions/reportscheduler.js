import { LIST_OF_SCHEDULE_REPORT,LOADED,LOADING,SAVE_SCHEDULE_REPORT,DETAIL_SCHEDULE_REPORT_FOR_UPDATE,UPDATE_SCHEDULER,REMOVE_SCHEDULER} from "../constants/actionTypes";
import * as api from '../api/index.js';

export const  savenewSchedulereport= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.savenewSchedulereport(formData);

        dispatch({ type: SAVE_SCHEDULE_REPORT, data });
        dispatch({type: LOADED });
        if (data?.status==='success') {
            alert(data.message)
            router("/hyphenview/ReportSchedulerList",{state:{message:data.message}})
        }else {
            alert(data.message);
        }
    }catch (error) {
        console.log(error.message);
      }
}

export const  listofSchedulereport= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.listofSchedulereport(formData);

        dispatch({ type: LIST_OF_SCHEDULE_REPORT, data });
        dispatch({type: LOADED });
        // if (data?.status==='success') {
           
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error) {
        console.log(error.message);
      }
}

export const  getschedulereportdetailforupdate= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.getschedulereportdetailforupdate(formData);

        dispatch({ type: DETAIL_SCHEDULE_REPORT_FOR_UPDATE, data });
        dispatch({type: LOADED });
        // if (data?.status==='success') {
           
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error) {
        console.log(error.message);
      }
}

export const  updatescheduleinfo= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.updatescheduleinfo(formData);

        dispatch({ type: UPDATE_SCHEDULER, data });
        dispatch({type: LOADED });
        if (data?.status==='success') {
           alert(data?.message)
           router("/hyphenview/ReportSchedulerList",{state:{message:data.message}})
        }else {
            alert(data?.message)
        }
    }catch (error) {
        console.log(error.message);
      }
}

export const  removeschedulereport= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.removeschedulereport(formData);

        dispatch({type: LOADED });
        if (data?.status==='success') {
           dispatch({ type: REMOVE_SCHEDULER, formData });
        }else {
            alert("somthing went wrong");
        }
    }catch (error) {
        console.log(error.message);
      }
}
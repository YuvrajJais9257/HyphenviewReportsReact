import { LOADED,LOADING,ASSIGN_GROUP_ID_TO_REPORT,GET_REPORT_DETAIL_BASEON_GROUP_ID} from "../constants/actionTypes";
import * as api from '../api/index.js';

export const  assignreporttothegroup= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.assignreporttothegroup(formData);

        dispatch({ type: ASSIGN_GROUP_ID_TO_REPORT, data });
        dispatch({type: LOADED });
        if (data?.status==='success') {
            alert(data?.message);
        }else {
            alert("User is not valid");
        }
    }catch (error) {
        console.log(error.message);
      }
}

export const getReportDetailonbasisOFgroupid= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.getReportDetailonbasisOFgroupid(formData);

        dispatch({ type: GET_REPORT_DETAIL_BASEON_GROUP_ID, data });
        dispatch({type: LOADED });
        // if (data?.status==='success') {
        //     alert(data?.message);
        // }else {
        //     alert("User is not valid");
        // }
    }catch (error) {
        console.log(error.message);
      }
}
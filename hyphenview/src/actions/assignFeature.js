import { ASSIGN_REPORT_ID_TO_FEATURE,LOADED,LOADING,LIST_ASSIGN_GROUP_ID_TO_FEATURE} from "../constants/actionTypes";
import * as api from '../api/index.js';

export const  assignfeaturetothegroup= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.assignfeaturetothegroup(formData);

        dispatch({ type: ASSIGN_REPORT_ID_TO_FEATURE, data });
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

export const  getfeatureaccessmask= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.getfeatureaccessmask(formData);

        dispatch({ type: LIST_ASSIGN_GROUP_ID_TO_FEATURE, data });
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
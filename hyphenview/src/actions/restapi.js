import {REST_API_DETAIL_SAVE,LOADING,LOADED} from "../constants/actionTypes";
import * as api from '../api/index.js';

export const  restapidetailsave= (formData, router) => async (dispatch) => {
    console.log(formData,"&&&&")
    dispatch({type: LOADING});
    try {
        const {data} = await api.restapidetailsave(formData);

        dispatch({ type: REST_API_DETAIL_SAVE, data });
        dispatch({type: LOADED });
        if (data?.status === "success") {
            alert(data?.message);
        }else {
            alert(data?.message);
        }
    }catch (error) {
        console.log(error.message);
      }
}
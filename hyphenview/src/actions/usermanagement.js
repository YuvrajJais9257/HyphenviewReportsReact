import { LIST_OF_USER,RESET_PASSWORD,DELETE_USER,SAVE_USER,RESET_MESSAGE_TEST_QUERY_CUSTOM,LOADING,LOADED,RESET_PASSWORD_MESSAGE} from "../constants/actionTypes";
import * as api from '../api/index.js';
import logMessage from "../logserver.js";

export const  listOfuser= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING,});
    try {
        const {data} = await api.listOfuser(formData);
        dispatch({ type: LIST_OF_USER, data });
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

export const resetPassword = (formData, router) => async (dispatch) => {
    try {
        const {data} = await api.resetPassword(formData);
        if (data?.status === 'success') {
            dispatch({ type: RESET_PASSWORD, data });
            // alert("Password Reset Successfully!")
            router("/UserManagementList",{state:{message:"Password Reset Successfully!"}})     
        }else {
            dispatch({ type: RESET_PASSWORD, data });
            // alert(data.message);
        }
    }catch (error) {
        console.log(error.message);
      }
}

export const resetmessagePassword = () => async (dispatch) => {
    try {
        dispatch({ type: RESET_PASSWORD_MESSAGE});
    }catch (error) {
      }
}

export const deleteUser = (formData, router) => async (dispatch) => {
    try {
        const {data} = await api.deleteUser(formData);
        if (data?.status === 200) {
            dispatch({ type: DELETE_USER, formData });
        }else {
            alert(data.message);
        }
    }catch (error) {
        console.log(error.message);
      }
}

export const saveUser = (formData, router) => async (dispatch) => {
    try {
        const {data} = await api.saveUser(formData);
        dispatch({ type: SAVE_USER, data });
        if (data?.message === 'User Added Successfully!') {
            // setTimeout("alert(User Added Successfully)", 2000);
            router("/UserManagementList",{state:{message:"User Added Successfully!"}})     
        }else {
            // alert("User is not valid");
        }
    }catch (error) {
        console.log(error.message);
      }
}

export const  resetmessageshown= () => async (dispatch) => {
    
    dispatch({ type: RESET_MESSAGE_TEST_QUERY_CUSTOM});
    // if (data?.validate) {
    //    dispatch(auth(formData, router));
    // }else {
    //     alert("User is not valid");
    // }
}




import { LOADED,LOADING,CREATE_CANVAS_PAGE,CANVAS_FRAME_PAGE_DATA,LIST_DASHBOARD_CANVAS_FRAME_NAME_WITH,UPDATE_CANVAS_FRAME_PAGE_DATA,DELETE_CANVAS_FRAME,CHECK_DASHBOARD_CANVAS_FRAME,LIST_DASHBOARD_CANVAS_FRAME_NAME,UPDATE_DASHBOARD_ACCESS,LIST_DASHBOARD_CANVAS_FRAME_ACCESS,GET_FRAME_PAGE_DATA_BASE_ON_ID } from "../constants/actionTypes";
import * as api from '../api/index.js';

export const  savecanvasframedata= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.savecanvasframedata(formData);

        dispatch({ type: CREATE_CANVAS_PAGE, data });
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

export const  deletecanvashframe = (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.deletecanvashframe(formData);
        dispatch({type: LOADED });
        if (data?.status==='success') {
            dispatch({ type: DELETE_CANVAS_FRAME, formData });
        }else {
            alert(data?.message);
        }
    }catch (error) {
        console.log(error.message);
      }
}


export const  listofaccessmask= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.listofaccessmask(formData);
        
        dispatch({type: LOADED });
        if (data?.status==='success') {
            dispatch({ type: LIST_DASHBOARD_CANVAS_FRAME_ACCESS, data });
        }else {
            alert("User is not valid");
        }
    }catch (error) {
        console.log(error.message);
      }
}

export const  canvashframedataformodification= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.canvashframedataformodification(formData);
        dispatch({ type: CANVAS_FRAME_PAGE_DATA, data });
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

export const  getreportframedatabygroupid= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.getreportframedatabygroupid(formData);
        dispatch({ type: GET_FRAME_PAGE_DATA_BASE_ON_ID, data });
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

export const  listofdashboardframename= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.listofdashboardframename(formData);
        
        dispatch({type: LOADED });
        if (data?.status==='success') {
            dispatch({ type: LIST_DASHBOARD_CANVAS_FRAME_NAME, data });
        }else {
            alert("User is not valid");
        }
    }catch (error) {
        console.log(error.message);
      }
}

export const  listofdashboardframenamewithdistiinct= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.listofdashboardframenamewithdistiinct(formData);
        
        dispatch({type: LOADED });
        if (data?.status==='success') {
            dispatch({ type: LIST_DASHBOARD_CANVAS_FRAME_NAME_WITH, data });
        }else {
            alert("User is not valid");
        }
    }catch (error) {
        console.log(error.message);
      }
}

export const  checkdashboardcanvasname= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.checkdashboardcanvasname(formData);
        
        dispatch({type: LOADED });
        if (data?.status==='success') {
            dispatch({ type: CHECK_DASHBOARD_CANVAS_FRAME, data });
        }else {
            alert(data?.message);
        }
    }catch (error) {
        console.log(error.message);
      }
}

export const  updatecanvashframedataformodification= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.updatecanvashframedataformodification(formData);

       
        dispatch({type: LOADED });
        if (data?.status==='success') {
            alert(data?.message);
            // dispatch({ type: UPDATE_CANVAS_FRAME_PAGE_DATA, formData });
        }else {
            alert("User is not valid");
        }
    }catch (error) {
        console.log(error.message);
      }
}

export const  updateaccessofdashboard= (formData, router) => async (dispatch) => {
    dispatch({type: LOADING});
    try {
        const {data} = await api.updateaccessofdashboard(formData);
        dispatch({type: LOADED });
        if (data?.status==='success') {
            alert(data?.message);
            dispatch({ type: UPDATE_DASHBOARD_ACCESS, formData });
        }else {
            alert("User is not valid");
        }
    }catch (error) {
        console.log(error.message);
      }
}
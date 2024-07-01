import { LIST_OF_GROUP,ADD_GROUP,RESET_MESSAGE_GROUP,MESSAGE_ADD_GROUP } from "../constants/actionTypes";
import * as api from '../api/index.js';
    
    
   
    export const listofgroup = (formData, router) => async (dispatch) => {
        try {
            const {data} = await api.listofgroup(formData);
            console.log(data,"dataqwerq")
            dispatch({ type: LIST_OF_GROUP, data });
            // if (data?.Status === "Deleted") {
            //     router("/ListOfReports",{state:{message:"report is deleted"}})     
            // }else {
            //     alert("User is not valid");
            // }
        }catch (error) {
            console.log(error.message);
          }
    }

    export const addGroup = (formData, router) => async (dispatch) => {
        try {
            const {data} = await api.addGroup(formData);
            if (data?.status === 'success') {
                setTimeout(alert(data?.message), 2000);
                dispatch({ type: ADD_GROUP, formData });
                dispatch({ type: MESSAGE_ADD_GROUP, data });
                router("/AssignationAndFeature",{state:{message:"Group Added Successfully!"}})     
            }else {
                dispatch({ type: MESSAGE_ADD_GROUP, data });
            }
        }catch (error) {
            console.log(error.message);
          }
    }

    export const resertgroupmessage = () => async (dispatch) =>{
        dispatch({ type: RESET_MESSAGE_GROUP});
    }
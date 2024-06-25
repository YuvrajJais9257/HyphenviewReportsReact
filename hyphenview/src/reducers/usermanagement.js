import * as actionType from "../constants/actionTypes";

const initialState = {
    allUserDetail: [],
    user: {}
  };
  

const authReducer = (state = initialState, action) => {
    switch (action.type){   
        case actionType.SAVE_USER:
        return { ...state, save_user: action.data, loading: false, error : null };

        case actionType.RESET_MESSAGE_TEST_QUERY_CUSTOM:
        return { ...state, save_user: null, loading: false, error : null };
 
        case actionType.RESET_PASSWORD:
            return { ...state, reset_password: action.data, error : null };

        case actionType.RESET_PASSWORD_MESSAGE:
            return { ...state, reset_password: null, error : null };

        case actionType.LIST_OF_USER:
        return { ...state, allUserDetail: action.data, loading: true, error : null };
        
        case actionType.DELETE_USER:
            return { ...state, allUserDetail: state.allUserDetail.filter((user)=>user.user_email_id !== action.formData.email), error : null };

        default:
			return state;
    }
};

export default authReducer;

// return {
//     ...state,
//     allEmployees: state.allEmployees.filter(employee => employee._id !== action.payload.employeeId)
//   };
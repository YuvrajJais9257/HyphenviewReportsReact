import * as actionType from "../constants/actionTypes";

const initialState = {
    assignfeaturetogroupid: [],
    feature: {}
  };

  const authReducer = (state = {authData : null}, action) => {
    switch (action.type){

        case actionType.ASSIGN_REPORT_ID_TO_FEATURE:
        return { ...state,  getassignfeatureaccess: action.data, loading: false, error : null };

        case actionType.LIST_ASSIGN_GROUP_ID_TO_FEATURE:
        return { ...state, assignrespontoget: action.data, loading: false, error : null };

        default:
			return state;
    }
};

export default authReducer;
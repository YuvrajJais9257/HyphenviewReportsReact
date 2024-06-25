import * as actionType from "../constants/actionTypes";

const initialState = {
    assigngroupidtoreport: [],
    reportsid: {}
  };

  const authReducer = (state = {authData : null}, action) => {
    switch (action.type){

        case actionType.ASSIGN_GROUP_ID_TO_REPORT:
        return { ...state, assignrespons: action.data, loading: false, error : null };

        case actionType.GET_REPORT_DETAIL_BASEON_GROUP_ID:
        return { ...state, getreportdetailonbasisofgroupId: action.data, loading: false, error : null };

        default:
			return state;
    }
};

export default authReducer;
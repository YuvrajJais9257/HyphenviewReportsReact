import * as actionType from "../constants/actionTypes";

const initialState = {
    allReportDetail: [],
    reports: {}
  };

  const authReducer = (state = initialState, action) => {
    switch (action.type){

        case actionType.GET_REPORT_ON_DASHBOARD:
        return { ...state, allReportDetail: action.data, loading: false, error : null };

        case actionType.REMOVE_REPORT:
        return { ...state, allReportDetail: state.allReportDetail?.filter((report)=>report.report_id !== action.formData.report_id), error : null };

        case actionType.UPDATE_REPORT:
        return { ...state, update_report: action.data, loading: false, error : null };

        case actionType.GENERATE_REPORT_BY_ID:
        return { ...state, generate_report_id: action.data, loading: false, error : null };

        case actionType.CHECK_DRILL_DOWN:
        return { ...state, checkdrilldown: action.data, loading: false, error : null };

        case actionType.DEFAULT_CHECK_DRILL_DOWN:
        return { ...state, checkdrilldown: null, loading: false, error : null };

        case actionType.GET_REPORT_DETAIL_BY_ID:
        return { ...state, generate_detail_by_id: action.data, loading: false, error : null };

        case actionType.GET_REPORTS_ACCESS_GROUP_ID:
        return { ...state, getreport_access_detail_by_id: action.data, loading: false, error : null };

        case actionType.GET_REPORT_ACCESS_DETAIL:
        return { ...state, getreportdetalwithaccess: action.data, loading: false, error : null };

        case actionType.GET_CHART_REPORT_DETAIL_BY_ID:
        return { ...state, getcharttypeofreportdetail: action.data, loading: false, error : null };

        case actionType.GET_BOX_REPORT_DETAIL_BY_ID:
        return { ...state, getboxtypeofreportdetail: action.data, loading: false, error : null };

        case actionType.GET_LIST_OF_COLUMN_FIRST:
        return { ...state, getlistofcolumfirst: action.data, loading: false, error : null };

        case actionType.GET_LIST_OF_COLUMN_SECOND:
        return { ...state, getlistofcolumsecond: action.data, loading: false, error : null };

        case actionType.REMOVE_LIST_OF_COLUMN_FIRST:
        return { ...state, getlistofcolumfirst: null, loading: false, error : null };
        
        case actionType.REMOVE_LIST_OF_COLUMN_SECOND:
        return { ...state, getlistofcolumsecond: null, loading: false, error : null };

        case actionType.SAVE_MAP_DATA_FOR_DRILLDOWN:
        return { ...state, savemapdatafordrilldown:  action.data, loading: false, error : null };

        case actionType.GET_DRILL_DOWN_DATA:
          console.log(action.data,"action.data")
        return { ...state, detaildatafordrilldown:  action.data, loading: false, error : null };

        case actionType.INITIAL_GET_DRILL_DOWN_DATA:
        return { ...state, detaildatafordrilldown:  null, loading: false, error : null };

        default:
			return state;
    }
};

export default authReducer;
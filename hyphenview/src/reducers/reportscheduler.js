import * as actionType from "../constants/actionTypes";

const initialState = {
    allScheduleReportDetail: [],
    ScheduleReportid: {}
  };

  const authReducer = (state = initialState, action) => {
    switch (action.type){

        case actionType.LIST_OF_SCHEDULE_REPORT:
        return { ...state, allScheduleReportDetail: action.data.Schedulers, loading: false, error : null };

        case actionType.SAVE_SCHEDULE_REPORT:
        return { ...state, saveschedulereport: action.data, loading: false, error : null };

        case actionType.DETAIL_SCHEDULE_REPORT_FOR_UPDATE:
        return { ...state, detailofscheduleforupdate: action.data, loading: false, error : null };

        case actionType.UPDATE_SCHEDULER:
        return { ...state, updateschedulereport: action.data, loading: false, error : null };

        case actionType.REMOVE_SCHEDULER:
        return { ...state, allScheduleReportDetail: state.allScheduleReportDetail?.filter((report)=>report.scheduleid !== action.formData.scheduleid), loading: false, error : null };

        default:
			return state;
    }
};

export default authReducer;
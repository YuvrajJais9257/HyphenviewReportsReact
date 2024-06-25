import * as actionType from "../constants/actionTypes";

const initialState = {
    canvasframedetail: [],
    listofdashboardcanvasframe:[],
    canvasid: {}
  };

  const authReducer = (state = initialState, action) => {
    switch (action.type){

        case actionType.CREATE_CANVAS_PAGE:
        return { ...state, responscanvasdetail: action.data, loading: false, error : null };

        case actionType.CANVAS_FRAME_PAGE_DATA:
        return { ...state, canvasframedetail: action.data, loading: false, error : null };

        case actionType.UPDATE_CANVAS_FRAME_PAGE_DATA:
        return { ...state, canvasframe: action.formData, loading: false, error : null };

        case actionType.LIST_DASHBOARD_CANVAS_FRAME_NAME:
        return { ...state, listofdashboardcanvasframe: action.data.dashboards, loading: false, error : null };

        case actionType.DELETE_CANVAS_FRAME:
        return { ...state,  listofdashboardcanvasframe: state.listofdashboardcanvasframe.filter((dashboardname) =>dashboardname.dashboard_report_name != action.formData.frame_name), error : null };

        case actionType.LIST_DASHBOARD_CANVAS_FRAME_NAME_WITH:
        return { ...state, listofdashboardcanvasframewithdisnict: action.data, loading: false, error : null };

        case actionType.CHECK_DASHBOARD_CANVAS_FRAME:
        return { ...state, checkdashboardcanvasframe: action.data, loading: false, error : null };

        case actionType.LIST_DASHBOARD_CANVAS_FRAME_ACCESS:
        return { ...state, listofdashboardcanvasaccess: action.data, loading: false, error : null };

        case actionType.UPDATE_DASHBOARD_ACCESS:
        return { ...state, listofdashboardacess: action.data, loading: false, error : null };

        case actionType.GET_FRAME_PAGE_DATA_BASE_ON_ID:
        return { ...state,  getdashboardframewithid: action.data, loading: false, error : null };

        default:
			return state;
    }

    
};

export default authReducer;
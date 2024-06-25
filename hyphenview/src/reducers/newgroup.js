import * as actionType from "../constants/actionTypes";

const initialState = {
  list_of_group: [],
  groupwithid: {}
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.LIST_OF_GROUP:
      return { ...state, list_of_group: action.data.group_names, loading: false, error: null };

    case actionType.ADD_GROUP:
      const group_name = action.formData.group_name;
      const customer_id = action.formData.customer_id;
      return {
        ...state,
        list_of_group: [
          ...state.list_of_group,
          {
            group_id: state.list_of_group.length > 0 ? state.list_of_group[state.list_of_group.length - 1].group_id + 1 : 1,
            groupname: group_name,
            customer_id: customer_id
          }
        ],
        loading: false,
        error: null
      };

      case actionType.RESET_MESSAGE_GROUP:
      return { ...state, addgroupmessage: null, loading: false, error : null };

      case actionType.MESSAGE_ADD_GROUP:
      return { ...state, addgroupmessage: action.data, loading: false, error : null };

    default:
      return state;
  }
};

export default authReducer;

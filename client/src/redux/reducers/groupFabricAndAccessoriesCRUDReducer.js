const initialState = {
  fabricAcc: [],
  isLoader: false,
  single: [],
};

export const groupFabricAndAccessoriesCRUDReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "GET_GROUP_FABRIC_ACC_LIST":
     
      return {
        ...state,
        fabricAcc: action.payload,
        isLoader: false,
      };

    case "ADD_EDIT_GROUP_FABRIC_ACC": {
      return {
        ...state,
        fabricAcc: action.payload,
        isLoader: false,
      };
    }

    case "IS_LOADING_GROUP_FABRIC":
      return {
        ...state,
        isLoader: true,
      };

    // case "EDIT_FABRIC_ACC":
    //   return {
    //     ...state,
    //     fabricAcc: state.fabricAcc.map((e) =>
    //       e._id === action.payload.id ? action.payload.data : e
    //     ),
    //     isLoader: false,
    //   };

    // case "DELETE_FABRIC_ACC":
    //   return {
    //     ...state,
    //     fabricAcc: state.fabricAcc.filter((e) => e._id !== action.payload),
    //     isLoader: false,
    //   };
    

    default:
      return state;
  }
};

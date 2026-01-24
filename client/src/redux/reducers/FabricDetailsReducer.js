const initialState = {
  FebricData: {},
  isLoader: false,
  single: {},
  noData: false,
};

export const FabricDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_FABRIC_Data":
     
      return {
        ...state,
        FebricData: { ...action.payload },
        noData: false,
        isLoader: false,
      };

    case "IS_LOADING":
      return {
        ...state,
        isLoader: true,
        noData: false,
      };
    case "FABRIC_NO_DATA":
      return {
        ...state,
        FebricData: {},
        noData: action.payload,
        isLoader: false,
      };

    default:
      return state;
  }
};

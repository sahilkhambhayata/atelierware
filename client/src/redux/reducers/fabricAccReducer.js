const initialState = {
    fabricAcc: {},
    isLoader: false,
    single: {},
  };

  export const fabricAccReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_FABRIC_ACC":
        return {
          ...state,
          fabricAcc: { ...action.payload },
          isLoader: false,
        };

      case "IS_LOADING":
        return {
          ...state,
          isLoader: true,
        };
      default:
        return state;
    }
  };

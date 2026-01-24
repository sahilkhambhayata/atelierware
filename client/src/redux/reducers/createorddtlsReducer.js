const initialState = {
  ordDetails: {},
  isLoader: false,
  single: {},
};

export const createorddtlsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "IS_LOADING_CREATE_ORDER_DETAILS":
      return {
        ...state,
        isLoader: true,
      };

    case "GET_CREATE_ORDER_DETAILS":
      return {
        ...state,
        ordDetails: { ...action.payload },
        isLoader: false,
      };

    default:
      return state;
  }
};

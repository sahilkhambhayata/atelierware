const initialState = {
  customer: {},
  isLoader: false,
  single: {},
};

export const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_CUSTOMER_DETAILS":
      return {
        ...state,
        customer: { ...action.payload },
        isLoader: false,
      };

    case "IS_LOADING":
      return {
        ...state,
        isLoader: true,
      };

    case "GET_SINGLE_CUSTOMER":
      return {
        ...state,
        single: action.payload,
        isLoader: false,
      };

    case "ADD_CUSTOMER":
      
      return {
        ...state,
        customer: {
          ...action.payload,
        },
        isLoader: false,
      };

    default:
      return state;
  }
};

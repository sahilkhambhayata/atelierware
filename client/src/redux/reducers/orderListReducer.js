const initialState = {
  orderData: {},
  isLoader: false,
  single: {},
  noData: false,
};

export const orderListReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ORDER_LIST_DATA":

      return {
        ...state,
        orderData: { ...action.payload },
        noData: false,
        isLoader: false,
      };

    case "IS_ORDER_LIST_LOADING":
      return {
        ...state,
        isLoader: true,
        noData: false,
      };
    case "NO_ORDER_DATA":
      return {
        ...state,
        orderData: {},
        noData: action.payload,
        isLoader: false,
      };

    case "GET_SINGLE_ORDER_ITEM":
      return {
        ...state,
        single: action.payload,
        noData: false,
        isLoader: false,
      };

    case "DELETE_ORDER_ITEM":
 
      return {
        ...state,
        orderData: state.orderData.Order.TOrdDtls.filter((e) => e.TOrdDtId !== action.payload),
        isLoader: false,
      };

    default:
      return state;
  }
};

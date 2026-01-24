const initialState = {
  orderCount: {},
  itemCount: {},
  // singleOrder: [],
};

export const orderCountReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ORDER_COUNT":
      return {
        ...state,
        orderCount: action.payload,
      };

    case "GET_ITEM_COUNT":
      return {
        ...state,
        itemCount: action.payload,
      };
    default:
      return state;
  }
};

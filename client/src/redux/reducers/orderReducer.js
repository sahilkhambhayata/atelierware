const initialState = {
  order: {},
  isLoader: false,
  serachLoader: false,
  searchResults: {},
  searchStatus: false,
  search: "",
  export: {},
  // singleOrder: [],
};
export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ORDER_DETAILS":
      return {
        ...state,
        order: { ...action.payload },
        isLoader: false,
        // searchStatus: false,
      };
    case "GET_EXPORT_DATA":
      return {
        ...state,
        export: action.payload,
        // isLoader: false,
      };
    case "GET_SEARCH_ORDER":
      return {
        ...state,
        searchResults: action.payload.data,
        searchStatus: action.payload.searchStatus,
        serachLoader: false,
        search: action.payload.search,
      };

    case "SORT_ORDERS":
      return {
        ...state,
        orders: action.payload,
      };

    case "SEARCH_LOADING":
      return {
        ...state,
        serachLoader: true,
      };
    case "IS_LOADING":
      return {
        ...state,
        isLoader: true,
      };

    case "DELETED_ORDER":
      return {
        ...state,
        order: {
          ...state.order,
          orderDetails: state.order.orderDetails.filter(
            (orderDetail) =>
              !action.payload.includes(orderDetail.TOrdHdID) &&
              !action.payload.includes("g" + orderDetail.TOrdHdID)
          ),
        },
        // searchResults: {
        //   ...state.searchResults,
        //   data: state.searchResults.data.filter(
        //     (orderDetail) => !action.payload.includes(orderDetail.TOrdHdID)
        //   ),
        // },
      };
    default:
      return state;
  }
};

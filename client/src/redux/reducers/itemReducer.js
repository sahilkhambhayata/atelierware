const initialState = {
  item: {},
  isLoader: false,
  serachLoader: false,

  itemSearch: {},
  searchStatus: false,
  search: "",
  export:{}
};

export const itemReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ITEM_DETAILS":
      return {
        ...state,
        item: { ...action.payload },
        isLoader: false,
        // search: "",
      };
      case "GET_ITEM_EXPORT_DATA":
      return {
        ...state,
        export: action.payload,
        // isLoader: false,
      };
    case "GET_SEARCH_ITEM":

      return {
        ...state,
        itemSearch: action.payload.data ,
        searchStatus: action.payload.searchStatus,
        serachLoader: false,
        // isLoader:false,
        search: action.payload.search,
      };
    case "SORT_ITEMS":
      return {
        ...state,
        items: action.payload,
        // search: "",
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
        // search: "",
      };

    case "DELETE_ITEM":

      return {
        ...state,
        item: {
          ...state.item,
          orderItemList: state.item.orderItemList.filter(
            (orderDetail) => !action.payload.includes(orderDetail.TOrdDtId)
          ),
        },
      };
    default:
      return state;
  }
};

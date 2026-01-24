export const getDirectSerachData = (itemSwitchStatus, search, searchStatus) => {
  return async (dispatch) => {
    const combinedObject = {
      itemSwitchStatus: itemSwitchStatus,
      search: search,
      searchStatus: searchStatus,
    };

    
    dispatch({ type: "ITEM_SEARCH_DATA", payload: combinedObject });
  };
};

export const getDirectSearchOrderData = (
  itemSwitchStatus,
  search,
  searchStatus
) => {
  return async (dispatch) => {
    const combinedObject = {
      orderSwitchStatus: itemSwitchStatus,
      search: search,
      searchStatus: searchStatus,
    };

   
    dispatch({ type: "ORDER_SEARCH_DATA", payload: combinedObject });
  };
};

export const getDirectSerachDataReducer = (state = {}, action) => {
  switch (action.type) {
    case "ITEM_SEARCH_DATA":
      return { ...action.payload };

    case "ORDER_SEARCH_DATA":
      return { ...action.payload };

    default:
      return state;
  }
};

export const getOrderExpandReducer = (state = {}, action) => {
    switch (action.type) {
      case "GET_ORDER_EXPAND":
        return (state = action.payload);
  
      default:
        return state;
    }
  };
  
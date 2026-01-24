

export const ordertypeReducer = (state = {}, action) => {
    switch (action.type) {
      case "GET_ORDERTYPE":
        return (state = action.payload);
  
      default:
        return state;
    }
  };
  
export const masterReducer = (state = {}, action) => {
    switch (action.type) {
      case "GET_MASTER":
        return (state = action.payload);
  
      default:
        return state;
    }
  };
  
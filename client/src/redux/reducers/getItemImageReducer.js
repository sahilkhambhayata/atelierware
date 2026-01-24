export const getItemImageReducer = (state = {}, action) => {
    switch (action.type) {
      case "GET_ITME_IMAGE":
        return (state = action.payload);
  
      default:
        return state;
    }
  };
  
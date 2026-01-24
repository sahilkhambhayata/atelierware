

export const countryReducer = (state = {}, action) => {
    switch (action.type) {
      case "GET_COUNTRY":
        return (state = action.payload);
  
      default:
        return state;
    }
  };
  
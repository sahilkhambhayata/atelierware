

export const saletypeReducer = (state = {}, action) => {
    switch (action.type) {
      case "GET_SALETYPE":
        return (state = action.payload);
  
      default:
        return state;
    }
  };
  
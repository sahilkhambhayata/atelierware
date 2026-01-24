export const AddGroupOrderBookReducer = (state = {}, action) => {
    switch (action.type) {
      case "ADD_GROUP_ORDER":
        
        return (state = action.payload);
  
      default:
        return state;
    }
  };
  
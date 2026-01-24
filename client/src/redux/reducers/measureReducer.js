export const measureReducer = (state = {}, action) => {
    switch (action.type) {
      case "GET_MEASURE":
        return (state = action.payload);
  
      default:
        return state;
    }
  };
  

  export const measureByItemReducer = (state = {}, action) => {
    switch (action.type){
      case "MEASUREMENT_BY_ITEM":
        return (state = action.payload);
  
      default:
        return state;
    }
  }

  export const oldmeasureReducer = (state={},action)=>{
    switch (action.type){
      case "OLD_MEASURE":
        return (state = action.payload);
  
      default:
        return state;
    }
  }

  export const oldItemListReducer = (state={},action)=>{
    switch (action.type){
      case "OLD_ITEM_MEASUREMENT_LIST":
        return (state = action.payload);
  
      default:
        return state;
    }
  }
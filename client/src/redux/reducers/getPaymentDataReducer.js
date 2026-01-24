
export const getPaymentDataReducer = (state = {}, action) => {
    switch (action.type) {
      case "ALL_AMOUNT_DATA":
      
        return { ...action.payload };
  
      default:
        return state;
    }
  };
  
export const paymentReducer = (state = {}, action) => {
    switch (action.type) {
      case "GET_PAYMENT_METHOD":
        return (state = action.payload);
  
      default:
        return state;
    }
  };
  
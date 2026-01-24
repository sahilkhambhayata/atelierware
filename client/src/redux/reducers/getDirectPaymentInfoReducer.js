export const getDirectPaymentInfoReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_PAYMENT_INFO":
      return (state = action.payload);

    default:
      return state;
  }
};

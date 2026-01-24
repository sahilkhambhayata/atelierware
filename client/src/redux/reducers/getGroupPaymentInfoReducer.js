export const getGroupPaymentInfoReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_GROUP_PAYMENT_INFO":
      return action.payload;
    default:
      return state;
  }
};
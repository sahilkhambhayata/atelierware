export const getDirectPaymentInfo = (data) => {
  return async (dispatch) => {
    const combinedObject = {
      data,
    };

    dispatch({ type: "GET_PAYMENT_INFO", payload: combinedObject });
  };
};

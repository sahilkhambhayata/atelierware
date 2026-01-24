export const getGroupPaymentInfo = (data) => {
  return async (dispatch) => {
    // Check if data contains valid values before dispatching
    if (data && Object.values(data).every((val) => !isNaN(val))) {
      dispatch({ type: "GET_GROUP_PAYMENT_INFO", payload: data });
    }
  };
};
// export const getGroupPaymentInfo = (data) => {
//   return async (dispatch) => {
//     const combinedObject = {
//       data,
//     };
//     dispatch({ type: "GET_GROUP_PAYMENT_INFO", payload: combinedObject });
//   };
// };

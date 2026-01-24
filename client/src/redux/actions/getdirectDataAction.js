export const getdirectDataAction = (data) => {
  return async (dispatch) => {
    dispatch({ type: "NORMAL_DISCOUNT_AMOUNT", payload: data });
  };
};

export const getdirectDataReducer = (state = {}, action) => {
  switch (action.type) {
    case "NORMAL_DISCOUNT_AMOUNT":
      return (state = action.payload);

    default:
      return state;
  }
};

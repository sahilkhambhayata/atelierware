export const VatSlabDataReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_VATSLAB_DATA":
      return (state = action.payload);

    default:
      return state;
  }
};

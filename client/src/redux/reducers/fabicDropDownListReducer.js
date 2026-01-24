export const fabicDropDownListReducer = (state = [], action) => {
  switch (action.type) {
    case "FABRIC_LIST_FOR_DYEING":
      return (state = action.payload);

    default:
      return state;
  }
};

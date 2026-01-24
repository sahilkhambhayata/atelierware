export const designerReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_DESIGNER":
      return (state = action.payload);

    default:
      return state;
  }
};

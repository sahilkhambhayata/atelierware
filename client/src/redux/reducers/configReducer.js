export const configReducer = (state = null, action) => {
  switch (action.type) {
    case "GET_CONFIG":
      return (state = action.payload);

    default:
      return state;
  }
};

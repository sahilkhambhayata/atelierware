export const styleReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_STYLE":
      return (state = action.payload);

    default:
      return state;
  }
};

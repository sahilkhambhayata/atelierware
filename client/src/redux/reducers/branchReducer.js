export const branchReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_BRANCH":
      
      return (state = action.payload);

    default:
      return state;
  }
};

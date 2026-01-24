// reducers.js

export const transformedPermissionReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_TRANSFORMED_PERMISSION":
      return action.payload;
    default:
      return state;
  }
};

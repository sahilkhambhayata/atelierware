const SET_TRANSFORMED_PERMISSION = "SET_TRANSFORMED_PERMISSION";

export const setTransformedPermission = (transformedData) => ({
  type: SET_TRANSFORMED_PERMISSION,
  payload: transformedData,
});

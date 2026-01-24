export const getDiscription = (data) => {
    
  return async (dispatch) => {
    dispatch({ type: "GET_DISCRIPTION", payload: data });
  };
};

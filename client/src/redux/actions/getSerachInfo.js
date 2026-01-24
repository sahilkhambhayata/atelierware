export const getSearchInfo = (data) => {
  return async (dispatch) => {
   
    dispatch({ type: "GET_SERACH_INFO", payload: data });
  };
};

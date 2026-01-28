import { axiosClient } from "./../../axios/axios";
export const loading = () => {
  return {
    type: "IS_LOADING",
  };
};

export const getSingleArticleDetails = (data) => {
  return {
    type: "GET_SINGLE_ARTICLE_DETAILS",
    payload: data.articleDetails,
  };
};

export const getSingleArticleDetailsAsyncData = (article_Id) => {
 
  return (dispatch) => {
    dispatch(loading());
    
    const p = 1;
    const l = 5;
    const token = localStorage.getItem("token");

    axiosClient

      .get(`oms/v1/getInvItem?Article_ID=${article_Id}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        dispatch(getSingleArticleDetails(res.data));
      })
      .catch((err) => {
        // console.log(err);
      });
  };
};


export const getSingleFabricAction = (data) => {

  return async (dispatch) => {
    dispatch({ type: "SINGLE_FABRIC_FOR_EDIT", payload: data });
  };
};


import { axiosClient } from "./../../axios/axios";
import { getSingleArticleDetails } from "./GetSingleArticleDetailsAction";
export const loading = () => {
  return {
    type: "IS_LOADING",
  };
};

export const getFabricAccDetails = (data) => {

  return {
    type: "GET_FABRIC_ACC",
    payload: data,
  };
};

export const getFabricAccDetailsAsyncData = (search, serviceId, ak) => {
  return (dispatch) => {
    dispatch(loading());
    const p = 1;
    const l = 50;
    const token = localStorage.getItem("token");

    axiosClient
      .get(`/oms/v1/searchFabOrAcc/${serviceId}?ak=${ak}&search=${search}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        dispatch(getFabricAccDetails(res.data));
      })
      .catch((err) => {
        dispatch(getFabricAccDetails({}));
      });
  };
};

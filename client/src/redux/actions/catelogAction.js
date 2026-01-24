import { axiosClient } from "./../../axios/axios";

export const loading = () => {
  return {
    type: "IS_LOADING",
  };
};

export const getCatelogList = (data) => {
  return {
    type: "GET_CATELOG",
    payload: data,
  };
};
export const getCatelogListData = (BU_ID) => {
  return async (dispatch) => {
    dispatch(loading());

    const token = localStorage.getItem("token");
    //   const BU_ID = localStorage.getItem("BU_Id");

    axiosClient
      .get(`/oms/v1/getCatelogHead?ak=${BU_ID}`, {
        headers: {
          token: `${token}`,
        },
      })
      .then((res) => {
        dispatch(getCatelogList(res.data));
      })
      .catch((err) => {
        dispatch(getCatelogList({}));
      });
  };
};

export const getSingleCatelogDetail = (id, BU_ID) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const data = await axiosClient.get(
        `/oms/v1/getCatelogDtl/${id}?ak=${BU_ID}`,

        {
          headers: {
            token: `${token}`,
          },
        }
      );


      if (data.data.success === true) {
        dispatch({ type: "GET_CATELOG_DETAILS", payload: data.data });

        return data.data;
      } else {
      }
      return data.data;
    } catch (error) {
      return error.response.data;
    }
  };
};

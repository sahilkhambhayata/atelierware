import { axiosClient } from "./../../axios/axios";

export const getOrderType = (BU_ID) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const data = await axiosClient.get(`/oms/v1/listOrderType?ak=${BU_ID}`, {
        headers: {
          token: `${token}`,
        },
      });

      if (data.data.success === true) {
        dispatch({ type: "GET_ORDERTYPE", payload: data.data });

        return data.data;
      } else {
        // console.log(data.data.error);
      }
      return data.data;
    } catch (error) {
      return error.response.data;
    }
  };
};

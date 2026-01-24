import { axiosClient } from "./../../axios/axios";

export const getConfig = (id) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const data = await axiosClient.get(`/oms/v1/configList?ak=${id}`, {
        headers: {
          token: `${token}`,
        },
      });
      
  

      if (data.data.success === true) {
        dispatch({ type: "GET_CONFIG", payload: data.data });
        return data.data;
      }
      return data.data;
    } catch (error) {
      return error.response.data;
    }
  };
};

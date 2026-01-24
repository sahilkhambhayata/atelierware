import { axiosClient } from "./../../axios/axios";

export const getCustomerStyle = (ak) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const data = await axiosClient.get(`/crm/v1/get/custstyle?ak=${ak}`, {
        headers: {
          token: `${token}`,
        },
      });

      if (data.data.success === true) {
        dispatch({ type: "GET_STYLE", payload: data.data });
        return data.data;
      } else {
      
      }
      return data.data;
    } catch (error) {
      return error.response.data;
    }
  };
};

import { axiosClient } from "./../../axios/axios";

export const getSingleCountry = (code) => {

  
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const data = await axiosClient.get(`/crm/v1/get/country/${code}`, {
        headers: {
          token: `${token}`,
        },
      });


      if (data.data.success === true) {
        dispatch({ type: "GET_COUNTRY", payload: data.data });
        return data.data;
      } else {
      }
      return data.data;
    } catch (error) {

      return error.response.data;
    }
  };
};

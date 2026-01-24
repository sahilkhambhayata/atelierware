import { axiosClient } from "./../../axios/axios";
import { logoutAdmin } from "./loginAction";

export const getSaleType = (BU_ID) => {

  return async (dispatch) => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem("token");
      const data = await axiosClient.get(`/oms/v1/listSalesType?ak=${BU_ID}`, {
        headers: {
          token: `${token}`,
        },
      });

      if (data.data.success === true) {
        dispatch({ type: "GET_SALETYPE", payload: data.data });

        return data.data;
      } else {
        dispatch(logoutAdmin(userId))
        console.log(data.data.error);
      }
      return data.data;
    } catch (error) {
      console.log(error);
    }
  };
};

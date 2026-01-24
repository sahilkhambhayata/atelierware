import { axiosClient } from "./../../axios/axios";
import { logoutAdmin } from "./loginAction";

export const getDesignerList = (BU_ID) => {
  return async (dispatch) => {
    try {
      // dispatch(loading());

      const token = localStorage.getItem("token");
      //   const BU_ID = localStorage.getItem("BU_Id");

      const data = await axiosClient.get(`/oms/v1/listSalesmen?ak=${BU_ID}`, {
        headers: {
          token: `${token}`,
        },
      });
      if (data.data.success === true) {
        dispatch({ type: "GET_DESIGNER", payload: data.data });

        return data.data;
      } else {
        // dispatch(logoutAdmin())
        console.log(data.data.error);
      }
      return data.data;
    } catch (error) {}
  };
};

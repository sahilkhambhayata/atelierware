import { axiosClient } from "./../../axios/axios";

export const sendEmailOfInvoice = (id) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const data1 = await axiosClient.post(
        `/oms/v1/getPdf`,
        {
          tordhdid: id,
        },
        {
          headers: {
            token: `${token}`,
          },
        }
      );

      
      return data1.data;
      // dispatch({ type: "ADD_FLATE_EXCEL", payload: data1.data });
    } catch (error) {
      console.log(error);
    }
  };
};

import { axiosClient } from "./../../axios/axios";

export const getPaymentMethod = (BU_Id) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const data = await axiosClient.post(
        `/oms/v1/getFinAccount`,
        { BU_Id: BU_Id },
        {
          headers: {
            token: `${token}`,
          },
        }
      );

      if (data.data.success === true) {
        dispatch({ type: "GET_PAYMENT_METHOD", payload: data.data });
        return data.data;
      } else {
        // console.log(data.data.error);
      }
      return data.data;
    } catch (error) {
      // console.log(error);
    }
  };
};

import { axiosClient } from "./../../axios/axios";
export const paymentSubmit = (data) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.post(
        `crm/v1/OrderLedgerDetails`,
        data,
        {
          headers: {
            token: token,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
};

export const payOnDeliverySubmit = (data) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axiosClient.post(
        `crm/v1/OrderLedgerCreate`,
        data,
        {
          headers: {
            token: token,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
};

export const deletePayment = (data) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axiosClient.post(
        `crm/v1/DeletePayment`,
        {
          vouno: data.vouno,
          TrId: data.TrId,
          TOrdHdId: data.TOrdHdId,
        },
        {
          headers: {
            token: token,
          },
        }
      );

      return response.data
    } catch (err) {
      console.log(err);
    }
  };
};

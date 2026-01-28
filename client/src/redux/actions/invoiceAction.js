import { axiosClient } from "./../../axios/axios";

export const loading = () => {
  return {
    type: "IS_LOADING",
  };
};

export const getInvoiceData = (data) => {
  return {
    type: "GET_INVOICE_DATA",
    payload: data,
  };
};

export const getInvoicePrintOrder = (TOrdHdID) => {
  return async (dispatch) => {
    dispatch(loading());
    try {

      const token = localStorage.getItem("token");
      const BU_Id = localStorage.getItem("BU_Id");
      // const TOrdHdID = localStorage.getItem("TOrdHdID");

      const res = await axiosClient.post(
        `/oms/v1/printOrder/${TOrdHdID}`,
        { BU_Id },
        {
          headers: {
            token: token,
          },
        }
      );

      dispatch(getInvoiceData(res.data));
      return res.data;
    } catch (err) {
      // console.log(err);
    }
  };
};

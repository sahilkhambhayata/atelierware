import { axiosClient } from "./../../axios/axios";

export const loading = () => {
  return {
    type: "IS_LOADING",
  };
};

export const getWorksheetData = (data) => {
  return {
    type: "GET_WORKSHEET_DATA",
    payload: data,
  };
};

export const getSingleItemWorksheetData = (data) => {
  return {
    type: "GET_SINGLE_ITEM_WORKSHEET_DATA",
    payload: data,
  };
};

export const getWorksheetPrintOrder = (TOrdHdID) => {
  return async (dispatch) => {
    dispatch(loading());
    try {
      const token = localStorage.getItem("token");
      // const BU_Id = localStorage.getItem("BU_Id");
      

      const res = await axiosClient.get(
        `/oms/v1/OrderWorkSheet/${TOrdHdID}`,

        {
          headers: {
            token: token,
          },
        }
      );

      dispatch(getWorksheetData(res.data));
      return res.data;
    } catch (err) {
      // console.log(err);
    }
  };
};

export const getSingleItemWorksheetPrintOrder = (TOrdDtID) => {
  return async (dispatch) => {
    dispatch(loading());
    try {
      const token = localStorage.getItem("token");
      // const BU_Id = localStorage.getItem("BU_Id");
     
      const res = await axiosClient.get(
        `/oms/v1/WorkSheet/${TOrdDtID}`,

        {
          headers: {
            token: token,
          },
        }
      );


     
      dispatch(getSingleItemWorksheetData(res.data));
      return res.data;
    } catch (err) {
      // console.log(err);
    }
  };
};

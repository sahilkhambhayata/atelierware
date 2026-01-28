import { axiosClient } from "./../../axios/axios";

export const getMeasureList = (BU_ID, itemId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const data = await axiosClient.get(
        `/oms/v1/getMasterMeasures?ak=${BU_ID}&itemId=${itemId}`,
        {
          headers: {
            token: `${token}`,
          },
        }
      );

      if (data.data.success === true) {
        dispatch({ type: "GET_MEASURE", payload: data.data });

        return data.data;
      } else {
        // console.log(data.data.error);
      }
      return data.data;
    } catch (error) {
      return error.response.data;
    }
  };
};

export const addMeasurement = (
  custId,
  itemId,
  TOrdHdId,
  TOrdDtId,
  data,
  marks
) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const requestBody = {
        CustId: Number(custId),
        ItemId: Number(itemId),
        TOrdHdId: Number(TOrdHdId),
        TOrdDtId: Number(TOrdDtId),
        ...data,
        MRemarks: marks.remarks,
      };

      const res = await axiosClient.post(
        `/oms/v1/createMeasures`,
        requestBody,
        {
          headers: {
            token: token,
          },
        }
      );

      return res.data;
    } catch (err) {
      // console.log(err);
    }
  };
};

export const oldMeasurementList = (custId, itemId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosClient.post(
        `/oms/v1/getOldMeasurement?CustId=${custId}&ItemId=${itemId}`,
        {
          token: token,
        }
      );
      if (res.data.success === true) {
        dispatch({ type: "OLD_MEASURE", payload: res.data });
        return res.data;
      } else {
        // console.log(res.data.error);
      }
      return res.data;
    } catch (err) {
      // console.log(err);
    }
  };
};

export const getMeasurementByItemId = (custId, itemId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosClient.post(
        `/oms/v1/getMeasurementByItemId?CustId=${custId}&ItemId=${itemId}`,
        {
          token: token,
        }
      );
      if (res.data.success === true) {
        dispatch({ type: "MEASUREMENT_BY_ITEM", payload: res.data });
        return res.data;
      } else {
        // console.log(res.data.error);
      }
      return res.data;
    } catch (err) {
      // console.log(err);
    }
  };
};

export const oldItemList = (custId, itemId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosClient.post(
        `/oms/v1/getItemlistbyMst?CustId=${custId}&ItemId=${itemId}`,
        {
          token: token,
        }
      );
      if (res.data.success == true) {
        dispatch({ type: "OLD_ITEM_MEASUREMENT_LIST", payload: res.data });
        return res.data;
      } else {
        // console.log(res.data.error);
      }
      return res.data;
    } catch (error) {
      // console.log(err);
    }
  };
};

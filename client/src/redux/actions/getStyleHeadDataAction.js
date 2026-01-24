import { axiosClient } from "./../../axios/axios";

export const loading = () => {
  return {
    type: "IS_LOADING",
  };
};

export const getStyleHeadDataAction = (ak, serviceId) => {

  return async (dispatch) => {
    try {
      dispatch(loading());
      const token = localStorage.getItem("token");
      const data = await axiosClient.get(
        `/oms/v1/getStyleHead/${serviceId}?ak=${ak}`, //dynamic
        // `oms/v1/getStyleHead/1571?ak=5wLsnD4DBAbd`, // static
        // oms/v1/getStyleHead/1571?ak=5wLsnD4DBAbd
        {
          headers: {
            token: token,
          },
        }
      );

      if (data.data.success === true) {
        dispatch({ type: "GET_STYLE_HEAD_DATA", payload: data.data });
        return data.data;
      } else {
        dispatch({ type: "GET_STYLE_HEAD_DATA", payload: data.data });
        
      }
      return data.data;
    } catch (error) {
   
    }
  };
};

export const addStyleHeadDataAction = (
  custId,
  itemId,
  TOrdHdId,
  TOrdDtId,
  data
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
      };

      const res = await axiosClient.post(`/oms/v1/Createstyle`, requestBody, {
        headers: {
          token: token,
        },
      });

      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
};

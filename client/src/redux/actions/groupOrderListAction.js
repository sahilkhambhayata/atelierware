import { axiosClient } from "./../../axios/axios";
import axios from "axios";

export const loading = () => {
  return {
    type: "IS_ORDER_LIST_LOADING",
  };
};

export const getGroupOrderList = (data) => {
  return {
    type: "GET_GROUP_ORDER_LIST_DATA",
    payload: data,
  };
};

export const noGroupOrderFound = (data) => {
  return {
    type: "NO_GROUP_ORDER_DATA",
    payload: data.data,
  };
};

export const getGroupOrderListAsyncData = (id) => {

 
  return async (dispatch) => {
    dispatch(loading());
    const token = localStorage.getItem("token");

    try {
      const response = await axiosClient.post(
        `/oms/v1/GetGroupItemOrderDtls/${id}`,
        {
          token: token,
        }
      );

     
      dispatch(getGroupOrderList(response.data));
      return response.data;
    } catch (error) {
      dispatch(noGroupOrderFound({ data: true }));
      return false;
    }
  };
};

export const getSingleGroupOrderList = (id) => {
  return async (dispatch) => {
    dispatch(loading());
    try {
      const token = localStorage.getItem("token");
      const data1 = await axiosClient.get(
        `oms/v1/GetGroupOrderItemList/${id}`,
        {
          headers: {
            token: token,
          },
        }
      );

      dispatch({ type: "GET_SINGLE_GROUP_ORDER_ITEM", payload: data1.data });

      return data1.data;
    } catch (error) {
      // console.log(error);
    }
  };
};

export const deleteGroupOrderItem = (id) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const data1 = await axiosClient.delete(
        `/oms/v1/DeleteGroupItem/${id}`,
        {
          headers: {
            token: token,
          },
        }
      );
      
      return data1.data;
    } catch (error) {
      // console.log(error);
    }
  };
};

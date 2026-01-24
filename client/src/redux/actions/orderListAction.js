import { axiosClient } from "./../../axios/axios";
export const loading = () => {
  return {
    type: "IS_ORDER_LIST_LOADING",
  };
};

export const getOrderList = (data) => {
  return {
    type: "GET_ORDER_LIST_DATA",
    payload: data,
  };
};

export const noOrderFound = (data) => {
  return {
    type: "NO_ORDER_DATA",
    payload: data.data,
  };
};

export const getOrderListAsyncData = (id) => {
  return async (dispatch) => {
    dispatch(loading());
    const p = 10;
    const l = 5;
    const token = localStorage.getItem("token");

    await axiosClient
      .get(`/oms/v1/getOrder/${id}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        dispatch(getOrderList(res.data));
      })
      .catch((err) => {
        dispatch(noOrderFound({ data: true }));
      });
  };
};

export const getSingleOrderList = (id) => {
  return async (dispatch) => {
    dispatch(loading());
    try {
      const token = localStorage.getItem("token");
      const data1 = await axiosClient.get(`oms/v1/GetOrderItemList/${id}`, {
        headers: {
          token: token,
        },
      });

      dispatch({ type: "GET_SINGLE_ORDER_ITEM", payload: data1.data });

      return data1.data;
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteOrderItem = (id) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const data1 = await axiosClient.delete(`oms/v1/DeleteItem/${id}`, {
        headers: {
          token: token,
        },
      });

      return data1.data;
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteGroupOrderItem = (id) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const data1 = await axiosClient.delete(`oms/v1/DeleteGroupItem/${id}`, {
        headers: {
          token: token,
        },
      });
      
      return data1.data;
    } catch (error) {
      console.log(error);
    }
  };
};

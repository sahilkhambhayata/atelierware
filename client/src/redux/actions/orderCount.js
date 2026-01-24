import { axiosClient } from "./../../axios/axios";

export const getOrderCount = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    const BU_Id = localStorage.getItem("BU_Id");
    const userId = localStorage.getItem("userId");
   
    try {
      const data = await axiosClient.get(
        `/oms/v1/countOrdHead?ak=${BU_Id}&UserId=${userId}`,
        {
          headers: {
            token: token,
          },
        }
      );
      
      if (data.data.success === true) {
        dispatch({ type: "GET_ORDER_COUNT", payload: data.data });
        return data.data;
      } else {
      
      }
      return data.data;
    } catch (error) {
      console.log(error, "error");
      // dispatch(getSearchDetails({}, searchStatus, search));
    }
  };
};

export const getItemCount = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    const BU_Id = localStorage.getItem("BU_Id");
    const userId = localStorage.getItem("userId");

    try {
      const data = await axiosClient.get(
        `/oms/v1/itemCount?ak=${BU_Id}&UserId=${userId}`,
        {
          headers: {
            token: token,
          },
        }
      );

      if (data.data.success === true) {
        dispatch({ type: "GET_ITEM_COUNT", payload: data.data });
        return data.data;
      } else {
        console.log(data.data.error);
      }
      return data.data;
    } catch (error) {
      console.log(error, "error");
    }
  };
};

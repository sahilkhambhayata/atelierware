import { axiosClient } from "./../../axios/axios";

export const fabicDropDownList = (TOrdDtId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const data = await axiosClient.post(
        `/oms/v1/fabriclistForDyeing?TOrdDtId=${TOrdDtId}`,
        {
          token: token,
        }
      );

      
      if (data.data.success) {
        dispatch({ type: "FABRIC_LIST_FOR_DYEING", payload: data.data });
        return data.data;
      }
      else{
        return data.data;
      }
    } catch (error) {
      return error.response.data;
    }
  };
};

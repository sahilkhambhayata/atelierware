import { axiosClient } from "./../../axios/axios";

export const loading = () => {
  return {
    type: "IS_LOADING_FABRIC",
  };
};

export const addDublicateOrder = (dtId) => {
  return async (dispatch) => {
    dispatch(loading());
    try {
      const token = localStorage.getItem("token");
      const data1 = await axiosClient.post(`oms/v1/duplicatitem/${dtId}`, {
        token: token,
      });

      //   dispatch({ type: "ADD_EDIT_FABRIC_ACC", payload: data1.data });
      // getFabricAccessoriesList(data.TOrdDtId);

      return data1.data;
    } catch (error) {
      // console.log(error);
    }
  };
};

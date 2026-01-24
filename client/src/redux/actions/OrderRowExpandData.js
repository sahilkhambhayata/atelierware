import { axiosClient } from "./../../axios/axios";

export const getOrderExpandData = (TOrdHdID) => {
  return async (dispatch) => {
    try {
      
      const token = localStorage.getItem("token");
      const BU_Id = localStorage.getItem("BU_Id");
      //   const branchId = localStorage.getItem("BranchId");
      //   const companyId = localStorage.getItem("CompanyId");

      const data = await axiosClient.get(
        `oms/v1/getSingleOrderItems?ak=${BU_Id}&TOrdHdID=${TOrdHdID}`,

        {
          headers: {
            token: `${token}`,
          },
        }
      );

      if (data.data.success === true) {
        dispatch({ type: "GET_ORDER_EXPAND", payload: data.data });

        return data.data;
      } else {
        console.log(data.data.error);
      }
      return data.data;
    } catch (error) {
      return error.response.data;
    }
  };
};

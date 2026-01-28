import { axiosClient } from "./../../axios/axios";

export const getItemImage = (TOrdDtId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      //   const branchId = localStorage.getItem("BranchId");
      //   const companyId = localStorage.getItem("CompanyId");

      const data = await axiosClient.post(
        `oms/v1/getSingleItemImage?TOrdDtId=${TOrdDtId}`,

        {
          //   headers: {
          token: `${token}`,
          //   },
        }
      );

      if (data.data.success === true) {
        dispatch({ type: "GET_ITME_IMAGE", payload: data.data });

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

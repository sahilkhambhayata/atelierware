import { axiosClient } from "./../../axios/axios";

export const getMasterList = (BU_ID) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const branchId = localStorage.getItem("BranchId");
      const companyId = localStorage.getItem("CompanyId");

      const data = await axiosClient.post(
        `/oms/v1/listMasters`,
        {
          branchId: branchId,
          companyId: companyId,
          NOJ:"Multiple"
        },
        {
          headers: {
            token: `${token}`,
          },
        }
      );

      if (data.data.success === true) {
        dispatch({ type: "GET_MASTER", payload: data.data });

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

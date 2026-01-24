import { axiosClient } from "./../../axios/axios";
import { getOrderCount } from "./orderCount";

export const getBranch = (id, token) => {
  return async (dispatch) => {
    try {
      const tokenAdmin = localStorage.getItem("token");

      const data = await axiosClient.get(`/oms/v1/getbranch/${id}`, {
        headers: {
          token: token ? token : tokenAdmin,
        },
      });

      if (data.data.success === true) {
        dispatch({ type: "GET_BRANCH", payload: data.data });
        localStorage.setItem("BU_Id", data.data.branch.BU_Id);
        localStorage.setItem("CompanyId", data.data.branch.Companyid);
        // dispatch(getOrderCount());

        return data.data;
      } else {
      }
      return data.data;
    } catch (error) {
      return error.response.data;
    }
  };
};

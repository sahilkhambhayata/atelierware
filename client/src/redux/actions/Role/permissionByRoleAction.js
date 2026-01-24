import { axiosClient } from "./../../../axios/axios";

export const permissionByRole = () => {
  return async (dispatch) => {
    try {
      const cacheBuster = new Date().getTime();
      const roleId = localStorage.getItem("RoleId");
      const data = await axiosClient.get(
        `RBAC/v1/api/uam/getpermissionsByRole?RoleId=${roleId}&_=${cacheBuster}`
      );


     
      if (data.data.success === true) {
        dispatch({ type: "PERMISSION", payload: data.data });
        return data.data;
      } else {
        return data.data;
      }
    } catch (error) {
      return error.response.data;
    }
  };
};

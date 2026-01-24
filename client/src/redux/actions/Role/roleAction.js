import { axiosClient } from "./../../../axios/axios";

// Action Types
const ROLE_LOADING = "ROLE_LOADING";
const GET_ROLE_DATA = "GET_ROLE_DATA";
const ROLE_NO_DATA = "ROLE_NO_DATA";

// Action Creators
export const loading = () => ({ type: ROLE_LOADING });

export const getRoleDetails = (data) => ({
  type: GET_ROLE_DATA,
  payload: data,
});

export const roleNoDataFound = () => ({ type: ROLE_NO_DATA });

// Thunks
export const getRoleDetailsAsyncData = (search, p, l) => async (dispatch) => {
  try {
    dispatch(loading());
    const page = p + 1;
    const limit = l;
    const BU_Id = localStorage.getItem("BU_Id");
    const cacheBuster = new Date().getTime();
    let res;
    if (search == "") {
      res = await axiosClient.get(
        `RBAC/v1/api/uam/getroles?ak=${BU_Id}&page=${page}&limit=${limit}&_=${cacheBuster}`
      );
    } else {
      res = await axiosClient.get(
        `RBAC/v1/api/uam/getroles?search=${search}&ak=${BU_Id}&page=${page}&limit=${limit}&_=${cacheBuster}`
      );
    }
    if (res.data.success) {
      dispatch(getRoleDetails(res.data));
    } else {
      dispatch(roleNoDataFound());
    }
  } catch (error) {
    dispatch(roleNoDataFound());
    console.error("Failed to fetch role details", error);
  }
};

export const createNewRole = (data, search, p, l) => async (dispatch) => {
  try {
    const userId = localStorage.getItem("userId");
    const CompanyId = localStorage.getItem("CompanyId");
    const BranchId = localStorage.getItem("BranchId");
    const res = await axiosClient.post(`RBAC/v1/api/uam/addupdaterole`, {
      CompanyId,
      BranchId,
      loginuserid: userId,
      Role: data.role,
      Description: data.desc,
    });
    if (res.data.success) {
      await dispatch(getRoleDetailsAsyncData(search, p, l));
      // if (responce.data.success) {
      return res.data;
      // }
    }
    // return res.data;
  } catch (error) {
    console.error("Error creating role", error);
    return { success: false, message: "Error creating role" };
  }
};

export const editOldRole = (roleId, data, search, p, l) => async (dispatch) => {
  try {
    const userId = localStorage.getItem("userId");
    const CompanyId = localStorage.getItem("CompanyId");
    const BranchId = localStorage.getItem("BranchId");
    const res = await axiosClient.post(`RBAC/v1/api/uam/addupdaterole`, {
      CompanyId,
      BranchId,
      loginuserid: userId,
      Role: data.role,
      RoleId: roleId,
      Description: data.desc,
    });

    if (res.data.success) {
      await dispatch(getRoleDetailsAsyncData(search, p, l));
      // if (responce.data.success) {
      return res.data;
      // }
    }
    // return res.data;
  } catch (error) {
    console.error("Error creating role", error);
    return { success: false, message: "Error creating role" };
  }
};

export const deleteRole = (id, search, p, l) => async (dispatch) => {
  try {
    const res = await axiosClient.delete(
      `RBAC/v1/api/uam/delrole?roleId=${id}`
    );
    if (res.data.success) {
      await dispatch(getRoleDetailsAsyncData(search, p, l));
      // if (responce.data.success) {
      return res.data;
      // }
    }
  } catch (error) {
    console.error("Error deleting role", error);
    return { success: false, message: "Error deleting role" };
  }
};

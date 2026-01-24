import { axiosClient } from "./../../../axios/axios";

// Action Types
const PERMISSION_LOADING = "PERMISSION_LOADING";
const GET_PERMISSION_DATA = "GET_PERMISSION_DATA";
const PERMISSION_NO_DATA = "PERMISSION_NO_DATA";
const OLD_PERMISSION_NO_DATA = "OLD_PERMISSION_NO_DATA";
const GET_OLD_PERMISSION_DATA = "GET_OLD_PERMISSION_DATA";
// Action Creators
export const loading = () => ({ type: PERMISSION_LOADING });

export const getPermissionDetails = (data) => ({
  type: GET_PERMISSION_DATA,
  payload: data,
});

export const getOldPermissionDetails = (data) => ({
  type: GET_OLD_PERMISSION_DATA,
  payload: data,
});

export const permissionNoDataFound = () => ({ type: PERMISSION_NO_DATA });
export const oldPermissionNoDataFound = () => ({
  type: OLD_PERMISSION_NO_DATA,
});

// Thunks
export const getPermissionDetailsAsyncData = () => async (dispatch) => {
  try {
    const BU_Id = localStorage.getItem("BU_Id");
    const cacheBuster = new Date().getTime();

    // const res = await axiosClient.get(`RBAC/v1/api/uam/getmodules?ak=${BU_Id}`);
    const res = await axiosClient.get(
      `RBAC/v1/api/uam/getAllpermissions?ak=${BU_Id}&_=${cacheBuster}`
    );

    if (res.data.success) {
      dispatch(getPermissionDetails(res.data));
    } else {
      dispatch(permissionNoDataFound());
    }
  } catch (error) {
    dispatch(permissionNoDataFound());
    console.error("Failed to fetch model details", error);
  }
};

export const selectedPermissionsDetail = (roleId) => async (dispatch) => {
  try {
    const BU_Id = localStorage.getItem("BU_Id");
    const cacheBuster = new Date().getTime();

    // const res = await axiosClient.get(`RBAC/v1/api/uam/getmodules?ak=${BU_Id}`);
    const res = await axiosClient.get(
      `RBAC/v1/api/uam/getrolepermissions?RoleId=${roleId}&_=${cacheBuster}`
    );

    if (res.data.success) {
      dispatch(getOldPermissionDetails(res.data));
    } else {
      dispatch(oldPermissionNoDataFound());
    }
  } catch (error) {
    dispatch(oldPermissionNoDataFound());
    console.error("Failed to fetch model details", error);
  }
};

export const createPermission = (roleId, permissions) => async (dispatch) => {
  try {
    
    const userId = localStorage.getItem(`userId`);
    const CompanyId = localStorage.getItem(`CompanyId`);
    const BranchId = localStorage.getItem("BranchId");
    const res = await axiosClient.post(`RBAC/v1/api/uam/addupdatepermissions`, {
      loginuserid: userId,
      RoleId: roleId,
      CompanyId,
      BranchId,
      permissions: permissions,
    });

    if (res.data.success) {
      return res.data;
    } else {
      return res.data;
    }
  } catch (error) {}
};

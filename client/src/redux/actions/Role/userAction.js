import { axiosClient } from "./../../../axios/axios";

// Action Types
const USER_LOADING = "USER_LOADING";
const GET_USER_DATA = "GET_USER_DATA";
const USER_NO_DATA = "USER_NO_DATA";

// Action Creators
export const loading = () => ({ type: USER_LOADING });

export const getUserDetails = (data) => ({
  type: GET_USER_DATA,
  payload: data,
});

export const userNoDataFound = () => ({ type: USER_NO_DATA });

// Thunks
export const getUserDetailsAsyncData = (search, p, l) => async (dispatch) => {
  try {
    dispatch(loading());
    const page = p + 1;
    const limit = l;
    const BU_Id = localStorage.getItem("BU_Id");
    const cacheBuster = new Date().getTime();
    let res;
    if (search == "") {
      res = await axiosClient.get(
        `RBAC/v1/api/uam/getusers?ak=${BU_Id}&page=${page}&limit=${limit}&_=${cacheBuster}`
      );
    } else {
      res = await axiosClient.get(
        `RBAC/v1/api/uam/searchuser?search=${search}&page=${page}&limit=${limit}&ak=${BU_Id}&_=${cacheBuster}`
      );
    }
    if (res.data.success) {
      dispatch(getUserDetails(res.data));
      return res.data;
    } else {
      dispatch(userNoDataFound());
      return res.data;
    }
  } catch (error) {
    dispatch(userNoDataFound());
    console.error("Failed to fetch user details", error);
  }
};

// export const getSearchUserData = (search, p, l) => async (dispatch) => {
//   try {
//     dispatch(loading());
//     const page = p + 1;
//     const limit = l;
//     const BU_Id = localStorage.getItem("BU_Id");
//     const cacheBuster = new Date().getTime();
//     let res;
//     if (search == "") {
//       res = await axiosClient.get(
//         `RBAC/v1/api/uam/getusers?ak=${BU_Id}&page=${page}&limit=${limit}&_=${cacheBuster}`
//       );
//     } else {
//       res = await axiosClient.get(
//         `RBAC/v1/api/uam/getusers?search=${search}&ak=${BU_Id}&page=${page}&limit=${limit}&_=${cacheBuster}`
//       );
//     }
//     if (res.data.success) {
//       dispatch(getUserDetails(res.data));
//       return res.data;
//     } else {
//       dispatch(userNoDataFound());
//       return res.data;
//     }
//   } catch (error) {
//     dispatch(userNoDataFound());
//     console.error("Failed to fetch user details", error);
//   }
// };

export const createNewUser = (data, designerData, search, p, l) => async (
  dispatch
) => {
  try {
    const DesignerId = designerData.map((item) => item.DesignerId).join(",");

    const userId = localStorage.getItem("userId");
    const CompanyId = localStorage.getItem("CompanyId");
    const BranchId = localStorage.getItem("BranchId");
    const res = await axiosClient.post(`RBAC/v1/api/uam/addupdateuser`, {
      CompanyId,
      BranchId,
      loginuserid: userId,
      RoleId: data.RoleId,
      EmpId: data.EmpId,
      PasswordHash: data.PasswordHash,
      Password: data.Password,
      DesignerId: DesignerId,
    });

    if (res.data.success) {
      await dispatch(getUserDetailsAsyncData(search, p, l));
      // if (responce.data.success) {
      return res.data;
      // }
    } else {
      return res.data;
    }
    // return res.data;
  } catch (error) {
    console.error("Error creating user", error);
    return { success: false, message: "Error creating user" };
  }
};

export const editOldUser = (oldId, data, designerData, search, p, l) => async (
  dispatch
) => {
  try {
    const DesignerId = designerData.map((item) => item.DesignerId).join(",");

    const userId = localStorage.getItem("userId");
    const CompanyId = localStorage.getItem("CompanyId");
    const BranchId = localStorage.getItem("BranchId");
    const res = await axiosClient.post(`RBAC/v1/api/uam/addupdateuser`, {
      CompanyId,
      BranchId,
      loginuserid: userId,
      RoleId: data.RoleId,
      // EmpId: data.EmpId,
      PasswordHash: data.PasswordHash,
      Password: data.Password,
      UserId: oldId,
      DesignerId: DesignerId,
    });

    if (res.data.success) {
      await dispatch(getUserDetailsAsyncData(search, p, l));
      // if (responce.data.success) {
      return res.data;
      // }
    } else {
      return res.data;
    }
    // return res.data;
  } catch (error) {
    console.error("Error creating user", error);
    return { success: false, message: "Error creating user" };
  }
};

// export const deleteUser = (id, search, p, l) => async (dispatch) => {
//   try {
//     const res = await axiosClient.delete(
//       `RBAC/v1/api/uam/deluser?UserId=${id}`
//     );
//     if (res.data.success) {
//       await dispatch(getUserDetailsAsyncData(search, p, l));
//       // if (responce.data.success) {
//       return res.data;
//       // }
//     }
//   } catch (error) {
//     console.error("Error deleting user", error);
//     return { success: false, message: "Error deleting user" };
//   }
// };

export const updateActivationUser = (user, search, p, l) => async (
  dispatch
) => {
  const userId = localStorage.getItem("userId");
  const CompanyId = localStorage.getItem("CompanyId");
  const BranchId = localStorage.getItem("BranchId");
  try {
    const res = await axiosClient.post(`RBAC/v1/api/uam/addupdateuser`, {
      CompanyId,
      BranchId,
      loginuserid: userId,
      ActivationStatus: !user.ActivationStatus,
      UserId: user.UserId,
    });

    if (res.data.success) {
      // await dispatch(getUserDetailsAsyncData(search, p, l));
      return res.data;
    } else {
      return res.data;
    }
  } catch (error) {
    console.error("Error deleting user", error);
    return { success: false, message: "Error Activation User" };
  }
};

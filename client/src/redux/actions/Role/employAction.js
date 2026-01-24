import { axiosClient } from "./../../../axios/axios";

// Action Types
const EMPLOY_LOADING = "EMPLOY_LOADING";
const GET_EMPLOY_DATA = "GET_EMPLOY_DATA";
const EMPLOY_NO_DATA = "EMPLOY_NO_DATA";

// Action Creators
export const loading = () => ({ type: EMPLOY_LOADING });

export const getEmployDetails = (data) => ({
  type: GET_EMPLOY_DATA,
  payload: data,
});

export const employNoDataFound = () => ({ type: EMPLOY_NO_DATA });

// Thunks
export const getEmployDetailsAsyncData = () => async (dispatch) => {
  try {
    dispatch(loading());

    const BU_Id = localStorage.getItem("BU_Id");

    const res = await axiosClient.get(
      `RBAC/v1/api/uam/employeeList?page=1&limit=10&ak=${BU_Id}`
    );
    if (res.data.success) {
        dispatch(getEmployDetails(res.data));
      } else {
        dispatch(employNoDataFound());
      }

  } catch (error) {
    dispatch(employNoDataFound());
    console.error("Failed to fetch user details", error);
  }
};

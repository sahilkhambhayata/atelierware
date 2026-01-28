import { axiosClient } from "./../../axios/axios";
import { debounce } from "lodash";

export const loading = () => {
  return {
    type: "IS_LOADING",
  };
};

export const searchLoading = () => {
  return {
    type: "SEARCH_LOADING",
  };
};

export const getOrderDetails = (data) => {
  return {
    type: "GET_ORDER_DETAILS",
    payload: data,
  };
};

const formatDate = (date) => {
  const year = date?.getFullYear();
  const month = String(date?.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
  const day = String(date?.getDate()).padStart(2, "0"); // Add leading zero if needed

  return `${year}-${month}-${day}`;
};

export const getOrderDetailsAsyncData = (
  page,
  l,
  ak,
  ic,
  filter,
  subfilter,
  startDate,
  endDate,
  minAmount,
  maxAmount
) => {
  return async (dispatch) => {
    try {
      const p = page + 1;

      dispatch(loading());
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const today = new Date();
      let tods;
      let tode;    
      
      if (ic < 6) {
        if (filter === undefined) {
          const response = await axiosClient.get(
            `/oms/v1/getOrderList?p=${p}&l=${l}&ak=${ak}&ic=${ic}&UserId=${userId}`,
            {
              headers: {
                token: token,
              },
            }
          );

          if (response.data.success) {
            dispatch(getOrderDetails(response.data));
            return response.data;
          } else {
            dispatch(getOrderDetails({}));
          }

          
        } else if (filter === 0) {
          if (subfilter === 0) {
            tods = today;
            tode = new Date(today);
            tode.setDate(today.getDate() + 1);
          } else if (subfilter === 1) {
            tods = new Date(today);
            tods.setDate(today.getDate() - 1);
            tode = today;
          } else if (subfilter === 2) {
            tods = new Date(today);
            tods.setDate(today.getDate() - 7);
            tode = new Date(today);
            tode.setDate(today.getDate() + 1);
          } else if (subfilter === 3) {
            tods = new Date(today);
            tods.setDate(today.getDate() - 14);
            tode = new Date(today);
            tode.setDate(today.getDate() - 7);
          } else if (subfilter === 4) {
            tods = new Date(today);
            tods.setDate(today.getDate() - 30);
            tode = new Date(today);
            tode.setDate(today.getDate() + 1);
          } else if (subfilter === 5) {
            tods = new Date(today);
            tods.setDate(today.getDate() - 60);
            tode = new Date(today);
            tode.setDate(today.getDate() - 30);
          } else if (subfilter === 6) {
            tods = startDate;
            tode = endDate;
          }
          const todsFormatted = formatDate(tods);
          const todeFormatted = formatDate(tode);
          const response = await axiosClient.get(
            `/oms/v1/getOrderList?p=${p}&l=${l}&ak=${ak}&ic=${ic}&tods=${todsFormatted}&tode=${todeFormatted}&UserId=${userId}`,
            {
              headers: {
                token: token,
              },
            }
          );
          if (response.data.success) {
            dispatch(getOrderDetails(response.data));
            return response.data;
          } else {
            dispatch(getOrderDetails({}));
          }
        } else if (filter === 1) {
          if (subfilter === 0) {
            tods = today;
            tode = new Date(today);
            tode.setDate(today.getDate() + 1);
          } else if (subfilter === 1) {
            tods = new Date(today);
            tods.setDate(today.getDate() + 1);
            tode = new Date(today);
            tode.setDate(today.getDate() + 2);
          } else if (subfilter === 2) {
            tods = new Date(today);
            tods.setDate(today.getDate() + 1);
            tode = new Date(today);
            tode.setDate(today.getDate() + 7);
          } else if (subfilter === 3) {
            tods = new Date(today);
            tods.setDate(today.getDate() + 7);
            tode = new Date(today);
            tode.setDate(today.getDate() + 14);
          } else if (subfilter === 4) {
            tods = new Date(today);
            tods.setDate(today.getDate() + 1);
            tode = new Date(today);
            tode.setDate(today.getDate() + 30);
          } else if (subfilter === 5) {
            tods = new Date(today);
            tods.setDate(today.getDate() + 30);
            tode = new Date(today);
            tode.setDate(today.getDate() + 60);
          } else if (subfilter === 6) {
            tods = startDate;
            tode = endDate;
          }
          const todsFormatted = formatDate(tods);
          const todeFormatted = formatDate(tode);
          const response = await axiosClient.get(
            `/oms/v1/getOrderList?p=${p}&l=${l}&ak=${ak}&ic=${ic}&tds=${todsFormatted}&tde=${todeFormatted}&UserId=${userId}`,
            {
              headers: {
                token: token,
              },
            }
          );
          if (response.data.success) {
            dispatch(getOrderDetails(response.data));
            return response.data;
          } else {
            dispatch(getOrderDetails({}));
          }
        } else if (filter === 3) {
          if (subfilter === 0) {
            tods = today;
            tode = new Date(today);
            tode.setDate(today.getDate() + 1);
          } else if (subfilter === 1) {
            tods = new Date(today);
            tods.setDate(today.getDate() - 1);
            tode = today;
          } else if (subfilter === 2) {
            tods = new Date(today);
            tods.setDate(today.getDate() - 7);
            tode = new Date(today);
            tode.setDate(today.getDate() + 1);
          } else if (subfilter === 3) {
            tods = new Date(today);
            tods.setDate(today.getDate() - 14);
            tode = new Date(today);
            tode.setDate(today.getDate() - 7);
          } else if (subfilter === 4) {
            tods = new Date(today);
            tods.setDate(today.getDate() - 30);
            tode = new Date(today);
            tode.setDate(today.getDate() + 1);
          } else if (subfilter === 5) {
            tods = new Date(today);
            tods.setDate(today.getDate() - 60);
            tode = new Date(today);
            tode.setDate(today.getDate() - 30);
          } else if (subfilter === 6) {
            tods = startDate;
            tode = endDate;
          }
          const todsFormatted = formatDate(tods);
          const todeFormatted = formatDate(tode);
          const response = await axiosClient.get(
            `/oms/v1/getOrderList?p=${p}&l=${l}&ak=${ak}&ic=${ic}&drdds=${todsFormatted}&drdde=${todeFormatted}&UserId=${userId}`,
            {
              headers: {
                token: token,
              },
            }
          );
          if (response.data.success) {
            dispatch(getOrderDetails(response.data));
            return response.data;
          } else {
            dispatch(getOrderDetails({}));
          }
        } else if (filter === 4) {
          if (subfilter === 0) {
            tods = today;
            tode = new Date(today);
            tode.setDate(today.getDate() + 1);
          } else if (subfilter === 1) {
            tods = new Date(today);
            tods.setDate(today.getDate() + 1);
            tode = new Date(today);
            tode.setDate(today.getDate() + 2);
          } else if (subfilter === 2) {
            tods = new Date(today);
            tods.setDate(today.getDate() + 1);
            tode = new Date(today);
            tode.setDate(today.getDate() + 7);
          } else if (subfilter === 3) {
            tods = new Date(today);
            tods.setDate(today.getDate() + 7);
            tode = new Date(today);
            tode.setDate(today.getDate() + 14);
          } else if (subfilter === 4) {
            tods = new Date(today);
            tods.setDate(today.getDate() + 1);
            tode = new Date(today);
            tode.setDate(today.getDate() + 30);
          } else if (subfilter === 5) {
            tods = new Date(today);
            tods.setDate(today.getDate() + 30);
            tode = new Date(today);
            tode.setDate(today.getDate() + 60);
          } else if (subfilter === 6) {
            tods = startDate;
            tode = endDate;
          }
          const todsFormatted = formatDate(tods);
          const todeFormatted = formatDate(tode);
          const response = await axiosClient.get(
            `/oms/v1/getOrderList?p=${p}&l=${l}&ak=${ak}&ic=${ic}&dds=${todsFormatted}&dde=${todeFormatted}&UserId=${userId}`,
            {
              headers: {
                token: token,
              },
            }
          );
          if (response.data.success) {
            dispatch(getOrderDetails(response.data));
            return response.data;
          } else {
            dispatch(getOrderDetails({}));
          }
        } else if (filter === 2) {
          const response = await axiosClient.get(
            `/oms/v1/getOrderList?p=${p}&l=${l}&ak=${ak}&ic=${ic}&ovs=${minAmount}&ove=${maxAmount}&UserId=${userId}`,
            {
              headers: {
                token: token,
              },
            }
          );
          if (response.data.success) {
            dispatch(getOrderDetails(response.data));
            return response.data;
          } else {
            dispatch(getOrderDetails({}));
          }
        } else if (filter === 5) {
          const response = await axiosClient.get(
            `/oms/v1/getOrderList?p=${p}&l=${l}&ak=${ak}&ic=${ic}&obs=${minAmount}&obe=${maxAmount}&UserId=${userId}`,
            {
              headers: {
                token: token,
              },
            }
          );
          if (response.data.success) {
            dispatch(getOrderDetails(response.data));
            return response.data;
          } else {
            dispatch(getOrderDetails({}));
          }
        } else if (filter === 6 || filter === 7) {
          const response = await axiosClient.get(
            `/oms/v1/getOrderList?p=${p}&l=${l}&ak=${ak}&ic=${ic}&UserId=${userId}`,
            {
              headers: {
                token: token,
              },
            }
          );
          if (response.data.success) {
            dispatch(getOrderDetails(response.data));
            return response.data;
          } else {
            dispatch(getOrderDetails({}));
          }
        }
      } else {
        const response = await axiosClient.get(
          `/oms/v1/getOrderList?p=${p}&l=${l}&ak=${ak}&UserId=${userId}`,
          {
            headers: {
              token: token,
            },
          }
        );
        if (response.data.success) {
          dispatch(getOrderDetails(response.data));
          return response.data;
        } else {
          dispatch(getOrderDetails({}));
        }
      }
    } catch (error) {
      // console.log(error.message);
    }
  };
};

export const getSearchDetails = (data, searchStatus, search) => {
  return {
    type: "GET_SEARCH_ORDER",
    payload: { data, searchStatus, search } || {},
  };
};

let currentSearchTerm = "";
export const searchOrder = (
  page,
  l,
  ak,
  switchStatus,
  search,
  searchStatus
) => {
  return async (dispatch) => {
    currentSearchTerm = search;

    const p = page + 1;
    dispatch(searchLoading());
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    try {
      const data = await axiosClient.post(
        `/oms/v1/search/order?p=${p}&l=${l}&ak=${ak}&UserId=${userId}`,
        {
          search: search,
          orderNo: switchStatus.orderNo,
          name: switchStatus.orderName,
          barcode: switchStatus.barcode,
        },
        {
          headers: {
            token: token,
          },
        }
      );

      if (data.data.success && search === currentSearchTerm) {
        dispatch(getSearchDetails(data.data, searchStatus, search));
        return data.data;
      } else {
        dispatch(getSearchDetails({}, searchStatus, search));
        return data.data;
      }
    } catch (error) {
      if (search === currentSearchTerm) {
        dispatch(getSearchDetails({}, searchStatus, search));
      }
    }
  };
};

export const createDebouncedSearchOrder = () =>
  debounce((dispatch, page, l, ak, switchStatus, search, searchStatus) => {
    dispatch(searchOrder(page, l, ak, switchStatus, search, searchStatus));
  }, 1000);

export const sortOrdersData = (orderData) => {
  return {
    type: "SORT_ORDERS",
    payload: orderData, // Pass the sorted order data as payload
  };
};

export const sendOrderDeleteOtp = (row) => {
  return async (dispatch) => {
    const BranchId = localStorage.getItem("BranchId");

    try {
      const updatedData = row.map((item) => {
        if (item.charAt(0) === "g") {
          return item.substring(1);
        } else {
          return item;
        }
      });
      const token = localStorage.getItem("token");
      // const updatedData = data.map(item => item.substring(1));
      const data = await axiosClient.post(
        `/oms/v1/sendotp`,
        {
          TOrdHdID: updatedData,
          BranchId: BranchId,
        },
        {
          headers: {
            token: token,
          },
        }
      );

      return data;
    } catch (error) {
      // console.log(error);
    }
  };
};

export const getExportData = (ic, BU_Id) => {
  return async (dispatch) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      // const updatedData = data.map(item => item.substring(1));
      const data = await axiosClient.post(
        `oms/v1/xlsxorder?ak=${BU_Id}&ic=${ic}&UserId=${userId}`,

        {
          // headers: {
          token: token,
          // },
        }
      );
      dispatch({ type: "GET_EXPORT_DATA", payload: data.data });
      return data;
    } catch (error) {
      return error.response.data;
    }
  };
};

export const verifyOrderDeleteOtp = (email, otp) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const BranchId = localStorage.getItem("BranchId");

      if (!token) {
      } else {
        const data = await axiosClient.post(
          `oms/v1/verifyotp`,

          {
            otp: Number(otp),
            BranchId: BranchId,
            // email: email,
          },
          {
            headers: {
              token: token,
            },
          }
        );

        if (data.data.success === true) {
          return data.data;
        } else {
          return data.data;
        }
      }
    } catch (error) {
      // console.log(error);
      // return error.response.data;
    }
  };
};

export const deleteOrder = (id) => {
  return async (dispatch) => {
    try {
      const updatedData = id.map((item) => {
        if (item.charAt(0) === "g") {
          return item.substring(1);
        } else {
          return item;
        }
      });
      const token = localStorage.getItem("token");

      const data = await axiosClient.post(
        `oms/v1/DeleteOrder/`,
        {
          tordhdid: updatedData,
          // BranchId: BranchId,
          // email: email,
        },
        {
          headers: {
            token: token,
          },
        }
      );

      if (data.data.success === true) {
        let row;
        if (typeof id === "string") {
          row = id;
        } else {
          row = id.map((e) => e.toString());
        }
        dispatch({
          type: "DELETED_ORDER",
          payload: row,
        });
        return data.data;
      } else {
        return data.data;
      }
    } catch (error) {
      // console.log(error);
    }
  };
};

import { axiosClient } from "./../../axios/axios";
import { debounce } from 'lodash';
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

export const getItemDetails = (data) => {
  return {
    type: "GET_ITEM_DETAILS",
    payload: data,
  };
};
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
  const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed

  return `${year}-${month}-${day}`;
};

export const getItemDetailsAsyncData = (
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
      if (ic < 5) {
        if (filter === undefined) {
          const response = await axiosClient.get(
            `/oms/v1/getItemList?p=${p}&l=${l}&ak=${ak}&ItemStatus=${ic}&UserId=${userId}`,
            {
              headers: {
                token: token,
              },
            }
          );

          if (response.data.success) {
            dispatch(getItemDetails(response.data));
            return response.data;
          } else {
            dispatch(getItemDetails({}));
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
            `/oms/v1/getItemList?p=${p}&l=${l}&ak=${ak}&ItemStatus=${ic}&tods=${todsFormatted}&tode=${todeFormatted}&UserId=${userId}`,
            {
              headers: {
                token: token,
              },
            }
          );
          if (response.data.success) {
            dispatch(getItemDetails(response.data));
            return response.data;
          } else {
            dispatch(getItemDetails({}));
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
            `/oms/v1/getItemList?p=${p}&l=${l}&ak=${ak}&ItemStatus=${ic}&tds=${todsFormatted}&tde=${todeFormatted}&UserId=${userId}`,
            {
              headers: {
                token: token,
              },
            }
          );
          if (response.data.success) {
            dispatch(getItemDetails(response.data));
            return response.data;
          } else {
            dispatch(getItemDetails({}));
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
            `/oms/v1/getItemList?p=${p}&l=${l}&ak=${ak}&ItemStatus=${ic}&drdds=${todsFormatted}&drdde=${todeFormatted}&UserId=${userId}`,
            {
              headers: {
                token: token,
              },
            }
          );
          if (response.data.success) {
            dispatch(getItemDetails(response.data));
            return response.data;
          } else {
            dispatch(getItemDetails({}));
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
            `/oms/v1/getItemList?p=${p}&l=${l}&ak=${ak}&ItemStatus=${ic}&dds=${todsFormatted}&dde=${todeFormatted}&UserId=${userId}`,
            {
              headers: {
                token: token,
              },
            }
          );
          if (response.data.success) {
            dispatch(getItemDetails(response.data));
            return response.data;
          } else {
            dispatch(getItemDetails({}));
          }
        } else if (filter === 2) {
          const response = await axiosClient.get(
            `/oms/v1/getItemList?p=${p}&l=${l}&ak=${ak}&ItemStatus=${ic}&ovs=${minAmount}&ove=${maxAmount}&UserId=${userId}`,
            {
              headers: {
                token: token,
              },
            }
          );
          if (response.data.success) {
            dispatch(getItemDetails(response.data));
            return response.data;
          } else {
            dispatch(getItemDetails({}));
          }
        } else if (filter === 5) {
          const response = await axiosClient.get(
            `/oms/v1/getItemList?p=${p}&l=${l}&ak=${ak}&ItemStatus=${ic}&obs=${minAmount}&obe=${maxAmount}&UserId=${userId}`,
            {
              headers: {
                token: token,
              },
            }
          );
          if (response.data.success) {
            dispatch(getItemDetails(response.data));
            return response.data;
          } else {
            dispatch(getItemDetails({}));
          }
        } else if (filter === 6 || filter === 7) {
          const response = await axiosClient.get(
            `/oms/v1/getItemList?p=${p}&l=${l}&ak=${ak}&ItemStatus=${ic}&UserId=${userId}`,
            {
              headers: {
                token: token,
              },
            }
          );
          if (response.data.success) {
            dispatch(getItemDetails(response.data));
            return response.data;
          } else {
            dispatch(getItemDetails({}));
          }
        }
      } else {
        const response = await axiosClient.get(
          `/oms/v1/getItemList?p=${p}&l=${l}&ak=${ak}&UserId=${userId}`,
          {
            headers: {
              token: token,
            },
          }
        );
        if (response.data.success) {
          dispatch(getItemDetails(response.data));
          return response.data;
        } else {
          dispatch(getItemDetails({}));
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
};

export const sortItemData = (orderData) => {
  return {
    type: "SORT_ITEMS",
    payload: orderData, // Pass the sorted order data as payload
  };
};

export const getItemSearchDetails = (data, searchStatus, search) => {
  return {
    type: "GET_SEARCH_ITEM",
    payload: { data, searchStatus, search } || {},
  };
};


let currentSearchTerm = '';
export const searchItem = (page, l, ak, switchStatus, search, searchStatus) => {
  return async (dispatch) => {
    currentSearchTerm = search;
    
    dispatch(searchLoading());
    const p = page + 1;
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const data = await axiosClient.post(
        `/oms/v1/item/search?p=${p}&l=${l}&ak=${ak}&UserId=${userId}`,
        {
          search: search,
          orderid: switchStatus.orderid,
          itemBarcode: switchStatus.itemBarcode,
          itemDes: switchStatus.itemDes,
          orderBarcode: switchStatus.orderBarcode,
          name: switchStatus.name,
          phone: switchStatus.phone,
        },
        {
          headers: {
            token: token,
          },
        }
      );

      // Only process the response if the search term hasn't changed
      if (data.data.success && search === currentSearchTerm) {
        dispatch(getItemSearchDetails(data.data, searchStatus, search));
        return data.data;
      } else if (search === currentSearchTerm) {
        dispatch(getItemSearchDetails({}, searchStatus, search));
      }
    } catch (error) {
      if (search === currentSearchTerm) {
        dispatch(getItemSearchDetails({}, searchStatus, search));
      }
    }
  };
};

// Debounced version of searchItem
export const createDebouncedSearchItem = () => debounce((dispatch, page, l, ak, switchStatus, search, searchStatus) => {
  dispatch(searchItem(page, l, ak, switchStatus, search, searchStatus));
}, 1000);


export const sendItemDeleteOtp = (row, email) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const data = await axiosClient.post(
        `/oms/v1/sendotp/delete/item`,
        {
          torddtid: row,
          email: email,
        },
        {
          headers: {
            token: token,
          },
        }
      );
    } catch (error) {
      return error.response.data;
    }
  };
};

export const verifyItemDeleteOtp = (row, email, otp) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
       
      } else {
        const data = await axiosClient.post(
          `/oms/v1/delete/item`,
          {
            otp: Number(otp),
            torddtid: row,
            email: email,
          },
          {
            headers: {
              token: token,
            },
          }
        );
        
        if (data.data.success === true) {
          let id;
          if (typeof row === "string") {
            id = row;
          } else {
            id = row.map((e) => e.toString());
          }
          dispatch({
            type: "DELETE_ITEM",
            payload: id,
          }); // Pass the row or its identifier to identify the item to delete
          return data.data;
          // return data.data;
        }
      }
    } catch (error) {
      console.log(error);
      // return error
      // return error.response.data;
    }
  };
};

export const getItemExportData = (ic, BU_Id) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      // const updatedData = data.map(item => item.substring(1));
      const data = await axiosClient.post(
        `oms/v1/xslxitems?ak=${BU_Id}&ItemStatus=${ic}&UserId=${userId}`,

        {
          // headers: {
          token: token,
          // },
        }
      );
      dispatch({ type: "GET_ITEM_EXPORT_DATA", payload: data.data });
      return data;
    } catch (error) {
      return error.response.data;
    }
  };
};
// export const deleteItem = (row) => {
//   return {
//     type: "DELETE_ITEM",
//     payload: row,
//   };
// };

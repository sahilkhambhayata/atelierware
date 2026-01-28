import { axiosClient } from "./../../axios/axios";
export const loading = () => {
  return {
    type: "IS_LOADING",
  };
};

// export const getServiceList = (BU_ID, searchService) => {
//   return async (dispatch) => {
//     try {
//       const token = localStorage.getItem("token");
//       //   const BU_ID = localStorage.getItem("BU_Id");

//       const data = await axiosClient.get(
//         `/oms/v1/listServicesitem?page=1&limit=50&search=${searchService}&ak=${BU_ID}`,
//         {
//           // /oms/v1/listServicesitem?page=1&limit=50&search=&ak=rgOXAaVvrGcC
//           headers: {
//             token: `${token}`,
//           },
//         }
//       );

//       if (data.data.success === true) {
//         dispatch({ type: "GET_SERVICE", payload: data.data });
//         return data.data;
//       } else {

//       }
//       return data.data;
//     } catch (error) {

//       return error.response.data;
//     }
//   };
// };

export const getServiceList = (data) => {
  return {
    type: "GET_SERVICE",
    payload: data,
  };
};
export const getupServiceList = (data) => {
  return {
    type: "GET_UP_SERVICE",
    payload: data,
  };
};
export const NoDAtaFound = (data) => {
  return {
    type: "NO_DATA",
    payload: data.data,
  };
};
export const UpNoDAtaFound = (data) => {
  return {
    type: "NO_UP_DATA",
    payload: data.data,
  };
};

export const getSingleGroupItem = (data) => {
  return {
    type: "GET_SINGLE_GROUP_SERVICE",
    payload: data,
  };
};

export const getServiceListAsyncData = (BU_ID, searchService) => {
  return (dispatch) => {
    dispatch(loading());
    const p = 1;
    const l = 50;
    const token = localStorage.getItem("token");

    axiosClient
      .get(
        `/oms/v1/listServicesitem?page=${p}&limit=${l}&search=${searchService}&ak=${BU_ID}`,
        {
          headers: {
            token: token,
          },
        }
      )
      .then((res) => {
        dispatch(getServiceList(res.data));
      })
      .catch((err) => {
      
        dispatch(NoDAtaFound({ data: true }));
      });
  };
};

export const getupServiceListAsyncData = (BU_ID, searchService) => {
  return (dispatch) => {
    dispatch(loading());
    const p = 1;
    const l = 50;
    const token = localStorage.getItem("token");

    axiosClient
      .get(
        `/oms/v1/listServicesitem?page=${p}&limit=${l}&search=${searchService}&ak=${BU_ID}`,
        {
          headers: {
            token: token,
          },
        }
      )
      .then((res) => {
        dispatch(getupServiceList(res.data));
      })
      .catch((err) => {
        // console.log(err.data);
        dispatch(UpNoDAtaFound({ data: true }));
      });
  };
};

export const getSingleGroupItemData = (serviceId) => {
  return async (dispatch) => {
    dispatch(loading());

    const token = localStorage.getItem("token");

    const data = await axiosClient
      .get(`/oms/v1/getitemdetail/${serviceId}`, {
        headers: {
          token: token,
        },
      })

    
      .then((res) => {
        dispatch(getSingleGroupItem(res));
      })
      .catch((err) => {
      
      });
  };
};

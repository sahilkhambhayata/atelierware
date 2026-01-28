import { axiosClient } from "./../../axios/axios";
export const loading = () => {
  return {
    type: "IS_LOADING_FABRIC",
  };
};

export const getFabricAccList = (data) => {
  return {
    type: "GET_FABRIC_ACC_LIST",
    payload: data,
  };
};

export const addFabricAccessories = (data) => {
  return async (dispatch) => {
    dispatch(loading());
    try {
      const token = localStorage.getItem("token");
      const data1 = await axiosClient.post(
        `oms/v1/createandupdatefebricOrdDetail`,
        data,

        {
          headers: {
            token: token,
          },
        }
      );

      dispatch({ type: "ADD_EDIT_FABRIC_ACC", payload: data1.data });
      return data1.data;
    } catch (error) {
      // console.log(error);
    }
  };
};

export const getFabricAccessoriesList = (TOrdDtId) => {
  return async (dispatch) => {
    dispatch(loading());
    try {
      const token = localStorage.getItem("token");
     
      const p = 1;
      const l = 100;
      const data = await axiosClient.post(
        `/oms/v1/fabriclist?TOrdDtId=${TOrdDtId}&p=${p}&l=${l}`,
        {
          token: token,
        }
      );

      if (data.data.success) {
        dispatch({ type: "GET_FABRIC_ACC_LIST", payload: data.data });
      } else {
        dispatch({ type: "GET_FABRIC_ACC_LIST", payload: {} });
      }
      
      return data.data;
    } catch (err) {
      dispatch({ type: "GET_FABRIC_ACC_LIST", payload: {} });
    }
  };
};

// export const deleteFabricAcc = (id) => async (dispatch) => {
//   // dispatch(loading());
//   try {
//     const token = localStorage.getItem("token");

//     const data1 = await axiosClient.delete(`oms/v1/deleteFebricOrdDtls/${id}`, {
//       headers: {
//         token: token,
//       },
//     });

//     dispatch({ type: "DELETE_FABRIC_ACC", payload: id });
//     // return data1.data;
//   } catch (error) {
//     // console.log(error);
//   }
// };

export const deleteFabricAcc = (id) => {
  return async (dispatch) => {
    dispatch(loading());
    try {
      const token = localStorage.getItem("token");

      const data1 = await axiosClient.delete(
        `oms/v1/deleteFebricOrdDtls/${id}`,
        {
          headers: {
            token: token,
          },
        }
      );

      return data1.data;
    } catch (error) {
      // console.log(error);
    }
  };
};

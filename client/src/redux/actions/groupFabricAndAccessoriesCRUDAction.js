import { axiosClient } from "./../../axios/axios";
export const loading = () => {
  return {
    type: "IS_LOADING_GROUP_FABRIC",
  };
};

export const getGroupFabricAccList = (data) => {
  return {
    type: "GET_GROUP_FABRIC_ACC_LIST",
    payload: data,
  };
};

export const addGroupFabricAccessories = (data) => {

  return async (dispatch) => {

    
    dispatch(loading());
    try {
      const token = localStorage.getItem("token");
      const data1 = await axiosClient.post(
        `oms/v1/CreatGroupFab`,
        data,
        // formdata,
        {
          headers: {
            token: token,
          },
        }
      );

      dispatch({ type: "ADD_EDIT_GROUP_FABRIC_ACC", payload: data1.data });

      return data1.data;
    } catch (error) {
      // console.log(error);
    }
  };
};

// export const getFabricAccessoriesList = (TOrdDtId) => {
//   return async (dispatch) => {
//     dispatch(loading());
//     try {
//       const token = localStorage.getItem("token");
//      
//       const p = 1;
//       const l = 100;
//       const data = await axiosClient.get(
//         `/oms/v1/fabriclist?TOrdDtId=${TOrdDtId}&p=${p}&l=${l}`,
//         {
//           headers: {
//             token: token,
//           },
//         }
//       );
//      
//       dispatch({ type: "GET_FABRIC_ACC_LIST", payload: data.data });
//     } catch (err) {
//      
//       dispatch({ type: "GET_FABRIC_ACC_LIST", payload: {} });
//     }
//   };
// };

// export const deleteFabricAcc = (id) => {
//   return async (dispatch) => {
//     dispatch(loading());
//     try {
//       const token = localStorage.getItem("token");

//       const data1 = await axiosClient.delete(
//         `oms/v1/deleteFebricOrdDtls/${id}`,
//         {
//           headers: {
//             token: token,
//           },
//         }
//       );

//       return data1.data;
//     } catch (error) {
//     
//     }
//   };
// };

import { axiosClient } from "./../../axios/axios";

// export const getVatSlabData = (VatSlabId) => async (dispatch) => {
//  
//   try {
//     const token = localStorage.getItem("token");
//     const data = await axiosClient.get(`/crm/v1/getCustomers/${customer_id}`, {
//       headers: {
//         token: token,
//       },
//     });

//     
//     dispatch({ type: "GET_SINGLE_CUSTOMER", payload: data.data });
//    
//   } catch (error) {

//   }
// };

export const getVatSlabData = (VatSlabId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const data = await axiosClient.post(
        `/oms/v1/getSingleVatSlabData`,
        {
          vatSlabId: VatSlabId,
        },
        {
          headers: {
            token: `${token}`,
          },
        }
      );

      if (data.data.success === true) {
        dispatch({ type: "GET_VATSLAB_DATA", payload: data.data });
        return data.data;
      }
      return data.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  };
};

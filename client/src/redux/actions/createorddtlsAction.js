import { axiosClient } from "./../../axios/axios";

export const loading = () => {
  return {
    type: "IS_LOADING_CREATE_ORDER_DETAILS",
  };
};

export const createorddtls = (data, BU_Id) => {
  return async (dispatch) => {
    dispatch(loading());
    try {
      
      const token = localStorage.getItem("token");

      const response = await axiosClient.post(
        `/oms/v1/orderCreate`,

        {
          TOrdHdID: data.TOrdHdID,
          TOrdSeriesId: data.TOrdSeriesId,
          TOrdNo: data.TOrdNo,
          TOrdDate: data.TOrdHdID === null ? data.orderDate : data.orderDate,
          RefNo: data.RefNo,
          UserId: data.UserId, // null
          AccountId: data.AccountId,
          CustName: data.CustName,
          MobNo: data.MobNo,
          Address: data.Address,
          Email: data.Email,
          MaskedEmail: data.MaskedEmail,
          MaskedMobNo: data.MaskedMobNo,
          LandMarkID: data.LandMarkID,
          Pincode: data.Pincode,
          AreaId: data.AreaId,
          DelDate: data.deliveryDate,
          TrialDate: data.trialDate ? data.trialDate : null,
          IsClosed: data.IsClosed,
          SalesType: data.saleType,
          CompanyId: data.getCompanyId,
          BranchId: data.getBranchId,
          OrderTypeId: data.OrderTypeId,
          UrgentType: data.priority === "Regular",
          PoNo: data.poNo,
          PoDate: data.poDate,
          CustGSTIN: data.CustGSTIN,

          // CompanyId: "52",
          // BranchId: "73",

          orderType: data.OrderTypeId,

          // OrderTypeId: data.OrderTypeId,
          // SalesType: data.SalesType,
          // UrgentType: data.priority,
          SalesmanName: data.designer,
          MasterName: data.master,
          SaleTypeId: data.saleTypeId,
          MasterId: data.masterId,
          SalesmanId: data.designerId,
        },

        {
          headers: {
            token: token,
          },
        }
      );

      dispatch({ type: "GET_CREATE_ORDER_DETAILS", payload: response.data });
      return response.data;
    } catch (error) {}
  };
};

// export const getSingleOrderDtls = (tordHdId) => {
//
//   return async (dispatch) => {
//     dispatch(loading());
//     try {
//       const token = localStorage.getItem("token");

//       const response = await axiosClient.get(`oms/v1/getTOrdHead/${tordHdId}`, {
//         headers: {
//           token: token,
//         },
//       });
//       dispatch({ type: "GET_CREATE_ORDER_DETAILS", payload: response.data });
//       return response.data;
//     } catch (error) {
//       console.log(error);
//     }
//   };
// };

export const getSingleOrderDtls = (data) => {
  return {
    type: "GET_CREATE_ORDER_DETAILS",
    payload: data,
  };
};

export const getSingleOrderDtlsAsyncData = (tordHdId) => {

  return (dispatch) => {
  
    dispatch(loading());
    const token = localStorage.getItem("token");

    return axiosClient
      .get(`oms/v1/getTOrdHead/${tordHdId}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        dispatch(getSingleOrderDtls(res.data));
        return true; // Return true if the request was successful
      })
      .catch((err) => {
        // console.log(err);
        return false; // Return false if there was an error
      });
  };
};

import { axiosClient } from "./../../axios/axios";
export const AddGroupOrderBook = (
  TOrdDtID,
  ItemId,
  TOrdHdID,
  data,
  getGroupPaymentInfo,
  fabricAccInfo,
  trailDeliveryData
) => {

  
 

  return async (dispatch) => {

    try {
      const token = localStorage.getItem("token");
      const formdata = {
        ...data,
        TOrdDtID: +TOrdDtID,
        ItemId: +ItemId,
        CompanyId: +data.CompanyId,
        BranchId: +data.BranchId,
        TOrdHdID: +TOrdHdID,

        Discount:
          getGroupPaymentInfo?.discountAmt == "NaN"
            ? 0
            : getGroupPaymentInfo?.discountAmt,

        Amount: +getGroupPaymentInfo?.stitching,
        VatPerc: +getGroupPaymentInfo?.vat,
        VatAmt:
          +getGroupPaymentInfo?.vatAmt == "NaN"
            ? 0
            : +getGroupPaymentInfo?.vatAmt,
        STPerc: 0,
        STAmt: 0,
        // STPerc: +getGroupPaymentInfo?.vat,
        // STAmt: +getGroupPaymentInfo?.vatAmt,
        MakingAmt:
          +getGroupPaymentInfo?.makingAmt == "NaN"
            ? +getGroupPaymentInfo?.stitching
            : +getGroupPaymentInfo?.makingAmt,
        FabAmt: +fabricAccInfo?.totalFabricAmount,
        AccessoryAmt: +fabricAccInfo?.totalAccessoriesAmount,
        StitchingDiscAmt: Number(getGroupPaymentInfo?.afterdiscountAmt),
        FabDiscAmt: Number(getGroupPaymentInfo?.discountAmt),
        BasicRate: Number(getGroupPaymentInfo?.basicAmt),
        NetAmount:
          getGroupPaymentInfo?.netPayable == "NaN"
            ? 0
            : Number(getGroupPaymentInfo?.netPayable),
        AdStitching: Number(getGroupPaymentInfo?.afterdiscountAmt),
        AdSTax: Number(getGroupPaymentInfo?.TaxAmt),
        DelAmount: Number(getGroupPaymentInfo?.netPayable),
        SGSTPer: Number(getGroupPaymentInfo?.SGST),
        SGSTAmt: Number(getGroupPaymentInfo?.SGSTAmt),
        CGSTPer: Number(getGroupPaymentInfo?.CGST),
        CGSTAmt: Number(getGroupPaymentInfo?.CGSTAmt),
        IGSTPer: Number(getGroupPaymentInfo?.IGST),
        IGSTAmt: Number(getGroupPaymentInfo?.IGSTAmt),
        DisPer:
          getGroupPaymentInfo?.DiscountPer == "NaN"
            ? 0
            : Number(getGroupPaymentInfo?.DiscountPer),
        DisAmt: Number(getGroupPaymentInfo?.discountAmt),
        TotalAfterDiscount: Number(getGroupPaymentInfo?.afterdiscountAmt),
      };
    
      const response = await axiosClient.post(`oms/v1/addgroupitem`, formdata, {
        headers: {
          token: token,
        },
      });

      dispatch({ type: "ADD_GROUP_ORDER", payload: response.data });
      return response.data;
    } catch (error) {
      // console.log(error);
    }
  };
};

export const generateGroupTOrdDtId = (data) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axiosClient.post(
        `oms/v1/addgroupitem`,
        data,

        {
          headers: {
            token: token,
          },
        }
      );
      dispatch({ type: "ADD_GROUP_ORDER", payload: response.data });

      return response;
    } catch (error) {
      // console.log(error);
    }
  };
};

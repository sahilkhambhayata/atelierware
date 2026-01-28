import { axiosClient } from "./../../axios/axios";
export const AddOrderBook = (
  TOrdDtID,
  TOrdHdID,
  data,
  getDirectPaymentInfo,
  trailDeliveryData
) => {

  return async (dispatch) => {
    try {
      
      const token = localStorage.getItem("token");
      const formdata = {
        TOrdDtID: +TOrdDtID,
        ItemId: +data.ItemId,
        CompanyId: +data.CompanyId,
        BranchId: +data.BranchId,
        TOrdHdID: +TOrdHdID,
        attach_img_1: data.attach_img_1,
        attach_img_2: data.attach_img_2,
        attach_img_3: data.attach_img_3,
        attach_img_4: data.attach_img_4,
        attach_img_5: data.attach_img_5,
        attach_img_6: data.attach_img_6,
        attach_img_7: data.attach_img_7,
        attach_img_8: data.attach_img_8,
        attach_img_9: data.attach_img_9,
        attach_img_10: data.attach_img_10,
        attach_img_1_desc: data.attach_img_1_desc,
        attach_img_2_desc: data.attach_img_2_desc,
        attach_img_3_desc: data.attach_img_3_desc,
        attach_img_4_desc: data.attach_img_4_desc,
        attach_img_5_desc: data.attach_img_5_desc,
        attach_img_6_desc: data.attach_img_6_desc,
        attach_img_7_desc: data.attach_img_7_desc,
        attach_img_8_desc: data.attach_img_8_desc,
        attach_img_9_desc: data.attach_img_9_desc,
        attach_img_10_desc: data.attach_img_10_desc,

        attach_garment_img_1: data.attach_garment_img_1,
        attach_garment_img_2: data.attach_garment_img_2,
        attach_garment_img_3: data.attach_garment_img_3,

        attach_garment_img_1_desc: data.attach_garment_img_1_desc,
        attach_garment_img_2_desc: data.attach_garment_img_2_desc,
        attach_garment_img_3_desc: data.attach_garment_img_3_desc,

        ItemName: data.ItemName,
        PatternAmt: +data.PatternAmt,
        Rate: +getDirectPaymentInfo?.makingAmt,
        DesignAmt: +data.DesignAmt,
        Urgent: trailDeliveryData.priority == "regular" ? false : true,
        DeliveryDate: trailDeliveryData.deliveryDate,
        ItemDesc: data.ItemDesc,
        MainItemId: Number(data.MainItemId),
        AdFabAmt: Number(data.AdFabricAmt),
        AdPattern: Number(data.AdPattern),
        LastUpdateddate: data.LastUpdateddate,
        IsAlteration: data.IsAlteration,
        ItemLocation: data.ItemLocation,
        AdAccessoryAmt: Number(data.AdAccessoriesAmt),
        GroupItem: Number(data.GroupItem),
        DelDate: trailDeliveryData.deliveryDate,
        TrialDate:
          trailDeliveryData.trialDate == null
            ? null
            : trailDeliveryData.trialDate,
        DelMode: data.DelMode,
        DelRemarks: data.DelRemarks,
        DesignerId: Number(data.DesignerId),
        MasterId: Number(data.MasterId),
        DesignDiscAmt: Number(data.DesignDiscAmt),
        AccessoryDiscAmt: Number(data.AccessoriesDisc),
        AdDesignAmt: Number(data.AdDesignAmt),
        Discount:
          getDirectPaymentInfo?.discountAmt == "NaN"
            ? 0
            : getDirectPaymentInfo?.discountAmt,
        Amount: +getDirectPaymentInfo?.Stitching,
        VatPerc: +getDirectPaymentInfo?.vat,
        VatAmt:
          +getDirectPaymentInfo?.vatAmt == "NaN"
            ? 0
            : +getDirectPaymentInfo?.vatAmt,
        STPerc: +getDirectPaymentInfo?.vat,
        STAmt: +getDirectPaymentInfo?.vatAmt,
        MakingAmt: +getDirectPaymentInfo?.makingAmt,
        FabAmt: +getDirectPaymentInfo?.FabricAmt,
        AccessoryAmt: +getDirectPaymentInfo?.AccessoriesAmount,
        StitchingDiscAmt: Number(getDirectPaymentInfo?.StitchingDisc),
        FabDiscAmt: Number(getDirectPaymentInfo?.FabricDisc),
        BasicRate: Number(getDirectPaymentInfo?.basicAmt),
        NetAmount:
          getDirectPaymentInfo?.netPayable == "NaN"
            ? 0
            : Number(getDirectPaymentInfo?.netPayable),
        AdStitching: Number(getDirectPaymentInfo?.AdStitchingAmt),
        AdSTax: Number(getDirectPaymentInfo?.TaxAmt),
        DelAmount: Number(getDirectPaymentInfo?.netPayable),
        SGSTPer: Number(getDirectPaymentInfo?.SGST),
        SGSTAmt: Number(getDirectPaymentInfo?.SGSTAmt),
        CGSTPer: Number(getDirectPaymentInfo?.CGST),
        CGSTAmt: Number(getDirectPaymentInfo?.CGSTAmt),
        IGSTPer: Number(getDirectPaymentInfo?.IGST),
        IGSTAmt: Number(getDirectPaymentInfo?.IGSTAmt),
        DisPer:
          getDirectPaymentInfo?.DiscountPer == "NaN"
            ? 0
            : Number(getDirectPaymentInfo?.DiscountPer),
        DisAmt: Number(getDirectPaymentInfo?.discountAmt),
        TotalAfterDiscount: Number(getDirectPaymentInfo?.afterdiscountAmt),
        Disc_Calculate_On: getDirectPaymentInfo?.TOrd_Disc_Calculate_On,
      };

      

      const response = await axiosClient.post(`oms/v1/addOrderItem`, formdata, {
        headers: {
          token: token,
        },
      });
      return response.data;
    } catch (error) {
      // console.log(error);
    }
  };
};

export const generateTOrdDtId = (data) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axiosClient.post(`oms/v1/addOrderItem`, data, {
        headers: {
          token: token,
        },
      });
      return response;
    } catch (error) {}
  };
};

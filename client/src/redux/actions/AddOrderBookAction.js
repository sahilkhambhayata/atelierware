import { axiosClient } from "./../../axios/axios";
export const AddOrderBook = (
  TOrdDtID,
  TOrdHdID,
  data,
  getDirectPaymentInfo,
  trailDeliveryData
) => {

  return async (dispatch) => {
    const toNum = (val) => {
      const n = Number(val);
      return isNaN(n) ? 0 : n;
    };
    try {

      const token = localStorage.getItem("token");
      const jsonFormData = {
        TOrdDtID: toNum(TOrdDtID),
        ItemId: toNum(data.ItemId),
        CompanyId: toNum(data.CompanyId),
        BranchId: toNum(data.BranchId),
        TOrdHdID: toNum(TOrdHdID),
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
        PatternAmt: toNum(data.PatternAmt),
        Rate: toNum(getDirectPaymentInfo?.makingAmt),
        DesignAmt: toNum(data.DesignAmt),
        Urgent: trailDeliveryData.priority == "regular" ? false : true,
        DeliveryDate: trailDeliveryData.deliveryDate ? new Date(trailDeliveryData.deliveryDate).toISOString().split('T')[0] : null,
        ItemDesc: data.ItemDesc,
        MainItemId: toNum(data.MainItemId),
        AdFabAmt: toNum(data.AdFabricAmt),
        AdPattern: toNum(data.AdPattern),
        LastUpdateddate: data.LastUpdateddate ? new Date(data.LastUpdateddate).toISOString().split('T')[0] : null,
        IsAlteration: data.IsAlteration,
        ItemLocation: data.ItemLocation,
        AdAccessoryAmt: toNum(data.AdAccessoriesAmt),
        GroupItem: toNum(data.GroupItem),
        DelDate: trailDeliveryData.deliveryDate ? new Date(trailDeliveryData.deliveryDate).toISOString().split('T')[0] : null,
        TrialDate:
          trailDeliveryData.trialDate == null
            ? null
            : new Date(trailDeliveryData.trialDate).toISOString().split('T')[0],
        DelMode: data.DelMode,
        DelRemarks: data.DelRemarks,
        DesignerId: toNum(data.DesignerId),
        MasterId: toNum(data.MasterId),
        DesignDiscAmt: toNum(data.DesignDiscAmt),
        AccessoryDiscAmt: toNum(data.AccessoriesDisc),
        AdDesignAmt: toNum(data.AdDesignAmt),
        Discount: toNum(getDirectPaymentInfo?.discountAmt),
        Amount: toNum(getDirectPaymentInfo?.Stitching),
        VatPerc: toNum(getDirectPaymentInfo?.vat),
        VatAmt: toNum(getDirectPaymentInfo?.vatAmt),
        STPerc: toNum(getDirectPaymentInfo?.vat),
        STAmt: toNum(getDirectPaymentInfo?.vatAmt),
        MakingAmt: toNum(getDirectPaymentInfo?.makingAmt),
        FabAmt: toNum(getDirectPaymentInfo?.FabricAmt),
        AccessoryAmt: toNum(getDirectPaymentInfo?.AccessoriesAmount),
        StitchingDiscAmt: toNum(getDirectPaymentInfo?.StitchingDisc),
        FabDiscAmt: toNum(getDirectPaymentInfo?.FabricDisc),
        BasicRate: toNum(getDirectPaymentInfo?.basicAmt),
        NetAmount: toNum(getDirectPaymentInfo?.netPayable),
        AdStitching: toNum(getDirectPaymentInfo?.AdStitchingAmt),
        AdSTax: toNum(getDirectPaymentInfo?.TaxAmt),
        DelAmount: toNum(getDirectPaymentInfo?.netPayable),
        SGSTPer: toNum(getDirectPaymentInfo?.SGST),
        SGSTAmt: toNum(getDirectPaymentInfo?.SGSTAmt),
        CGSTPer: toNum(getDirectPaymentInfo?.CGST),
        CGSTAmt: toNum(getDirectPaymentInfo?.CGSTAmt),
        IGSTPer: toNum(getDirectPaymentInfo?.IGST),
        IGSTAmt: toNum(getDirectPaymentInfo?.IGSTAmt),
        DisPer: toNum(getDirectPaymentInfo?.DiscountPer),
        DisAmt: toNum(getDirectPaymentInfo?.discountAmt),
        TotalAfterDiscount: toNum(getDirectPaymentInfo?.afterdiscountAmt),
        Disc_Calculate_On: getDirectPaymentInfo?.TOrd_Disc_Calculate_On,
      };

      const formdata = new FormData();

      Object.keys(jsonFormData).forEach((key) => {
        if (jsonFormData[key] !== null && jsonFormData[key] !== undefined) {
          formdata.append(key, jsonFormData[key]);
        }
      });



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
    } catch (error) { }
  };
};

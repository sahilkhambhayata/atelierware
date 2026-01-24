import React, { useEffect, useState } from "react";
import InputHelp from "../../../../../Layout/header/dropdown/inputhelp/InputHelp";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import tridateImg from "./../../../../../images/icons/tridateImg.svg";
import deldateImg from "./../../../../../images/icons/deldateImg.svg";
import SpecialIcon from "./../../../../../images/icons/special-icon.svg";
import PriorityIcon from "./../../../../../images/icons/add-order-priority-icon.svg";
import { convertLength } from "@mui/material/styles/cssUtils";
import PaymentInputInfoIcon from "./../../../../../images/icons/payment-input-info-icon.svg";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";

import DatePicker from "react-datepicker";
import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownItem,
  UncontrolledTooltip,
} from "reactstrap";
import { getGroupTrialDeliveryData } from "../../../../../redux/actions/getGroupTrialDeliveryAction";
import { getGroupPaymentInfo } from "../../../../../redux/actions/getGroupPaymentInfoAction";
import { useLocation, useNavigate } from "react-router";
import { getVatSlabData } from "../../../../../redux/actions/VatSlabAction";
import { getBranch } from "../../../../../redux/actions/branchAction";
import { useTheme } from "../../../../../Layout/Provider/Themes";
import Tooltip from "../../../../../Components/Tooltip/Tooltip";
import ToolTipContent from "../../../../../Components/Tooltip/ToolTipContent";
import { getConfig } from "../../../../../redux/actions/configAction";
import { usePermissions } from "../../../../../Layout/Provider/PermissionsContext";

const RightSideDetail = () => {
  const { tabId } = useTheme();
  const symbol = localStorage.getItem("countrySymbol");
  const itemId = localStorage.getItem(`serviceId${tabId}`);
  const BranchId = localStorage.getItem("BranchId");
  const { handleAction } = usePermissions();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const service = useSelector((state) => state.service);
  const selectedItem = service?.singleGroupService?.data?.itemDetails;
  const getConfigData = useSelector((state) => state?.config?.orderType);
  const getBranchData = useSelector((state) => state?.branch?.branch);
  const saleType = useSelector((state) => state?.saleType?.salesType);
  const mood = localStorage.getItem(`mood${tabId}`);
  // const [mood, setMood] = useState();

  const createorddtls = useSelector(
    (state) => state.createorddtls.ordDetails.upCrtOrder
  );
  const singleGroupOrderData = useSelector(
    (state) => state.groupOrderList.single
  );

  const groupData = useSelector(
    (state) => state?.groupOrderList?.single?.orderItemList
  );

  const groupDetails = useSelector(
    (state) => state?.addGroupOrderDetails?.creategroupitem?.GROUPITEM
  );

  const [totalBasicRate, setTotalBasicRate] = useState();
  const BU_Id = localStorage.getItem("BU_Id");

  useEffect(() => {
    if (groupData?.groupItemList?.length > 0) {
      setTotalBasicRate(
        groupData?.groupItemList?.reduce(
          (total, item) =>
            total + (item.Rate !== null ? item.Rate : item.Amount || 0),
          0
        )
      );
    } else {
      setTotalBasicRate(
        groupDetails?.reduce((total, item) => total + (item.BasicRate || 0), 0)
      );
    }
  }, [groupData, groupDetails]);

  const [stitching, setStitching] = useState();
  useEffect(() => {
    setStitching(totalBasicRate);
  }, [totalBasicRate]);
  // const totalBasicRate = groupDetails?.reduce(
  //   (total, item) => total + (item.BasicRate || 0),
  //   0
  // );

  const [fabricAmount, setFabricAmount] = useState();
  const [accessoriesAmount, setAccessoriesAmount] = useState();
  const updatedMakingAmount =
    Object.keys(singleGroupOrderData).length != 0
      ? singleGroupOrderData?.orderItemList?.BasicRate
      : 0;

  const [makingAmt, setMakingAmt] = useState(
    updatedMakingAmount
      ? updatedMakingAmount
      : selectedItem?.BasicRate
      ? selectedItem?.BasicRate
      : 0
  );
  const updatedDiscountAmount =
    Object.keys(singleGroupOrderData).length != 0
      ? singleGroupOrderData?.orderItemList?.Discount
      : 0;

  const [selectedDiscount, setSelectedDiscount] = useState("%");
  const [discountAmount, setDiscountAmount] = useState(
    updatedDiscountAmount ? updatedDiscountAmount : 0
  );

  if (selectedDiscount !== "%") {
    discountAmount === "" ? setDiscountAmount(0) : discountAmount;
  }

  useEffect(() => {
    if (Object.keys(singleGroupOrderData).length !== 0) {
      setMakingAmt(singleGroupOrderData?.orderItemList?.Amount);
      setSelectedDiscount(symbol);
      setDiscountAmount(singleGroupOrderData?.orderItemList?.Discount);
    }
  }, [singleGroupOrderData.orderItemList]);

  useEffect(() => {
    if (Object.keys(singleGroupOrderData).length !== 0) {
      setMakingAmt(singleGroupOrderData?.orderItemList?.Amount);
      setSelectedDiscount(symbol);
      setDiscountAmount(singleGroupOrderData?.orderItemList?.Discount);
    }
  }, []);

  const handleInputChange = (event) => {
    setMakingAmt(event.target.value);
  };

  const EnableInventory =
    getConfigData?.EnableInventory !== null
      ? getConfigData?.EnableInventory
      : null;

  // get VatSlabData Data for  selectedItem
  const VatSlabData = selectedItem?.VatSlabInfo;
  const RoundUpToDecimal =
    getConfigData?.RoundUpToDecimal == 0 ||
    getConfigData?.RoundUpToDecimal == undefined ||
    getConfigData?.RoundUpToDecimal == null
      ? 2
      : getConfigData?.RoundUpToDecimal;

  const TOrd_Disc_Calculate_On =
    getConfigData?.TOrd_Disc_Calculate_On === null
      ? "BASIC_AMOUNT"
      : getConfigData?.TOrd_Disc_Calculate_On.toUpperCase();

  //  findSeleType Dynamic Data /////////
  const findSeleType = saleType?.find((iteem) => {
    return iteem.Id == createorddtls?.SaleTypeId;
  });

  let selectedCompanyCountry = "IN";
  let mystateCode =
    getBranchData?.StateCode !== null ? getBranchData?.StateCode : null;
  let customerStateCode =
    createorddtls?.CustGSTIN === null
      ? mystateCode
      : createorddtls?.CustGSTIN.slice(0, 2);

  let GstType;
  if (selectedCompanyCountry == "IN") {
    GstType = customerStateCode != mystateCode ? "Inter State" : "Intra State";
  } else {
    GstType = "Intra State";
  }
  let SGSTAmt = 0.0;
  let CGSTAmt = 0;
  let IGSTAmt = 0;
  let vatAmt = 0;

  let SGST = VatSlabData?.SGST == null || undefined ? 0 : VatSlabData?.SGST;
  let CGST = VatSlabData?.CGST == null || undefined ? 0 : VatSlabData?.CGST;
  let IGST = VatSlabData?.IGST == null || undefined ? 0 : VatSlabData?.IGST;
  let vat =
    VatSlabData?.VatPercent == null || undefined ? 0 : VatSlabData?.VatPercent;

  const fabAccAmountObject = useSelector((state) => state.getGroupFabAccAmount);

  let FabricAmt = parseFloat(
    fabAccAmountObject.totalFabricAmount == undefined
      ? 0
      : fabAccAmountObject.totalFabricAmount?.toFixed(RoundUpToDecimal)
  );
  let AccessoriesAmount = parseFloat(
    fabAccAmountObject.totalAccessoriesAmount == undefined
      ? 0
      : fabAccAmountObject.totalAccessoriesAmount?.toFixed(RoundUpToDecimal)
  );

  // let stitching = parseFloat(totalBasicRate);

  // const [basicAmt, setBasicAmt] = useState();
  // stitching is discussive after dynamic
  let basicAmt = +(
    parseFloat(stitching) +
    parseFloat(fabricAmount) +
    parseFloat(accessoriesAmount)
  )?.toFixed(RoundUpToDecimal);
  let Stitching = parseFloat(makingAmt);

  let FabricAccessoriesAmt = Number(FabricAmt) + Number(AccessoriesAmount);
  let DiscountType = selectedDiscount;
  let DiscountPer = selectedDiscount === "%" ? discountAmount : 0;

  // discountAmt hendle ////////////////////////////
  let discountAmt = 0;

  if (selectedDiscount === "%") {
    if (discountAmount > 100) {
      toast.error("please Enter valid %");
      setDiscountAmount("");
    } else {
      discountAmt = (basicAmt * DiscountPer) / 100;
    }
  } else if (selectedDiscount === symbol) {
    if (discountAmount > basicAmt) {
      toast.error("please Enter valid  ₹");
      setDiscountAmount("");
    } else {
      if (discountAmount === "") {
        discountAmt = 0;
      } else {
        discountAmt = discountAmount;
      }
    }
  }

  let afterdiscountAmt = basicAmt - discountAmt;
  var TaxAmt = 0;
  var TaxPer = 0;
  let taxableAmount;
  let discountCalculateOn;

  let StitchingDisc;
  let AdStitchingAmt;
  let FabricDisc;
  let AdFabricAmt;
  let AccessoriesDisc;
  let AdAccessoriesAmt;

  switch (TOrd_Disc_Calculate_On) {
    case "BASIC_AMOUNT": {
      FabricDisc = FabricAmt == 0 ? 0 : discountAmt / 3;
      AdFabricAmt = FabricAmt == 0 ? 0 : FabricAmt - FabricDisc;
      StitchingDisc = Stitching == 0 ? 0 : discountAmt / 3;
      AdStitchingAmt = Stitching == 0 ? 0 : Stitching - StitchingDisc;
      AccessoriesDisc = AccessoriesAmount == 0 ? 0 : discountAmt / 3;
      AdAccessoriesAmt =
        AccessoriesAmount == 0 ? 0 : AccessoriesAmount - AccessoriesDisc;
      discountCalculateOn = +basicAmt;
      break;
    }
    case "FABRIC_AMOUNT":
      FabricDisc = FabricAmt == 0 ? 0 : discountAmt;
      AdFabricAmt = FabricAmt == 0 ? 0 : FabricAmt - FabricDisc;
      StitchingDisc = 0;
      AdStitchingAmt = Stitching == 0 ? 0 : Stitching - StitchingDisc;
      AccessoriesDisc = 0;
      AdAccessoriesAmt =
        AccessoriesAmount == 0 ? 0 : AccessoriesAmount - AccessoriesDisc;
      discountCalculateOn = +FabricAmt?.toFixed(RoundUpToDecimal);
      break;
    case "MAKING_AMOUNT":
      FabricDisc = 0;
      AdFabricAmt = FabricAmt == 0 ? 0 : FabricAmt - FabricDisc;
      StitchingDisc = Stitching == 0 ? 0 : discountAmt;
      AdStitchingAmt = Stitching == 0 ? 0 : Stitching - StitchingDisc;
      AccessoriesDisc = 0;
      AdAccessoriesAmt =
        AccessoriesAmount == 0 ? 0 : AccessoriesAmount - AccessoriesDisc;
      discountCalculateOn = +Stitching?.toFixed(RoundUpToDecimal);
      break;
    case "ACCRSSORIES_AMOUNT":
      FabricDisc = 0;
      AdFabricAmt = FabricAmt == 0 ? 0 : FabricAmt - FabricDisc;
      StitchingDisc = 0;
      AdStitchingAmt = Stitching == 0 ? 0 : Stitching - StitchingDisc;
      AccessoriesDisc = AccessoriesAmount == 0 ? 0 : discountAmt;
      AdAccessoriesAmt =
        AccessoriesAmount == 0 ? 0 : AccessoriesAmount - AccessoriesDisc;

      discountCalculateOn = +AccessoriesAmount?.toFixed(RoundUpToDecimal);
      break;
    case "MAKING_+_FABRIC_AMOUNT":
      FabricDisc = FabricAmt == 0 ? 0 : discountAmt / 2;
      AdFabricAmt = FabricAmt == 0 ? 0 : FabricAmt - FabricDisc;
      StitchingDisc = Stitching == 0 ? 0 : discountAmt / 2;
      AdStitchingAmt = Stitching == 0 ? 0 : Stitching - StitchingDisc;
      AccessoriesDisc = 0;
      AdAccessoriesAmt =
        AccessoriesAmount == 0 ? 0 : AccessoriesAmount - AccessoriesDisc;

      discountCalculateOn = +(Stitching + FabricAmt)?.toFixed(RoundUpToDecimal);
      break;
    case "FABRIC_+_ACCRSSORIES_AMOUNT":
      FabricDisc = FabricAmt == 0 ? 0 : discountAmt / 2;
      AdFabricAmt = FabricAmt == 0 ? 0 : FabricAmt - FabricDisc;
      StitchingDisc = 0;
      AdStitchingAmt = Stitching == 0 ? 0 : Stitching - StitchingDisc;
      AccessoriesDisc = AccessoriesAmount == 0 ? 0 : discountAmt / 2;
      AdAccessoriesAmt =
        AccessoriesAmount == 0 ? 0 : AccessoriesAmount - AccessoriesDisc;

      discountCalculateOn = +(FabricAmt + AccessoriesAmount)?.toFixed(
        RoundUpToDecimal
      );
      break;
    case "MAKING_+_ACCRSSORIES_AMOUNT":
      FabricDisc = 0;
      AdFabricAmt = FabricAmt == 0 ? 0 : FabricAmt - FabricDisc;
      StitchingDisc = Stitching == 0 ? 0 : discountAmt / 2;
      AdStitchingAmt = Stitching == 0 ? 0 : Stitching - StitchingDisc;
      AccessoriesDisc = AccessoriesAmount == 0 ? 0 : discountAmt / 2;
      AdAccessoriesAmt =
        AccessoriesAmount == 0 ? 0 : AccessoriesAmount - AccessoriesDisc;

      discountCalculateOn = +(Stitching + AccessoriesAmount)?.toFixed(
        RoundUpToDecimal
      );
      break;
    default:
      discountCalculateOn = +basicAmt;
      break;
  }

  if (selectedDiscount === "%") {
    // discountAmt = +parseFloat(
    //   (discountCalculateOn * DiscountPer) / 100
    // )?.toFixed(RoundUpToDecimal);

    discountAmt = +((discountCalculateOn * DiscountPer) / 100)?.toFixed(
      RoundUpToDecimal
    );
  } else {
    // DiscountPer = +((discountAmount * 100) / discountCalculateOn)?.toFixed(
    //   RoundUpToDecimal
    // );
    // discountAmt = +parseFloat(
    //   (discountCalculateOn * DiscountPer) / 100
    // )?.toFixed(RoundUpToDecimal);

    DiscountPer = +((discountAmount * 100) / discountCalculateOn);
    discountAmt = +((discountCalculateOn * DiscountPer) / 100);
  }

  if (findSeleType?.CalculateOn != "") {
    if (
      findSeleType?.CalculationType == "Including" ||
      findSeleType?.CalculationType == "None"
    ) {
      // if (
      //   findSeleType?.CalculateOn ==
      //   "stitching Charges + Fabric Amount After Discount"
      // )
      //  {
      if (findSeleType?.TaxType == "GST") {
        if (GstType == "Inter State") {
          taxableAmount =
            +parseFloat(basicAmt)?.toFixed(RoundUpToDecimal) -
            +parseFloat(discountAmt)?.toFixed(RoundUpToDecimal);
          IGSTAmt = +parseFloat(
            (IGST * (basicAmt - discountAmt)) / (100 + IGST)
          )?.toFixed(RoundUpToDecimal);
          TaxAmt = IGSTAmt;
          TaxPer = IGST;
          CGSTAmt = +parseFloat(TaxAmt / 2)?.toFixed(RoundUpToDecimal);
          SGSTAmt = +parseFloat(TaxAmt / 2)?.toFixed(RoundUpToDecimal);
        } else if (GstType == "Intra State") {
          TaxPer = +parseFloat(CGST + SGST)?.toFixed(RoundUpToDecimal);

          TaxAmt = +parseFloat(
            // (TaxPer * (basicAmt - discountAmt)) / (100 + TaxPer)
            (TaxPer *
              (+parseFloat(basicAmt)?.toFixed(RoundUpToDecimal) -
                +parseFloat(discountAmt)?.toFixed(RoundUpToDecimal))) /
              (100 + TaxPer)
          )?.toFixed(RoundUpToDecimal);
          CGSTAmt = +parseFloat(TaxAmt / 2)?.toFixed(RoundUpToDecimal);
          SGSTAmt = +parseFloat(TaxAmt / 2)?.toFixed(RoundUpToDecimal);
        }
      } else if (findSeleType?.TaxType == "VAT") {
        vatAmt = +parseFloat(
          (vat *
            (+parseFloat(basicAmt)?.toFixed(RoundUpToDecimal) -
              +parseFloat(discountAmt)?.toFixed(RoundUpToDecimal))) /
            (100 + vat)
        )?.toFixed(RoundUpToDecimal);
        TaxAmt = +parseFloat(vatAmt)?.toFixed(RoundUpToDecimal);
        TaxPer = +parseFloat(vat)?.toFixed(RoundUpToDecimal);
        // }
      }
      taxableAmount =
        +parseFloat(basicAmt)?.toFixed(RoundUpToDecimal) -
        +parseFloat(discountAmt)?.toFixed(RoundUpToDecimal) -
        +parseFloat(TaxAmt)?.toFixed(RoundUpToDecimal);
      // taxableAmount = basicAmt - discountAmt - TaxAmt;
    } else if (findSeleType?.CalculationType == "Excluding") {
      // if (
      //   findSeleType?.CalculateOn ==
      //   "stitching Charges + Fabric Amount After Discount"
      // )
      //  {
      if (findSeleType?.TaxType == "GST") {
        if (GstType == "Inter State") {
          discountAmt = +parseFloat((basicAmt * DiscountPer) / 100)?.toFixed(
            RoundUpToDecimal
          );
          IGSTAmt = +parseFloat(
            (IGST * (basicAmt - discountAmt)) / 100
          )?.toFixed(RoundUpToDecimal);
          TaxAmt = IGSTAmt;
          TaxPer = IGST;
          CGSTAmt = +parseFloat(TaxAmt / 2)?.toFixed(RoundUpToDecimal);
          SGSTAmt = +parseFloat(TaxAmt / 2)?.toFixed(RoundUpToDecimal);
        } else if (GstType == "Intra State") {
          discountAmt = +parseFloat((basicAmt * DiscountPer) / 100)?.toFixed(
            RoundUpToDecimal
          );

          TaxPer = +parseFloat(CGST + SGST)?.toFixed(RoundUpToDecimal);
          TaxAmt = +parseFloat(
            (TaxPer * (basicAmt - discountAmt)) / 100
          )?.toFixed(RoundUpToDecimal);
          CGSTAmt = +parseFloat(TaxAmt / 2)?.toFixed(RoundUpToDecimal);
          SGSTAmt = +parseFloat(TaxAmt / 2)?.toFixed(RoundUpToDecimal);
        }
      } else if (findSeleType?.TaxType == "VAT") {
        discountAmt = +parseFloat((basicAmt * DiscountPer) / 100)?.toFixed(
          RoundUpToDecimal
        );
        vatAmt = +parseFloat((vat * (basicAmt - discountAmt)) / 100)?.toFixed(
          RoundUpToDecimal
        );
        TaxAmt = vatAmt;

        TaxPer = vat;
        // }
      }
      taxableAmount =
        +parseFloat(basicAmt)?.toFixed(RoundUpToDecimal) -
        +parseFloat(discountAmt)?.toFixed(RoundUpToDecimal);
      // taxableAmount = basicAmt - discountAmt;
    }
  } else if (findSeleType?.TaxType == "Tax Free") {
    TaxAmt = 0.0;
    TaxPer = 0.0;
  }

  let netPayable =
    +parseFloat(taxableAmount)?.toFixed(RoundUpToDecimal) +
    +parseFloat(TaxAmt)?.toFixed(RoundUpToDecimal);

  // discount hendle  //////////////////////////

  const handlediscountChange = (event) => {
    setDiscountAmount(event.target.value);
  };

  // dropdown handling //////
  const getcreateorddtls = useSelector(
    (state) => state.createorddtls?.ordDetails?.upCrtOrder
    // (state) => state.getcreateorddtls.ordDetails.upCrtOrder
  );

  const handlediscountSelect = (type) => {
    setSelectedDiscount(type);
    setIsDropdownOpen(false);
    setDiscountAmount("");
  };

  const [advanceData, setAdvanceData] = useState({
    priority: getcreateorddtls?.UrgentType == 1 ? "regular" : "urgent",
    trialDate:
      getcreateorddtls !== undefined
        ? new Date(getcreateorddtls?.TrialDate)
        : new Date(),
    deliveryDate:
      getcreateorddtls !== undefined
        ? new Date(getcreateorddtls?.DelDate)
        : new Date(),
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (Object.keys(singleGroupOrderData).length !== 0) {
      if (singleGroupOrderData.orderItemList) {
        setAdvanceData({
          priority: singleGroupOrderData?.orderItemList?.Urgent
            ? "urgent"
            : "regular",
          trialDate:
            singleGroupOrderData?.orderItemList?.TrialDate == null
              ? null
              : new Date(singleGroupOrderData?.orderItemList?.TrialDate),
          deliveryDate:
            singleGroupOrderData.orderItemList.DelDate == null || undefined
              ? new Date()
              : new Date(singleGroupOrderData?.orderItemList?.DelDate),
        });
      }
    }
  }, [singleGroupOrderData]);

  useEffect(() => {
    dispatch(getGroupTrialDeliveryData(advanceData));
  }, []);

  useEffect(() => {
    dispatch(getGroupTrialDeliveryData(advanceData));
  }, [
    advanceData.trialDate,
    advanceData.deliveryDate,
    advanceData.priority,
    dispatch,
  ]);
  const config = useSelector((state) => state.config?.orderType);

  const dateFormatConfig = getConfigData?.DateAndTime?.split(" ");
  const dateFormatString = dateFormatConfig?.[0] || "MM/dd/yyyy";

  const dateFormat =
  config?.DateAndTime?.replace("true", "HH:mm aa").replace("false", "") ??
  "dd/MM/yyyy HH:mm";

  const handleDataChange = (key, value) => {
    if (key === "trialDate" && value === null) {
      setAdvanceData((prevData) => ({
        ...prevData,
        trialDate: null,
      }));
    }
    setAdvanceData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };


  const updateDateField = (key, selectedDate) => {
    if (!selectedDate) return;

    setAdvanceData((prevData) => {
      const updatedData = { ...prevData };

      const existingDate = updatedData[key] || new Date();
      const newDateTime = new Date(existingDate);

      if (
        existingDate.getHours() === selectedDate.getHours() &&
        existingDate.getMinutes() === selectedDate.getMinutes()
      ) {
        newDateTime.setFullYear(selectedDate.getFullYear());
        newDateTime.setMonth(selectedDate.getMonth());
        newDateTime.setDate(selectedDate.getDate());
      }

      newDateTime.setHours(selectedDate.getHours());
      newDateTime.setMinutes(selectedDate.getMinutes());
      newDateTime.setSeconds(selectedDate.getSeconds());
      newDateTime.setMilliseconds(selectedDate.getMilliseconds());

      updatedData[key] = newDateTime;
      return updatedData;
    });
  };

  const weekend =
    getConfigData?.WeekOff !== (null || undefined)
      ? getConfigData?.WeekOff
      : " N o W EeK OFF";
  const disableMondays = (date) => {
    const weekendUpperCase = weekend?.toUpperCase()?.trim();

    switch (weekendUpperCase) {
      case "SUNDAY":
        return date.getDay() !== 0;
      case "MONDAY":
        return date.getDay() !== 1;
      case "TUESDAY":
        return date.getDay() !== 2;
      case "WEDNESDAY":
        return date.getDay() !== 3;
      case "THURSDAY":
        return date.getDay() !== 4;
      case "FRIDAY":
        return date.getDay() !== 5;
      case "SATURDAY":
        return date.getDay() !== 6;
      case "NOWEEKOFF":
        return true;
      default:
        return true;
    }
  };

  // const [paymentInfoObj, setPaymentInfoObj] = useState({
  //   SGSTAmt: parseFloat(SGSTAmt)?.toFixed(RoundUpToDecimal),
  //   CGSTAmt: parseFloat(CGSTAmt)?.toFixed(RoundUpToDecimal),
  //   IGSTAmt: parseFloat(IGSTAmt)?.toFixed(RoundUpToDecimal),
  //   vatAmt: parseFloat(vatAmt)?.toFixed(RoundUpToDecimal),
  //   SGST: parseFloat(SGST)?.toFixed(RoundUpToDecimal),
  //   CGST: parseFloat(CGST)?.toFixed(RoundUpToDecimal),
  //   IGST: parseFloat(IGST)?.toFixed(RoundUpToDecimal),
  //   vat: parseFloat(vat)?.toFixed(RoundUpToDecimal),
  //   FabricAmt: parseFloat(FabricAmt)?.toFixed(RoundUpToDecimal),
  //   AccessoriesAmount: parseFloat(AccessoriesAmount)?.toFixed(RoundUpToDecimal),
  //   stitching: parseFloat(stitching)?.toFixed(RoundUpToDecimal),
  //   basicAmt: parseFloat(basicAmt)?.toFixed(RoundUpToDecimal),
  //   discountAmt: parseFloat(discountAmt)?.toFixed(RoundUpToDecimal),
  //   afterdiscountAmt: parseFloat(afterdiscountAmt)?.toFixed(RoundUpToDecimal),
  //   TaxAmt: parseFloat(TaxAmt)?.toFixed(RoundUpToDecimal),
  //   TaxPer: parseFloat(TaxPer)?.toFixed(RoundUpToDecimal),
  //   taxableAmount: parseFloat(taxableAmount)?.toFixed(RoundUpToDecimal),
  //   discountCalculateOn: parseFloat(discountCalculateOn)?.toFixed(
  //     RoundUpToDecimal
  //   ),
  //   makingAmt: parseFloat(makingAmt)?.toFixed(RoundUpToDecimal),
  //   netPayable: parseFloat(netPayable)?.toFixed(RoundUpToDecimal),
  //   DiscountPer: parseFloat(DiscountPer)?.toFixed(RoundUpToDecimal),
  // });

  // const paymentInfoObj = ({
  //   SGSTAmt: parseFloat(SGSTAmt)?.toFixed(RoundUpToDecimal),
  //   CGSTAmt: parseFloat(CGSTAmt)?.toFixed(RoundUpToDecimal),
  //   IGSTAmt: parseFloat(IGSTAmt)?.toFixed(RoundUpToDecimal),
  //   vatAmt: parseFloat(vatAmt)?.toFixed(RoundUpToDecimal),
  //   SGST: parseFloat(SGST)?.toFixed(RoundUpToDecimal),
  //   CGST: parseFloat(CGST)?.toFixed(RoundUpToDecimal),
  //   IGST: parseFloat(IGST)?.toFixed(RoundUpToDecimal),
  //   vat: parseFloat(vat)?.toFixed(RoundUpToDecimal),
  //   FabricAmt: parseFloat(FabricAmt)?.toFixed(RoundUpToDecimal),
  //   AccessoriesAmount: parseFloat(AccessoriesAmount)?.toFixed(RoundUpToDecimal),
  //   stitching: parseFloat(stitching)?.toFixed(RoundUpToDecimal),
  //   basicAmt: parseFloat(basicAmt)?.toFixed(RoundUpToDecimal),
  //   discountAmt: parseFloat(discountAmt)?.toFixed(RoundUpToDecimal),
  //   afterdiscountAmt: parseFloat(afterdiscountAmt)?.toFixed(RoundUpToDecimal),
  //   TaxAmt: parseFloat(TaxAmt)?.toFixed(RoundUpToDecimal),
  //   TaxPer: parseFloat(TaxPer)?.toFixed(RoundUpToDecimal),
  //   taxableAmount: parseFloat(taxableAmount)?.toFixed(RoundUpToDecimal),
  //   discountCalculateOn: parseFloat(discountCalculateOn)?.toFixed(
  //     RoundUpToDecimal
  //   ),
  //   makingAmt: parseFloat(makingAmt)?.toFixed(RoundUpToDecimal),
  //   netPayable: parseFloat(netPayable)?.toFixed(RoundUpToDecimal),
  //   DiscountPer: parseFloat(DiscountPer)?.toFixed(RoundUpToDecimal),
  // })

  const [paymentInfoObj, setPaymentInfoObj] = useState({
    SGSTAmt: parseFloat(SGSTAmt)?.toFixed(RoundUpToDecimal),
    CGSTAmt: parseFloat(CGSTAmt)?.toFixed(RoundUpToDecimal),
    IGSTAmt: parseFloat(IGSTAmt)?.toFixed(RoundUpToDecimal),
    vatAmt: parseFloat(vatAmt)?.toFixed(RoundUpToDecimal),
    SGST: parseFloat(SGST)?.toFixed(RoundUpToDecimal),
    CGST: parseFloat(CGST)?.toFixed(RoundUpToDecimal),
    IGST: parseFloat(IGST)?.toFixed(RoundUpToDecimal),
    vat: parseFloat(vat)?.toFixed(RoundUpToDecimal),
    FabricAmt: parseFloat(FabricAmt)?.toFixed(RoundUpToDecimal),
    AccessoriesAmount: parseFloat(AccessoriesAmount)?.toFixed(RoundUpToDecimal),
    stitching: parseFloat(stitching)?.toFixed(RoundUpToDecimal),
    basicAmt: parseFloat(basicAmt)?.toFixed(RoundUpToDecimal),
    discountAmt: parseFloat(discountAmt)?.toFixed(RoundUpToDecimal),
    afterdiscountAmt: parseFloat(afterdiscountAmt)?.toFixed(RoundUpToDecimal),
    TaxAmt: parseFloat(TaxAmt)?.toFixed(RoundUpToDecimal),
    TaxPer: parseFloat(TaxPer)?.toFixed(RoundUpToDecimal),
    taxableAmount: parseFloat(taxableAmount)?.toFixed(RoundUpToDecimal),
    discountCalculateOn: parseFloat(discountCalculateOn)?.toFixed(
      RoundUpToDecimal
    ),
    makingAmt: parseFloat(makingAmt)?.toFixed(RoundUpToDecimal),
    netPayable: parseFloat(netPayable)?.toFixed(RoundUpToDecimal),
    DiscountPer: parseFloat(DiscountPer)?.toFixed(RoundUpToDecimal),
  });

  useEffect(() => {
    setPaymentInfoObj({
      SGSTAmt: parseFloat(SGSTAmt)?.toFixed(RoundUpToDecimal),
      CGSTAmt: parseFloat(CGSTAmt)?.toFixed(RoundUpToDecimal),
      IGSTAmt: parseFloat(IGSTAmt)?.toFixed(RoundUpToDecimal),
      vatAmt: parseFloat(vatAmt)?.toFixed(RoundUpToDecimal),
      SGST: parseFloat(SGST)?.toFixed(RoundUpToDecimal),
      CGST: parseFloat(CGST)?.toFixed(RoundUpToDecimal),
      IGST: parseFloat(IGST)?.toFixed(RoundUpToDecimal),
      vat: parseFloat(vat)?.toFixed(RoundUpToDecimal),
      FabricAmt: parseFloat(FabricAmt)?.toFixed(RoundUpToDecimal),
      AccessoriesAmount: parseFloat(AccessoriesAmount)?.toFixed(
        RoundUpToDecimal
      ),
      stitching: parseFloat(stitching)?.toFixed(RoundUpToDecimal),
      basicAmt: parseFloat(basicAmt)?.toFixed(RoundUpToDecimal),
      discountAmt: parseFloat(discountAmt)?.toFixed(RoundUpToDecimal),
      afterdiscountAmt: parseFloat(afterdiscountAmt)?.toFixed(RoundUpToDecimal),
      TaxAmt: parseFloat(TaxAmt)?.toFixed(RoundUpToDecimal),
      TaxPer: parseFloat(TaxPer)?.toFixed(RoundUpToDecimal),
      taxableAmount: parseFloat(taxableAmount)?.toFixed(RoundUpToDecimal),
      discountCalculateOn: parseFloat(discountCalculateOn)?.toFixed(
        RoundUpToDecimal
      ),
      makingAmt: parseFloat(makingAmt)?.toFixed(RoundUpToDecimal),
      netPayable: parseFloat(netPayable)?.toFixed(RoundUpToDecimal),
      DiscountPer: parseFloat(DiscountPer)?.toFixed(RoundUpToDecimal),
    });
  }, [makingAmt, netPayable]);

  // useEffect(() => {
  //   selectedDiscount === "%" ? setDiscountAmount("") : setDiscountAmount(0);
  // }, [selectedDiscount]);

  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getVatSlabData(selectedItem?.VatSlabId));
    // dispatch(getBranch(BranchId));
    if (BU_Id) {
      dispatch(getConfig(BU_Id));
    }
  }, []);

  useEffect(() => {
    if (paymentInfoObj.SGSTAmt !== "NuN") {
      dispatch(getGroupPaymentInfo(paymentInfoObj));
    }
  }, [paymentInfoObj.netPayable]);

  useEffect(() => {
    const shouldDispatch =
      discountAmount !== undefined &&
      makingAmt !== undefined &&
      fabAccAmountObject !== undefined;

    if (shouldDispatch) {
      dispatch(getGroupPaymentInfo(paymentInfoObj));
    }
  }, [discountAmount, makingAmt, fabAccAmountObject, dispatch]);

  const selectedGroupItem = service?.singleGroupService?.data?.itemDetails;

  useEffect(() => {
    let totalFabSum = 0;
    let totalAccSum = 0;
    groupData?.groupItemList.map((item, i) => {
      const fabArray = item?.fabricList?.filter(
        (val) => val?.ItemType === "Cut Length" || val?.ItemType === "Fabric" || val?.ItemType === "fabric" ||  val?.ItemType === "cut length"
      );

      const totalFabricAmount = fabArray?.reduce((sum, fabric) => {
        const product = fabric.Quantity * fabric.articleDetails.Sale_Rate;

        return sum + product;
      }, 0);

      const accArray = item?.fabricList?.filter(
        (val) => val?.ItemType === "Accessories" || val?.ItemType === "accessories"
      );

      const totalAccAmount = accArray?.reduce((sum, fabric) => {
        const product = fabric.Quantity * fabric.articleDetails.Sale_Rate;

        return sum + product;
      }, 0);

      // setFabricAmount(fabricAmount+totalFabricAmount)
      totalFabSum += totalFabricAmount;
      totalAccSum += totalAccAmount;
    });

    setFabricAmount(totalFabSum);

    setAccessoriesAmount(totalAccSum);
  }, [groupData, singleGroupOrderData]);
  const location = useLocation();

  // const [mood, setMood] = useState();

  // useEffect(() => {
  //   // if (isFromOrderTrackerList || isFromItemTrackerList) {
  //   if (location.state !== null) {
  //     setMood(location.state.mood);
  //   } else {
  //     const data = JSON.parse(localStorage.getItem("orderEditData"));

  //     setMood(data.mood);
  //   }
  //   // }
  // }, [tabId]);
  const handleKeyDown = (e) => {
    if (mood === "view") {
      e.preventDefault();
      toast.error("You have no rights to change");
    }
  };

  

  return (
    <div className="">
      <div className="border rounded-2 p-3 mt-3 mx-1 row fx-column sv-card">
        <div className="text-center custom-border-right col-md-4 col-12 tridate ">
          <div className="d-flex justify-content-center">
            <img src={tridateImg} alt="" width="17px" className="me-1" />
            Trial Date
          </div>
          <span className="fs-14 fw-medium">
            <DatePicker
              className="border-1 fw-medium fs-14 text-center "
              name="trialDate"
              selected={advanceData.trialDate}
              dateFormat={dateFormat}
                showTimeInput={true}
                timeFormat="HH:mm"
              // dateFormat="dd/MM/yyyy"
              // onChange={handleTrailDate}
              minDate={
                getcreateorddtls?.TrialDate != undefined
                  ? getcreateorddtls?.TrialDate
                  : new Date()
              }
              onChange={(date) => updateDateField("trialDate", date)}
              maxDate={advanceData.deliveryDate}
              filterDate={disableMondays}
              placeholderText="Trial Date"
              isClearable
              readOnly={mood === "view"}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              shouldCloseOnSelect={false}
            ></DatePicker>
          </span>
        </div>

        <div className="text-center custom-border-right col-md-4 col-12 deldate ">
          <div className="d-flex justify-content-center">
            <img src={deldateImg} alt="" width="17px" className="me-1" />
            Delivery Date
          </div>
          <span className="fs-14 fw-medium">
            <DatePicker
              className="border-1 fw-medium fs-14 text-center "
              name="deliveryDate"
              selected={advanceData.deliveryDate}
              dateFormat={dateFormat}
               showTimeInput={true}
                timeFormat="HH:mm"
              // dateFormat="dd/MM/yyyy"
              placeholderText="Trial Date"
              // onChange={handleDeliveryDate}
              onChange={(date) => updateDateField("deliveryDate", date)}
              minDate={advanceData.trialDate}
              filterDate={disableMondays}
              readOnly={mood === "view"}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              shouldCloseOnSelect={false}
            ></DatePicker>
          </span>
        </div>

        <div className="text-center col-md-4 col-12 mt-md-0  priority">
          <div className="d-flex justify-content-center">
            <img src={PriorityIcon} alt="" width="17px" className="me-1" />
            priority
          </div>
          <div className="d-flex justify-content-between  col-12 p-0">
            <div className="position-relative nk-header-searchbox w-100">
              {advanceData.priority === "urgent" && (
                <img src={SpecialIcon} alt="" width="12" className="me-2 " />
              )}
              <UncontrolledDropdown className="user-dropdown">
                <DropdownToggle tag="a" className="cursor-pointer">
                  <div className="d-flex text-dark align-items-center">
                    <div className="">
                      <span
                        className={`text-uppercase fs-14 fw-medium ${
                          advanceData.priority === "urgent"
                            ? "text-danger"
                            : "text-dark"
                        }`}
                      >
                        <span> {advanceData.priority}</span>
                      </span>
                    </div>
                  </div>
                </DropdownToggle>

                <DropdownMenu
                  className="dropdown-menu-s1 mt-1"
                  style={{ width: "190px" }}
                >
                  <div className="dropdown-body">
                    <div className="p-2">
                      <ul>
                        {/* {orderType?.map((item, ind) => {
                        return ( */}
                        <DropdownItem
                          className="fw-medium fs-14 d-flex align-items-center cursor-pointer"
                          // onClick={() => handlePriority("regular")}
                          onClick={() =>
                            handleDataChange("priority", "regular")
                          }
                        >
                          <img
                            src={SpecialIcon}
                            alt=""
                            className="opacity-0 mr-2"
                          />
                          Regular
                        </DropdownItem>
                        <DropdownItem
                          className="fw-medium fs-14 text-danger cursor-pointer"
                          // onClick={() => handlePriority("Urgent")}
                          onClick={() => handleDataChange("priority", "Urgent")}
                        >
                          <img src={SpecialIcon} alt="" className="mr-2" />
                          Urgent
                        </DropdownItem>

                        {/* );
                      })} */}
                      </ul>
                    </div>
                  </div>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-2  mt-3 mx-1 row fx-column sv-card">
        <div className=" p-0 p-sm-3 mx-auto">
          <div className="row align-items-center justify-content-between rounded-2 py-2 py-md-0 m-1 m-md-0">
            <div className="d-flex align-items-center col-md-3 col-3 justify-content-start c-col-100">
              <label className="fw-bold  mt-2 mb-2 ">Making</label>{" "}
              <div
                className="ms-2 p-0 w-20px h-20px text-center"
                id="makingAmt"
              >
                <div className="d-flex text-dark">
                  <img
                    src={PaymentInputInfoIcon}
                    alt="PaymentInputInfoIcon"
                    className="img-fluid"
                  />
                </div>
              </div>
              <Tooltip
                id={`makingAmt`}
                direction="right"
                text={ToolTipContent.enterMakingAmount}
              />
            </div>

            <div className="col-md-9 col-9 row align-items-center c-col-100">
              <div className="col-md-3 col-sm-3 col-12 px-0"></div>
              <div className="col-md-1 col-sm-1 col-12 px-0 text-center"></div>
              <div className="col-md-3 col-sm-3 col-12 px-0">
                <InputGroup className="">
                  <InputGroup.Text id="basic-addon1" className="c-padding-ex">
                    {symbol}
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Making"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    className="c-padding text-end"
                    value={totalBasicRate}
                    readOnly={mood === "view"}
                    onKeyDown={handleKeyDown}
                    onChange={handleInputChange}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                    }}
                  />
                </InputGroup>
              </div>
              <div className="col-md-1 col-sm-1 col-12 px-0 text-center">
                <span>=</span>
              </div>
              <div className="col-md-4 col-sm-4 col-12 px-0 ">
                <InputGroup className="w-100">
                  <InputGroup.Text
                    id="basic-addon1"
                    className="w-25 "
                    style={{ backgroundColor: "#c5c5c5" }}
                  >
                    {symbol}
                  </InputGroup.Text>
                  <InputGroup.Text id="basic-addon2" className="w-75">
                    <span className="text-end w-100">
                      {stitching == 0
                        ? "-"
                        : stitching?.toFixed(RoundUpToDecimal) == "NaN"
                        ? 0
                        : stitching?.toFixed(RoundUpToDecimal)}
                    </span>
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </div>
          </div>
          {/* {!EnableInventory &&
        basicAmt !== "" &&
        FabricAmt?.toFixed(RoundUpToDecimal) != 0 &&
        FabricAmt?.toFixed(RoundUpToDecimal) != undefined && ( */}
          <div className="row align-items-center justify-content-between rounded-2 py-2 py-md-0 m-1 m-md-0">
            <div className="d-flex align-items-center col-md-3 col-3 c-col-100">
              <div className="d-flex align-items-center mt-2 mb-2 ">
                <label className="fw-bold mb-0">Fabric</label>
                <div
                  className="ms-2 p-0 w-20px h-20px text-center"
                  id="FabricAmt"
                >
                  <div className="d-flex text-dark">
                    <img
                      src={PaymentInputInfoIcon}
                      alt="PaymentInputInfoIcon"
                      className="img-fluid"
                    />
                  </div>
                </div>
                <Tooltip
                  id={`FabricAmt`}
                  direction="right"
                  text={ToolTipContent.enterFabricAmount}
                />
              </div>
            </div>

            <div className="col-md-9 col-9 row align-items-center c-col-100">
              <div className="col-md-3 col-sm-3 col-12 px-0"></div>
              <div className="col-md-1 col-sm-1 col-12 px-0 text-center"></div>
              <div className="col-md-3 col-sm-3 col-12 px-0"></div>
              <div className="col-md-1 col-sm-1 col-12 px-0 text-center"></div>
              <div className="col-md-4 col-sm-4 col-12 px-0 ">
                <InputGroup className="w-100">
                  <InputGroup.Text
                    id="basic-addon1"
                    className="w-25 "
                    style={{ backgroundColor: "#c5c5c5" }}
                  >
                    {symbol}
                  </InputGroup.Text>
                  <InputGroup.Text id="basic-addon2" className="w-75">
                    {/* {basicAmt === "" ? 0 : FabricAmt?.toFixed(RoundUpToDecimal)} */}

                    <span className="text-end w-100">
                      {/* {basicAmt === 0
                        ? "-"
                        : makingAmt?.toFixed(RoundUpToDecimal)} */}
                      {fabricAmount?.toFixed(RoundUpToDecimal)}
                    </span>
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </div>
          </div>
          {/* )} */}

          {/* {!EnableInventory &&
        basicAmt !== "" &&
        AccessoriesAmount.toFixed(RoundUpToDecimal) != 0 &&
        AccessoriesAmount.toFixed(RoundUpToDecimal) != undefined && ( */}
          <div className="row align-items-center justify-content-between rounded-2 py-2 py-md-0 m-1 m-md-0">
            <div className="d-flex align-items-center col-md-3 col-3 c-col-100">
              <div className="d-flex align-items-center mt-2 mb-2 ">
                <label className="fw-bold mb-0">Accessories</label>{" "}
                <div
                  className="ms-2 p-0 w-20px h-20px text-center"
                  id="AccessoriesAmt"
                >
                  <div className="d-flex text-dark">
                    <img
                      src={PaymentInputInfoIcon}
                      alt="PaymentInputInfoIcon"
                      className="img-fluid"
                    />
                  </div>
                </div>
                <Tooltip
                  id={`AccessoriesAmt`}
                  direction="right"
                  text={ToolTipContent.enterAccessoriesAmount}
                />
              </div>
            </div>

            <div className="col-md-9 col-9 row align-items-center c-col-100">
              <div className="col-md-3 col-sm-3 col-12 px-0"></div>
              <div className="col-md-1 col-sm-1 col-12 px-0 text-center"></div>
              <div className="col-md-3 col-sm-3 col-12 px-0"></div>
              <div className="col-md-1 col-sm-1 col-12 px-0 text-center"></div>
              <div className="col-md-4 col-sm-4 col-12 px-0 ">
                <InputGroup className="w-100">
                  <InputGroup.Text
                    id="basic-addon1"
                    className="w-25 "
                    style={{ backgroundColor: "#c5c5c5" }}
                  >
                    {symbol}
                  </InputGroup.Text>
                  <InputGroup.Text id="basic-addon2" className="w-75">
                    <span className="text-end w-100">
                      {/* {basicAmt === 0
                        ? "-"
                        : makingAmt?.toFixed(RoundUpToDecimal)} */}
                      {accessoriesAmount?.toFixed(RoundUpToDecimal)}
                    </span>
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </div>
          </div>
          {/* )} */}

          <div className="row align-items-center justify-content-between rounded-2 py-2 py-md-0 m-1 m-md-0">
            <div className="d-flex align-items-center col-md-3 col-3 c-col-100">
              <div className="d-flex align-items-center mt-2 mb-2 ">
                <label className="fw-bold mb-0">Discount</label>{" "}
                <div
                  className="ms-2 p-0 w-20px h-20px text-center"
                  id="discounttooltip"
                >
                  <div className="d-flex text-dark">
                    <img
                      src={PaymentInputInfoIcon}
                      alt="PaymentInputInfoIcon"
                      className="img-fluid"
                    />
                  </div>
                </div>
                <Tooltip
                  id={`discounttooltip`}
                  direction="right"
                  text={`Please Enter discount ${
                    selectedDiscount === symbol ? "Amount" : "percent"
                  }`}
                />
              </div>
            </div>

            <div className="col-md-9 col-9 row align-items-center c-col-100">
              <div className="col-md-3 col-sm-3 col-12 px-0"></div>
              <div className="col-md-1  col-sm-1 col-12 px-0 text-center"></div>
              <div className="col-md-3 col-sm-3 col-12 px-0">
                <InputGroup className="">
                  <InputGroup.Text id="basic-addon1" className="c-padding-ex">
                    <UncontrolledDropdown
                      className=" cursor-pointer"
                      id="saleType"
                      isOpen={isDropdownOpen}
                      toggle={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <DropdownToggle
                        tag="span"
                        className="w-100"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        {selectedDiscount}
                      </DropdownToggle>
                      <DropdownMenu
                        className="dropdown-menu-s1 mt-1"
                        style={{ width: "190px" }}
                      >
                        <div className="dropdown-body">
                          <div className="p-2">
                            <ul>
                              <DropdownItem
                                className="fw-medium fs-14 d-flex align-items-center"
                                onClick={() => handlediscountSelect("%")}
                              >
                                %
                              </DropdownItem>
                              <DropdownItem
                                className="fw-medium fs-14 d-flex align-items-center"
                                onClick={() => handlediscountSelect(symbol)}
                              >
                                {symbol}
                              </DropdownItem>
                            </ul>
                          </div>
                        </div>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </InputGroup.Text>
                  <Form.Control
                    placeholder={selectedDiscount === symbol ? "1000" : "10.00"}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    className="c-padding text-end"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                    }}
                    id="BtnBkAnOrderGroupItemDiscAmt"
                    readOnly={mood === "view"}
                    onKeyDown={handleKeyDown}
                    value={discountAmount === 0 ? "" : discountAmount}
                    // onChange={() =>
                    //   handleAction(
                    //     "BtnBkAnOrderGroupItemDiscAmt",
                    //     "action",
                    //     handlediscountChange,
                    //     null

                    //   )
                    // }
                    onChange={handlediscountChange}
                  />
                </InputGroup>
              </div>
              <div className="col-md-1 col-sm-1 col-12 px-0 text-center">
                <span>=</span>
              </div>
              <div className="col-md-4 col-sm-4 col-12 px-0 ">
                <InputGroup className="w-100">
                  <InputGroup.Text
                    id="basic-addon1"
                    className="w-25 "
                    style={{ backgroundColor: "#c5c5c5" }}
                  >
                    {symbol}
                  </InputGroup.Text>
                  <InputGroup.Text id="basic-addon2" className="w-75">
                    <span className="text-end w-100">
                      {/* {basicAmt === 0
                        ? "-"
                        : makingAmt?.toFixed(RoundUpToDecimal)} */}
                      {basicAmt == ""
                        ? 0
                        : discountAmt?.toFixed(RoundUpToDecimal) == "NaN"
                        ? 0
                        : discountAmt?.toFixed(RoundUpToDecimal)}
                    </span>
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </div>
          </div>

          <div className="row align-items-center justify-content-between rounded-2 py-2 py-md-0 m-1 m-md-0">
            <div className="d-flex align-items-center col-md-3 col-3 justify-content-start c-col-100">
              <div className="d-flex align-items-center mt-2 mb-2 ">
                <label className="fw-bold mb-0">Taxable Amount</label>{" "}
                <div
                  className="ms-2 p-0 w-20px h-20px text-center"
                  id="taxableAmounttooltip"
                >
                  <div className="d-flex text-dark">
                    <img
                      src={PaymentInputInfoIcon}
                      alt="PaymentInputInfoIcon"
                      className="img-fluid"
                    />
                  </div>
                </div>
                <Tooltip
                  id={`taxableAmounttooltip`}
                  direction="right"
                  text={ToolTipContent.taxableAmount}
                />
              </div>
            </div>

            <div className="col-md-9 col-9 row align-items-center c-col-100">
              <div className="col-md-3 col-sm-3 col-12 px-0"></div>
              <div className="col-md-1 col-sm-1 col-12 px-0 text-center"></div>
              <div className="col-md-3 col-sm-3 col-12 px-0"></div>
              <div className="col-md-1 col-sm-1 col-12 px-0 text-center">
                <span>=</span>
              </div>
              <div className="col-md-4 col-sm-4 col-12 px-0 ">
                <InputGroup className="w-100">
                  <InputGroup.Text
                    id="basic-addon1"
                    className="w-25 "
                    style={{ backgroundColor: "#c5c5c5" }}
                  >
                    {symbol}
                  </InputGroup.Text>
                  <InputGroup.Text id="basic-addon2" className="w-75">
                    <span className="text-end w-100">
                      {basicAmt == ""
                        ? 0
                        : taxableAmount?.toFixed(RoundUpToDecimal) == "NaN"
                        ? 0
                        : taxableAmount?.toFixed(RoundUpToDecimal)}
                    </span>
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </div>
          </div>

          <div className="row align-items-center justify-content-between rounded-2 py-2 py-md-0 m-1 m-md-0">
            <div className="d-flex align-items-center col-md-3 col-3 justify-content-start c-col-100">
              <div className="d-flex align-items-center mt-2 mb-2 ">
                <label className="fw-bold mb-0">Tax Amount</label>{" "}
                <div
                  className="ms-2 p-0 w-20px h-20px text-center"
                  id="teAmounttooltip"
                >
                  <div className="d-flex text-dark">
                    <img
                      src={PaymentInputInfoIcon}
                      alt="PaymentInputInfoIcon"
                      className="img-fluid"
                    />
                  </div>
                </div>
                <Tooltip
                  id={`teAmounttooltip`}
                  direction="right"
                  text={ToolTipContent.taxAmount}
                />
              </div>
            </div>

            <div className="col-md-9 col-9 row align-items-center c-col-100">
              <div className="col-md-3 col-sm-3 col-12 px-0"></div>
              <div className="col-md-1 col-sm-1 col-12 px-0 text-center"></div>
              <div className="col-md-3 col-sm-3 col-12 px-0">
                {findSeleType?.TaxType != "VAT" ? (
                  <InputGroup className="w-100">
                    <InputGroup.Text
                      id="basic-addon1"
                      className="d-sm-block d-none w-100"
                    >
                      GST @{CGST + SGST}%
                    </InputGroup.Text>
                  </InputGroup>
                ) : (
                  <InputGroup className="w-100">
                    <InputGroup.Text
                      id="basic-addon1"
                      className="d-sm-block d-none w-100"
                    >
                      VAT @{vat}%
                    </InputGroup.Text>
                  </InputGroup>
                )}
              </div>
              <div className="col-md-1 col-sm-1 col-12 px-0 text-center">
                <span>=</span>
              </div>
              <div className="col-md-4 col-sm-4 col-12 px-0 ">
                <InputGroup className="w-100">
                  <InputGroup.Text
                    id="basic-addon1"
                    className="w-25"
                    style={{ backgroundColor: "#c5c5c5" }}
                  >
                    {symbol}
                  </InputGroup.Text>
                  <InputGroup.Text id="basic-addon2" className="w-75">
                    <span className="text-end w-100">
                      {basicAmt == ""
                        ? 0
                        : TaxAmt?.toFixed(RoundUpToDecimal) == "NaN"
                        ? 0
                        : TaxAmt?.toFixed(RoundUpToDecimal)}
                    </span>
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </div>
          </div>
        </div>
        <div className="fw-bold row mx-1 d-flex justify-content-between align-items-center bg-gray10 px-3 mt-2 border rounded-2">
          <span className="fs-6 col-sm-3 col-12 text-center text-sm-start">
            Net Payable
          </span>
          <div className="py-1  col-sm-3  col-12 text-center rounded-2 bg-gray-dark ">
            <span className="fs-5">
              {basicAmt == ""
                ? 0
                : netPayable?.toFixed(RoundUpToDecimal) == "NaN"
                ? 0
                : netPayable?.toFixed(RoundUpToDecimal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSideDetail;

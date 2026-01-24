import React, { useEffect, useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

import InputHelp from "./../../../../../Layout/header/dropdown/inputhelp/InputHelp";
import tridateImg from "./../../../../../images/icons/tridateImg.svg";
import deldateImg from "./../../../../../images/icons/deldateImg.svg";
import SpecialIcon from "./../../../../../images/icons/special-icon.svg";
import PriorityIcon from "./../../../../../images/icons/add-order-priority-icon.svg";
import PaymentInputInfoIcon from "./../../../../../images/icons/payment-input-info-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownItem,
  UncontrolledTooltip,
} from "reactstrap";
import { toast } from "react-toastify";
import { getVatSlabData } from "../../../../../redux/actions/VatSlabAction";
import { getdirectDataAction } from "../../../../../redux/actions/getdirectDataAction";
import { getBranch } from "./../../../../../redux/actions/branchAction";
import { getDirectTrialDeliveryData } from "../../../../../redux/actions/getDirectTrialDeliveryAction";
import { getDirectPaymentInfo } from "../../../../../redux/actions/getDirectPaymentInfoAction";
import { Navigate, useLocation, useNavigate } from "react-router";
import { getConfig } from "../../../../../redux/actions/configAction";
import { getSingleOrderDtlsAsyncData } from "../../../../../redux/actions/createorddtlsAction";
import Tooltip from "../../../../../Components/Tooltip/Tooltip";
import ToolTipContent from "../../../../../Components/Tooltip/ToolTipContent";
import { useTheme } from "../../../../../Layout/Provider/Themes";
import { usePermissions } from "../../../../../Layout/Provider/PermissionsContext";

// import { formatDate, formatTime } from "../../../../../redux/dateFormateFunction";

const RightSideDetail = () => {
  const symbol = localStorage.getItem("countrySymbol");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const { tabId } = useTheme();

  // const [selectedDiscount, setSelectedDiscount] = useState("%");
  // const [discountAmount, setDiscountAmount] = useState("");
  // const TOrdHdID = localStorage.getItem(`TOrdHdID${tabId}`);

  const location = useLocation();
  const dispatch = useDispatch();
  const { handleAction } = usePermissions();

  const isFromGroupPage =
    location.state && location.state.from === "group-page";
  const BranchId = localStorage.getItem("BranchId");
  const BU_Id = localStorage.getItem("BU_Id");

  const service = useSelector((state) => state.service);

  const selectedItem = service?.singleGroupService?.data?.itemDetails;

  const getConfigData = useSelector((state) => state?.config?.orderType);

  const getBranchData = useSelector((state) => state?.branch?.branch);
  const saleType = useSelector((state) => state?.saleType?.salesType);
  const createorddtls = useSelector(
    (state) => state?.createorddtls?.ordDetails?.upCrtOrder
  );

  const singleOrderData = useSelector((state) => state.orderListData.single);
  // const [mood, setMood] = useState();
  const { tabId } = useTheme();
  const mood = localStorage.getItem(`mood${tabId}`);

  const handleKeyDown = (e) => {
    if (mood === "view") {
      e.preventDefault();
      toast.error("You have no rights to change");
    }
  };
  // const mood = localStorage.getItem(`mood${tabId}`);
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

  useEffect(() => {
    if (BU_Id) {
      dispatch(getConfig(BU_Id));
    }
  }, []);

  const trailDeliveryData = useSelector((state) => state?.trialDeliveryDate);
  // makingAmt State
  //for update============================================
  const updatedMakingAmount =
    Object.keys(singleOrderData).length !== 0
      ? singleOrderData?.orderItemList?.[0]?.BasicRate -
        singleOrderData?.orderItemList?.[0]?.FabAmt
      : 0;
  const [makingAmt, setMakingAmt] = useState(
    updatedMakingAmount
      ? updatedMakingAmount
      : selectedItem?.BasicRate
      ? selectedItem?.BasicRate
      : 0
  );

  const updatedDiscountAmount =
    Object.keys(singleOrderData).length != 0
      ? singleOrderData?.orderItemList?.Discount
      : 0;

  const [selectedDiscount, setSelectedDiscount] = useState("%");
  const [discountAmount, setDiscountAmount] = useState(
    updatedDiscountAmount ? updatedDiscountAmount : 0
  );

  useEffect(() => {
    setMakingAmt(selectedItem?.BasicRate ? selectedItem?.BasicRate : 0);
    // setDiscountAmount(selectedItem?.BasicRate ? selectedItem?.BasicRate : 0)
  }, [selectedItem]);

  if (selectedDiscount !== "%") {
    discountAmount === "" ? setDiscountAmount(0) : discountAmount;
  }

  const handleInputChange = (event) => {
    setMakingAmt(event.target.value);
  };

  const EnableInventory =
    getConfigData?.EnableInventory !== null || undefined
      ? getConfigData?.EnableInventory
      : null;

  const VatSlabData = selectedItem?.VatSlabInfo;

  const RoundUpToDecimal =
    getConfig?.RoundUpToDecimal == 0 ||
    getConfig?.RoundUpToDecimal == undefined ||
    getConfig?.RoundUpToDecimal == null
      ? 2
      : getConfigData?.RoundUpToDecimal;

  const TOrd_Disc_Calculate_On =
    getConfigData?.TOrd_Disc_Calculate_On === null || undefined
      ? "BASIC_AMOUNT"
      : getConfigData?.TOrd_Disc_Calculate_On.toUpperCase();

  const findSeleType = saleType?.find((iteem) => {
    return iteem.Id == createorddtls?.SaleTypeId;
  });

  const fabAccAmountObject = useSelector((state) => state.getFabAccAmount);

  // selectedCompanyCountry IN   hendle ////////////////////////////

  let selectedCompanyCountry = "IN";
  let mystateCode =
    getBranchData?.StateCode !== null || undefined
      ? getBranchData?.StateCode
      : null;
  let customerStateCode =
    createorddtls?.CustGSTIN === null || undefined
      ? mystateCode
      : createorddtls?.CustGSTIN.slice(0, 2);

  let GstType;
  if (selectedCompanyCountry == "IN") {
    GstType = customerStateCode != mystateCode ? "Inter State" : "Intra State";
  } else {
    GstType = "Intra State";
  }
  const isFromGroupOrderPage =
    location.state && location.state.from == "group-page";
  let SGSTAmt = 0.0;
  let CGSTAmt = 0;
  let IGSTAmt = 0;
  let vatAmt = 0;
  let SGST = VatSlabData?.SGST == null || undefined ? 0 : VatSlabData?.SGST;
  let CGST = VatSlabData?.CGST == null || undefined ? 0 : VatSlabData?.CGST;
  let IGST = VatSlabData?.IGST == null || undefined ? 0 : VatSlabData?.IGST;
  let vat =
    VatSlabData?.VatPercent == null || undefined ? 0 : VatSlabData?.VatPercent;

  let FabricAmt = parseFloat(
    fabAccAmountObject.totalFabricAmount == undefined
      ? 0
      : fabAccAmountObject.totalFabricAmount
  ); //fabricAmt amt is static  after dynamic   not veluble 0
  let AccessoriesAmount = parseFloat(
    fabAccAmountObject.totalAccessoriesAmount == undefined
      ? 0
      : fabAccAmountObject.totalAccessoriesAmount
  ); // Accesorus amt is static  after dynamic not veluble 0
  let Stitching = parseFloat(makingAmt); // Stitching is discussive after dynamic
  let basicAmt = isFromGroupOrderPage
    ? +(parseFloat(FabricAmt) + parseFloat(AccessoriesAmount))?.toFixed(
        RoundUpToDecimal
      )
    : +(
        parseFloat(Stitching) +
        parseFloat(FabricAmt) +
        parseFloat(AccessoriesAmount)
      )?.toFixed(RoundUpToDecimal);
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
      //   "Stitching Charges + Fabric Amount After Discount"
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
          CGSTAmt = 0;
          SGSTAmt = 0;
          // CGSTAmt = +parseFloat(TaxAmt / 2)?.toFixed(RoundUpToDecimal);
          // SGSTAmt = +parseFloat(TaxAmt / 2)?.toFixed(RoundUpToDecimal);
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
      //   "Stitching Charges + Fabric Amount After Discount"
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
          CGSTAmt = 0;
          SGSTAmt = 0;
          // CGSTAmt = +parseFloat(TaxAmt / 2)?.toFixed(RoundUpToDecimal);
          // SGSTAmt = +parseFloat(TaxAmt / 2)?.toFixed(RoundUpToDecimal);
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

  const handlediscountSelect = (type) => {
    setSelectedDiscount(type);
    setIsDropdownOpen(false);
    setDiscountAmount("");
  };

  const getcreateorddtls = useSelector(
    (state) => state.createorddtls?.ordDetails?.upCrtOrder
    // (state) => state.getcreateorddtls.ordDetails.upCrtOrder
  );

  const [advanceData, setAdvanceData] = useState({
    priority: getcreateorddtls?.UrgentType == 1 ? "regular" : "urgent",
    // trialDate:new Date(),
    // deliveryDate:new Date(),
    trialDate:
      getcreateorddtls !== undefined
        ? new Date(getcreateorddtls?.TrialDate)
        : new Date(),
    deliveryDate:
      getcreateorddtls !== undefined
        ? new Date(getcreateorddtls?.DelDate)
        : new Date(),
  });

  useEffect(() => {
    if (Object.keys(singleOrderData).length !== 0) {
      if (singleOrderData.orderItemList[0]) {
        setAdvanceData({
          priority: singleOrderData?.orderItemList?.[0]?.Urgent
            ? "urgent"
            : "regular",
          trialDate:
            singleOrderData?.orderItemList?.[0]?.TrialDate == null || undefined
              ? null
              : new Date(singleOrderData?.orderItemList?.[0]?.TrialDate),
          deliveryDate:
            singleOrderData?.orderItemList?.[0]?.DelDate == null || undefined
              ? new Date()
              : new Date(singleOrderData?.orderItemList?.[0]?.DelDate),
        });
      }
    }
  }, [singleOrderData]);

  useEffect(() => {
    dispatch(getDirectTrialDeliveryData(advanceData));
  }, []);

  useEffect(() => {
    dispatch(getDirectTrialDeliveryData(advanceData));
  }, [
    advanceData.trialDate,
    advanceData.deliveryDate,
    advanceData.priority,
    dispatch,
  ]);

  const handleDataChange = (key, value) => {
    if ((key === "trialDate" && value === null) || undefined) {
      setAdvanceData((prevData) => ({
        ...prevData,
        trialDate: null,
      }));
    }
    setAdvanceData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
    // if (key === "trialDate") {
    //   // Check if value is null (user cleared the DatePicker)
    //   if (value === null) {
    //     setAdvanceData((prevData) => ({
    //       ...prevData,
    //       trialDate: null,
    //     }));
    //     return; // Exit early if value is null
    //   }

    //   // Format the date before setting it in the state
    //   const formattedDate = formatDate(new Date(value), "dd/mmm/yyyy");

    //   // Update state with the formatted date
    //   setAdvanceData((prevData) => ({
    //     ...prevData,
    //     trialDate: new Date(formattedDate),
    //   }));
    // } else {
    //   // For other keys, simply update the state with the provided value
    //   setAdvanceData((prevData) => ({
    //     ...prevData,
    //     [key]: value,
    //   }));
    // }
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

  // const handleDeliveryChange = (key, value) => {

  //   setAdvanceData((prevData) => ({
  //     ...prevData,
  //     [key]: value,
  //   }));

  // };

  const weekend =
    getConfigData?.WeekOff !== (null || undefined)
      ? getConfigData?.WeekOff
      : " N o W EeK OFF";
  const disableMondays = (date) => {
    const weekendUpperCase = weekend?.toUpperCase().trim();

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
    Stitching: parseFloat(Stitching)?.toFixed(RoundUpToDecimal),
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
    DiscountPer: +parseFloat(DiscountPer)?.toFixed(RoundUpToDecimal),
    //  only for Add , Not Show to frontend
    StitchingDisc,
    AdStitchingAmt,
    FabricDisc,
    AdFabricAmt,
    AccessoriesDisc,
    AdAccessoriesAmt,
    // for new Add
    TOrd_Disc_Calculate_On,
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
      Stitching: parseFloat(Stitching)?.toFixed(RoundUpToDecimal),
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
      DiscountPer: +parseFloat(DiscountPer)?.toFixed(RoundUpToDecimal),
      //  only for Add , Not Show to frontend
      StitchingDisc,
      AdStitchingAmt,
      FabricDisc,
      AdFabricAmt,
      AccessoriesDisc,
      AdAccessoriesAmt,
      // for new Add
      TOrd_Disc_Calculate_On,
    });
  }, [makingAmt, netPayable]);

  useEffect(() => {
    if (isFromGroupPage) {
      setPaymentInfoObj({
        SGSTAmt: 0,
        CGSTAmt: 0,
        IGSTAmt: 0,
        vatAmt: 0,
        SGST: 0,
        CGST: 0,
        IGST: 0,
        vat: 0,
        FabricAmt: parseFloat(FabricAmt)?.toFixed(RoundUpToDecimal),
        AccessoriesAmount: parseFloat(AccessoriesAmount)?.toFixed(
          RoundUpToDecimal
        ),
        Stitching: 0,
        basicAmt: makingAmt,
        discountAmt: 0,
        afterdiscountAmt: 0,
        TaxAmt: 0,
        TaxPer: 0,
        taxableAmount: 0,
        discountCalculateOn: 0,
        makingAmt: 0,
        netPayable: 0,
        DiscountPer: +0,
        //  only for Add , Not Show to frontend
        StitchingDisc,
        AdStitchingAmt,
        FabricDisc,
        AdFabricAmt,
        AccessoriesDisc,
        AdAccessoriesAmt,
        // for new Add
        TOrd_Disc_Calculate_On,
      });
    }
  }, []);
  // useEffect(() => {
  //   selectedDiscount === "%" ? setDiscountAmount("") : setDiscountAmount(0);
  // }, [selectedDiscount]);

  const navigate = useNavigate();
  const config = useSelector((state) => state.config?.orderType);

  const dateFormatConfig = getConfigData?.DateAndTime?.split(" ");
  const dateFormat =
  config?.DateAndTime?.replace("true", "HH:mm aa").replace("false", "") ??
  "dd/MM/yyyy HH:mm";

  useEffect(() => {
    // dispatch(getVatSlabData(selectedItem.VatSlabId));
    // dispatch(getBranch(BranchId)).then((res) => {});
    if (BU_Id) {
      dispatch(getConfig(BU_Id));
    }
  }, []);

  // static send data to singleOrderBook

  useEffect(() => {
    dispatch(getDirectPaymentInfo(paymentInfoObj));
  }, [paymentInfoObj.netPayable]);

  useEffect(() => {
    dispatch(getDirectPaymentInfo(paymentInfoObj));
  }, [discountAmount, makingAmt, fabAccAmountObject]);

  useEffect(() => {
    if (Object.keys(singleOrderData).length !== 0) {
      setMakingAmt(singleOrderData?.orderItemList?.[0]?.Amount);
      setSelectedDiscount(symbol);
      setDiscountAmount(singleOrderData?.orderItemList?.[0]?.Discount);
      // setAdvanceData({
      //   priority: singleOrderData?.orderItemList?.[0]?.Urgent
      //     ? "Urgent"
      //     : "Regular",
      //   trialDate: new Date(singleOrderData?.orderItemList?.[0]?.TrialDate),
      //   deliveryDate: new Date(singleOrderData?.orderItemList?.[0]?.DelDate),
      // });
    }
  }, [singleOrderData]);

  useEffect(() => {
    if (Object.keys(singleOrderData).length !== 0) {
      setMakingAmt(singleOrderData?.orderItemList?.[0]?.Amount);
      setSelectedDiscount(symbol);
      setDiscountAmount(singleOrderData?.orderItemList?.[0]?.Discount);
      // setAdvanceData({
      //   priority: singleOrderData?.orderItemList?.[0]?.Urgent
      //     ? "Urgent"
      //     : "Regular",
      //   trialDate: new Date(singleOrderData?.orderItemList?.[0]?.TrialDate),
      //   deliveryDate: new Date(singleOrderData?.orderItemList?.[0]?.DelDate),
      // });
    }
  }, []);

  // const totalSeconds = 3643;
  // const formattedTime12Hour = formatTime(advanceData.trialDate, true); // 12-hour format
  // const formattedTime24Hour = formatTime(advanceData.trialDate); // 24-hour format

  return (
    <div>
      {!isFromGroupPage && (
        <div className="border rounded-2 p-3 mt-3 mx-1 row fx-column sv-card">
          {/* <div>
          <div>
            <p>Formatted Time (12-hour): {formattedTime12Hour}</p>
            <p>Formatted Time (24-hour): {formattedTime24Hour}</p>
          </div>
        </div> */}
          <div className="text-center custom-border-right col-md-4 col-12 tridate ">
            <div className="d-flex justify-content-center">
              <img src={tridateImg} alt="" width="17px" className="me-1" />
              Trial Date
            </div>
            <span className="fs-14 fw-medium custom-isclearable">
              <DatePicker
                className="border-1 fw-medium fs-14 text-center "
                name="trialDate"
                selected={advanceData.trialDate}
                dateFormat={dateFormat}
                showTimeInput={true}
                timeFormat="HH:mm"
                minDate={
                  getcreateorddtls?.TrialDate != undefined
                    ? getcreateorddtls?.TrialDate
                    : new Date()
                }
                readOnly={mood === "view"}
                onKeyDown={handleKeyDown}
                // dateFormat={getConfigData?.DateAndTime?.split(" ")}
                // dateFormat={formatDate(advanceData.trialDate, "MMM DD,yyyy")}
                // onChange={handleTrailDate}
                onChange={(date) => {
                  updateDateField("trialDate", date);
                }}
                maxDate={advanceData.deliveryDate}
                filterDate={disableMondays}
                placeholderText="Trial Date"
                isClearable
                autoComplete="off"
                shouldCloseOnSelect={false}
                // isClearable
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
                // dateFormat={getConfigData?.DateAndTime?.split(" ")}
                // dateFormat="dd/MM/yyyy"
                readOnly={mood === "view"}
                onKeyDown={handleKeyDown}
                placeholderText="Trial Date"
                // onChange={handleDeliveryDate}
                onChange={(date) => updateDateField("deliveryDate", date)}
                minDate={advanceData.trialDate}
                filterDate={disableMondays}
                autoComplete="off"
                shouldCloseOnSelect={false}
              ></DatePicker>
            </span>
          </div>

          <div className="text-center col-md-4 col-12 mt-md-0  priority">
            <div className="d-flex justify-content-center">
              <img src={PriorityIcon} alt="" width="17px" className="me-1" />
              Priority
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
                            onClick={() =>
                              handleDataChange("priority", "urgent")
                            }
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
      )}

      <div
        className={` mt-3 mx-1 row fx-column sv-card ${
          !isFromGroupPage ||
          (isFromGroupPage && (FabricAmt > 0 || AccessoriesAmount > 0))
            ? "border rounded-2"
            : ""
        }`}
      >
        <div className="p-0 p-sm-3 mx-auto ">
          {/* {!isFromGroupPage && ( */}
          <div className="row align-items-center justify-content-between rounded-2 py-2 py-md-0 m-1 m-md-0">
            <div className="d-flex align-items-center col-md-3 col-3  justify-content-start c-col-100">
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

            <div className="col-md-9 col-9  row align-items-center c-col-100">
              <div className="col-md-3 col-sm-3 col-12 px-0"></div>
              <div className="col-md-1 col-sm-1 col-12 px-0 text-center"></div>
              <div className="col-md-3 col-sm-3 col-12 px-0">
                <InputGroup className="">
                  <InputGroup.Text id="basic-addon1" className="c-padding-ex">
                    {symbol}
                  </InputGroup.Text>
                  <Form.Control
                    id="EditBkAnOrderEditMakingAmt"
                    placeholder="Making"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    className="c-padding text-end"
                    value={makingAmt}
                    readOnly={mood === "view"}
                    onKeyDown={handleKeyDown}
                    // onChange={() =>
                    //   handleAction(
                    //     "changeOrdRegMakeAmt",
                    //     "action",
                    //     handleInputChange,
                    //     null

                    //   )
                    // }
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
                      {makingAmt == 0
                        ? "-"
                        : makingAmt == "NaN"
                        ? 0
                        : makingAmt}
                    </span>
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </div>
          </div>
          {/* )} */}

          {EnableInventory == 1 &&
            basicAmt !== "" &&
            FabricAmt?.toFixed(RoundUpToDecimal) != 0 &&
            FabricAmt?.toFixed(RoundUpToDecimal) != undefined && (
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
                        <span className="text-end w-100">
                          {basicAmt == ""
                            ? 0
                            : FabricAmt?.toFixed(RoundUpToDecimal)}
                          {/* {basicAmt === 0 ? "-" : makingAmt} */}
                        </span>
                      </InputGroup.Text>
                    </InputGroup>
                  </div>
                </div>
              </div>
            )}

          {EnableInventory == 1 &&
            basicAmt !== "" &&
            AccessoriesAmount?.toFixed(RoundUpToDecimal) != 0 &&
            AccessoriesAmount?.toFixed(RoundUpToDecimal) != undefined && (
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
                          {basicAmt == ""
                            ? 0
                            : AccessoriesAmount?.toFixed(RoundUpToDecimal)}
                        </span>
                      </InputGroup.Text>
                    </InputGroup>
                  </div>
                </div>
              </div>
            )}

          {!isFromGroupPage && (
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
                      placeholder={
                        selectedDiscount === symbol ? "1000" : "10.00"
                      }
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="c-padding text-end"
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                      }}
                      id="EditBkAnOrderUpdateDiscAmt"
                      value={discountAmount === 0 ? "" : discountAmount}
                      readOnly={mood === "view"}
                      onKeyDown={handleKeyDown}
                      // onClick={() =>
                      //   handleAction(
                      //     "EditBkAnOrderUpdateDiscAmt",
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
          )}

          {!isFromGroupPage && (
            <div className="row align-items-center justify-content-between rounded-2 py-2 py-md-0 m-1 m-md-0">
              <div className="d-flex align-items-center col-md-3 col-3  c-col-100">
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
                <div className="col-md-1 col-sm-1 col-12 px-0 text-center"></div>
                {/* <div className="col-md-1 col-sm-1 col-12 px-0 text-center">
                  <span>=</span>
                </div> */}
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
          )}

          {!isFromGroupPage && (
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
                <div className="col-md-3 col-sm-3 col-12 px-0 position-relative">
                  {findSeleType?.TaxType != "VAT" ? (
                    <InputGroup className="w-100">
                      <InputGroup.Text id="basic-addon1" className=" w-100">
                        GST @{CGST + SGST}%
                      </InputGroup.Text>
                    </InputGroup>
                  ) : (
                    <InputGroup className="w-100">
                      <InputGroup.Text id="basic-addon1" className=" w-100">
                        VAT @{vat}%
                      </InputGroup.Text>
                    </InputGroup>
                  )}

                  <div className=" text-center  w-100  GstType-position">
                    <span className="cust-fs-12 border border-1 py-0 p-1 mt-1 text-uppercase">
                      {GstType}
                    </span>
                  </div>
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
                        {/* {basicAmt === 0 ? "-" : makingAmt} */}

                        {basicAmt == ""
                          ? 0
                          : TaxAmt?.toFixed(RoundUpToDecimal) == "NaN"
                          ? 0
                          : TaxAmt?.toFixed(RoundUpToDecimal)}
                        {/* {basicAmt == "" ? 0 : TaxAmt?.toFixed(RoundUpToDecimal)} */}
                      </span>
                    </InputGroup.Text>
                  </InputGroup>
                </div>
              </div>
            </div>
          )}
        </div>

        {!isFromGroupPage && (
          <div className="fw-bold row mx-1 mr-5 justify-content-between c-col-90 align-items-center bg-gray10 px-3 mt-2 border rounded-2">
            <span className="fs-6 col-sm-8 c-col-70 col-12 text-center text-sm-start">
              Net Payable
            </span>
            <div className="py-1  col-sm-3 c-col-30 col-12 text-center rounded-2 bg-gray-dark ">
              <span className="fs-5">
                {basicAmt === ""
                  ? 0
                  : netPayable?.toFixed(RoundUpToDecimal) == "NaN"
                  ? 0
                  : netPayable?.toFixed(RoundUpToDecimal)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSideDetail;

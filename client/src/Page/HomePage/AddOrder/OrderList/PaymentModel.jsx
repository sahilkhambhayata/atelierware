import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { Button, Spinner } from "reactstrap";
import { useForm } from "react-hook-form";
import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownItem,
  Form,
  UncontrolledTooltip,
} from "reactstrap";
import CashPaymentIcon from "../../../../images/icons/cashpayment-icon.svg";
import WalletPaymentIcon from "../../../../images/icons/wallet-icon.svg";
import BankPaymentIcon from "../../../../images/icons/bank-icon.svg";
import CodPaymentIcon from "../../../../images/icons/cod-icon.svg";
import CashPaymentIcon1 from "../../../../images/icons/cashpayment-icon1.svg";
import WalletPaymentIcon1 from "../../../../images/icons/wallet-icon1.svg";
import BankPaymentIcon1 from "../../../../images/icons/bank-icon1.svg";
import CodPaymentIcon1 from "../../../../images/icons/cod-icon1.svg";
import paymentIcon from "../../../../images/icons/paymentIcon.svg";

import Icon from "./../../../../Components/icon/Icon";
import balanceIcon from "../../../../images/icons/balanceIcon.svg";
import PaymentInputInfoIcon from "../../../../images/icons/payment-input-info-icon.svg";
import PaymentEditIcon from "../../../../images/icons/payment-edit-icon.svg";
import PaymentDeleteIcon from "../../../../images/icons/payment-delete-icon.svg";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentMethod } from "../../../../redux/actions/paymentMethodAction";
import { getPaymentData } from "../../../../redux/actions/getPaymentDataAction";
import NetPayableData from "./NetPayableData";
import {
  payOnDeliverySubmit,
  paymentSubmit,
} from "../../../../redux/actions/paymentSubmitAction";
import { toast } from "react-toastify";
import { Link } from "@mui/material";
import { useTheme } from "../../../../Layout/Provider/Themes";
import Tooltip from "../../../../Components/Tooltip/Tooltip";

const PaymentModel = ({
  onPaymentMethod,
  onPaymentModal,
  onPaymentDelete,
  onForm,
  onSummary,
}) => {
  const { tabId } = useTheme();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  // const paymentDetails = useSelector((state) => state.paymentDetails);
  const paymentDetails = useSelector((state) => state.paymentDetails);
  let orderList = useSelector((state) => state.groupOrderList);
  // let orderList = useSelector((state) => state.groupOrderList);
  const branch = useSelector((state) => state.branch?.branch);
  const [isPayOnDeliveryLoader, setIsPayOnDeliveryLoader] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const getConfig = useSelector((state) => state?.config?.orderType);
  const symbol = localStorage.getItem("countrySymbol");
  const RoundUpToDecimal =
    getConfig?.RoundUpToDecimal == 0 ||
    getConfig?.RoundUpToDecimal == undefined ||
    getConfig?.RoundUpToDecimal == null
      ? 2
      : getConfig?.RoundUpToDecimal;

  const [cashDetails, setCashDetails] = useState({
    accountName: "",
    accountId: "",
    amount: 0,
  });

  const [discountDetails, setDiscountDetials] = useState({
    discountReason: "Cash Discount",
    discountAmount: 0,
  });
  const getCurrentDate = () => {
    const currentDate = new Date();
    return currentDate.toISOString().split("T")[0]; // Get YYYY-MM-DD format
  };
  const [walletDetails, setWalletDetails] = useState({
    walletAccountName: "",
    walletAccountId: "",
    walletAmount: 0,
    walletChannelId: "",
    walletChannelName: "",
    walletTransaction: "",
    walletTransactionDate: getCurrentDate(),
  });

  const [bankDetails, setBankDetails] = useState({
    bankAccountName: "",
    bankAccountId: "",
    bankAmount: 0,
    bankChannelId: "",
    bankChannelName: "",
    bankTransaction: "",
    bankTransactionDate: getCurrentDate(),
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownChannel, setIsDropdownChannel] = useState(false);

  const { accountName, accountId, amount } = cashDetails;
  const {
    walletAccountName,
    walletAccountId,
    walletAmount,
    walletChannelId,
    walletChannelName,
    walletTransaction,
    walletTransactionDate,
  } = walletDetails;

  const {
    bankAccountName,
    bankAccountId,
    bankAmount,
    bankChannelId,
    bankChannelName,
    bankTransaction,
    bankTransactionDate,
  } = bankDetails;

  const { discountReason, discountAmount } = discountDetails;
  const handlePaymentMethodChange = (value) => {
    onPaymentMethod(value);
    setPaymentMethod(value);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const BU_ID = localStorage.getItem("BU_Id");
    dispatch(getPaymentMethod(BU_ID));
  }, []);

  const navigate = useNavigate();

  const closePaymentModal = () => {
    onPaymentModal(false);
    // navigate("/invoice");
    setCashDetails({
      accountName: "",
      accountId: "",
      amount: 0,
    });
    setWalletDetails({
      walletAccountName,
      walletAccountId,
      walletAmount,
      walletChannelId,
      walletChannelName,
      walletTransaction,
      walletTransactionDate,
    });
    setBankDetails({
      bankAccountName: "",
      bankAccountId: "",
      bankAmount: 0,
      bankChannelId: "",
      bankChannelName: "",
      bankTransaction: "",
      bankTransactionDate: "",
    });

    setDiscountDetials({
      discountReason: "",
      discountAmount: null,
    });
  };

  const [help, setHelp] = useState({
    cashHelp: false,
    walletHelp: false,
    BankHelp: false,
    accountNameHelp: false,
    amountHelp: false,
    channelHelp: false,
    transactionHelp: false,
    transactionDateHelp: false,
  });

  const [displaySummary, setDisplaySummary] = useState(false);
  const [displayForm, setDisplayForm] = useState(true);

  // const handleAddPayment = (value) => {
  //   if (Number(data.amount) < 5000) {
  //     onSummary(true);
  //     setDisplaySummary(true);
  //   } else if (Number(data.amount) === 5000) {
  //     onForm(false);
  //     onSummary(true);
  //     setDisplayForm(false);
  //     setDisplaySummary(true);
  //   }
  // };

  const paymentMethodDetails = useSelector(
    (state) => state.paymentMethodData.financialData
  );

  const cashData = paymentMethodDetails?.filter((item) => item.GroupId === 11);
  const walletData = paymentMethodDetails?.filter(
    (item) => item.GroupId === 44
  );
  const bankData = paymentMethodDetails?.filter((item) => item.GroupId === 12);

  const handleCashChange = (key, value, item) => {
    if (key === "accountName") {
      setCashDetails((prevData) => ({
        ...prevData,
        accountId: item.AccountId,
      }));
    }

    if (key === "ChannelName") {
      setCashDetails((prevData) => ({
        ...prevData,
        ChannelId: item.ChannelId,
      }));
    }

    setCashDetails((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleWalletChange = (key, value, item) => {
    if (key === "walletAccountName") {
      setWalletDetails((prevData) => ({
        ...prevData,
        walletAccountId: item.AccountId,
      }));
    }

    if (key === "walletChannelName") {
      setWalletDetails((prevData) => ({
        ...prevData,
        walletChannelId: item.ChannelId,
        walletChannelName: item.ChannelName,
      }));
    }

    setWalletDetails((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleBankChange = (key, value, item) => {
    if (key === "bankAccountName") {
      setBankDetails((prevData) => ({
        ...prevData,
        bankAccountId: item.AccountId,
      }));
    }

    if (key === "bankChannelName") {
      setBankDetails((prevData) => ({
        ...prevData,
        bankChannelId: item.ChannelId,
        bankChannelName: item.ChannelName,
      }));
    }

    setBankDetails((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCashSubmit = () => {
    onSummary(true);
    setDisplaySummary(true);
    let sendedCashData;
    let sendedWalletData;
    let sendedBankData;
    if (cashDetails?.accountId !== "" && cashDetails?.amount > 0) {
      sendedCashData = {
        accountName: cashDetails?.accountName,
        accountId: cashDetails?.accountId,
        amount: cashDetails?.amount,
      };
    } else {
      sendedCashData = {
        accountId: "",
        amount: 0,
      };
    }
    if (
      walletDetails?.walletAccountId !== "" &&
      walletDetails?.walletAmount > 0 &&
      walletDetails?.walletChannelId !== ""
    ) {
      sendedWalletData = {
        walletAccountName: walletDetails?.walletAccountName,
        walletAccountId: walletDetails?.walletAccountId,
        walletAmount: walletDetails?.walletAmount,
        walletChannelId: walletDetails?.walletChannelId,
        walletChannelName: walletDetails?.walletChannelName,
        walletTransaction: walletDetails?.walletTransaction,
        walletTransactionDate: walletDetails?.walletTransactionDate,
      };
    } else {
      sendedWalletData = {
        walletAccountName: "",
        walletAccountId: "",
        walletAmount: 0,
        walletChannelId: "",
        walletChannelName: "",
        walletTransaction: "",
        walletTransactionDate: getCurrentDate(),
      };
    }

    if (
      bankDetails?.bankAccountId !== "" &&
      bankDetails?.bankAmount > 0 &&
      bankDetails?.bankChannelId !== ""
    ) {
      sendedBankData = {
        bankAccountName: bankDetails?.bankAccountName,
        bankAccountId: bankDetails?.bankAccountId,
        bankAmount: bankDetails?.bankAmount,
        bankChannelId: bankDetails?.bankChannelId,
        bankChannelName: bankDetails?.bankChannelName,
        bankTransaction: bankDetails?.bankTransaction,
        bankTransactionDate: bankDetails?.bankTransactionDate,
      };
    } else {
      sendedBankData = {
        bankAccountName: "",
        bankAccountId: "",
        bankAmount: 0,
        bankChannelId: "",
        bankChannelName: "",
        bankTransaction: "",
        bankTransactionDate: getCurrentDate(),
      };
    }
    dispatch(getPaymentData(sendedCashData, sendedWalletData, sendedBankData));
  };

  const [isDiscount, setIsDiscount] = useState(false);

  const handleDiscountAdd = () => {
    setIsDiscount(!isDiscount);
  };

  const sum =
    Number(paymentDetails?.cashDetails?.amount) +
    Number(paymentDetails?.walletDetails?.walletAmount) +
    Number(paymentDetails?.bankDetails?.bankAmount) +
    Number(discountAmount);

  // const itemID =localStorage.getItem(`serviceId${tabId}`);
  // const itemID = 2078;
  const BranchId = localStorage.getItem("BranchId");
  const CompanyId = localStorage.getItem("CompanyId");
  const TOrdHdID = localStorage.getItem(`TOrdHdID${tabId}`);
  const CustId = localStorage.getItem(`customerId${tabId}`);
  const UserId = localStorage.getItem("userId");

  const [roundedValue, setRoundedValue] = useState();
  const [roundAmt, setRoundAmt] = useState();
  // const []

  useEffect(() => {
    const value = orderList?.orderData?.Order?.totalNetAmount;
    // const value = 123.34;
    const decimalPart = value - Math.floor(value);
    let roundedValue;

    if (decimalPart >= 0.01 && decimalPart <= 0.49) {
      roundedValue = Math.floor(value);
    } else if (decimalPart >= 0.51 && decimalPart <= 0.99) {
      roundedValue = Math.ceil(value);
    } else {
      roundedValue = Math.round(value);
    }
    const roundAmt = roundedValue - value;
    setRoundedValue(roundedValue);
    setRoundAmt(roundAmt?.toFixed(2));
  }, [orderList?.orderData?.Order?.totalNetAmount]);

  const handlePayOnDelivery = () => {
    setIsPayOnDeliveryLoader(true);
    const data = {
      TOrdHdId: TOrdHdID,
      BranchId: BranchId,
      CompanyId: CompanyId,
      TrType: "TO",
      SaleType: "T ORDER",
      NetAmt: roundedValue,
      VouDate: getCurrentDate(),
      TotalMakingAmt: orderList?.orderData?.Order?.totalMakingamt,
      TSGSTAmt: orderList?.orderData?.Odrer?.TSGSTAmt,
      TCGSTAmt: orderList?.orderData?.Odrer?.TCGSTAmt,
      TotalFabricAmt: orderList?.orderData?.Odrer?.TotalFabAmt,
      taxamt: orderList?.orderData?.Odrer?.TaxAmt,
      RoundAmt: roundAmt,
      TotalAccessoriesAmt: orderList?.orderData?.Odrer?.AccessoryAmt
        ? orderList?.orderData?.Odrer?.AccessoryAmt
        : 0,
      // CustId: CustId,
      // UserId: UserId,
      // MobileNo: "88889999",
      // PayAcno: null,

      // TrAmount: cashDetails?.amount,
    };
    dispatch(payOnDeliverySubmit(data)).then((res) => {
      if (res?.success === true) {
        toast.success(res.message);
        setIsPayOnDeliveryLoader(false);
        setTimeout(() => {
          // const newTab = window.open("/invoice", "_blank");

          navigate("/dashboard");

          // setOrdModalLoading(false);
          closePaymentModal();
        }, 3000);
      } else {
        // toast.error(res.message);
        // setTimeout(() => {
        //   setOrdModalLoading(false);
        // }, 5000);
      }
    });
  };

  const handleSubmitPayment = () => {
    let cashObj;
    let walletObj;
    let bankObj;
    let discountObj;
    setIsLoader(true);

    const transactionsDetails = [];

    if (cashDetails?.amount > 0 && cashDetails?.accountId != "") {
      cashObj = {
        TrType: "R",
        TOrdHdId: TOrdHdID,
        CustId: CustId,
        UserId: UserId,
        MobileNo: branch?.Phone,
        PayAcno: cashDetails?.accountId,
        BranchId: BranchId,
        CompanyId: CompanyId,
        VouDate: new Date(),
        BankName: null,
        ChequeDate: null,
        ChequeNo: null,
        IsActive: 1,
        TrPaymode: "CASH",
        TrSaletype: "CASH",
        paytype: "CASH",
        TrAmount: cashDetails?.amount,
        //   "TrId": "150476"
      };
      transactionsDetails.push(cashObj);
    }
    if (
      walletDetails?.walletAmount > 0 &&
      walletDetails?.walletChannelId != "" &&
      walletDetails?.walletAccountId != ""
    ) {
      walletObj = {
        TrType: "R",
        TOrdHdId: TOrdHdID,
        CustId: CustId,
        UserId: UserId,
        MobileNo: branch?.Phone,
        PayAcno: walletDetails?.walletAccountId,
        BranchId: BranchId,
        CompanyId: CompanyId,
        VouDate: new Date(),
        BankName: walletDetails?.walletChannelName,
        ChannelId: walletDetails?.walletChannelId,
        ChequeDate: walletDetails?.walletTransactionDate,
        ChequeNo: walletDetails?.walletTransaction,
        IsActive: 1,
        TrPaymode: "WALLET",
        TrSaletype: "T ORDER", //static
        paytype: "WALLET",
        TrAmount: walletDetails?.walletAmount,
        //   "TrId": "150476"
      };
      transactionsDetails.push(walletObj);
    }

    if (
      bankDetails?.bankAmount > 0 &&
      bankDetails?.bankAccountId != "" &&
      bankDetails?.bankChannelId != ""
    ) {
      bankObj = {
        TrType: "R",
        TOrdHdId: TOrdHdID,
        CustId: CustId,
        UserId: UserId,
        MobileNo: branch?.Phone,
        PayAcno: bankDetails?.bankAccountId,
        BranchId: BranchId,
        CompanyId: CompanyId,
        VouDate: new Date(),
        BankName: bankDetails?.bankChannelName,
        ChannelId: bankDetails?.bankChannelId,
        ChequeDate: bankDetails?.bankTransactionDate,
        ChequeNo: bankDetails?.bankTransaction,
        IsActive: 1,
        TrPaymode: "BANK",
        TrSaletype: "T ORDER", //static,...
        paytype: "BANK",
        TrAmount: bankDetails?.bankAmount,
        //   "TrId": "150476"
      };
      transactionsDetails.push(bankObj);
    }

    if (discountDetails.discountAmount > 0) {
      discountObj = {
        TOrdHdId: TOrdHdID,
        TrType: "JV",
        UserId: UserId,
        BranchId: BranchId,
        CompanyId: CompanyId,
        VouDate: new Date(),
        PROMO: "T ORDER", //static.......
        benefitAmt: discountDetails.discountAmount,
        IsActive: 1,
        CashDiscount: discountDetails.discountAmount,
        // "TrPaymode": "CASHh",
        // "paytype": "CASH",
        CustName: "your_value",
        CustId: CustId,
        // "TrId": "150457"
      };
      transactionsDetails.push(discountObj);
    }

    const data = {
      TOrdHdId: TOrdHdID,
      BranchId: BranchId,
      CompanyId: CompanyId,
      TrType: "TO",
      SaleType: "T ORDER",
      NetAmt: roundedValue,
      VouDate: getCurrentDate(),
      TotalMakingAmt: orderList?.orderData?.Order?.totalMakingamt,
      TSGSTAmt: orderList?.orderData?.Odrer?.TSGSTAmt,
      TCGSTAmt: orderList?.orderData?.Odrer?.TCGSTAmt,
      TotalFabricAmt: orderList?.orderData?.Odrer?.TotalFabAmt,
      taxamt: orderList?.orderData?.Odrer?.TaxAmt,
      RoundAmt: roundAmt,
      TotalAccessoriesAmt: orderList?.orderData?.Odrer?.AccessoryAmt
        ? orderList?.orderData?.Odrer?.AccessoryAmt
        : 0,
      // CustId: CustId,
      // UserId: UserId,
      // MobileNo: "88889999",
      // PayAcno: null,

      // TrAmount: cashDetails?.amount,
    };
    dispatch(payOnDeliverySubmit(data)).then((res) => {
      if (res?.success === true) {
        dispatch(paymentSubmit(transactionsDetails)).then((res) => {
          if (res?.success) {
            toast.success(res.message);
            setIsLoader(false);
            const sendingData = {
              TOrdHdID: localStorage.getItem(`TOrdHdID${tabId}`),
            };
            localStorage.setItem("orderEditData", JSON.stringify(sendingData));
            const url = `/#/invoice`;
            const a = document.createElement("a");
            a.href = url;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            if (from == "order-tracker") {
              navigate("/dashboard");
            } else {
              navigate("/item-tracker");
            }

            closePaymentModal();
            setCashDetails({
              accountName: "",
              accountId: "",
              amount: 0,
            });
            setWalletDetails({
              walletAccountName: "",
              walletAccountId: "",
              walletAmount: 0,
              walletChannelId: "",
              walletChannelName: "",
              walletTransaction: "",
              walletTransactionDate: "",
            });

            setBankDetails({
              bankAccountName: "",
              bankAccountId: "",
              bankAmount: 0,
              bankChannelId: "",
              bankChannelName: "",
              bankTransaction: "",
              bankTransactionDate: "",
            });
            setTimeout(() => {
              // setOrdModalLoading(false);
              navigate("/dashboard");
              closePaymentModal();
            }, 3000);
            dispatch(getPaymentData(cashDetails, walletDetails, bankDetails));
          } else {
            // toast.error(res.message);
            setTimeout(() => {
              setIsLoader(false);
            }, 500);
            // setTimeout(() => {
            //   setOrdModalLoading(false);
            // }, 5000);
          }
          setTimeout(() => {
            setIsLoader(false);
          }, 500);
        });
      } else {
        toast.error(res.message);
        setTimeout(() => {
          setOrdModalLoading(false);
        }, 5000);
      }
    });
  };

  const handleEditCash = (mode) => {
    if (mode == "cash") {
      handlePaymentMethodChange("cash");
      setCashDetails({
        accountName: cashDetails?.accountName,
        accountId: cashDetails?.accountId,
        amount: cashDetails?.amount,
      });
      // dispatch(getPaymentData(cashDetails, walletDetails, bankDetails));
    } else if (mode == "wallet") {
      handlePaymentMethodChange("wallet");

      setWalletDetails({
        walletAccountName: walletDetails?.walletAccountName,
        walletAccountId: walletDetails?.walletAccountId,
        walletAmount: walletDetails?.walletAmount,
        walletChannelId: walletDetails?.walletChannelId,
        walletChannelName: walletDetails?.walletChannelName,
        walletTransaction: walletDetails?.walletTransaction,
        walletTransactionDate: walletDetails?.walletTransactionDate,
      });
      // dispatch(getPaymentData(cashDetails, walletDetails, bankDetails));
    } else if (mode == "bank") {
      handlePaymentMethodChange("bank");

      setBankDetails({
        bankAccountName: bankDetails?.bankAccountName,
        bankAccountId: bankDetails?.bankAccountId,
        bankAmount: bankDetails?.bankAmount,
        bankChannelId: bankDetails?.bankChannelId,
        bankChannelName: bankDetails?.bankChannelName,
        bankTransaction: bankDetails?.bankTransaction,
        bankTransactionDate: bankDetails?.bankTransactionDate,
      });
      // dispatch(getPaymentData(cashDetails, walletDetails, bankDetails));
    }
  };

  const handleDeleteCash = (mode) => {
    if (mode == "cash") {
      setCashDetails({
        accountName: "",
        accountId: "",
        amount: 0,
      });
      dispatch(getPaymentData(cashDetails, walletDetails, bankDetails));
    } else if (mode == "wallet") {
      setWalletDetails({
        walletAccountName: "",
        walletAccountId: "",
        walletAmount: 0,
        walletChannelId: "",
        walletChannelName: "",
        walletTransaction: "",
        walletTransactionDate: "",
      });
      dispatch(getPaymentData(cashDetails, walletDetails, bankDetails));
    } else if (mode == "bank") {
      setBankDetails({
        bankAccountName: "",
        bankAccountId: "",
        bankAmount: 0,
        bankChannelId: "",
        bankChannelName: "",
        bankTransaction: "",
        bankTransactionDate: "",
      });
      dispatch(getPaymentData(cashDetails, walletDetails, bankDetails));
    }
    // alert("handleDeleteCash");
    // onPaymentDelete(value);
  };
  useEffect(() => {
    dispatch(getPaymentData(cashDetails, walletDetails, bankDetails));
  }, [dispatch]);

  // const [fullValue,setFullValue] = useState({
  //   value:"",
  //   amount:"",
  //   roundAmt:"",
  // })

  const customRound = () => {
    // const value = orderList?.orderData?.Order?.totalNetAmount;
    const value = 123.34;
    const decimalPart = value - Math.floor(value);
    let roundedValue;

    if (decimalPart >= 0.01 && decimalPart <= 0.49) {
      roundedValue = Math.floor(value);
    } else if (decimalPart >= 0.51 && decimalPart <= 0.99) {
      roundedValue = Math.ceil(value);
    } else {
      roundedValue = Math.round(value);
    }
    const roundAmt = roundedValue - value;
    setRoundedValue(roundedValue);
    setRoundAmt(roundAmt?.toFixed(2));

    // return { amount: roundedValue, roundAmt: roundAmt.toFixed(2) };
  };

  return (
    <div className="dropdown-menu-s1">
      <div className="bg-white  cust_color_change_resp">
        {paymentMethod === "cod" ? (
          <div>
            <Icon
              name="cross"
              style={{ cursor: "pointer" }}
              onClick={closePaymentModal}
              className="d-flex justify-content-end fs-2 m-2"
            />
            <div className="d-flex justify-content-center">
              <span className="fs-3 fw-bold text-center">Payment</span>
            </div>
            <div className="bg-gray10 mb-2 mx-4">
              <NetPayableData />
            </div>

            <div className="d-flex align-items-center justify-content-center my-3">
              <div className="border rounded-pill px-1 py-1 d-flex align-items-center">
                <div onClick={() => handlePaymentMethodChange("cod")}>
                  <div
                    className={`py-1 px-2 rounded-pill d-flex ${
                      paymentMethod === "cod"
                        ? "bg-dark text-white"
                        : "bg-white text-dark"
                    }`}
                  >
                    <img
                      src={
                        paymentMethod === "cod"
                          ? CodPaymentIcon1
                          : CodPaymentIcon
                      }
                      alt=""
                      className="me-1"
                    />
                    <span className="d-none d-sm-block text-uppercase cursor-pointer">
                      {" "}
                      pay on delivery
                    </span>
                  </div>
                </div>
                <div onClick={() => handlePaymentMethodChange("cash")}>
                  <div
                    className={`py-1 px-2 rounded-pill d-flex ${
                      paymentMethod === "cash"
                        ? "bg-dark text-white"
                        : "bg-white text-dark"
                    }`}
                  >
                    <img
                      src={
                        paymentMethod === "cash"
                          ? CashPaymentIcon
                          : CashPaymentIcon1
                      }
                      alt=""
                      className="me-1"
                    />
                    <span className="d-none d-sm-block  text-uppercase cursor-pointer">
                      {" "}
                      CASH
                    </span>
                  </div>
                </div>
                <div onClick={() => handlePaymentMethodChange("wallet")}>
                  <div
                    className={`py-1 px-2 rounded-pill d-flex ${
                      paymentMethod === "wallet"
                        ? "bg-dark text-white"
                        : "bg-white text-dark"
                    }`}
                  >
                    <img
                      src={
                        paymentMethod === "wallet"
                          ? WalletPaymentIcon1
                          : WalletPaymentIcon
                      }
                      alt=""
                      className="me-1"
                    />
                    <span className="d-none d-sm-block text-uppercase cursor-pointer">
                      wallet
                    </span>
                  </div>
                </div>
                <div onClick={() => handlePaymentMethodChange("bank")}>
                  <div
                    className={`py-1 px-2 rounded-pill d-flex align-items-center ${
                      paymentMethod === "bank"
                        ? "bg-dark text-white"
                        : "bg-white text-dark"
                    }`}
                  >
                    <img
                      src={
                        paymentMethod === "bank"
                          ? BankPaymentIcon1
                          : BankPaymentIcon
                      }
                      alt=""
                      className="mr-2"
                    />
                    <span className="d-none d-sm-block  text-uppercase cursor-pointer">
                      bank
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="cust-min-h">
                <div className="mx-3 border px-3 rounded-2 py-1 bg-gray10">
                  <div className="fw-bold w-100 bg-white d-flex justify-content-between  align-items-center bg-gray10">
                    <span>Payable Against Delivery</span>
                    <div className="w-25">
                      <div
                        // style={{ backgroundColor: "#E4E6EA" }}
                        className="p-1 text-center rounded-2 py-1 bg-gray3"
                      >
                        <span>
                          {symbol} {orderList?.orderData?.Order?.totalNetAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center mt-3 mb-5">
                <Button
                  color="dark"
                  className="mt-3"
                  onClick={handlePayOnDelivery}
                >
                  {isPayOnDeliveryLoader ? (
                    <>
                      <span>
                        <Spinner
                          size="sm"
                          color="light"
                          className="mx-1 py-1"
                        />
                      </span>
                    </>
                  ) : (
                    <>
                      <img
                        src={paymentIcon}
                        alt=""
                        className="me-2 text-white"
                      />
                      <Link
                        // href="/#/invoice"
                        // target="_black"
                        className="text-light text-decoration-none"
                      >
                        {" "}
                        <span>Save & Print</span>
                      </Link>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : paymentMethod === "cash" ? (
          <div className="row position-relative">
            {displayForm && (
              <div
                className={` ${
                  displaySummary ? "col-xl-6 col-12 " : "col-12"
                } `}
              >
                <div className="d-flex justify-content-center mt-5">
                  <span className="fs-3 fw-bold text-center">Payment</span>
                </div>
                {!displaySummary && (
                  <div className="bg-gray10 mx-4">
                    <NetPayableData />
                  </div>
                )}

                <div className="d-flex align-items-center justify-content-center my-3">
                  <div className="border rounded-pill px-1 py-1 d-flex align-items-center">
                    <div onClick={() => handlePaymentMethodChange("cod")}>
                      <div
                        className={`py-1 px-2 rounded-pill d-flex ${
                          paymentMethod === "cod"
                            ? "bg-dark text-white"
                            : "bg-white text-dark"
                        }`}
                      >
                        <img
                          src={
                            paymentMethod === "cod"
                              ? CodPaymentIcon1
                              : CodPaymentIcon
                          }
                          alt=""
                          className="me-1"
                        />
                        <span className="d-none d-sm-block text-uppercase cursor-pointer">
                          {" "}
                          Add to Payment
                        </span>
                      </div>
                    </div>
                    <div onClick={() => handlePaymentMethodChange("cash")}>
                      <div
                        className={`py-1 px-2 rounded-pill d-flex ${
                          paymentMethod === "cash"
                            ? "bg-dark text-white"
                            : "bg-white text-dark"
                        }`}
                      >
                        <img
                          src={
                            paymentMethod === "cash"
                              ? CashPaymentIcon
                              : CashPaymentIcon1
                          }
                          alt=""
                          className="me-1"
                        />
                        <span className="d-none d-sm-block  text-uppercase cursor-pointer">
                          {" "}
                          CASH
                        </span>
                      </div>
                    </div>
                    <div onClick={() => handlePaymentMethodChange("wallet")}>
                      <div
                        className={`py-1 px-2 rounded-pill d-flex ${
                          paymentMethod === "wallet"
                            ? "bg-dark text-white"
                            : "bg-white text-dark"
                        }`}
                      >
                        <img
                          src={
                            paymentMethod === "wallet"
                              ? WalletPaymentIcon1
                              : WalletPaymentIcon
                          }
                          alt=""
                          className="me-1"
                        />
                        <span className="d-none d-sm-block text-uppercase cursor-pointer">
                          wallet
                        </span>
                      </div>
                    </div>
                    <div onClick={() => handlePaymentMethodChange("bank")}>
                      <div
                        className={`py-1 px-2 rounded-pill d-flex ${
                          paymentMethod === "bank"
                            ? "bg-dark text-white"
                            : "bg-white text-dark"
                        }`}
                      >
                        <img
                          src={
                            paymentMethod === "bank"
                              ? BankPaymentIcon1
                              : BankPaymentIcon
                          }
                          alt=""
                          className=""
                        />
                        <span className="d-none d-sm-block text-uppercase cursor-pointer ms-1">
                          bank
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCashSubmit(cashDetails, walletDetails, bankDetails);
                  }}
                  className={`text-start m-4 `}
                >
                  <div className="cust-min-h">
                    <div className="d-flex align-items-center mt-2 mb-2">
                      <label className="fw-bold mb-0">Account Name</label>
                      <UncontrolledDropdown
                        className="user-dropdown justify-content-center "
                        isOpen={help.accountNameHelp}
                        toggle={() => {}}
                      >
                        <DropdownToggle tag="a">
                          <img
                            src={PaymentInputInfoIcon}
                            onMouseEnter={() =>
                              setHelp({ ...help, accountNameHelp: true })
                            }
                            onMouseLeave={() =>
                              setHelp({ ...help, accountNameHelp: false })
                            }
                            // onClick={() => setIsOpen(!isOpen)}
                            alt="PaymentInputInfoIcon"
                          />
                        </DropdownToggle>

                        <DropdownMenu
                          container="body"
                          className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1 shadow-xl  "
                          style={{
                            position: "absolute",
                            top: 0,
                            zIndex: 10000,
                            width: "250px",
                          }}
                        >
                          <div className="dropdown-body">
                            <div className="avtar-rows-container">
                              Lorem ipsum dolor sit amet, consectetuer
                              adipiscing elit, sed diam nonummy nibh
                            </div>
                          </div>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>

                    <UncontrolledDropdown
                      className="user-dropdown w-100 position-relative  form-control-lg form-control cursor-pointer"
                      id="saleType"
                      isOpen={isDropdownOpen}
                      toggle={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <DropdownToggle
                        tag="a"
                        className="w-100"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <div className="">
                          <div className="d-flex text-dark align-items-center">
                            <div className="">
                              <span className="text-uppercase ">
                                {cashDetails?.accountName
                                  ? cashDetails?.accountName
                                  : "account name"}
                                {/* {selectedSaleType
                        ? selectedSaleType.Name
                        : saleTypeDefault?.Name} */}
                              </span>
                            </div>
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
                              {cashData?.[0]?.Accounts.map((item, ind) => {
                                return (
                                  <React.Fragment key={ind}>
                                    <DropdownItem
                                      id={`account${ind}`}
                                      className="fw-medium fs-14 d-flex align-items-center"
                                      onClick={() =>
                                        handleCashChange(
                                          "accountName",
                                          item.AccountName,
                                          item
                                        )
                                      }
                                    >
                                      {item.AccountName?.length > 13
                                        ? item.AccountName.slice(0, 13) + "..."
                                        : item.AccountName}
                                    </DropdownItem>

                                    {item.AccountName?.length > 13 ? (
                                      <>
                                        <Tooltip
                                          id={`account${ind}`}
                                          direction="right"
                                          text={item.AccountName}
                                        />
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </DropdownMenu>
                    </UncontrolledDropdown>

                    <div className="d-flex align-items-center mt-2 mb-2">
                      <label className="fw-bold mb-0">Amount</label>{" "}
                      <UncontrolledDropdown
                        className="user-dropdown justify-content-center "
                        isOpen={help.amountHelp}
                        toggle={() => {}}
                      >
                        <DropdownToggle tag="a">
                          <img
                            src={PaymentInputInfoIcon}
                            onMouseEnter={() =>
                              setHelp({ ...help, amountHelp: true })
                            }
                            onMouseLeave={() =>
                              setHelp({ ...help, amountHelp: false })
                            }
                            // onClick={() => setIsOpen(!isOpen)}
                            alt="PaymentInputInfoIcon"
                          />
                        </DropdownToggle>

                        <DropdownMenu
                          container="body"
                          className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1 shadow-xl  "
                          style={{
                            position: "absolute",
                            top: 0,
                            zIndex: 10000,
                            width: "250px",
                          }}
                        >
                          <div className="dropdown-body">
                            <div className="avtar-rows-container">
                              Lorem ipsum dolor sit amet, consectetuer
                              adipiscing elit, sed diam nonummy nibh
                            </div>
                          </div>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                    {/* <input
                      type="text" // Change type to "text"
                      name="amount"
                      value={amount}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Validate if the entered value is a valid decimal number
                        if (!isNaN(value) && /^\d*\.?\d*$/.test(value)) {
                          setCashDetails({
                            ...cashDetails,
                            amount: value,
                          });
                        }
                      }}
                      style={{ height: "40px" }}
                      className="form-control h-line"
                      placeholder="5000"
                      minLength="1" // Change min to minLength
                      maxLength="10" // You can adjust the maximum length as per your requirement
                      pattern="\d*\.?\d*" // Pattern for a decimal number
                    /> */}
                    <input
                      type="number"
                      name="amount"
                      value={cashDetails?.amount}
                      onChange={(e) =>
                        setCashDetails({
                          ...cashDetails,
                          amount: e.target.value,
                        })
                      }
                      style={{ height: "40px" }}
                      className="form-control h-line"
                      placeholder="5000"
                      min="1"
                      max={orderList?.orderData?.Order?.totalNetAmount || ""}
                    />
                  </div>

                  <div className="d-flex justify-content-center mt-3 mb-5">
                    <Button
                      color="dark"
                      className="mt-3"
                      disabled={
                        cashDetails?.amount < 1 ||
                        cashDetails?.accountName == ""
                      }
                    >
                      Add to Payment
                    </Button>
                  </div>
                </Form>
              </div>
            )}
            {displaySummary && (
              <div
                className={`${
                  displayForm ? "col-xl-6 col-12 px-2" : "col-12"
                } bg-gray10 custome-pdmr`}
              >
                <div className="bg-gray10 mb-2 mt-5">
                  <NetPayableData />
                </div>
                <div className="border rounded-2 w-100 mb-3 bg-white my-5 ">
                  <div className="bg-gray2 p-2 border-bottom">
                    <span className="fw-bold fs-6">Payment Summary</span>
                  </div>
                  <div className="p-2">
                    <table className="w-100">
                      {paymentDetails?.cashDetails?.amount > 0 && (
                        <tr className="trHover">
                          <td className="fw-medium">
                            Cash{" "}
                            <UncontrolledDropdown
                              className="user-dropdown justify-content-center "
                              isOpen={help.cashHelp}
                              toggle={() => {}}
                            >
                              <DropdownToggle tag="a">
                                <img
                                  src={PaymentInputInfoIcon}
                                  onMouseEnter={() =>
                                    setHelp({ ...help, cashHelp: true })
                                  }
                                  onMouseLeave={() =>
                                    setHelp({ ...help, cashHelp: false })
                                  }
                                  // onClick={() => setIsOpen(!isOpen)}
                                  alt="PaymentInputInfoIcon"
                                />
                              </DropdownToggle>

                              <DropdownMenu
                                container="body"
                                className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  zIndex: 10000,
                                  width: "250px",
                                }}
                              >
                                <div className="dropdown-body">
                                  <div className="avtar-rows-container">
                                  Payment made in cash mode
                                  </div>
                                </div>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 ">
                              {paymentDetails?.cashDetails?.accountName}
                            </small>
                          </td>

                          <td className="custom-light-text custom-text-transform">
                            {/* 31/10/2023 */}
                          </td>
                          <td className="fw-medium d-flex align-items-center justify-content-end">
                            {paymentDetails?.cashDetails?.amount}
                            <div className="paymentIcon">
                              {/* <img
                                src={PaymentEditIcon}
                                className="m-1"
                                onClick={(e) => handleEditCash("cash")}
                              ></img> */}
                              <img
                                src={PaymentDeleteIcon}
                                alt=""
                                onClick={(e) => handleDeleteCash("cash")}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                      <tr className="custom-border-top"></tr>
                      {paymentDetails?.walletDetails?.walletAmount > 0 && (
                        <tr className="mt-2 trHover">
                          <td className="fw-medium ">
                            wallet
                            <UncontrolledDropdown
                              className="user-dropdown justify-content-center "
                              isOpen={help.walletHelp}
                              toggle={() => {}}
                            >
                              <DropdownToggle tag="a">
                                <img
                                  src={PaymentInputInfoIcon}
                                  onMouseEnter={() =>
                                    setHelp({ ...help, walletHelp: true })
                                  }
                                  onMouseLeave={() =>
                                    setHelp({ ...help, walletHelp: false })
                                  }
                                  // onClick={() => setIsOpen(!isOpen)}
                                  alt="PaymentInputInfoIcon"
                                />
                              </DropdownToggle>

                              <DropdownMenu
                                container="body"
                                className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  zIndex: 10000,
                                  width: "250px",
                                }}
                              >
                                <div className="dropdown-body">
                                  <div className="avtar-rows-container">
                                  Payment made in wallet mode
                                  </div>
                                </div>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 ">
                              {paymentDetails?.walletDetails?.walletAccountName}
                            </small>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 ">
                              {paymentDetails?.walletDetails?.walletChannelName}
                            </small>
                          </td>
                          <td className="custom-light-text custom-text-transform">
                            <small className="custom-light-text custom-text-transform ml-3 my-0 py-0">
                              {
                                paymentDetails?.walletDetails
                                  ?.walletTransactionDate
                              }
                            </small>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 py-0">
                              Tnx#{" "}
                              {paymentDetails?.walletDetails?.walletTransaction}
                            </small>
                          </td>
                          <td className="fw-medium d-flex align-items-center justify-content-end">
                            {paymentDetails?.walletDetails?.walletAmount}
                            <div className="paymentIcon">
                              {/* <img
                                src={PaymentEditIcon}
                                className="m-1"
                                onClick={(e) => handleEditCash("wallet")}

                              ></img> */}
                              <img
                                src={PaymentDeleteIcon}
                                alt=""
                                // onClick={handleDelete}
                                onClick={(e) => handleDeleteCash("wallet")}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                      <tr className="custom-border-top trHover"></tr>

                      {paymentDetails?.bankDetails?.bankAmount > 0 && (
                        <tr className="trHover">
                          <td className="fw-medium">
                            Bank
                            <UncontrolledDropdown
                              className="user-dropdown justify-content-center "
                              isOpen={help.BankHelp}
                              toggle={() => {}}
                            >
                              <DropdownToggle tag="a">
                                <img
                                  src={PaymentInputInfoIcon}
                                  onMouseEnter={() =>
                                    setHelp({ ...help, BankHelp: true })
                                  }
                                  onMouseLeave={() =>
                                    setHelp({ ...help, BankHelp: false })
                                  }
                                  // onClick={() => setIsOpen(!isOpen)}
                                  alt="PaymentInputInfoIcon"
                                />
                              </DropdownToggle>

                              <DropdownMenu
                                container="body"
                                className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  zIndex: 10000,
                                  width: "250px",
                                }}
                              >
                                <div className="dropdown-body">
                                  <div className="avtar-rows-container">
                                  Payment made in bank mode
                                  </div>
                                </div>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 ">
                              {paymentDetails?.bankDetails?.bankAccountName}
                            </small>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 ">
                              {paymentDetails?.bankDetails?.bankChannelName}
                            </small>
                          </td>
                          <td className="custom-light-text custom-text-transform">
                            <small className="custom-light-text custom-text-transform ml-3 my-0 py-0">
                              {paymentDetails?.bankDetails?.bankTransactionDate}
                            </small>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 py-0">
                              Tnx#{" "}
                              {paymentDetails?.bankDetails?.bankTransaction}
                            </small>
                          </td>
                          <td className="fw-medium d-flex align-items-center justify-content-end">
                            {paymentDetails?.bankDetails?.bankAmount}
                            <div className="paymentIcon">
                              {/* <img
                                src={PaymentEditIcon}
                                className="m-1"
                                onClick={(e) => handleEditCash("bank")}

                              ></img> */}
                              <img
                                src={PaymentDeleteIcon}
                                alt=""
                                onClick={(e) => handleDeleteCash("bank")}
                                // onClick={handleDelete}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </table>
                  </div>
                  {isDiscount ? (
                    <div className="p-2">
                      <div className="row justify-content-between">
                        <div className="col-7">
                          <input
                            type="text"
                            // {...register("amount", {
                            //   required: "amount is required",
                            // })}

                            name="discountReason"
                            value={discountReason}
                            onChange={(e) =>
                              setDiscountDetials({
                                ...discountDetails,
                                discountReason: e.target.value,
                              })
                            }
                            style={{ height: "40px" }}
                            className="form-control h-line"
                            placeholder="Discount Reason"
                          />
                        </div>
                        <div className="col-3">
                          <input
                            type="number"
                            // {...register("amount", {
                            //   required: "amount is required",
                            // })}
                            name="discountAmount"
                            value={discountAmount}
                            onChange={(e) =>
                              setDiscountDetials({
                                ...discountDetails,
                                discountAmount: e.target.value,
                              })
                            }
                            style={{ height: "40px" }}
                            className="form-control h-line"
                            placeholder="5000"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2">
                      <Button
                        outline
                        color="dark"
                        onClick={handleDiscountAdd}
                        className=""
                      >
                        {/* <img src={viewIcon} alt="viewIcon" /> */}
                        <span className="fs-4">+</span>
                        <span className="ms-1">Cash Discount</span>
                      </Button>
                    </div>
                  )}
                  <div className="bg-gray2 p-2 border-bottom d-flex justify-content-between">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold mr-4">
                      {symbol} {sum}
                    </span>
                  </div>
                </div>
                <div className="bg-gray2 p-2 border-bottom d-flex justify-content-between my-2">
                  {/* <span className="fw-bold">Total Pending Balance</span> */}
                  <span className="fw-bold"> Balance</span>
                  <span className="fw-bold mr-4">
                    {/* {symbol} {orderList?.orderData?.Order?.NetAmt - sum} */}
                    {symbol}{" "}
                    {(
                      orderList?.orderData?.Order?.totalNetAmount - sum
                    )?.toFixed(RoundUpToDecimal)}
                  </span>
                </div>
                <div className="mt-5 d-flex justify-content-center mb-5">
                  <Button
                    className="bg-danger text-white"
                    // onClick={closePaymentModal}
                    onClick={handleSubmitPayment}
                    disabled={
                      orderList?.orderData?.Order?.totalNetAmount - sum < 0
                    }
                    // disabled={orderList?.orderData?.Order?.NetAmt - sum < 0}
                  >
                    {isLoader ? (
                      <>
                        <span>
                          <Spinner
                            size="sm"
                            color="light"
                            className="mx-1 py-1"
                          />
                        </span>
                      </>
                    ) : (
                      <>
                        <img
                          src={paymentIcon}
                          alt=""
                          className="me-2 fill-white"
                        />
                        <Link
                          // href="/#/invoice"
                          // target="_black"
                          className="text-light text-decoration-none"
                        >
                          <span>Pay</span>
                        </Link>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
            <Icon
              name="cross"
              style={{ cursor: "pointer", right: "1%" }}
              onClick={closePaymentModal}
              className="d-flex justify-content-end fs-2 m-2 position-absolute"
            />
          </div>
        ) : paymentMethod === "wallet" ? (
          <div className="row position-relative">
            {displayForm && (
              <div
                className={`${displaySummary ? "col-xl-6 col-12" : "col-12"}`}
              >
                <div className="d-flex justify-content-center mt-5">
                  <span className="fs-3 fw-bold text-center">Payment</span>
                </div>
                {!displaySummary && (
                  <div className="bg-gray10 mx-4">
                    <NetPayableData />
                  </div>
                )}
                <div className="d-flex align-items-center justify-content-center my-3">
                  <div className="border rounded-pill px-1 py-1 d-flex align-items-center">
                    <div onClick={() => handlePaymentMethodChange("cod")}>
                      <div
                        className={`d-flex  py-1 px-2 rounded-pill ${
                          paymentMethod === "cod"
                            ? "bg-dark text-white"
                            : "bg-white text-dark"
                        }`}
                      >
                        <img
                          src={
                            paymentMethod === "cod"
                              ? CodPaymentIcon1
                              : CodPaymentIcon
                          }
                          alt=""
                          className="me-1"
                        />
                        <span className="d-none d-sm-block text-uppercase cursor-pointer">
                          pay on delivery
                        </span>
                      </div>
                    </div>

                    <div onClick={() => handlePaymentMethodChange("cash")}>
                      <div
                        className={`d-flex py-1 px-2 rounded-pill ${
                          paymentMethod === "cash"
                            ? "bg-dark text-white"
                            : "bg-white text-dark"
                        }`}
                      >
                        <img
                          src={
                            paymentMethod === "cash"
                              ? CashPaymentIcon
                              : CashPaymentIcon1
                          }
                          alt=""
                          className="me-1"
                        />
                        <span className="d-none d-sm-block  text-uppercase cursor-pointer">
                          {" "}
                          CASH
                        </span>
                      </div>
                    </div>

                    <div onClick={() => handlePaymentMethodChange("wallet")}>
                      <div
                        className={`d-flex py-1 px-2 rounded-pill ${
                          paymentMethod === "wallet"
                            ? "bg-dark text-white"
                            : "bg-white text-dark"
                        }`}
                      >
                        <img
                          src={
                            paymentMethod === "wallet"
                              ? WalletPaymentIcon1
                              : WalletPaymentIcon
                          }
                          alt=""
                          className="me-1"
                        />
                        <span className="d-none d-sm-block  text-uppercase cursor-pointer">
                          wallet
                        </span>
                      </div>
                    </div>

                    <div onClick={() => handlePaymentMethodChange("bank")}>
                      <div
                        className={`d-flex py-1 px-2 rounded-pill ${
                          paymentMethod === "bank"
                            ? "bg-dark text-white"
                            : "bg-white text-dark"
                        }`}
                      >
                        <img
                          src={
                            paymentMethod === "bank"
                              ? BankPaymentIcon1
                              : BankPaymentIcon
                          }
                          alt=""
                          className="me-1"
                        />
                        <span className="d-none d-sm-block  text-uppercase cursor-pointer">
                          bank
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCashSubmit(cashDetails, walletDetails, bankDetails);
                  }}
                  className="text-start m-4 "
                >
                  <div className="cust-min-h">
                    <div className="d-flex align-items-center mt-2 mb-2">
                      <label className="fw-bold mb-0">Account Name</label>{" "}
                      {/* <InputHelp className="ms-2" /> */}
                      <UncontrolledDropdown
                        className="user-dropdown justify-content-center "
                        isOpen={help.accountNameHelp}
                        toggle={() => {}}
                      >
                        <DropdownToggle tag="a">
                          <img
                            className="ml-1"
                            src={PaymentInputInfoIcon}
                            onMouseEnter={() =>
                              setHelp({ ...help, accountNameHelp: true })
                            }
                            onMouseLeave={() =>
                              setHelp({ ...help, accountNameHelp: false })
                            }
                            // onClick={() => setIsOpen(!isOpen)}
                            alt="PaymentInputInfoIcon"
                          />
                        </DropdownToggle>

                        <DropdownMenu
                          container="body"
                          className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1 shadow-xl  "
                          style={{
                            position: "absolute",
                            top: 0,
                            zIndex: 10000,
                            width: "250px",
                          }}
                        >
                          <div className="dropdown-body">
                            <div className="avtar-rows-container">
                              Lorem ipsum dolor sit amet, consectetuer
                              adipiscing elit, sed diam nonummy nibh
                            </div>
                          </div>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                    <UncontrolledDropdown
                      className="user-dropdown w-100 position-relative  form-control cursor-pointer"
                      id="saleType"
                      isOpen={isDropdownOpen}
                      toggle={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <DropdownToggle
                        tag="a"
                        className="w-100"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <div className="">
                          <div className="d-flex text-dark align-items-center">
                            <div className="">
                              <span className="text-uppercase ">
                                {walletDetails?.walletAccountName
                                  ? walletDetails?.walletAccountName
                                  : "account name"}
                                {/* {selectedSaleType
                        ? selectedSaleType.Name
                        : saleTypeDefault?.Name} */}
                              </span>
                            </div>
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
                              {walletData?.[0]?.Accounts.map((item, ind) => {
                                return (
                                  <React.Fragment key={ind}>
                                    <DropdownItem
                                      id={`account${ind}`}
                                      className="fw-medium fs-14 d-flex align-items-center"
                                      onClick={() =>
                                        handleWalletChange(
                                          "walletAccountName",
                                          item.AccountName,
                                          item
                                        )
                                      }
                                    >
                                      {item.AccountName?.length > 13
                                        ? item.AccountName.slice(0, 13) + "..."
                                        : item.AccountName}
                                    </DropdownItem>

                                    {item.AccountName?.length > 13 ? (
                                      <>
                                        <Tooltip
                                          id={`account${ind}`}
                                          direction="right"
                                          text={item.AccountName}
                                        />
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    <div className="d-flex align-items-center mt-2 mb-2">
                      <label className="fw-bold mb-0 ">Amount</label>{" "}
                      {/* <InputHelp className="ms-2" /> */}
                      <UncontrolledDropdown
                        className="user-dropdown justify-content-center "
                        isOpen={help.amountHelp}
                        toggle={() => {}}
                      >
                        <DropdownToggle tag="a">
                          <img
                            className="ml-1"
                            src={PaymentInputInfoIcon}
                            onMouseEnter={() =>
                              setHelp({ ...help, amountHelp: true })
                            }
                            onMouseLeave={() =>
                              setHelp({ ...help, amountHelp: false })
                            }
                            // onClick={() => setIsOpen(!isOpen)}
                            alt="PaymentInputInfoIcon"
                          />
                        </DropdownToggle>

                        <DropdownMenu
                          container="body"
                          className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1 shadow-xl  "
                          style={{
                            position: "absolute",
                            top: 0,
                            zIndex: 10000,
                            width: "250px",
                          }}
                        >
                          <div className="dropdown-body">
                            <div className="avtar-rows-container">
                              Lorem ipsum dolor sit amet, consectetuer
                              adipiscing elit, sed diam nonummy nibh
                            </div>
                          </div>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>

                    <input
                      type="number"
                      // {...register("amount", {
                      //   required: "amount is required",
                      // })}
                      name="walletAmount"
                      value={walletDetails?.walletAmount}
                      onChange={(e) =>
                        setWalletDetails({
                          ...walletDetails,
                          walletAmount: e.target.value,
                        })
                      }
                      style={{ height: "40px" }}
                      className="form-control h-line"
                      placeholder="5000"
                      min="1"
                      max={orderList?.orderData?.Order?.totalNetAmount || ""}
                    />
                    <div className="d-flex align-items-center mt-2 mb-2">
                      <label className="fw-bold mb-0">Channel</label>{" "}
                      {/* <InputHelp className="ms-2" /> */}
                      <UncontrolledDropdown
                        className="user-dropdown justify-content-center "
                        isOpen={help.channelHelp}
                        toggle={() => {}}
                      >
                        <DropdownToggle tag="a">
                          <img
                            className="ml-1"
                            src={PaymentInputInfoIcon}
                            onMouseEnter={() =>
                              setHelp({ ...help, channelHelp: true })
                            }
                            onMouseLeave={() =>
                              setHelp({ ...help, channelHelp: false })
                            }
                            // onClick={() => setIsOpen(!isOpen)}
                            alt="PaymentInputInfoIcon"
                          />
                        </DropdownToggle>

                        <DropdownMenu
                          container="body"
                          className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1 shadow-xl  "
                          style={{
                            position: "absolute",
                            top: 0,
                            zIndex: 10000,
                            width: "250px",
                          }}
                        >
                          <div className="dropdown-body">
                            <div className="avtar-rows-container">
                              Lorem ipsum dolor sit amet, consectetuer
                              adipiscing elit, sed diam nonummy nibh
                            </div>
                          </div>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                    <UncontrolledDropdown
                      className="user-dropdown w-100 position-relative  form-control-lg form-control cursor-pointer"
                      id="saleType"
                      isOpen={isDropdownChannel}
                      toggle={() => setIsDropdownChannel(!isDropdownChannel)}
                    >
                      <DropdownToggle
                        tag="a"
                        className="w-100"
                        onClick={() => setIsDropdownChannel(!isDropdownChannel)}
                      >
                        <div className="">
                          <div className="d-flex text-dark align-items-center">
                            <div className="">
                              <span className="text-uppercase ">
                                {walletDetails?.walletChannelName
                                  ? walletDetails?.walletChannelName
                                  : "channel name"}
                                {/* {selectedSaleType
                        ? selectedSaleType.Name
                        : saleTypeDefault?.Name} */}
                              </span>
                            </div>
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
                              {walletData[0]?.Channels.map((item, ind) => {
                                return (
                                  <React.Fragment key={ind}>
                                    <DropdownItem
                                      id={`channel${ind}`}
                                      className="fw-medium fs-14 d-flex align-items-center"
                                      onClick={() =>
                                        handleWalletChange(
                                          "walletChannelName",
                                          item.ChannelName,
                                          item
                                        )
                                      }
                                    >
                                      {item.ChannelName?.length > 13
                                        ? item.ChannelName.slice(0, 13) + "..."
                                        : item.ChannelName}
                                    </DropdownItem>

                                    {item.ChannelName?.length > 13 ? (
                                      <>
                                        <Tooltip
                                          id={`account${ind}`}
                                          direction="right"
                                          text={item.ChannelName}
                                        />
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    <div className="mt-2 d-flex cust-d-collumn">
                      <div className="w-100 me-3">
                        <div className="d-flex align-items-center mt-2 mb-2">
                          <label className="fw-bold mb-0">
                            Transaction/Check#
                          </label>{" "}
                          {/* <InputHelp className="ms-2" /> */}
                          <UncontrolledDropdown
                            className="user-dropdown justify-content-center "
                            isOpen={help.transactionHelp}
                            toggle={() => {}}
                          >
                            <DropdownToggle tag="a">
                              <img
                                className="ml-1"
                                src={PaymentInputInfoIcon}
                                onMouseEnter={() =>
                                  setHelp({ ...help, transactionHelp: true })
                                }
                                onMouseLeave={() =>
                                  setHelp({ ...help, transactionHelp: false })
                                }
                                // onClick={() => setIsOpen(!isOpen)}
                                alt="PaymentInputInfoIcon"
                              />
                            </DropdownToggle>

                            <DropdownMenu
                              container="body"
                              className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1 shadow-xl  "
                              style={{
                                position: "absolute",
                                top: 0,
                                zIndex: 10000,
                                width: "250px",
                              }}
                            >
                              <div className="dropdown-body">
                                <div className="avtar-rows-container">
                                  Lorem ipsum dolor sit amet, consectetuer
                                  adipiscing elit, sed diam nonummy nibh
                                </div>
                              </div>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                        <input
                          type="text"
                          // {...register("transaction", {
                          //   required: "transaction is required",
                          // })}
                          name="walletTransaction"
                          value={walletTransaction}
                          onChange={(e) =>
                            setWalletDetails({
                              ...walletDetails,
                              walletTransaction: e.target.value,
                            })
                          }
                          style={{ height: "40px" }}
                          className="form-control h-line"
                          placeholder="5000"
                        />
                      </div>
                      <div className="w-100">
                        <div className="d-flex align-items-center  mt-2 mb-2">
                          <label className="fw-bold mb-0">
                            Transaction/Check Date
                          </label>{" "}
                          {/* <InputHelp className="ms-2" /> */}
                          <UncontrolledDropdown
                            className="user-dropdown justify-content-center "
                            isOpen={help.transactionDateHelp}
                            toggle={() => {}}
                          >
                            <DropdownToggle tag="a">
                              <img
                                className="ml-1"
                                src={PaymentInputInfoIcon}
                                onMouseEnter={() =>
                                  setHelp({
                                    ...help,
                                    transactionDateHelp: true,
                                  })
                                }
                                onMouseLeave={() =>
                                  setHelp({
                                    ...help,
                                    transactionDateHelp: false,
                                  })
                                }
                                // onClick={() => setIsOpen(!isOpen)}
                                alt="PaymentInputInfoIcon"
                              />
                            </DropdownToggle>

                            <DropdownMenu
                              container="body"
                              className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1 shadow-xl  "
                              style={{
                                position: "absolute",
                                top: 0,
                                zIndex: 10000,
                                width: "250px",
                              }}
                            >
                              <div className="dropdown-body">
                                <div className="avtar-rows-container">
                                  Lorem ipsum dolor sit amet, consectetuer
                                  adipiscing elit, sed diam nonummy nibh
                                </div>
                              </div>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                        <input
                          type="date"
                          name="walletTransactionDate"
                          value={walletTransactionDate}
                          onChange={(e) =>
                            setWalletDetails({
                              ...walletDetails,
                              walletTransactionDate: e.target.value,
                            })
                          }
                          max={getCurrentDate()}
                          min={orderList?.orderData?.Odrer?.TOrdDate}
                          // {...register("date", {
                          //   required: "date is required",
                          // })}
                          style={{ height: "40px" }}
                          className="form-control h-line"
                          placeholder="5000"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mt-3 mb-5">
                    <Button
                      color="dark"
                      className="mt-3"
                      disabled={
                        walletDetails?.walletAmount === null ||
                        walletDetails?.walletAccountId == "" ||
                        walletDetails?.walletChannelId == ""
                      }
                      // onClick={handleAddPayment}
                    >
                      Add to Payment
                    </Button>
                  </div>
                </Form>
              </div>
            )}
            {displaySummary && (
              <div
                className={`${
                  displayForm ? "col-xl-6 col-12 px-2" : "col-12"
                } bg-gray10 custome-pdmr`}
              >
                <div className="bg-gray10 mb-2 mt-5">
                  <NetPayableData />
                </div>
                <div className="border rounded-2 w-100 mb-3 bg-white my-5">
                  <div className="bg-gray2 p-2 border-bottom">
                    <span className="fw-bold fs-6">Payment Summary</span>
                  </div>
                  <div className="p-2">
                    <table className="w-100">
                      {paymentDetails?.cashDetails?.amount > 0 && (
                        <tr className="trHover">
                          <td className="fw-medium">
                            Cash{" "}
                            <UncontrolledDropdown
                              className="user-dropdown justify-content-center "
                              isOpen={help.cashHelp}
                              toggle={() => {}}
                            >
                              <DropdownToggle tag="a">
                                <img
                                  className="ml-1"
                                  src={PaymentInputInfoIcon}
                                  onMouseEnter={() =>
                                    setHelp({ ...help, cashHelp: true })
                                  }
                                  onMouseLeave={() =>
                                    setHelp({ ...help, cashHelp: false })
                                  }
                                  // onClick={() => setIsOpen(!isOpen)}
                                  alt="PaymentInputInfoIcon"
                                />
                              </DropdownToggle>

                              <DropdownMenu
                                container="body"
                                className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  zIndex: 10000,
                                  width: "250px",
                                }}
                              >
                                <div className="dropdown-body">
                                  <div className="avtar-rows-container">
                                  Payment made in cash mode
                                  </div>
                                </div>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 ">
                              {paymentDetails?.cashDetails?.accountName}
                            </small>
                          </td>
                          <td className="custom-light-text custom-text-transform">
                            {/* 31/10/2023 */}
                          </td>
                          <td className="fw-medium d-flex align-items-center justify-content-end">
                            {paymentDetails?.cashDetails?.amount}
                            <div className="paymentIcon">
                              {/* <img
                                src={PaymentEditIcon}
                                className="m-1"
                                onClick={(e) => handleEditCash("cash")}

                              ></img> */}
                              <img
                                src={PaymentDeleteIcon}
                                alt=""
                                onClick={(e) => handleDeleteCash("cash")}
                                // onClick={handleDelete}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                      <tr className="custom-border-top trHover"></tr>
                      {paymentDetails?.walletDetails?.walletAmount > 0 && (
                        <tr className="mt-2 trHover">
                          <td className="fw-medium ">
                            wallet
                            <UncontrolledDropdown
                              className="user-dropdown justify-content-center "
                              isOpen={help.walletHelp}
                              toggle={() => {}}
                            >
                              <DropdownToggle tag="a">
                                <img
                                  src={PaymentInputInfoIcon}
                                  onMouseEnter={() =>
                                    setHelp({ ...help, walletHelp: true })
                                  }
                                  onMouseLeave={() =>
                                    setHelp({ ...help, walletHelp: false })
                                  }
                                  // onClick={() => setIsOpen(!isOpen)}
                                  alt="PaymentInputInfoIcon"
                                />
                              </DropdownToggle>

                              <DropdownMenu
                                container="body"
                                className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  zIndex: 10000,
                                  width: "250px",
                                }}
                              >
                                <div className="dropdown-body">
                                  <div className="avtar-rows-container">
                                  Payment made in wallet mode
                                  </div>
                                </div>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 ">
                              {paymentDetails?.walletDetails?.walletAccountName}
                            </small>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 ">
                              {paymentDetails?.walletDetails?.walletChannelName}
                            </small>
                          </td>
                          <td className="custom-light-text custom-text-transform">
                            <small className="custom-light-text custom-text-transform ml-3 my-0 py-0">
                              {
                                paymentDetails?.walletDetails
                                  ?.walletTransactionDate
                              }
                            </small>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 py-0">
                              Tnx#{" "}
                              {paymentDetails?.walletDetails?.walletTransaction}
                            </small>
                          </td>
                          <td className="fw-medium d-flex align-items-center justify-content-end">
                            {paymentDetails?.walletDetails?.walletAmount}
                            <div className="paymentIcon">
                              {/* <img
                                src={PaymentEditIcon}
                                className="m-1"
                                onClick={(e) => handleEditCash("wallet")}

                              ></img> */}
                              <img
                                src={PaymentDeleteIcon}
                                alt=""
                                onClick={(e) => handleDeleteCash("wallet")}
                                // onClick={handleDelete}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                      <tr className="custom-border-top"></tr>

                      {paymentDetails?.bankDetails?.bankAmount > 0 && (
                        <tr className="trHover">
                          <td className="fw-medium">
                            Bank
                            <UncontrolledDropdown
                              className="user-dropdown justify-content-center "
                              isOpen={help.BankHelp}
                              toggle={() => {}}
                            >
                              <DropdownToggle tag="a">
                                <img
                                  src={PaymentInputInfoIcon}
                                  onMouseEnter={() =>
                                    setHelp({ ...help, BankHelp: true })
                                  }
                                  onMouseLeave={() =>
                                    setHelp({ ...help, BankHelp: false })
                                  }
                                  // onClick={() => setIsOpen(!isOpen)}
                                  alt="PaymentInputInfoIcon"
                                />
                              </DropdownToggle>

                              <DropdownMenu
                                container="body"
                                className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  zIndex: 10000,
                                  width: "250px",
                                }}
                              >
                                <div className="dropdown-body">
                                  <div className="avtar-rows-container">
                                  Payment made in bank mode
                                  </div>
                                </div>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 ">
                              {paymentDetails?.bankDetails?.bankAccountName}
                            </small>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 ">
                              {paymentDetails?.bankDetails?.bankChannelName}
                            </small>
                          </td>
                          <td className="custom-light-text custom-text-transform">
                            <small className="custom-light-text custom-text-transform ml-3 my-0 py-0">
                              {paymentDetails?.bankDetails?.bankTransactionDate}
                            </small>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 py-0">
                              Tnx#{" "}
                              {paymentDetails?.bankDetails?.bankTransaction}
                            </small>
                          </td>
                          <td className="fw-medium d-flex align-items-center justify-content-end">
                            {paymentDetails?.bankDetails?.bankAmount}
                            <div className="paymentIcon">
                              {/* <img
                                src={PaymentEditIcon}
                                className="m-1"
                                onClick={(e) => handleEditCash("bank")}

                              ></img> */}
                              <img
                                src={PaymentDeleteIcon}
                                alt=""
                                onClick={(e) => handleDeleteCash("bank")}
                                // onClick={handleDelete}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </table>
                  </div>
                  {isDiscount ? (
                    <div className="p-2">
                      <div className="row justify-content-between">
                        <div className="col-7">
                          <input
                            type="text"
                            // {...register("amount", {
                            //   required: "amount is required",
                            // })}

                            name="discountReason"
                            value={discountReason}
                            onChange={(e) =>
                              setDiscountDetials({
                                ...discountDetails,
                                discountReason: e.target.value,
                              })
                            }
                            style={{ height: "40px" }}
                            className="form-control h-line"
                            placeholder="Discount Reason"
                          />
                        </div>
                        <div className="col-3">
                          <input
                            type="number"
                            // {...register("amount", {
                            //   required: "amount is required",
                            // })}
                            name="discountAmount"
                            value={discountAmount}
                            onChange={(e) =>
                              setDiscountDetials({
                                ...discountDetails,
                                discountAmount: e.target.value,
                              })
                            }
                            style={{ height: "40px" }}
                            className="form-control h-line"
                            placeholder="5000"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2">
                      <Button
                        outline
                        color="dark"
                        onClick={handleDiscountAdd}
                        className=""
                      >
                        {/* <img src={viewIcon} alt="viewIcon" /> */}
                        <span className="fs-4">+</span>
                        <span className="ms-1">Cash Discount</span>
                      </Button>
                    </div>
                  )}
                  <div className="bg-gray2 p-2 border-bottom d-flex justify-content-between">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold mr-4">
                      {symbol} {sum}
                    </span>
                  </div>
                </div>
                <div className="bg-gray2 p-2 border-bottom d-flex justify-content-between my-2">
                  {/* <span className="fw-bold">Total Pending Balance</span> */}
                  <span className="fw-bold"> Balance</span>
                  <span className="fw-bold mr-4">
                    {/* {symbol} {orderList?.orderData?.Order?.NetAmt - sum} */}
                    {symbol}{" "}
                    {(
                      orderList?.orderData?.Order?.totalNetAmount - sum
                    )?.toFixed(RoundUpToDecimal)}
                  </span>
                </div>
                <div className="mt-5 d-flex justify-content-center mb-5">
                  <Button
                    className="bg-danger text-white"
                    // onClick={closePaymentModal}
                    onClick={handleSubmitPayment}
                    disabled={
                      orderList?.orderData?.Order?.totalNetAmount - sum < 0
                    }
                    // disabled={orderList?.orderData?.Order?.NetAmt - sum < 0}
                  >
                    {isLoader ? (
                      <>
                        <span>
                          <Spinner
                            size="sm"
                            color="light"
                            className="mx-1 py-1"
                          />
                        </span>
                      </>
                    ) : (
                      <>
                        <img
                          src={paymentIcon}
                          alt=""
                          className="me-2 fill-white"
                        />
                        <Link
                          // href="/#/invoice"
                          // target="_black"
                          className="text-light text-decoration-none"
                        >
                          <span>Pay</span>
                        </Link>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="position-absolute" style={{ right: "1%" }}>
              <Icon
                name="cross"
                style={{ cursor: "pointer" }}
                onClick={closePaymentModal}
                className="d-flex justify-content-end fs-2 m-2 "
              />
            </div>
          </div>
        ) : paymentMethod === "bank" ? (
          <div className="row position-relative">
            {displayForm && (
              <div
                className={`${displaySummary ? "col-xl-6 col-12" : "col-12"}`}
              >
                <div className="d-flex justify-content-center mt-5">
                  <span className="fs-3 fw-bold text-center">Payment</span>
                </div>
                {!displaySummary && (
                  <div className="bg-gray10 mx-4">
                    <NetPayableData />
                  </div>
                )}
                <div className="d-flex align-items-center justify-content-center my-3">
                  <div className="border rounded-pill px-1 py-1 d-flex align-items-center">
                    <div onClick={() => handlePaymentMethodChange("cod")}>
                      <div
                        className={`d-flex  py-1 px-2 rounded-pill ${
                          paymentMethod === "cod"
                            ? "bg-dark text-white"
                            : "bg-white text-dark"
                        }`}
                      >
                        <img
                          src={
                            paymentMethod === "cod"
                              ? CodPaymentIcon1
                              : CodPaymentIcon
                          }
                          alt=""
                          className="me-1"
                        />
                        <span className="d-none d-sm-block text-uppercase cursor-pointer">
                          pay on delivery
                        </span>
                      </div>
                    </div>

                    <div onClick={() => handlePaymentMethodChange("cash")}>
                      <div
                        className={`d-flex py-1 px-2 rounded-pill ${
                          paymentMethod === "cash"
                            ? "bg-dark text-white"
                            : "bg-white text-dark"
                        }`}
                      >
                        <img
                          src={
                            paymentMethod === "cash"
                              ? CashPaymentIcon
                              : CashPaymentIcon1
                          }
                          alt=""
                          className="me-1"
                        />
                        <span className="d-none d-sm-block  text-uppercase cursor-pointer">
                          {" "}
                          CASH
                        </span>
                      </div>
                    </div>

                    <div onClick={() => handlePaymentMethodChange("wallet")}>
                      <div
                        className={`d-flex py-1 px-2 rounded-pill ${
                          paymentMethod === "wallet"
                            ? "bg-dark text-white"
                            : "bg-white text-dark"
                        }`}
                      >
                        <img
                          src={
                            paymentMethod === "wallet"
                              ? WalletPaymentIcon1
                              : WalletPaymentIcon
                          }
                          alt=""
                          className="me-1"
                        />
                        <span className="d-none d-sm-block  text-uppercase cursor-pointer">
                          wallet
                        </span>
                      </div>
                    </div>

                    <div onClick={() => handlePaymentMethodChange("bank")}>
                      <div
                        className={`d-flex py-1 px-2 rounded-pill ${
                          paymentMethod === "bank"
                            ? "bg-dark text-white"
                            : "bg-white text-dark"
                        }`}
                      >
                        <img
                          src={
                            paymentMethod === "bank"
                              ? BankPaymentIcon1
                              : BankPaymentIcon
                          }
                          alt=""
                          className="me-1"
                        />
                        <span className="d-none d-sm-block  text-uppercase cursor-pointer">
                          bank
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCashSubmit(cashDetails, walletDetails, bankDetails);
                  }}
                  className="text-start  m-4"
                >
                  <div className="cust-min-h">
                    <div className="d-flex align-items-center mt-2 mb-2">
                      <label className="fw-bold mb-0">Account Name</label>{" "}
                      {/* <InputHelp className="ms-2" /> */}
                      <UncontrolledDropdown
                        className="user-dropdown justify-content-center "
                        isOpen={help.accountNameHelp}
                        toggle={() => {}}
                      >
                        <DropdownToggle tag="a">
                          <img
                            className="ml-1"
                            src={PaymentInputInfoIcon}
                            onMouseEnter={() =>
                              setHelp({ ...help, accountNameHelp: true })
                            }
                            onMouseLeave={() =>
                              setHelp({ ...help, accountNameHelp: false })
                            }
                            // onClick={() => setIsOpen(!isOpen)}
                            alt="PaymentInputInfoIcon"
                          />
                        </DropdownToggle>

                        <DropdownMenu
                          container="body"
                          className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1 shadow-xl  "
                          style={{
                            position: "absolute",
                            top: 0,
                            zIndex: 10000,
                            width: "250px",
                          }}
                        >
                          <div className="dropdown-body">
                            <div className="avtar-rows-container">
                              Lorem ipsum dolor sit amet, consectetuer
                              adipiscing elit, sed diam nonummy nibh
                            </div>
                          </div>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                    <UncontrolledDropdown
                      className="user-dropdown w-100 position-relative form-control-lg form-control cursor-pointer"
                      id="saleType"
                      isOpen={isDropdownOpen}
                      toggle={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <DropdownToggle
                        tag="a"
                        className="w-100"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <div className="">
                          <div className="d-flex text-dark align-items-center">
                            <div className="">
                              <span className="text-uppercase ">
                                {bankDetails?.bankAccountName
                                  ? bankDetails?.bankAccountName
                                  : "account name"}
                                {/* {selectedSaleType
                        ? selectedSaleType.Name
                        : saleTypeDefault?.Name} */}
                              </span>
                            </div>
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
                              {bankData[0]?.Accounts.map((item, ind) => {
                                return (
                                  <React.Fragment key={ind}>
                                    <DropdownItem
                                      id={`account${ind}`}
                                      className="fw-medium fs-14 d-flex align-items-center"
                                      onClick={() =>
                                        handleBankChange(
                                          "bankAccountName",
                                          item.AccountName,
                                          item
                                        )
                                      }
                                    >
                                      {item.AccountName?.length > 13
                                        ? item.AccountName.slice(0, 13) + "..."
                                        : item.AccountName}
                                    </DropdownItem>

                                    {item.AccountName?.length > 13 ? (
                                      <>
                                        <Tooltip
                                          id={`account${ind}`}
                                          direction="right"
                                          text={item.AccountName}
                                        />
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    <div className="d-flex align-items-center mt-2 mb-2">
                      <label className="fw-bold mb-0 ">Amount</label>{" "}
                      {/* <InputHelp className="ms-2" /> */}
                      <UncontrolledDropdown
                        className="user-dropdown justify-content-center "
                        isOpen={help.amountHelp}
                        toggle={() => {}}
                      >
                        <DropdownToggle tag="a">
                          <img
                            className="ml-1"
                            src={PaymentInputInfoIcon}
                            onMouseEnter={() =>
                              setHelp({ ...help, amountHelp: true })
                            }
                            onMouseLeave={() =>
                              setHelp({ ...help, amountHelp: false })
                            }
                            // onClick={() => setIsOpen(!isOpen)}
                            alt="PaymentInputInfoIcon"
                          />
                        </DropdownToggle>

                        <DropdownMenu
                          container="body"
                          className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1 shadow-xl  "
                          style={{
                            position: "absolute",
                            top: 0,
                            zIndex: 10000,
                            width: "250px",
                          }}
                        >
                          <div className="dropdown-body">
                            <div className="avtar-rows-container">
                              Lorem ipsum dolor sit amet, consectetuer
                              adipiscing elit, sed diam nonummy nibh
                            </div>
                          </div>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                    <input
                      type="number"
                      // {...register("amount", {
                      //   required: "amount is required",
                      // })}
                      name="bankAmount"
                      value={bankDetails?.bankAmount}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          bankAmount: e.target.value,
                        })
                      }
                      style={{ height: "40px" }}
                      className="form-control h-line"
                      placeholder="5000"
                      min="1"
                      max={orderList?.orderData?.Order?.totalNetAmount || ""}
                    />
                    <div className="d-flex align-items-center mt-2 mb-2">
                      <label className="fw-bold mb-0">Channel</label>{" "}
                      {/* <InputHelp className="ms-2" /> */}
                      <UncontrolledDropdown
                        className="user-dropdown justify-content-center "
                        isOpen={help.channelHelp}
                        toggle={() => {}}
                      >
                        <DropdownToggle tag="a">
                          <img
                            className="ml-1"
                            src={PaymentInputInfoIcon}
                            onMouseEnter={() =>
                              setHelp({ ...help, channelHelp: true })
                            }
                            onMouseLeave={() =>
                              setHelp({ ...help, channelHelp: false })
                            }
                            // onClick={() => setIsOpen(!isOpen)}
                            alt="PaymentInputInfoIcon"
                          />
                        </DropdownToggle>

                        <DropdownMenu
                          container="body"
                          className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1 shadow-xl  "
                          style={{
                            position: "absolute",
                            top: 0,
                            zIndex: 10000,
                            width: "250px",
                          }}
                        >
                          <div className="dropdown-body">
                            <div className="avtar-rows-container">
                              Lorem ipsum dolor sit amet, consectetuer
                              adipiscing elit, sed diam nonummy nibh
                            </div>
                          </div>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                    <UncontrolledDropdown
                      className="user-dropdown w-100 position-relative form-control-lg form-control cursor-pointer"
                      id="saleType"
                      isOpen={isDropdownChannel}
                      toggle={() => setIsDropdownChannel(!isDropdownChannel)}
                    >
                      <DropdownToggle
                        tag="a"
                        className="w-100"
                        onClick={() => setIsDropdownChannel(!isDropdownChannel)}
                      >
                        <div className="">
                          <div className="d-flex text-dark align-items-center">
                            <div className="">
                              <span className="text-uppercase ">
                                {bankDetails?.bankChannelName
                                  ? bankDetails?.bankChannelName
                                  : "channel name"}
                                {/* {selectedSaleType
                        ? selectedSaleType.Name
                        : saleTypeDefault?.Name} */}
                              </span>
                            </div>
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
                              {bankData[0]?.Channels.map((item, ind) => {
                                return (
                                  <React.Fragment key={ind}>
                                    <DropdownItem
                                      id={`channel${ind}`}
                                      className="fw-medium fs-14 d-flex align-items-center"
                                      onClick={() =>
                                        handleBankChange(
                                          "bankChannelName",
                                          item.ChannelName,
                                          item
                                        )
                                      }
                                    >
                                      {item.ChannelName?.length > 13
                                        ? item.ChannelName.slice(0, 13) + "..."
                                        : item.ChannelName}
                                    </DropdownItem>

                                    {item.ChannelName?.length > 13 ? (
                                      <>
                                        <Tooltip
                                          id={`account${ind}`}
                                          direction="right"
                                          text={item.ChannelName}
                                        />
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                    <div className="mt-2 d-flex cust-d-collumn">
                      <div className="w-100 me-3">
                        <div className="d-flex align-items-center mt-2 mb-2">
                          <label className="fw-bold mb-0">
                            Transaction/Check#
                          </label>{" "}
                          {/* <InputHelp className="ms-2" /> */}
                          <UncontrolledDropdown
                            className="user-dropdown justify-content-center "
                            isOpen={help.transactionHelp}
                            toggle={() => {}}
                          >
                            <DropdownToggle tag="a">
                              <img
                                className="ml-1"
                                src={PaymentInputInfoIcon}
                                onMouseEnter={() =>
                                  setHelp({ ...help, transactionHelp: true })
                                }
                                onMouseLeave={() =>
                                  setHelp({ ...help, transactionHelp: false })
                                }
                                // onClick={() => setIsOpen(!isOpen)}
                                alt="PaymentInputInfoIcon"
                              />
                            </DropdownToggle>

                            <DropdownMenu
                              container="body"
                              className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1 shadow-xl  "
                              style={{
                                position: "absolute",
                                top: 0,
                                zIndex: 10000,
                                width: "250px",
                              }}
                            >
                              <div className="dropdown-body">
                                <div className="avtar-rows-container">
                                  Lorem ipsum dolor sit amet, consectetuer
                                  adipiscing elit, sed diam nonummy nibh
                                </div>
                              </div>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                        <input
                          type="text"
                          // {...register("transaction", {
                          //   required: "transaction is required",
                          // })}
                          name="bankTransaction"
                          value={bankTransaction}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              bankTransaction: e.target.value,
                            })
                          }
                          style={{ height: "40px" }}
                          className="form-control h-line"
                          placeholder="5000"
                        />
                      </div>
                      <div className="w-100">
                        <div className="d-flex align-items-center mt-2 mb-2">
                          <label className="fw-bold mb-0">
                            Transaction/Check Date
                          </label>{" "}
                          {/* <InputHelp className="ms-2" /> */}
                          <UncontrolledDropdown
                            className="user-dropdown justify-content-center "
                            isOpen={help.transactionDateHelp}
                            toggle={() => {}}
                          >
                            <DropdownToggle tag="a">
                              <img
                                className="ml-1"
                                src={PaymentInputInfoIcon}
                                onMouseEnter={() =>
                                  setHelp({
                                    ...help,
                                    transactionDateHelp: true,
                                  })
                                }
                                onMouseLeave={() =>
                                  setHelp({
                                    ...help,
                                    transactionDateHelp: false,
                                  })
                                }
                                // onClick={() => setIsOpen(!isOpen)}
                                alt="PaymentInputInfoIcon"
                              />
                            </DropdownToggle>

                            <DropdownMenu
                              container="body"
                              className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1 shadow-xl  "
                              style={{
                                position: "absolute",
                                top: 0,
                                zIndex: 10000,
                                width: "250px",
                              }}
                            >
                              <div className="dropdown-body">
                                <div className="avtar-rows-container">
                                  Lorem ipsum dolor sit amet, consectetuer
                                  adipiscing elit, sed diam nonummy nibh
                                </div>
                              </div>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                        <input
                          type="date"
                          name="bankTransactionDate"
                          value={bankTransactionDate}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              bankTransactionDate: e.target.value,
                            })
                          }
                          max={getCurrentDate()}
                          min={orderList?.orderData?.Odrer?.TOrdDate}
                          // {...register("date", {
                          //   required: "date is required",
                          // })}
                          style={{ height: "40px" }}
                          className="form-control h-line"
                          placeholder="5000"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mt-3 mb-5">
                    <Button
                      color="dark"
                      className="mt-3"
                      disabled={
                        bankDetails?.bankAmount === null ||
                        bankDetails?.bankAccountId == "" ||
                        bankDetails?.bankChannelId == ""
                      }
                      // onClick={handleAddPayment}
                    >
                      Add to Payment
                    </Button>
                  </div>
                </Form>
              </div>
            )}
            {displaySummary && (
              <div
                className={`${
                  displayForm ? "col-xl-6 col-12 px-2" : "col-12"
                } bg-gray10 custome-pdmr`}
              >
                <div className="bg-gray10 mb-2 mt-5">
                  <NetPayableData />
                </div>
                <div className="border rounded-2 w-100 mb-3 bg-white my-5">
                  <div className="bg-gray2 p-2 border-bottom">
                    <span className="fw-bold fs-6">Payment Summary</span>
                  </div>
                  <div className="p-2">
                    <table className="w-100">
                      {paymentDetails?.cashDetails?.amount && (
                        <tr className="trHover">
                          <td className="fw-medium">
                            Cash{" "}
                            <UncontrolledDropdown
                              className="user-dropdown justify-content-center "
                              isOpen={help.cashHelp}
                              toggle={() => {}}
                            >
                              <DropdownToggle tag="a">
                                <img
                                  className="ml-1"
                                  src={PaymentInputInfoIcon}
                                  onMouseEnter={() =>
                                    setHelp({ ...help, cashHelp: true })
                                  }
                                  onMouseLeave={() =>
                                    setHelp({ ...help, cashHelp: false })
                                  }
                                  // onClick={() => setIsOpen(!isOpen)}
                                  alt="PaymentInputInfoIcon"
                                />
                              </DropdownToggle>

                              <DropdownMenu
                                container="body"
                                className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  zIndex: 10000,
                                  width: "250px",
                                }}
                              >
                                <div className="dropdown-body">
                                  <div className="avtar-rows-container">
                                  Payment made in cash mode
                                  </div>
                                </div>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 ">
                              {paymentDetails?.cashDetails?.accountName}
                            </small>
                          </td>
                          <td className="custom-light-text custom-text-transform">
                            {/* 31/10/2023 */}
                          </td>
                          <td className="fw-medium d-flex align-items-center justify-content-end">
                            {paymentDetails?.cashDetails?.amount}
                            <div className="paymentIcon">
                              {/* <img
                                src={PaymentEditIcon}
                                className="m-1"
                                onClick={(e) => handleEditCash("cash")}
                              ></img> */}
                              <img
                                src={PaymentDeleteIcon}
                                alt=""
                                onClick={(e) => handleDeleteCash("cash")}
                                // onClick={handleDelete}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                      <tr className="custom-border-top"></tr>
                      {paymentDetails?.walletDetails?.walletAmount > 0 && (
                        <tr className="mt-2 trHover">
                          <td className="fw-medium ">
                            wallet
                            <UncontrolledDropdown
                              className="user-dropdown justify-content-center "
                              isOpen={help.walletHelp}
                              toggle={() => {}}
                            >
                              <DropdownToggle tag="a">
                                <img
                                  src={PaymentInputInfoIcon}
                                  onMouseEnter={() =>
                                    setHelp({ ...help, walletHelp: true })
                                  }
                                  onMouseLeave={() =>
                                    setHelp({ ...help, walletHelp: false })
                                  }
                                  // onClick={() => setIsOpen(!isOpen)}
                                  alt="PaymentInputInfoIcon"
                                />
                              </DropdownToggle>

                              <DropdownMenu
                                container="body"
                                className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  zIndex: 10000,
                                  width: "250px",
                                }}
                              >
                                <div className="dropdown-body">
                                  <div className="avtar-rows-container">
                                  Payment made in wallet mode
                                  </div>
                                </div>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 ">
                              {paymentDetails?.walletDetails?.walletAccountName}
                            </small>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 ">
                              {paymentDetails?.walletDetails?.walletChannelName}
                            </small>
                          </td>
                          <td className="custom-light-text custom-text-transform">
                            <small className="custom-light-text custom-text-transform ml-3 my-0 py-0">
                              {
                                paymentDetails?.walletDetails
                                  ?.walletTransactionDate
                              }
                            </small>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 py-0">
                              Tnx#{" "}
                              {paymentDetails?.walletDetails?.walletTransaction}
                            </small>
                          </td>
                          <td className="fw-medium d-flex align-items-center justify-content-end">
                            {paymentDetails?.walletDetails?.walletAmount}
                            <div className="paymentIcon">
                              {/* <img
                                src={PaymentEditIcon}
                                className="m-1"
                                onClick={(e) => handleEditCash("wallet")}

                              ></img> */}
                              <img
                                src={PaymentDeleteIcon}
                                alt=""
                                onClick={(e) => handleDeleteCash("wallet")}
                                // onClick={handleDelete}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                      <tr className="custom-border-top"></tr>

                      {paymentDetails?.bankDetails?.bankAmount > 0 && (
                        <tr className="trHover">
                          <td className="fw-medium">
                            Bank
                            <UncontrolledDropdown
                              className="user-dropdown justify-content-center "
                              isOpen={help.BankHelp}
                              toggle={() => {}}
                            >
                              <DropdownToggle tag="a">
                                <img
                                  src={PaymentInputInfoIcon}
                                  onMouseEnter={() =>
                                    setHelp({ ...help, BankHelp: true })
                                  }
                                  onMouseLeave={() =>
                                    setHelp({ ...help, BankHelp: false })
                                  }
                                  // onClick={() => setIsOpen(!isOpen)}
                                  alt="PaymentInputInfoIcon"
                                />
                              </DropdownToggle>

                              <DropdownMenu
                                container="body"
                                className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  zIndex: 10000,
                                  width: "250px",
                                }}
                              >
                                <div className="dropdown-body">
                                  <div className="avtar-rows-container">
                                  Payment made in bank mode
                                  </div>
                                </div>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 ">
                              {paymentDetails?.bankDetails?.bankAccountName}
                            </small>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 ">
                              {paymentDetails?.bankDetails?.bankChannelName}
                            </small>
                          </td>
                          <td className="custom-light-text custom-text-transform">
                            <small className="custom-light-text custom-text-transform ml-3 my-0 py-0">
                              {paymentDetails?.bankDetails?.bankTransactionDate}
                            </small>
                            <br />
                            <small className="custom-light-text custom-text-transform ml-3 my-0 py-0">
                              Tnx#{" "}
                              {paymentDetails?.bankDetails?.bankTransaction}
                            </small>
                          </td>
                          <td className="fw-medium d-flex align-items-center justify-content-end">
                            {paymentDetails?.bankDetails?.bankAmount}
                            <div className="paymentIcon">
                              {/* <img
                                src={PaymentEditIcon}
                                className="m-1"
                                onClick={(e) => handleEditCash("bank")}

                              ></img> */}
                              <img
                                src={PaymentDeleteIcon}
                                alt=""
                                onClick={(e) => handleDeleteCash("bank")}
                                // onClick={handleDelete}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </table>
                  </div>
                  {isDiscount ? (
                    <div className="p-2">
                      <div className="row justify-content-between">
                        <div className="col-7">
                          <input
                            type="text"
                            // {...register("amount", {
                            //   required: "amount is required",
                            // })}

                            name="discountReason"
                            value={discountReason}
                            onChange={(e) =>
                              setDiscountDetials({
                                ...discountDetails,
                                discountReason: e.target.value,
                              })
                            }
                            style={{ height: "40px" }}
                            className="form-control h-line"
                            placeholder="Discount Reason"
                          />
                        </div>
                        <div className="col-3">
                          <input
                            type="number"
                            // {...register("amount", {
                            //   required: "amount is required",
                            // })}
                            name="discountAmount"
                            value={discountAmount}
                            onChange={(e) =>
                              setDiscountDetials({
                                ...discountDetails,
                                discountAmount: e.target.value,
                              })
                            }
                            style={{ height: "40px" }}
                            className="form-control h-line"
                            placeholder="5000"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2">
                      <Button
                        outline
                        color="dark"
                        onClick={handleDiscountAdd}
                        className=""
                      >
                        {/* <img src={viewIcon} alt="viewIcon" /> */}
                        <span className="fs-4">+</span>
                        <span className="ms-1">Cash Discount</span>
                      </Button>
                    </div>
                  )}
                  <div className="bg-gray2 p-2 border-bottom d-flex justify-content-between">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold mr-4">
                      {symbol} {sum}
                    </span>
                  </div>
                </div>
                <div className="bg-gray2 p-2 border-bottom d-flex justify-content-between my-2">
                  {/* <span className="fw-bold">Total Pending Balance</span> */}
                  <span className="fw-bold">Balance</span>
                  <span className="fw-bold mr-4">
                    {/* {symbol} {orderList?.orderData?.Order?.NetAmt - sum} */}
                    {symbol}{" "}
                    {(
                      orderList?.orderData?.Order?.totalNetAmount - sum
                    )?.toFixed(RoundUpToDecimal)}
                  </span>
                </div>
                <div className="mt-5 d-flex justify-content-center mb-5">
                  <Button
                    className="bg-danger text-white"
                    // onClick={closePaymentModal}
                    onClick={handleSubmitPayment}
                    disabled={
                      orderList?.orderData?.Order?.totalNetAmount - sum < 0
                    }
                    // disabled={orderList?.orderData?.Order?.NetAmt - sum < 0}
                  >
                    {isLoader ? (
                      <>
                        <span>
                          <Spinner
                            size="sm"
                            color="light"
                            className="mx-1 py-1"
                          />
                        </span>
                      </>
                    ) : (
                      <>
                        <img
                          src={paymentIcon}
                          alt=""
                          className="me-2 fill-white"
                        />
                        <Link
                          // href="/#/invoice"
                          // target="_black"
                          className="text-light text-decoration-none"
                        >
                          <span>Pay</span>
                        </Link>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="position-absolute" style={{ right: "1%" }}>
              <Icon
                name="cross"
                style={{ cursor: "pointer" }}
                onClick={closePaymentModal}
                className="d-flex justify-content-end fs-2 m-2 "
              />
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default PaymentModel;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import LeftSideDetail from "./LeftSideDetail";
import RightSideDetail from "./RightSideDetail";
import { Button, Modal, ModalBody, ModalFooter, Spinner } from "reactstrap";
import viewIcon from "./../../../../../images/icons/viewIcon.svg";
import backArrowIcon from "./../../../../../images/icons/backArrowIcon.svg";
import deleteWaringIcon from "./../../../../..//images/icons/delete-waring-icon.svg";

import { useDispatch, useSelector } from "react-redux";
import Icon from "../../../../../Components/icon/Icon";
import UpdateServiceAlbum from "./../../SearchCustomer/UpdateServiceAlbum";
import {
  AddGroupOrderBook,
  generateGroupTOrdDtId,
} from "../../../../../redux/actions/AddGroupOrderBookAction";
import { toast } from "react-toastify";
import { getSingleGroupOrderList } from "../../../../../redux/actions/groupOrderListAction";
import { getBranch } from "../../../../../redux/actions/branchAction";
import { getConfig } from "../../../../../redux/actions/configAction";
import { getSaleType } from "../../../../../redux/actions/saleTypeAction";
import { getMasterList } from "../../../../../redux/actions/masterAction";
import { getOrderType } from "../../../../../redux/actions/orderTypeAction";
import { getDesignerList } from "../../../../../redux/actions/designerAction";
import { useTheme } from "../../../../../Layout/Provider/Themes";
import { getSingleGroupItemData } from "../../../../../redux/actions/serviceAction";
import { usePermissions } from "../../../../../Layout/Provider/PermissionsContext";
import {
  deleteOrderItem,
  getSingleOrderList,
} from "../../../../../redux/actions/orderListAction";

const GroupOrderBook = () => {
  const { tabId } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const itemDesc = useSelector((state) => state.itemDescription);
  const [searchService, setSearchService] = useState("");
  const [selectedService, setSelectedService] = useState();
  let [groupOldDtID, setGroupOldDtID] = useState();
  const service = useSelector((state) => state.service);
  const selectedGroupItem = service?.singleGroupService?.data?.itemDetails;
  const groupDetails = useSelector(
    (state) => state?.addGroupOrderDetails?.creategroupitem?.GROUPITEM
  );
  const groupData = useSelector(
    (state) => state?.groupOrderList?.single?.orderItemList
  );
  const [isLoader, setIsLoader] = useState(false);
  const trailDeliveryData = useSelector(
    (state) => state?.groupTrialDeliveryData
  );

  const CompanyId = localStorage.getItem("CompanyId");
  const BranchId = localStorage.getItem("BranchId");
  const [isTOrdDtIDNull, setIsTOrdDtIDNull] = useState(
    localStorage.getItem(`TOrdDtID${tabId}`) === "null"
  );
  const location = useLocation();
  const isForEdit =
    location.state && location.state.from === "group-order-list";
  const isFromOrderTrackerList =
    location.state && location.state.from == "order-tracker";

  const BU_Id = localStorage.getItem("BU_Id");

  const [balanceData, setBalanceData] = useState({});
  const [serviceId, setServiceId] = useState();
  const [TOrdHdID, setTOrdHdID] = useState();
  const [id, setId] = useState();
  const [TOrdDtID, setTOrdDtID] = useState(null);
  const [isFromItemTrackerList, setIsFromItemTrackerList] = useState(false);
  const [tab, setTab] = useState();
  const { handleAction } = usePermissions();

  // const serviceId = localStorage.getItem(`serviceId${tabId}`);
  // const TOrdHdID = localStorage.getItem(`TOrdHdID${tabId}`);
  // const id = localStorage.getItem(`customerId${tabId}`);
  // const TOrdDtID = localStorage.getItem(`TOrdDtID${tabId}`);
  // const isFromItemTrackerList =
  //   location.state && location.state.from == "item-tracker";
  // const tab = location.state && location.state.tab;
  const [TOrdNo, setTOrdNo] = useState();
  const [mood, setMood] = useState();

  useEffect(() => {
    // if (isFromOrderTrackerList || isFromItemTrackerList) {
    if (location.state !== null) {
      setTOrdNo(location.state.TOrdNo);
      // setMood(location.state.mood);
    } else {
      const data = JSON.parse(localStorage.getItem("orderEditData"));

      setTOrdNo(data.TOrdNo);
      // setMood(data.mood);
    }
    // }
  }, [tabId, location.state]);

  useEffect(() => {
    // if (isFromOrderTrackerList || isFromItemTrackerList) {   
    if (tabId) {
      const blncData = localStorage.getItem(`TOrdDtID${tabId}`);

      if (location.state !== null) {
        if (location.state.from == "new-order") {
          setTOrdDtID(null);
        } else {
          setTOrdDtID(localStorage.getItem(`TOrdDtID${tabId}`));
        }
        setId(localStorage.getItem(`customerId${tabId}`));
        setTOrdHdID(localStorage.getItem(`TOrdHdID${tabId}`));
        setMood(localStorage.getItem(`mood${tabId}`));
        // setBalanceData(localStorage.getItem(`balanceData${tabId}`));
        setServiceId(localStorage.getItem(`serviceId${tabId}`));
        setTab(location?.state?.tab);
        // setIsFromItemTrackerList(false);
        // setFrom(location?.state?.from);
      } else if (blncData != null) {
        const data = JSON.parse(localStorage.getItem("orderEditData"));

        setId(localStorage.getItem(`customerId${tabId}`));
        setTOrdHdID(localStorage.getItem(`TOrdHdID${tabId}`));
        setMood(localStorage.getItem(`mood${tabId}`));
        // setBalanceData(JSON.parse(blncData));
        setTOrdDtID(localStorage.getItem(`TOrdDtID${tabId}`));
        setServiceId(localStorage.getItem(`serviceId${tabId}`));
        setTab(data.tab);
        setIsFromItemTrackerList(true);
      } else {
        const data = JSON.parse(localStorage.getItem("orderEditData"));

        setId(data.AccountId);
        // setBalanceData(data?.balanceData);
        setTab(data?.tab);
        setIsFromItemTrackerList(true);
        setTOrdHdID(data.TOrdHdID);
        setTOrdDtID(data.TOrdDtId);
        setServiceId(data.ItemId);
        setMood(data.mood);

        localStorage.setItem(`customerId${tabId}`, data.AccountId);
        localStorage.setItem(`TOrdHdID${tabId}`, data.TOrdHdID);
        localStorage.setItem(`serviceId${tabId}`, data.ItemId);
        localStorage.setItem(`TOrdDtID${tabId}`, data.TOrdDtId);
        localStorage.setItem(`mood${tabId}`, data.mood);
        // localStorage.setItem(
        //   `balanceData${tabId}`,
        //   JSON.stringify(data?.balanceData)
        // );
      }
    }
    // }
    // else{
    //   setTOrdHdID(localStorage.getItem(`TOrdHdID${tabId}`));
    //   setTOrdDtID(localStorage.getItem(`TOrdDtID${tabId}`));
    //   setId(localStorage.getItem(`customerId${tabId}`));
    //   setServiceId(localStorage.getItem(`serviceId${tabId}`));
    // }
  }, [tabId]);

  useEffect(() => {
    dispatch(getSingleOrderList(TOrdDtID));
  }, [TOrdDtID]);

  useEffect(() => {
    if (TOrdDtID) {
      dispatch(getSingleGroupOrderList(TOrdDtID));
    }
  }, [TOrdDtID]);
  useEffect(() => {
    if (serviceId) {
      dispatch(getSingleGroupItemData(serviceId));
    }
  }, [serviceId]);
  useEffect(() => {
    if (serviceId) {
      dispatch(getSingleGroupItemData(serviceId));
    }
  }, []);

  // const singleGroupOrderData = useSelector(
  //   (state) => state.groupOrderList.single
  // );

  useEffect(() => {
    dispatch(getSaleType(BU_Id));
    dispatch(getMasterList(BU_Id));
    dispatch(getOrderType(BU_Id));
    dispatch(getDesignerList(BU_Id));
  }, []);

  useEffect(() => {
    // dispatch(getVatSlabData(selectedItem.VatSlabId));
    // dispatch(getBranch(BranchId)).then((res) => {});
    if (BU_Id) {
      dispatch(getConfig(BU_Id));
    }
  }, []);

  const [conformModel, setConformModel] = useState(false);

  const handleBacktoService = () => {
    setConformModel(true);

    const oldDtID = localStorage.getItem(`TOrdDtID${tabId}`);
    // setModalIsOpen(true);
    // navigate("/add-order");
    setGroupOldDtID(oldDtID);
    // navigate("/add-order", {
    //   state: { from: "group-page", groupOldDtID: groupOldDtID },
    // });
    // setSearchService("");
    // localStorage.setItem(`TOrdDtID${tabId}`, null);

    // dispatch({ type: "GET_SINGLE_GROUP_ORDER_ITEM", payload: {} });
    // dispatch({ type: "ADD_GROUP_ORDER", payload: {} });
    // dispatch({ type: "GET_SINGLE_GROUP_SERVICE", payload: {} });
  };

  const handleConformModel = () => {
    dispatch(deleteOrderItem(groupOldDtID)).then((res) => {
      if (res?.success) {
        navigate("/add-order", {
          state: { from: "group-page", groupOldDtID: groupOldDtID },
        });
        setSearchService("");
        localStorage.setItem(`TOrdDtID${tabId}`, null);

        dispatch({ type: "GET_SINGLE_GROUP_ORDER_ITEM", payload: {} });
        dispatch({ type: "ADD_GROUP_ORDER", payload: {} });
        dispatch({ type: "GET_SINGLE_GROUP_SERVICE", payload: {} });
      }
    });
  };

  const cancleBack = () => {
    setConformModel(false);
  };
  // const handleAddOrder = () => {
  //   navigate("/order-list", {
  //     state: { from: "group-page", id: id },
  //   });
  // };

  const getGroupPaymentInfo = useSelector(
    (state) => state?.getGroupPaymentInfo
  );

  const getGroupFabAccAmount = useSelector(
    (state) => state?.getGroupFabAccAmount
  );
  // const fabAccAmountObject = useSelector((state) => state.getGroupFabAccAmount);

  // const handleImageClick = (item) => {

  //   setSelectedService(item);
  // };

  useEffect(() => {
    setMasterData({
      ...masterData,
      TOrdHdID: TOrdHdID,
      CompanyId: CompanyId,
      BranchId: BranchId,
      TOrdDtID: TOrdDtID,
    });
  }, [TOrdDtID, TOrdHdID]);
  const [masterData, setMasterData] = useState({
    // ...selectedGroupItem,
    // ItemId: selectedGroupItem?.ItemId,
    TOrdHdID: TOrdHdID,
    CompanyId: CompanyId,
    BranchId: BranchId,
    TOrdDtID: TOrdDtID,
    // IsGroup: true,
    // AccessoryAmt:

    DelDate:
      trailDeliveryData?.deliveryDate == undefined
        ? new Date()
        : trailDeliveryData?.deliveryDate,
    TrialDate:
      trailDeliveryData?.trialDate == undefined
        ? new Date()
        : trailDeliveryData?.trialDate,
    DeliveryDate:
      trailDeliveryData?.deliveryDate == undefined
        ? new Date()
        : trailDeliveryData?.deliveryDate,
    LastUpdateddate: new Date(),
    IsAlteration: 0, // FR  Static 0
    ItemLocation: null, //FR Static Null
    DesignDiscAmt: 0, // FR static = 0
    AccessoryDiscAmt: null, // - blank to  sheet
    AdDesignAmt: null, //FR static Null
    Urgent: trailDeliveryData?.priority == "regular" ? false : true,
    ItemDesc: itemDesc,
    GROUPITEM: groupDetails
      ? groupDetails?.map((subitem) => ({
          // ...subitem,
          // IsGroup: false,
          DelDate:
            trailDeliveryData?.deliveryDate == undefined
              ? new Date()
              : trailDeliveryData?.deliveryDate,
          TrialDate:
            trailDeliveryData?.trialDate == undefined
              ? new Date()
              : trailDeliveryData?.trialDate,
          DeliveryDate:
            trailDeliveryData?.deliveryDate == undefined
              ? new Date()
              : trailDeliveryData?.deliveryDate,
          Urgent: trailDeliveryData?.priority == "regular" ? false : true,

          LastUpdateddate: new Date(),
          TOrdHdID: TOrdHdID,
          CompanyId: CompanyId,
          BranchId: BranchId,
          TOrdDtID: subitem?.TOrdDtId,
        }))
      : groupData?.groupItemList?.map((subitem) => ({
          // ...subitem,
          // IsGroup: false,
          DelDate:
            trailDeliveryData?.deliveryDate == undefined
              ? new Date()
              : trailDeliveryData?.deliveryDate,
          TrialDate:
            trailDeliveryData?.trialDate == undefined
              ? new Date()
              : trailDeliveryData?.trialDate,
          DeliveryDate:
            trailDeliveryData?.deliveryDate == undefined
              ? new Date()
              : trailDeliveryData?.deliveryDate,
          Urgent: trailDeliveryData?.priority == "regular" ? false : true,

          LastUpdateddate: new Date(),
          TOrdHdID: TOrdHdID,
          CompanyId: CompanyId,
          BranchId: BranchId,
          TOrdDtID: subitem?.TOrdDtId,
        })),
  });

  useEffect(() => {
    setMasterData({
      // ...selectedGroupItem,
      // ItemId: selectedGroupItem?.ItemId,
      TOrdHdID: TOrdHdID,
      CompanyId: CompanyId,
      BranchId: BranchId,
      TOrdDtID: TOrdDtID,
      // IsGroup: true,
      // AccessoryAmt:

      DelDate:
        trailDeliveryData?.deliveryDate == undefined
          ? new Date()
          : trailDeliveryData?.deliveryDate,
      TrialDate:
        trailDeliveryData?.trialDate == undefined
          ? new Date()
          : trailDeliveryData?.trialDate,
      DeliveryDate:
        trailDeliveryData?.deliveryDate == undefined
          ? new Date()
          : trailDeliveryData?.deliveryDate,
      LastUpdateddate: new Date(),
      IsAlteration: 0, // FR  Static 0
      ItemLocation: null, //FR Static Null
      DesignDiscAmt: 0, // FR static = 0
      AccessoryDiscAmt: null, // - blank to  sheet
      AdDesignAmt: null, //FR static Null
      Urgent: trailDeliveryData?.priority == "regular" ? false : true,

      GROUPITEM: groupDetails
        ? groupDetails?.map((subitem) => ({
            // ...subitem,
            // IsGroup: false,
            DelDate:
              trailDeliveryData?.deliveryDate == undefined
                ? new Date()
                : trailDeliveryData?.deliveryDate,
            TrialDate:
              trailDeliveryData?.trialDate == undefined
                ? new Date()
                : trailDeliveryData?.trialDate,
            DeliveryDate:
              trailDeliveryData?.deliveryDate == undefined
                ? new Date()
                : trailDeliveryData?.deliveryDate,
            Urgent: trailDeliveryData?.priority == "regular" ? false : true,

            LastUpdateddate: new Date(),
            TOrdHdID: TOrdHdID,
            CompanyId: CompanyId,
            BranchId: BranchId,
            TOrdDtID: subitem?.TOrdDtId,
          }))
        : groupData?.groupItemList?.map((subitem) => ({
            // ...subitem,
            // IsGroup: false,
            DelDate:
              trailDeliveryData?.deliveryDate == undefined
                ? new Date()
                : trailDeliveryData?.deliveryDate,
            TrialDate:
              trailDeliveryData?.trialDate == undefined
                ? new Date()
                : trailDeliveryData?.trialDate,
            DeliveryDate:
              trailDeliveryData?.deliveryDate == undefined
                ? new Date()
                : trailDeliveryData?.deliveryDate,
            Urgent: trailDeliveryData?.priority == "regular" ? false : true,

            LastUpdateddate: new Date(),
            TOrdHdID: TOrdHdID,
            CompanyId: CompanyId,
            BranchId: BranchId,
            TOrdDtID: subitem?.TOrdDtId,
          })),
    });
  }, []);

  useEffect(() => {
    setMasterData({
      ...masterData,
      ItemDesc: selectedGroupItem?.ItemDescription,
    });
  }, [selectedGroupItem]);

  useEffect(() => {
    setMasterData({
      ...masterData,
      DelDate:
        trailDeliveryData?.deliveryDate == undefined
          ? new Date()
          : trailDeliveryData?.deliveryDate,
      TrialDate:
        trailDeliveryData?.trialDate == null
          ? null
          : trailDeliveryData?.trialDate,
      DeliveryDate:
        trailDeliveryData?.deliveryDate == undefined
          ? new Date()
          : trailDeliveryData?.deliveryDate,
      Urgent: trailDeliveryData?.priority == "regular" ? false : true,

      GROUPITEM: groupDetails
        ? groupDetails?.map((subitem) => ({
            // ...subitem,
            // IsGroup: false,
            DelDate:
              trailDeliveryData?.deliveryDate == undefined
                ? new Date()
                : trailDeliveryData?.deliveryDate,
            TrialDate:
              trailDeliveryData?.trialDate == undefined
                ? new Date()
                : trailDeliveryData?.trialDate,
            DeliveryDate:
              trailDeliveryData?.deliveryDate == undefined
                ? new Date()
                : trailDeliveryData?.deliveryDate,
            Urgent: trailDeliveryData?.priority == "regular" ? false : true,

            LastUpdateddate: new Date(),
            TOrdHdID: TOrdHdID,
            CompanyId: CompanyId,
            BranchId: BranchId,
            TOrdDtID: subitem?.TOrdDtId,
          }))
        : groupData?.groupItemList?.map((subitem) => ({
            // ...subitem,
            // IsGroup: false,
            DelDate:
              trailDeliveryData?.deliveryDate == undefined
                ? new Date()
                : trailDeliveryData?.deliveryDate,
            TrialDate:
              trailDeliveryData?.trialDate == undefined
                ? new Date()
                : trailDeliveryData?.trialDate,
            DeliveryDate:
              trailDeliveryData?.deliveryDate == undefined
                ? new Date()
                : trailDeliveryData?.deliveryDate,
            Urgent: trailDeliveryData?.priority == "regular" ? false : true,

            LastUpdateddate: new Date(),
            TOrdHdID: TOrdHdID,
            CompanyId: CompanyId,
            BranchId: BranchId,
            TOrdDtID: subitem?.TOrdDtId,
          })),
    });
  }, [
    groupDetails,
    groupData,
    // fabAccAmountObject,
    getGroupPaymentInfo,
    trailDeliveryData,
  ]);

  const handleAddOrder = () => {
    setIsLoader(true);

    dispatch(
      AddGroupOrderBook(
        localStorage.getItem(`TOrdDtID${tabId}`),
        localStorage.getItem(`serviceId${tabId}`),

        TOrdHdID,
        masterData,
        getGroupPaymentInfo,
        getGroupFabAccAmount,
        trailDeliveryData
      )
    ).then((res) => {
      if (res.success) {
        toast.success(res.message);
        setIsLoader(false);
        if (isFromOrderTrackerList) {
          navigate(
            // `/order-tracker-single-order/${location.state.TOrdNo}/${location.state.mood}`,
            `/order-tracker-single-order`,
            {
              state: {
                tab: tab,
                from: "order-tracker",
                TOrdNo: location.state.TOrdNo,
                mood: location.state.mood,
              },
            }
          );
        } else if (isFromItemTrackerList) {
          // navigate(`/order-tracker-single-order/${TOrdNo}/${mood}`, {
          navigate(`/order-tracker-single-order`, {
            state: {
              tab: tab,
              from: "item-tracker",
              TOrdNo: TOrdNo,
              mood: mood,
            },
          });
        } else {
          navigate("/order-list", {
            state: { from: "group-page", id: id },
          });
        }
      } else {
        setTimeout(() => {
          setIsLoader(false);
        }, 500);
      }
    });
  };
  setTimeout(() => {
    setIsLoader(false);
  }, 5000);

  // const [isApiCallMade, setIsApiCallMade] = useState(false);

  useEffect(() => {
    if (
      TOrdHdID != null &&
      selectedGroupItem &&
      Object.keys(selectedGroupItem).length > 0
    ) {
      if (
        (TOrdDtID == "null" || TOrdDtID == null) &&
        selectedGroupItem?.GROUPITEM?.length > 0
      ) {
        const modifiedObject = {
          ...selectedGroupItem,
          // ItemId: selectedGroupItem?.ItemId,
          TOrdHdID: TOrdHdID,
          CompanyId: CompanyId,
          BranchId: BranchId,
          Discount: 0,
          Amount: selectedGroupItem?.BasicRate,
          VatPerc: +getGroupPaymentInfo?.vat,
          VatAmt:
            +getGroupPaymentInfo?.vatAmt == "NaN"
              ? 0
              : +getGroupPaymentInfo?.vatAmt,
          STPerc: +getGroupPaymentInfo?.vat,
          STAmt: +getGroupPaymentInfo?.vatAmt,
          MakingAmt: selectedGroupItem?.BasicRate,
          FabAmt: 0,
          AccessoryAmt: 0,

          StitchingDiscAmt: Number(getGroupPaymentInfo?.afterdiscountAmt),
          FabDiscAmt: Number(getGroupPaymentInfo?.discountAmt),
          BasicRate: selectedGroupItem?.BasicRate,
          NetAmount: selectedGroupItem?.BasicRate,
          AdStitching: Number(getGroupPaymentInfo?.afterdiscountAmt),
          AdSTax: Number(getGroupPaymentInfo?.TaxAmt),
          DelAmount: Number(getGroupPaymentInfo?.netPayable),
          SGSTPer: Number(getGroupPaymentInfo?.SGST),
          SGSTAmt: Number(getGroupPaymentInfo?.SGSTAmt),
          CGSTPer: Number(getGroupPaymentInfo?.CGST),
          CGSTAmt: Number(getGroupPaymentInfo?.CGSTAmt),
          IGSTPer: Number(getGroupPaymentInfo?.IGST),
          IGSTAmt: Number(getGroupPaymentInfo?.IGSTAmt),
          DisPer: 0,
          DisAmt: 0,
          IsAlteration: 0, // FR  Static 0
          ItemLocation: null, //FR Static Null
          DesignDiscAmt: 0, // FR static = 0
          AccessoryDiscAmt: null, // - blank to  sheet
          AdDesignAmt: null,
          TotalAfterDiscount: Number(getGroupPaymentInfo?.afterdiscountAmt),
          ItemDesc: selectedGroupItem?.ItemDescription,
          Rate: selectedGroupItem?.BasicRate,
          ItemName: selectedGroupItem?.ItemName,
          DelDate:
            trailDeliveryData?.deliveryDate == undefined
              ? new Date()
              : trailDeliveryData?.deliveryDate,
          TrialDate:
            trailDeliveryData?.trialDate == undefined
              ? new Date()
              : trailDeliveryData?.trialDate,
          DeliveryDate:
            trailDeliveryData?.deliveryDate == undefined
              ? new Date()
              : trailDeliveryData?.deliveryDate,
          Urgent: trailDeliveryData?.priority == "regular" ? false : true,
          LastUpdateddate: new Date(),
          // selectedGroupItem,
          // ItemName: selectedGroupItem?.ItemName,
          GROUPITEM: selectedGroupItem?.GROUPITEM.map((subitem) => ({
            ...subitem,
            // ItemId: subitem?.ItemId,
            TOrdHdID: TOrdHdID,
            CompanyId: CompanyId,
            BranchId: BranchId,
            ItemDesc: subitem?.ItemDescription,
            ItemName: subitem?.ItemName,
            BasicRate: subitem?.BasicRate,
            NetAmount: subitem?.BasicRate,
            Rate: subitem?.BasicRate,
            LastUpdateddate: new Date(),
            DelDate:
              trailDeliveryData?.deliveryDate == undefined
                ? new Date()
                : trailDeliveryData?.deliveryDate,
            TrialDate:
              trailDeliveryData?.trialDate == undefined
                ? new Date()
                : trailDeliveryData?.trialDate,
            DeliveryDate:
              trailDeliveryData?.deliveryDate == undefined
                ? new Date()
                : trailDeliveryData?.deliveryDate,
            Urgent: trailDeliveryData?.priority == "regular" ? false : true,
            // BasicRate:selectedGroupItem
            // subitem,
            // ItemName: subitem?.ItemName,
          })),
        };
        dispatch(generateGroupTOrdDtId(modifiedObject)).then((res) => {
          if (res.data.success) {
            localStorage.setItem(
              `TOrdDtID${tabId}`,
              res.data.creategroupitem.TOrdDtId
            );
            setIsTOrdDtIDNull(false);
            // toast.success(res.message);
          } else {
            setIsTOrdDtIDNull(true);
          }
        });
      } else {
        setIsTOrdDtIDNull(false);
      }
    }
  }, [TOrdHdID, selectedGroupItem?.ItemId]);

  const handleBackOrder = () => {
    if (isFromOrderTrackerList) {
      navigate(
        // `/order-tracker-single-order/${location.state.TOrdNo}/${location.state.mood}`,
        `/order-tracker-single-order`,
        {
          state: {
            from: "order-tracker",
            mood: "edit",
            tab: tab,
            TOrdNo: location.state.TOrdNo,
            // mood: location.state.mood,
            // balanceData: data,
          },
        }
      );
    } else if (isFromItemTrackerList) {
      // navigate(`/order-tracker-single-order/${TOrdNo}/${mood}`, {
      navigate(`/order-tracker-single-order`, {
        state: {
          from: "item-tracker",
          mood: "edit",
          tab: tab,
          TOrdNo: TOrdNo,
          // mood: location.state.mood,
          // balanceData: data,
        },
      });
    } else {
      navigate("/order-list");
    }
    // history.goBack();
  };

  const goBackItemTracker = () => {
    navigate("/item-tracker");
  };
  const handleViewToEdit = () => {
    setMood("edit");
    localStorage.setItem(`mood${tabId}`, "edit");
  };
  return (
    <>
      <div className="action-btn my-1 ">
        {/* {Object.keys(singleOrderData).length === 0 && ( */}
        <Button
          outline
          color="light"
          className="bg-white"
          onClick={handleBacktoService}
        >
          <img src={backArrowIcon} alt="viewIcon" />
          <span className="ms-1">Service</span>
        </Button>
        {/* )} */}
      </div>

      <div className=" shadow-lg bg-white  w-100 p-2 rounded-2">
        <div className="border rounded-2">
          <div className="d-flex ">
            <div className="w-100  px-3 pb-0 p-lg-3">
              <div className="row mt-3">
                <div className="col-lg-6 col-12  custom-border-right">
                  <LeftSideDetail />
                </div>

                <div className="col-lg-6 col-12 p-1 p-sm-2">
                  <RightSideDetail />
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center text-center py-lg-3 my-2 my-lg-3 my-xl-5 w-100 ">
            {!isForEdit && !isFromItemTrackerList && !isFromOrderTrackerList ? (
              <Button
                className="d-flex justify-content-center w-25"
                onClick={handleAddOrder}
              >
                {isLoader ? (
                  <>
                    <span>
                      <Spinner size="sm" color="light" className="mx-1 py-1" />
                    </span>
                  </>
                ) : (
                  <span>Add</span>
                )}
              </Button>
            ) : isFromOrderTrackerList ? (
              <div className="d-flex justify-content-center text-center py-lg-3 my-2 my-lg-3 my-xl-5 w-100">
                <Button
                  className=" me-2 "
                  onClick={handleAddOrder}
                  disabled={localStorage.getItem(`TOrdDtID${tabId}`) == null}
                >
                  {/* Add */}
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
                    <span>Update</span>
                  )}
                </Button>
                <Button
                  outline
                  color="light"
                  onClick={handleBackOrder}
                  disabled={localStorage.getItem(`TOrdDtID${tabId}`) == null}
                >
                  <span>Back</span>
                </Button>
              </div>
            ) : isFromItemTrackerList ? (
              <>
                {mood == "edit" ? (
                  <div className="d-flex justify-content-center text-center py-lg-3 my-2 my-lg-3 my-xl-5 w-100 ">
                    <Button
                      className=" me-2 "
                      onClick={handleAddOrder}
                      disabled={
                        localStorage.getItem(`TOrdDtID${tabId}`) == null
                      }
                    >
                      {/* Add */}
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
                        <span>Update</span>
                      )}
                    </Button>
                    <Button
                      outline
                      color="light"
                      onClick={handleBackOrder}
                      disabled={
                        localStorage.getItem(`TOrdDtID${tabId}`) == null
                      }
                    >
                      <span>Back</span>
                    </Button>
                  </div>
                ) : (
                  <div className="d-flex justify-content-center text-center py-lg-3 my-2 my-lg-3 my-xl-5 w-100 ">
                    <Button
                      className=" me-2 "
                      onClick={() =>
                        handleAction(
                          "BtnItemTrckrEditItem",
                          "action",
                          handleViewToEdit

                          // balanceData.balanceData
                        )
                      }
                      // onClick={handleViewToEdit}
                      disabled={
                        localStorage.getItem(`TOrdDtID${tabId}`) == null
                      }
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
                        <span>Go to Edit</span>
                      )}
                    </Button>
                    <Button
                      outline
                      color="light"
                      onClick={goBackItemTracker}
                      disabled={
                        localStorage.getItem(`TOrdDtID${tabId}`) == null
                      }
                    >
                      <span>Back</span>
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={conformModel}
        // toggle={handleImageDeleteModelClose}
        size="lg"
        className="rounded-top-4 add-order-singe-image-slider"
      >
        {/* <div className="p-4 rounded-top-4"> */}
        <div className="bg-1c2b4c text-white p-3 rounded-top-4">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>Back</div>
          </div>
        </div>

        <ModalBody>
          <div className="border rounded-2">
            <div className="d-flex my-3 mx-2 pb-5">
              <div>
                <div className="d-flex mt-2 ">
                  <img
                    src={deleteWaringIcon}
                    alt=""
                    className="mr-2"
                    width="50px"
                  />
                  <div>
                    <span className="fw-bold text-warning fs-3">
                      Back To Other service
                    </span>
                    <br />
                    <span className="custom-light-text ">
                      <b>
                        Wait! Are you sure you want to select other service?
                      </b>
                      <p className="mt-2"></p>
                      If you leave now, your item detail and progress will be
                      descard
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex p-2 border-top justify-content-end">
              <Button
                outline
                color="dark"
                className="mr-2"
                onClick={
                  () => handleConformModel()

                  // setConformModel(false);
                }
              >
                Yes
              </Button>
              <Button onClick={cancleBack}>No</Button>
            </div>
          </div>
        </ModalBody>

        {/* </div> */}
      </Modal>
    </>
  );
};

export default GroupOrderBook;

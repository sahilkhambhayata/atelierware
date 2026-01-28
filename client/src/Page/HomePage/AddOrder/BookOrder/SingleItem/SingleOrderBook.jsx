import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import LeftSideDetail from "./LeftSideDetail";
import RightSideDetail from "./RightSideDetail";
import viewIcon from "./../../../../../images/icons/viewIcon.svg";
import backArrowIcon from "./../../../../../images/icons/backArrowIcon.svg";
import deleteWaringIcon from "./../../../../..//images/icons/delete-waring-icon.svg";

import { useDispatch, useSelector } from "react-redux";
import {
  AddOrderBook,
  generateTOrdDtId,
} from "../../../../../redux/actions/AddOrderBookAction";
import { toast } from "react-toastify";
import { getVatSlabData } from "../../../../../redux/actions/VatSlabAction";
import { Button, Modal, ModalBody, ModalFooter, Spinner } from "reactstrap";
import ServiceAlbum from "../../SearchCustomer/ServiceAlbum";
import ProductAlbum from "../../SearchCustomer/ProductAlbum";
import Icon from "../../../../../Components/icon/Icon";
import UpdateServiceAlbum from "../../SearchCustomer/UpdateServiceAlbum";
import { getSingleGroupItemData } from "../../../../../redux/actions/serviceAction";
import { getSaleType } from "../../../../../redux/actions/saleTypeAction";
import { getMasterList } from "../../../../../redux/actions/masterAction";
import { getOrderType } from "../../../../../redux/actions/orderTypeAction";
import { getDesignerList } from "../../../../../redux/actions/designerAction";

import { useTheme } from "../../../../../Layout/Provider/Themes";
import {
  deleteOrderItem,
  getSingleOrderList,
} from "../../../../../redux/actions/orderListAction";
import { usePermissions } from "../../../../../Layout/Provider/PermissionsContext";
// import { useHistory } from "react-router-dom";

const SingleOrderBook = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { tabId } = useTheme();
  const [isModalOpen, setModalIsOpen] = useState(false);
  const [searchService, setSearchService] = useState("");
  const [switchValue, setSwitchValue] = useState("Service");
  const [isLoader, setIsLoader] = useState(false);
  const [selectedService, setSelectedService] = useState();
  let [oldDtID, setOldDtID] = useState();
  const { handleAction } = usePermissions();

  const BU_ID = localStorage.getItem("BU_Id");
  const BranchId = localStorage.getItem("BranchId");

  const [balanceData, setBalanceData] = useState({});
  const [serviceId, setServiceId] = useState();
  const [TOrdHdID, setTOrdHdID] = useState();
  const [id, setId] = useState();
  const [TOrdDtID, setTOrdDtID] = useState(null);
  const [isFromItemTrackerList, setIsFromItemTrackerList] = useState(false);
  const [tab, setTab] = useState();
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

  // useEffect(() => {
  //   if (id === null || id === "null") {
  //     navigate("/add-order");
  //   }
  // }, [id]);

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
        setTOrdDtID(data?.TOrdDtId);
        setServiceId(data?.ItemId);
        setMood(data.mood);

        localStorage.setItem(`customerId${tabId}`, data.AccountId);
        localStorage.setItem(`TOrdHdID${tabId}`, data.TOrdHdID);
        localStorage.setItem(`serviceId${tabId}`, data?.ItemId);
        localStorage.setItem(`TOrdDtID${tabId}`, data?.TOrdDtId);
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

  const CompanyId = localStorage.getItem("CompanyId");

  const isFromOrderList = location.state && location.state.from == "order-list";
  const isFromGroupOrderList =
    location.state && location.state.from == "group-page";
  const isGroupId = location.state && location.state.id;

  const isFromOrderTrackerList =
    location.state && location.state.from == "order-tracker";

  const createOrderData = useSelector(
    (state) => state.createorddtls?.ordDetails?.upCrtOrder
  );
  const service = useSelector((state) => state.service);
  const selectedItem = service?.singleGroupService?.data?.itemDetails;
  const getDirectPaymentInfo = useSelector(
    (state) => state?.getDirectPaymentInfo?.data
  );
  const imageStore = useSelector((state) => state?.imageArray.sendArray);

  const garmentStore = useSelector(
    (state) => state.garmentArray.sendGarmentArray
  );
  const trailDeliveryData = useSelector((state) => state?.trialDeliveryDate);
  const singleOrderData = useSelector((state) => state.orderListData.single);
  const [isTOrdDtIDNull, setIsTOrdDtIDNull] = useState(
    localStorage.getItem(`TOrdDtID${tabId}`) == "null" ||
      localStorage.getItem(`TOrdDtID${tabId}`) == null ||
      localStorage.getItem(`TOrdDtID${tabId}`) == undefined
  );

  const itemDesc = useSelector((state) => state.itemDescription);

  function convertBlobUrlToBase64(blobUrl) {
    return new Promise((resolve, reject) => {
      fetch(blobUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            const base64String = reader.result;
            resolve(base64String);
          };

          reader.onerror = reject;

          reader.readAsDataURL(blob);
        })
        .catch((error) => {
          console.error("Error fetching or converting the Blob:", error);
          reject(error);
        });
    });
  }

  const [masterData, setMasterData] = useState({
    ItemId: selectedItem?.ItemId,
    CompanyId: CompanyId,
    BranchId: BranchId,
    // TOrdHdID: localStorage.getItem(`TOrdHdID${tabId}`),
    attach_img_1: imageStore?.length > 0 ? imageStore?.[0]?.image : null,
    attach_img_2: imageStore?.length > 1 ? imageStore?.[1]?.image : null,
    attach_img_3: imageStore?.length > 2 ? imageStore?.[2]?.image : null,
    attach_img_4: imageStore?.length > 3 ? imageStore?.[3]?.image : null,
    attach_img_5: imageStore?.length > 4 ? imageStore?.[4]?.image : null,
    attach_img_6: imageStore?.length > 5 ? imageStore?.[5]?.image : null,
    attach_img_7: imageStore?.length > 6 ? imageStore?.[6]?.image : null,
    attach_img_8: imageStore?.length > 7 ? imageStore?.[7]?.image : null,
    attach_img_9: imageStore?.length > 8 ? imageStore?.[8]?.image : null,
    attach_img_10: imageStore?.length > 9 ? imageStore?.[9]?.image : null,

    attach_img_1_desc:
      imageStore?.length > 0 ? imageStore?.[0]?.description : null,
    attach_img_2_desc:
      imageStore?.length > 1 ? imageStore?.[1]?.description : null,
    attach_img_3_desc:
      imageStore?.length > 2 ? imageStore?.[2]?.description : null,
    attach_img_4_desc:
      imageStore?.length > 3 ? imageStore?.[3]?.description : null,
    attach_img_5_desc:
      imageStore?.length > 4 ? imageStore?.[4]?.description : null,
    attach_img_6_desc:
      imageStore?.length > 5 ? imageStore?.[5]?.description : null,
    attach_img_7_desc:
      imageStore?.length > 6 ? imageStore?.[6]?.description : null,
    attach_img_8_desc:
      imageStore?.length > 7 ? imageStore?.[7]?.description : null,
    attach_img_9_desc:
      imageStore?.length > 8 ? imageStore?.[8]?.description : null,
    attach_img_10_desc:
      imageStore?.length > 9 ? imageStore?.[9]?.description : null,

    attach_garment_img_1:
      garmentStore?.length > 0 ? garmentStore?.[0]?.image : null,
    attach_garment_img_2:
      garmentStore?.length > 1 ? garmentStore?.[1]?.image : null,
    attach_garment_img_3:
      garmentStore?.length > 2 ? garmentStore?.[2]?.image : null,

    attach_garment_img_1_desc:
      garmentStore?.length > 0 ? garmentStore?.[0]?.description : null,
    attach_garment_img_2_desc:
      garmentStore?.length > 1 ? garmentStore?.[1]?.description : null,
    attach_garment_img_3_desc:
      garmentStore?.length > 2 ? garmentStore?.[2]?.description : null,
    ItemName: selectedItem?.ItemName,
    // Rate: , // dis
    // Discount: getDirectPaymentInfo?.discountAmt, // discountAmount or discountpercent e dono me se ek  ?
    // Amount: getDirectPaymentInfo?.Stitching, // qty * rate  (qty = 1 static Backend)
    PatternAmt: 0, //dis
    DesignAmt: 0,
    // VatPerc: getDirectPaymentInfo?.vat,
    // VatAmt: getDirectPaymentInfo?.vatAmt, //vatAmt Calculated filed
    // STPerc: getDirectPaymentInfo?.vat, // VatPerc (MstVatSlab)
    // STAmt: getDirectPaymentInfo?.vatAmt, //vatAmt Calculated filed
    // Urgent: trailDeliveryData?.priority == "regular" ? false : true,
    MainItemId: null, // get to group items
    DelDate:
      trailDeliveryData?.deliveryDate == undefined
        ? new Date()
        : trailDeliveryData?.deliveryDate,
    TrialDate:
      trailDeliveryData?.trialDate == undefined
        ? new Date()
        : trailDeliveryData?.trialDate,
    DelMode: "In-Store", //FR static (In-Store)
    DelRemarks: null, //FR static (null)
    DesignerId: createOrderData?.SalesmanId,
    MasterId: createOrderData?.MasterId,
    // FabAmt: getDirectPaymentInfo?.FabricAmt,
    // AccessoryAmt: getDirectPaymentInfo?.AccessoriesAmount,
    // StitchingDiscAmt: getDirectPaymentInfo?.afterdiscountAmt, //making DiscAmt
    // FabDiscAmt: getDirectPaymentInfo?.discountAmt, //making DiscAmt
    // BasicRate: getDirectPaymentInfo?.basicAmt, //pending Basic Rate = Making + Fabric + Acccessary)
    NetAmount: null,
    // AdStitching: getDirectPaymentInfo?.afterdiscountAmt, //Ad = AfterDiscount  Calculated Amount
    AdPattern: 0, // FR static = 0
    // AdSTax: getDirectPaymentInfo?.TaxAmt, //Calculated Amount  //dis
    AdFabAmt: null, //Calculated Amount  // dis
    AdAccessoryAmt: null, //Calculated Amount //dis
    GroupItem: isFromGroupOrderList ? isGroupId.GroupItem : null,
    // GroupItem: null, // IsGroup = true | false  no idea
    // DelAmount: getDirectPaymentInfo?.netPayable, // net  Amount
    DeliveryDate:
      trailDeliveryData?.trialDate == null
        ? null
        : trailDeliveryData?.deliveryDate == undefined
        ? new Date()
        : trailDeliveryData?.deliveryDate,
    ItemDesc: itemDesc,
    // SGSTPer: getDirectPaymentInfo?.SGST, //FR - Hidden   VatSlabData -> SGST
    // SGSTAmt: getDirectPaymentInfo?.SGSTAmt, //FR - Hidden
    // CGSTPer: getDirectPaymentInfo?.CGST, //FR - Hidden  VatSlabData -> CGST
    // CGSTAmt: getDirectPaymentInfo?.CGSTAmt, //FR - Hidden
    // IGSTPer: getDirectPaymentInfo?.IGST, //FR - Hidden
    // IGSTAmt: getDirectPaymentInfo?.IGSTAmt, //FR - Hidden
    LastUpdateddate: new Date(),
    // DisPer: getDirectPaymentInfo?.DiscountPer,
    // DisAmt: getDirectPaymentInfo?.discountAmt,
    IsAlteration: 0, // FR  Static 0
    ItemLocation: null, //FR Static Null
    DesignDiscAmt: 0, // FR static = 0
    AccessoryDiscAmt: null, // - blank to  sheet
    AdDesignAmt: null, //FR static Null
    // makingAmt:
    // TotalAfterDiscount: getDirectPaymentInfo?.afterdiscountAmt, //basic amt - DiscAmt pending
  });

  const handleSwitchChange = (value) => {
    setSwitchValue(value);
  };

  const handleImageClick = (item) => {
    setSelectedService(item);
  };

  const [conformModel, setConformModel] = useState(false);

  const handleBacktoService = () => {
    setConformModel(true);
  };

  const handleConformModel = () => {
    dispatch(deleteOrderItem(localStorage.getItem(`TOrdDtID${tabId}`))).then(
      (res) => {
        if (res?.success) {
          navigate("/add-order", {
            state: {
              from: "add-order-home-page",
              oldDtID: localStorage.getItem(`TOrdDtID${tabId}`),
            },
          });
          // navigate("/add-order");
          setSearchService("");
          localStorage.setItem(`TOrdDtID${tabId}`, null);

          dispatch({ type: "GET_FABRIC_ACC_LIST", payload: {} });
          dispatch({ type: "GET_SINGLE_ORDER_ITEM", payload: {} });
          dispatch({ type: "GET_SINGLE_GROUP_SERVICE", payload: {} });
        }
      }
    );
  };

  const cancleBack = () => {
    setConformModel(false);
  };
  const handleSearchServiceChange = (e) => {
    setSearchService(e.target.value);
  };

  // location.state.TOrdNo
  const handleAddOrder = () => {
    setIsLoader(true);

    dispatch(
      AddOrderBook(
        localStorage.getItem(`TOrdDtID${tabId}`),
        TOrdHdID,
        masterData,
        getDirectPaymentInfo,
        trailDeliveryData
      )
    ).then((res) => {
      if (res.success) {
        toast.success(res.message);
        setIsLoader(false);

        if (isFromGroupOrderList) {
          localStorage.setItem(`TOrdDtID${tabId}`, isGroupId.GroupItem);
          navigate("/group-order-home-page", {
            state: { from: "single-page" },
          });
        } else if (isFromOrderTrackerList) {
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
          navigate("/order-list");
        }
      } else {
        setIsLoader(false);
      }
      setTimeout(() => {
        setIsLoader(false);
      }, 5000);
    });
  };
  // const history = useHistory();

  const handleBackOrder = () => {
    if (isFromOrderTrackerList || isFromItemTrackerList) {
      navigate(
        // `/order-tracker-single-order/${location.state.TOrdNo}/${location.state.mood}`,
        `/order-tracker-single-order`,
        {
          state: {
            from: "order-tracker",
            mood: "edit",
            tab: tab,
            TOrdNo: location.state.TOrdNo,

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

          // balanceData: data,
        },
      });
    } else {
      navigate("/order-list");
    }
    // history.goBack();
  };

  const toggleImage = () => {
    setModalIsOpen(false);
    // navigate("/add-order-home-page", { state: { id } });
  };

  // create order Data
  useEffect(() => {
    setOldDtID(localStorage.getItem(`TOrdDtID${tabId}`));
    if (isFromOrderList) {
      handleBacktoService();
    }
  }, [location.state]);

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

  useEffect(() => {
    dispatch(getSaleType(BU_ID));
    dispatch(getMasterList(BU_ID));
    dispatch(getOrderType(BU_ID));
    dispatch(getDesignerList(BU_ID));
  }, []);

  useEffect(() => {
    setMasterData({
      ...masterData,
      ItemId: selectedItem?.ItemId,
      ItemDesc: selectedItem?.ItemDescription,
      ItemName: selectedItem?.ItemName,
    });
  }, [selectedItem]);

  useEffect(() => {
    setMasterData({
      ...masterData,
      ItemDesc: itemDesc,
    });
  }, [itemDesc]);

  useEffect(() => {
    const data = {
      ...masterData,
      attach_img_1: imageStore?.length > 0 ? imageStore?.[0]?.image : null,
      attach_img_2: imageStore?.length > 1 ? imageStore?.[1]?.image : null,
      attach_img_3: imageStore?.length > 2 ? imageStore?.[2]?.image : null,
      attach_img_4: imageStore?.length > 3 ? imageStore?.[3]?.image : null,
      attach_img_5: imageStore?.length > 4 ? imageStore?.[4]?.image : null,
      attach_img_6: imageStore?.length > 5 ? imageStore?.[5]?.image : null,
      attach_img_7: imageStore?.length > 6 ? imageStore?.[6]?.image : null,
      attach_img_8: imageStore?.length > 7 ? imageStore?.[7]?.image : null,
      attach_img_9: imageStore?.length > 8 ? imageStore?.[8]?.image : null,
      attach_img_10: imageStore?.length > 9 ? imageStore?.[9]?.image : null,
      attach_img_1_desc: imageStore?.length > 0 ? imageStore?.[0]?.desc : null,
      attach_img_2_desc: imageStore?.length > 1 ? imageStore?.[1]?.desc : null,
      attach_img_3_desc: imageStore?.length > 2 ? imageStore?.[2]?.desc : null,
      attach_img_4_desc: imageStore?.length > 3 ? imageStore?.[3]?.desc : null,
      attach_img_5_desc: imageStore?.length > 4 ? imageStore?.[4]?.desc : null,
      attach_img_6_desc: imageStore?.length > 5 ? imageStore?.[5]?.desc : null,
      attach_img_7_desc: imageStore?.length > 6 ? imageStore?.[6]?.desc : null,
      attach_img_8_desc: imageStore?.length > 7 ? imageStore?.[7]?.desc : null,
      attach_img_9_desc: imageStore?.length > 8 ? imageStore?.[8]?.desc : null,
      attach_img_10_desc: imageStore?.length > 9 ? imageStore?.[9]?.desc : null,
      attach_garment_img_1:
        garmentStore?.length > 0 ? garmentStore?.[0]?.image : null,
      attach_garment_img_2:
        garmentStore?.length > 1 ? garmentStore?.[1]?.image : null,
      attach_garment_img_3:
        garmentStore?.length > 2 ? garmentStore?.[2]?.image : null,

      attach_garment_img_1_desc:
        garmentStore?.length > 0 ? garmentStore?.[0]?.description : null,
      attach_garment_img_2_desc:
        garmentStore?.length > 1 ? garmentStore?.[1]?.description : null,
      attach_garment_img_3_desc:
        garmentStore?.length > 2 ? garmentStore?.[2]?.description : null,
    };

    setMasterData(data);
  }, [imageStore, garmentStore]);

  // useEffect(() => {
  //   // console.log(garmentStore, "garmentStore");

  //   setMasterData({
  //     ...masterData,
  //     attach_garment_img_1:
  //       garmentStore?.length > 0 ? garmentStore?.[0]?.image : null,
  //     attach_garment_img_2:
  //       garmentStore?.length > 1 ? garmentStore?.[1]?.image : null,
  //     attach_garment_img_3:
  //       garmentStore?.length > 2 ? garmentStore?.[2]?.image : null,

  //     attach_garment_img_1_desc:
  //       garmentStore?.length > 0 ? garmentStore?.[0]?.description : null,
  //     attach_garment_img_2_desc:
  //       garmentStore?.length > 1 ? garmentStore?.[1]?.description : null,
  //     attach_garment_img_3_desc:
  //       garmentStore?.length > 2 ? garmentStore?.[2]?.description : null,
  //   });
  // }, [garmentStore]);

  useEffect(() => {
    if (TOrdDtID != null) {
      setOldDtID(TOrdDtID);
    }
  }, [TOrdDtID]);
  const [isApiCalled, setIsApiCalled] = useState(false);

  const [dtLoader, setDtLoader] = useState(false);
  useEffect(() => {
    if (
      TOrdHdID != null &&
      TOrdHdID != "null" &&
      selectedItem &&
      Object.keys(selectedItem).length > 0 &&
      !dtLoader
    ) {
      if (TOrdDtID == null || TOrdDtID == "null") {
        setDtLoader(true);
        const data = {
          ...selectedItem,
          ItemName: selectedItem?.ItemName,
          PatternAmt: +selectedItem?.PatternAmt,
          Rate: selectedItem?.BasicRate,
          DesignAmt: +selectedItem?.DesignAmt,
          Urgent: trailDeliveryData?.priority == "regular" ? false : true,
          DeliveryDate:
            trailDeliveryData?.deliveryDate == undefined
              ? new Date()
              : trailDeliveryData?.deliveryDate,
          ItemDesc: selectedItem?.ItemDescription,
          MainItemId: Number(selectedItem?.MainItemId),
          AdFabAmt: Number(selectedItem?.AdFabricAmt),
          AdPattern: Number(selectedItem?.AdPattern),
          LastUpdateddate: new Date(),
          IsAlteration: 0,
          ItemLocation: null,
          AdAccessoryAmt: Number(selectedItem?.AdAccessoriesAmt),
          GroupItem: Number(selectedItem?.GroupItem),
          DelDate:
            trailDeliveryData?.deliveryDate == undefined
              ? new Date()
              : trailDeliveryData?.deliveryDate,
          TrialDate:
            trailDeliveryData?.trialDate == undefined
              ? new Date()
              : trailDeliveryData?.trialDate,

          DelMode: selectedItem?.DelMode,
          DelRemarks: selectedItem?.DelRemarks,
          DesignerId: createOrderData?.SalesmanId,
          MasterId: createOrderData?.MasterId,
          DesignDiscAmt: 0,
          AccessoryDiscAmt: null,
          AdDesignAmt: Number(selectedItem?.AdDesignAmt),
          Discount:
            getDirectPaymentInfo?.discountAmt == "NaN"
              ? 0
              : getDirectPaymentInfo?.discountAmt,
          Amount: selectedItem?.BasicRate,
          MakingAmt: +selectedItem?.BasicRate,
          FabAmt: +getDirectPaymentInfo?.FabricAmt,
          AccessoryAmt: +getDirectPaymentInfo?.AccessoriesAmount,
          StitchingDiscAmt: Number(getDirectPaymentInfo?.StitchingDisc),
          FabDiscAmt: Number(getDirectPaymentInfo?.FabricDisc),
          BasicRate: selectedItem?.BasicRate,
          NetAmount: selectedItem?.BasicRate,
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
          DisAmt: 0,
          TotalAfterDiscount: Number(getDirectPaymentInfo?.afterdiscountAmt),
          Disc_Calculate_On: getDirectPaymentInfo?.TOrd_Disc_Calculate_On,

          TOrdHdID: TOrdHdID,
          CompanyId: CompanyId,
          BranchId: BranchId,
          ItemId: selectedItem?.ItemId,
        };

        dispatch(generateTOrdDtId(data)).then((res) => {
          if (res.data.success) {
            localStorage.setItem(
              `TOrdDtID${tabId}`,
              res.data.crtUpdItem.TOrdDtId
            );
            // setDtLoader(false)

            toast.success(res.message);
            setIsTOrdDtIDNull(false);
          } else {
            setIsTOrdDtIDNull(true); // Update state here if generation fails
          }
        });
      }
    } else {
      setIsTOrdDtIDNull(false); // Update state here if TOrdDtID is already set
    }

    // toggleImage();
    // }
  }, [TOrdHdID, selectedItem?.ItemId, TOrdDtID]);

  useEffect(() => {
    if (TOrdDtID) {
      dispatch(getSingleGroupItemData(TOrdDtID));
    }
  }, [TOrdDtID]);

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
        {Object.keys(singleOrderData).length === 0 && (
          <div className="">
            <Button
              outline
              color="light"
              className="bg-white"
              onClick={handleBacktoService}
            >
              <img src={backArrowIcon} alt="viewIcon" />
              <span className="ms-1">Service</span>
            </Button>
          </div>
        )}
      </div>

      <div className=" shadow-lg bg-white  w-100 p-2 rounded-2">
        <div className="border rounded-2">
          <div className="d-flex ">
            <div className="w-100 px-3 pb-0 p-lg-3">
              <div className="row mt-3 ">
                <div className="col-lg-6 col-12   custom-border-right">
                  <LeftSideDetail />
                </div>

                <div className="col-lg-6 col-12 p-1 p-sm-2">
                  <RightSideDetail />
                </div>
              </div>
            </div>
          </div>

          {isFromGroupOrderList ? (
            <div className="d-flex justify-content-center text-center py-lg-3 my-2 my-lg-3 my-xl-5 w-100 ">
              <Button
                className="d-flex justify-content-center me-2  w-25"
                onClick={handleAddOrder}
                disabled={localStorage.getItem(`TOrdDtID${tabId}`) == "null"}
              >
                {/* Add */}
                {isLoader ? (
                  <>
                    <span>
                      <Spinner size="sm" color="light" className="mx-1 py-1" />
                    </span>
                  </>
                ) : (
                  <span>Add To Group</span>
                )}
              </Button>
            </div>
          ) : isFromOrderTrackerList ? (
            <div className="d-flex justify-content-center text-center py-lg-3 my-2 my-lg-3 my-xl-5 w-100 ">
              <Button
                className=" me-2 "
                onClick={handleAddOrder}
                disabled={localStorage.getItem(`TOrdDtID${tabId}`) == null}
              >
                {/* Add */}
                {isLoader ? (
                  <>
                    <span>
                      <Spinner size="sm" color="light" className="mx-1 py-1" />
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
                    disabled={localStorage.getItem(`TOrdDtID${tabId}`) == null}
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
                    disabled={localStorage.getItem(`TOrdDtID${tabId}`) == null}
                  >
                    <span>Back</span>
                  </Button>
                </div>
              )}
            </>
          ) : Object.keys(singleOrderData).length === 0 ? (
            <div className="d-flex justify-content-center text-center py-lg-3 my-2 my-lg-3 my-xl-5 w-100 ">
              <Button
                className="d-flex justify-content-center me-2  w-25"
                onClick={handleAddOrder}
                disabled={isTOrdDtIDNull}
                // disabled={localStorage.getItem(`TOrdDtID${tabId}`) == "null"}
              >
                {/* Add */}
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
            </div>
          ) : (
            <div className="d-flex justify-content-center text-center py-lg-3 my-2 my-lg-3 my-xl-5 w-100 ">
              <Button
                className=" me-2 "
                onClick={handleAddOrder}
                disabled={localStorage.getItem(`TOrdDtID${tabId}`) == null}
              >
                {/* Add */}
                {isLoader ? (
                  <>
                    <span>
                      <Spinner size="sm" color="light" className="mx-1 py-1" />
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
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} size="xl">
        <div className="w-100 p-2">
          <div className="d-flex align-items-center justify-content-between">
            <div className="position-relative nk-header-searchbox w-100">
              <input
                type="text"
                id="default-01"
                name="searchService"
                value={searchService}
                onChange={(e) => handleSearchServiceChange(e)}
                placeholder="search"
                className="form-control-lg form-control search-input"
              />

              <Icon
                name="search"
                alt=""
                className="position-absolute input-field-icon"
              />
            </div>
          </div>
        </div>
        <ModalBody className="p-2">
          <div className="overflowFixServices">
            <div className="border border-2 py-2 px-1 rounded-2">
              <UpdateServiceAlbum
                onImageClick={handleImageClick}
                searchService={searchService}
              />
            </div>
          </div>
        </ModalBody>
      </Modal>

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

export default SingleOrderBook;

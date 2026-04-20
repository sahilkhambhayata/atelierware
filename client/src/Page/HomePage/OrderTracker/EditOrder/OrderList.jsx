import React, { useEffect, useState } from "react";
import { axiosClient } from "./../../../../axios/axios";
// import service1 from "./../../../../images/avatar/ServiceAlbum/service1.png";
import tridateImg from "./../../../../images/icons/tridateImg.svg";
import deldateImg from "./../../../../images/icons/deldateImg.svg";
import SpecialIcon from "./../../../../images/icons/special-icon.svg";
import redCloseIcon from "./../../../../images/icons/red-delete-icon.svg";
import isStyleIcon from "./../../../../images/icons/isStyle-icon.svg";
import isMeasurementIcon from "./../../../../images/icons/isMeasurement-icon.svg";
import isAccessoriesIcon from "./../../../../images/icons/isAccessories-icon.svg";
import isFabricIcon from "./../../../../images/icons/isFabric-icon.svg";
import isnotStyleIcon from "./../../../../images/icons/isnotStyle-icon.svg";
import isnotMeasurementIcon from "./../../../../images/icons/isnotMeasurement-icon.svg";
import isnotAccessoriesIcon from "./../../../../images/icons/isnotAccessories-icon.svg";
import isnotFabricIcon from "./../../../../images/icons/isnotFabric-icon.svg";
import DownArrowIcon from "./../../../../images/icons/up-arrow.svg";
import service1 from "./../../../../images/avatar/ServiceAlbum/service1.png";
import odertableBarcodeIcon from "./../../../../images/icons/odertable-barcode.svg";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router";
import {
  Button,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  Spinner,
  UncontrolledDropdown,
  UncontrolledTooltip,
} from "reactstrap";
import DeleteIcon from "./../../../../images/icons/delete-icon.svg";
import ActionEditIcon from "./../../../../images/icons/edit-icon.png";
import duplicateIcon from "./../../../../images/icons/duplicate.svg";
import Accordion from "react-bootstrap/Accordion";
import ImagesSlider from "./ImageSlider";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteOrderItem,
  getOrderListAsyncData,
  getSingleOrderList,
} from "../../../../redux/actions/orderListAction";
import { addDublicateOrder } from "../../../../redux/actions/dublicateSingleOrderAction";
import { formatDate } from "../../../../redux/dateFormateFunction";
import DeleteSlider from "./DeleteSlider";
import DeleteSliderViewToEdit from "./DeleteSliderViewToEdit";
import DeletePaymentSlider from "./DeletePaymentSlider";
import {
  getGroupOrderListAsyncData,
  getSingleGroupOrderList,
} from "../../../../redux/actions/groupOrderListAction";
import ListingSkelaton from "../../AddOrder/SkeletonDesign/ListingSkelaton";
import ToolTipContent from "../../../../Components/Tooltip/ToolTipContent";
import Tooltip from "../../../../Components/Tooltip/Tooltip";
import { useTheme } from "../../../../Layout/Provider/Themes";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";
import PaymentInputInfoIcon from "../../../../images/icons/payment-input-info-icon.svg";

// onDelete();
const OrderList = ({ tab, from }) => {
  const { tabId } = useTheme();
  const symbol = localStorage.getItem("countrySymbol");
  const fromData = from;
  const { handleAction } = usePermissions();
  const EnableInventory = useSelector(
    (state) => state?.config?.orderType.EnableInventory
  );

  const service = useSelector((state) => state.service.service.orderDetails);
  const getConfig = useSelector((state) => state?.config?.orderType);
  const serviceId = localStorage.getItem(`serviceId${tabId}`);

  const RoundUpToDecimal =
    getConfig?.RoundUpToDecimal == 0 ||
      getConfig?.RoundUpToDecimal == undefined ||
      getConfig?.RoundUpToDecimal == null
      ? 2
      : getConfig?.RoundUpToDecimal;
  const dispatch = useDispatch();
  const selectedService = service?.find((item) => item.ItemId === serviceId);

  let orderList = useSelector((state) => state.groupOrderList);

  const navigate = useNavigate();

  const [openedRow, setOpenedRow] = useState(-1);
  const [dropDownData, setDropDownData] = useState({});
  const [isLoader, setIsLoader] = useState(false);
  const [isNetPayment, setIsNetPayment] = useState(false);
  const [oldDtID, setOldDtID] = useState();
  const [showAccordion, setShowAccordion] = useState([]);
  const [showOrderSummaryAcc, setShowOrderSummaryAcc] = useState(false);
  const [showTotalPaidAcc, setShowTotalPaidAcc] = useState(false);
  const [selectedRow, setSeledRow] = useState();
  const [isDublicateLoader, setIsDublicateLoader] = useState(false);
  const [isImageModel, setIsImageModel] = useState(false);
  const [modelImageArray, setModelImageArray] = useState([]);
  const [action, setAction] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarViewToEdit, setIsSidebarViewToEdit] = useState(false);
  // const [mood, setMood] = useState(localStorage.getItem(`mood${tabId}`));
  // const mood = localStorage.getItem(`mood${tabId}`);
  const [isDeletePaymentSidebar, setIsDeletePaymentSidebar] = useState(false);
  const [selectedPaymentMood, setSelectedPaymentMood] = useState();
  const [clickedRow, setClickedRow] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // const handleRowClick = () => {
  //   setClickedRow(descriptionData.index);
  //   handleAction(
  //     "BtnItemTrckrView",
  //     "action",
  //     handleCellClick,
  //     descriptionData
  //   );
  //   setShowTooltip(true); // Show tooltip on click
  // };
  // const handleMouseOver = () => {
  //   if (!showTooltip) {
  //     setShowTooltip(true);
  //   }
  // };

  // const handleMouseOut = () => {
  //   if (!clickedRow) {
  //     setShowTooltip(false);
  //   }
  // };

  const handleAccordionToggle = () => {
    setIsNetPayment(!isNetPayment);
  };

  const handleMouseEnter = (item, ind) => {
    setOpenedRow(ind);
    setDropDownData(item);
  };

  const location = useLocation();

  const handleBacktoOrder = () => {
    // console.log(tabId);

    let oldDtIDValue = localStorage.getItem(`TOrdDtID${tabId}`);

    if (oldDtIDValue === null) {
      oldDtIDValue = null;
      localStorage.setItem(`TOrdDtID${tabId}`, oldDtIDValue);
    }

    dispatch({ type: "GET_SINGLE_ORDER_ITEM", payload: {} });
    dispatch({ type: "GET_FABRIC_ACC_LIST", payload: {} });
    setOldDtID(oldDtIDValue);

    navigate("/add-order", {
      state: {
        from: fromData,
        oldDtID: oldDtIDValue,
        TOrdNo: TOrdNo,
        mood: mood,
      },
    });
  };

  const handleImageModel = (images) => {
    setModelImageArray(images);
    setIsImageModel(!isImageModel);
  };
  const closeImageModal = () => {
    setIsImageModel(false);
  };

  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [isConfirm, setIsConfirm] = useState(false);
  const [TOrdNo, setTOrdNo] = useState();
  const [mood, setMood] = useState();
  // const mood = localStorage.getItem(`mood${tabId}`)

  useEffect(() => {
    if (location.state !== null) {
      setTOrdNo(location.state.TOrdNo);
      setMood(location.state.mood);
    } else {
      const data = JSON.parse(localStorage.getItem("orderEditData"));

      setTOrdNo(data.TOrdNo);
      setMood(data.mood);
    }
  }, [tabId]);

  const handleEditItem = (item) => {
    // if (tab == "under-booking") {
    localStorage.setItem(`TOrdDtID${tabId}`, item.TOrdDtId);
    localStorage.setItem(`TOrdHdID${tabId}`, item.TOrdHdID);
    localStorage.setItem(`serviceId${tabId}`, item.ItemId);

    if (item.groupItemList.length > 0) {
      dispatch(getSingleGroupOrderList(item.TOrdDtId));
      navigate("/group-order-home-page", {
        state: {
          from: fromData,
          tab: tab,
          TOrdNo: TOrdNo,
          mood: mood,
        },
      });
    } else {
      dispatch(getSingleOrderList(item.TOrdDtId));
      // navigate("/add-order-home-page");

      navigate("/add-order-home-page", {
        state: {
          from: fromData,
          tab: tab,
          TOrdNo: TOrdNo,
          mood: mood,
        },
      });
    }

    // }
    // else {
    //   setSidebarOpen(true);
    //   setSeledRow(item);
    //   setAction("edit");

    // }
  };

  const handleDublicateItem = (item) => {
    setIsDublicateLoader(true);

    dispatch(addDublicateOrder(item.TOrdDtId)).then((res) => {
      if (res?.success === true) {
        // dispatch(getOrderListAsyncData())
        const TOrdHdID = localStorage.getItem(`TOrdHdID${tabId}`);
        dispatch(getGroupOrderListAsyncData(TOrdHdID));
        setIsDublicateLoader(false);

        toast.success(res.message);
      } else {
      }
    });
  };

  const handleDeleteItem = (item) => {
    // if (tab == "under-booking") {
    //   setIsLoader(true);
    //   dispatch(deleteOrderItem(item.TOrdDtId)).then((res) => {
    //     if (res?.success) {
    //       const TOrdHdID = localStorage.getItem(`TOrdHdID${tabId}`);
    //       dispatch(getOrderListAsyncData(TOrdHdID));
    //       toast.success(res.message);
    //       setIsLoader(false);
    //     } else {
    //       setTimeout(() => {
    //         setIsLoader(false);
    //       }, 400);
    //     }
    //   });
    //   setTimeout(() => {
    //     setIsLoader(false);
    //   }, 6000);
    // } else {
    setAction("delete");
    setSidebarOpen(true);
    setSeledRow(item);
    setTimeout(() => {
      setIsLoader(false);
    }, 400);

    // onDelete();
    // }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openedRow !== -1 && !event.target.closest(".dropdown-menu-custom")) {
        setOpenedRow(-1);
        setDropDownData({});
      }
    };
    document.body.addEventListener("click", handleClickOutside);
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [openedRow]);

  // const handleDelete = (id) => {
  //   setSidebarOpen(true);
  //   setSelectedDeleteRow(id);
  // };

  const toggleSidebar = (isOpen) => {
    setSidebarOpen(isOpen);
  };

  const toogleSideBarViewToEdit = (isOpen) => {
    if (tab == "other") {
      setIsSidebarViewToEdit(isOpen);
    } else {
      setMood("edit");
      localStorage.setItem(`mood${tabId}`, "edit");
    }
  };
  // const image1 = orderList?.orderData?.Order?.TOrdDtls;
  const verifyForEdit = () => {
    toogleSideBarViewToEdit(true);
  };

  const handlePaymentDelete = (entry) => {
    setIsDeletePaymentSidebar(true);
    setSelectedPaymentMood(entry);
  };
  const togglePaymentSidebar = (isOpen) => {
    setIsDeletePaymentSidebar(isOpen);
    // if (!isOpen) {
    //   dispatch(getGroupOrderListAsyncData(balanceData?.balanceData.TOrdHdID));
    // }
  };

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  return (
    <>
      <div className="my-1">
        {mood == "view" && (
          <div className="d-flex justify-content-end">
            <Button
              outline
              // color="white"
              onClick={verifyForEdit}
              className=""
              id="addNewOrderBtn"
            >
              {/* <img src={viewIcon} alt="viewIcon" /> */}
              {/* <span className="fs-4"></span> */}
              <span className="ms-1">Edit</span>
            </Button>
            <Tooltip
              id={`addNewOrderBtn`}
              direction="left"
              text={ToolTipContent.editOrder}
            />
          </div>
        )}
        {mood == "edit" && (
          <div className="d-flex justify-content-end">
            <Button
              outline
              // color="light"
              onClick={() =>
                handleAction(
                  "BtnEditOrderAddMoreItem",
                  "action",
                  handleBacktoOrder,
                  null
                  // balanceData.balanceData
                )
              }
              className=""
              id="BtnEditOrderAddMoreItem"
            >
              {/* <img src={viewIcon} alt="viewIcon" /> */}
              <span className="fs-4">+</span>
              <span className="ms-1">Add More Item</span>
            </Button>
            <Tooltip
              id={`BtnEditOrderAddMoreItem`}
              direction="left"
              text={ToolTipContent.addNewOrder}
            />
          </div>
        )}
      </div>
      <div className="shadow p-1 bg-white cust-orderlist-padding ">
        <div
          className=" rounded-2 p-1 position-relative cust-orderlist-padding"
          style={{ maxHeight: "500px", minHeight: "500px ", overflow: "auto" }}
        >
          {orderList.isLoader ? (
            <span>
              <ListingSkelaton />
            </span>
          ) : (
            <>
              {orderList?.orderData.success == false ? (
                <>
                  <span>No any Item..</span>
                </>
              ) : (
                <>
                  {orderList?.orderData?.Order?.TOrdDtls?.map((order, ind) => {
                    const finalImageObjects = Object.keys(order)
                      .filter(
                        (key) =>
                          (key.startsWith("attach_img_") ||
                            key.startsWith("attach_garment_img_")) &&
                          !key.endsWith("_desc") &&
                          order[key] !== null
                      )
                      .map((imgKey) => {
                        const descKey = `${imgKey}_desc`;
                        return {
                          image: order[imgKey],
                          desc: order.hasOwnProperty(descKey)
                            ? order[descKey]
                            : null,
                        };
                      });

                    const fabricList = order.fabricList;
                    const fabArray = fabricList.filter(
                      (item) =>
                        item?.ItemType === "Cut Length" ||
                        item?.ItemType === "Fabric" ||
                        item?.ItemType === "fabric" ||
                        item?.ItemType === "cut length"
                    );
                    const accessoriesArray = fabricList.filter(
                      (item) =>
                        item?.ItemType === "Accessories" ||
                        item?.ItemType === "accessories"
                    );
                    return order.groupItemList.length > 0 ? (
                      <>
                        <React.Fragment key={ind}>
                          <div className="row  rounded-2 order-listing-sec">
                            <div className="col-sm-6 col-12 order-listing_cust-call-40">
                              <div className="d-flex cust-img-item_desc">
                                <div className="fs-img">
                                  <div className="img-card">
                                    <img
                                      src={service1}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </div>
                                </div>
                                <div className="item-info-sec">
                                  <UncontrolledDropdown
                                    className="user-dropdown table-Customer-col w-100"
                                    isOpen={openedRow === ind}
                                    toggle={() => { }}
                                  >
                                    <DropdownToggle tag="a">
                                      <div className="avatar-stack mt-1 d-flex">
                                        <span className="fw-bold fs-6 text-dark">
                                          {order.ItemName ? (
                                            <>
                                              {order.ItemName.length > 10
                                                ? order.ItemName.slice(0, 10) +
                                                "..."
                                                : order.ItemName}
                                              &nbsp;
                                              {order.OrdSrNo
                                                ? order.OrdSrNo
                                                : ""}
                                            </>
                                          ) : (
                                            "No Item Data...."
                                          )}
                                        </span>
                                        <img
                                          src={PaymentInputInfoIcon}
                                          onMouseEnter={() =>
                                            handleMouseEnter(order, ind)
                                          }
                                          className="ms-1"
                                          alt="PaymentInputInfoIcon"
                                        />
                                        {mood == "edit" && (
                                          <div className="">
                                            <div className="ms-3 editDeleteHoverAnimation d-flex align-items-center">
                                              {isLoader ? (
                                                <span>
                                                  <Spinner
                                                    size="sm"
                                                    color="dark"
                                                    className="mx-1 py-1"
                                                  />
                                                </span>
                                              ) : (
                                                <>
                                                  <img
                                                    src={DeleteIcon}
                                                    alt=""
                                                    width="20px"
                                                    onClick={() =>
                                                      handleAction(
                                                        "BtnEditOrderDelItem",
                                                        "action",
                                                        handleDeleteItem,
                                                        order
                                                      )
                                                    }
                                                    className="me-1 cursor-pointer"
                                                    id={`BtnEditOrderDelItem${ind}`}
                                                  />
                                                  <Tooltip
                                                    id={`BtnEditOrderDelItem${ind}`}
                                                    direction="top"
                                                    text={
                                                      ToolTipContent.removeOrder
                                                    }
                                                  />
                                                </>
                                              )}
                                              <img
                                                src={ActionEditIcon}
                                                alt=""
                                                width="25px"
                                                onClick={() =>
                                                  handleAction(
                                                    "BtnEditOrderEditItem",
                                                    "action",
                                                    handleEditItem,
                                                    order
                                                  )
                                                }
                                                className="me-1 cursor-pointer"
                                                id={`BtnEditOrderEditItem${ind}`}
                                              />
                                              <Tooltip
                                                id={`BtnEditOrderEditItem${ind}`}
                                                direction="top"
                                                text={
                                                  ToolTipContent.editOrderDetails
                                                }
                                              />
                                            </div>
                                          </div>
                                        )}
                                        <div className="avatar-item"></div>
                                      </div>
                                    </DropdownToggle>

                                    <DropdownMenu
                                      container="body"
                                      className=" pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1"
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                        width: "350px",
                                      }}
                                    >
                                      <div
                                        className="dropdown-body p-2"
                                        id="dropdownTooltip"
                                      >
                                        <div className="avtar-rows-container">
                                          <span className="fw-bold fs-6 text-dark">
                                            {order.ItemName ? (
                                              <>{order.ItemName}</>
                                            ) : (
                                              "No Item Data...."
                                            )}
                                          </span>
                                          {dropDownData?.barcode ? (
                                            <div className="d-flex">
                                              <img
                                                src={odertableBarcodeIcon}
                                                alt=""
                                              />

                                              <span className="ml-2">
                                                {dropDownData?.barcode}
                                              </span>
                                            </div>
                                          ) : (
                                            <></>
                                          )}

                                          <div className=" border rounded-2">
                                            <span className="ms-1">
                                              {dropDownData?.ItemDesc?.length >
                                                100
                                                ? dropDownData.ItemDesc.slice(
                                                  0,
                                                  100
                                                ) + "..."
                                                : dropDownData.ItemDesc}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      {dropDownData?.ItemDesc?.length > 100 && (
                                        <Tooltip
                                          id="dropdownTooltip"
                                          direction="right"
                                          text={dropDownData.ItemDesc}
                                        />
                                      )}
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                  <div className=" p-1 rounded-2  tridelpr">
                                    <div className="row">
                                      {order.TrialDate != null && (
                                        <div className="d-flex custom-border-right pr-3  custome-col-w col-lg-4 col-12  align-items-center">
                                          <img
                                            src={tridateImg}
                                            alt=""
                                            width="17px"
                                            className="me-1"
                                          />
                                          <span className="me-1 custom-show-lable-tridelr">
                                            Trial{" "}
                                          </span>
                                          <span className="fs-14 fw-medium">
                                            {order.TrialDate != null &&
                                              formatDate(
                                                new Date(order.TrialDate),
                                                getConfig?.DateAndTime,
                                                true
                                              ).slice()}
                                          </span>
                                        </div>
                                      )}
                                      <div className="d-flex custom-border-right pr-3 custome-col-w col-lg-5 col-12 align-items-center">
                                        <img
                                          src={deldateImg}
                                          alt=""
                                          width="17px"
                                          className="me-1"
                                        />
                                        <span className="me-1 custom-show-lable-tridelr">
                                          {" "}
                                          Delivery{" "}
                                        </span>
                                        <span className="fs-14 fw-medium">
                                          {formatDate(
                                            new Date(order.DelDate),
                                            getConfig?.DateAndTime,
                                            true
                                          )}
                                        </span>
                                      </div>
                                      <div className="d-flex col-lg-3 col-12 custome-col-w align-items-center">
                                        <span className="me-1 ">Priority</span>
                                        <span className="fs-14 fw-medium ms-1">
                                          {order.Urgent && (
                                            <img
                                              src={SpecialIcon}
                                              alt=""
                                              width="14px"
                                              className="me-1"
                                            />
                                          )}

                                          {order.Urgent ? "Urgent" : "Regular"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="custom-group-icon">
                                    {order.groupItemList.map((item, i) => {
                                      const fabArray = item.fabricList.filter(
                                        (item) =>
                                          item.ItemType === "Cut Length" ||
                                          item.ItemType === "Fabric"
                                      );
                                      const accessoriesArray = item.fabricList.filter(
                                        (item) =>
                                          item.ItemType === "Accessories"
                                      );

                                      const finalImageObjects = Object.keys(item)
                                        .filter(
                                          (key) =>
                                            (key.startsWith("attach_img_") ||
                                              key.startsWith(
                                                "attach_garment_img_"
                                              )) &&
                                            !key.endsWith("_desc") &&
                                            item[key] !== null
                                        )
                                        .map((imgKey) => {
                                          const descKey = `${imgKey}_desc`;
                                          return {
                                            image: item[imgKey],
                                            desc: item.hasOwnProperty(descKey)
                                              ? item[descKey]
                                              : null,
                                          };
                                        });
                                      return (
                                        <div
                                          className="row justify-content-between align-items-center custom-group-icon"
                                          key={ind}
                                        >
                                          <div className="col-3 d-flex custom-group-item-lable">
                                            <span>{item.ItemName}
                                              &nbsp; {item.OrdSrNo ? `(${item.OrdSrNo})` : ""}
                                            </span>
                                          </div>

                                          <div className="col-9 d-flex feb_acces_measu_stl_icon ">
                                            <div className="d-flex bg-white border rounded-2">
                                              {EnableInventory == 1 && (
                                                <div className="rounded-circle d-flex align-items-center mx-1 ">
                                                  <img
                                                    src={
                                                      fabArray.length > 0
                                                        ? isFabricIcon
                                                        : isnotFabricIcon
                                                    }
                                                    alt=""
                                                    width="35px"
                                                    height="35px"
                                                    onClick={() =>
                                                      handleAction(
                                                        "BtnEditOrderEditItem",
                                                        "action",
                                                        handleEditItem,
                                                        order
                                                      )
                                                    }
                                                    className="me-1 cursor-pointer"
                                                  />
                                                </div>
                                              )}
                                              {EnableInventory == 1 && (
                                                <div className="rounded-circle d-flex align-items-center mx-1 ">
                                                  <img
                                                    src={
                                                      accessoriesArray.length >
                                                        0
                                                        ? isAccessoriesIcon
                                                        : isnotAccessoriesIcon
                                                    }
                                                    alt=""
                                                    width="35px"
                                                    onClick={() =>
                                                      handleAction(
                                                        "BtnEditOrderEditItem",
                                                        "action",
                                                        handleEditItem,
                                                        order
                                                      )
                                                    }
                                                    className="me-1 cursor-pointer"
                                                  />
                                                </div>
                                              )}
                                              <div className="rounded-circle d-flex align-items-center mx-1">
                                                <img
                                                  src={
                                                    item?.ordMeasure?.length > 0
                                                      ? isMeasurementIcon
                                                      : isnotMeasurementIcon
                                                  }
                                                  alt=""
                                                  width="35px"
                                                  onClick={() =>
                                                    handleAction(
                                                      "BtnEditOrderEditItem",
                                                      "action",
                                                      handleEditItem,
                                                      order
                                                    )
                                                  }
                                                  className="me-1 cursor-pointer"
                                                />
                                              </div>
                                              <div className="rounded-circle d-flex align-items-center mx-1">
                                                <img
                                                  src={
                                                    item?.ordstyle?.length > 0
                                                      ? isStyleIcon
                                                      : isnotStyleIcon
                                                  }
                                                  alt=""
                                                  width="35px"
                                                  onClick={() =>
                                                    handleAction(
                                                      "BtnEditOrderEditItem",
                                                      "action",
                                                      handleEditItem,
                                                      order
                                                    )
                                                  }
                                                  className="me-1 cursor-pointer"
                                                />
                                              </div>
                                            </div>
                                            {finalImageObjects.length > 0 && (
                                              <div
                                                className="avatar-stack mt-1 d-flex ml-3"
                                                onClick={() =>
                                                  handleImageModel(
                                                    finalImageObjects
                                                  )
                                                }
                                              >
                                                {finalImageObjects
                                                  .slice(0, 4)
                                                  .map((item, ind) => {
                                                    return (
                                                      <div
                                                        className="avatar-item "
                                                        key={ind}
                                                      >
                                                        <img
                                                          className="avatar rounded-circle"
                                                          src={
                                                            !item.image
                                                              ? service1
                                                              : item.image instanceof File || item.image instanceof Blob
                                                                ? URL.createObjectURL(item.image)
                                                                : item.image.startsWith?.("data:") || item.image.startsWith?.("http")
                                                                  ? item.image
                                                                  : `${axiosClient.defaults.baseURL}${item.image}`
                                                          }
                                                          alt="1"
                                                          width="25px"
                                                          height="25px"
                                                        />
                                                      </div>
                                                    );
                                                  })}
                                                {finalImageObjects.length >
                                                  4 ? (
                                                  <div className="avatar-item">
                                                    <span className="avatar">
                                                      +
                                                      {finalImageObjects.length -
                                                        4}
                                                    </span>
                                                  </div>
                                                ) : (
                                                  <div className="avatar-item">
                                                    <span className="avatar"></span>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-sm-6 col-12 order-listing_cust-call-60">
                              <div className="row align-items-center rounded-2  basic_amt_accrd_Sec right-side-part">
                                <div className="right-side-part-1 ">
                                  <div className="d-flex justify-content-between">
                                    <Accordion
                                      className={`custom-z-index border-bottom ctransition w-100 ${showAccordion.includes(ind)
                                        ? "position-absolute px-2  justify-content-between"
                                        : " Accordion-header-bg-tranpernt bg-transperent"
                                        }`}
                                      style={{
                                        zIndex: showAccordion.includes(ind)
                                          ? "11"
                                          : " 10",
                                      }}
                                    >
                                      <Accordion.Item
                                        eventKey="0"
                                        className={`w-100 bg-transperent   ${showAccordion.includes(ind)
                                          ? "custome-acc-item"
                                          : "basic_acc_btn_item"
                                          }`}
                                      >
                                        <Accordion.Header className="w-100 custom-acc-header">
                                          <div
                                            className="w-100  d-flex justify-content-between single-acc-row "
                                            id={`basicAccHeader${ind}`}
                                            onClick={() => {
                                              if (showAccordion.includes(ind)) {
                                                setTimeout(() => {
                                                  const newData = showAccordion.filter(
                                                    (res) => res !== ind
                                                  );
                                                  setShowAccordion(newData);
                                                }, 300);
                                              } else {
                                                setShowAccordion([
                                                  ...showAccordion,
                                                  ind,
                                                ]);
                                              }
                                            }}
                                          >
                                            <span>Basic Amt</span>
                                            <div>
                                              <img
                                                src={DownArrowIcon}
                                                alt="DownArrowIcon"
                                                width={"12px"}
                                                className="mx-1 ctransition-05"
                                                style={{
                                                  rotate: showAccordion.includes(
                                                    ind
                                                  )
                                                    ? "0deg"
                                                    : "180deg",
                                                }}
                                              />
                                              <span>
                                                {symbol}{" "}
                                                {order?.BasicRate
                                                  ? (+order.BasicRate)?.toFixed(
                                                    RoundUpToDecimal
                                                  )
                                                  : 0}
                                              </span>
                                            </div>
                                          </div>
                                        </Accordion.Header>
                                        {!showAccordion.includes(ind) && (
                                          <Tooltip
                                            id={`basicAccHeader${ind}`}
                                            direction="left"
                                            text={
                                              ToolTipContent.showBasicAmountDetail
                                            }
                                          />
                                        )}
                                        <Accordion.Body
                                          className="custom-acc-body"
                                          container="body"
                                        >
                                          <Accordion>
                                            <Accordion.Item eventKey="0">
                                              <Accordion.Header className="">
                                                <div className="d-flex justify-content-between border p-1 rounded-2  w-100">
                                                  <span>Making</span>
                                                  <div>
                                                    <span>
                                                      {symbol}{" "}
                                                      {(
                                                        order.BasicRate -
                                                        (order.FabAmt +
                                                          order.AccessoryAmt)
                                                      )?.toFixed(
                                                        RoundUpToDecimal
                                                      )}
                                                    </span>
                                                  </div>
                                                </div>
                                              </Accordion.Header>
                                            </Accordion.Item>
                                          </Accordion>
                                        </Accordion.Body>
                                      </Accordion.Item>
                                    </Accordion>
                                  </div>

                                  {showAccordion.includes(ind) && (
                                    <div className="d-flex justify-content-between single-acc-row_extra">
                                      <span>Basic Amt</span>
                                      <span>
                                        {symbol}{" "}
                                        {order?.BasicRate
                                          ? (+order.BasicRate)?.toFixed(
                                            RoundUpToDecimal
                                          )
                                          : 0}
                                      </span>
                                    </div>
                                  )}

                                  <div className="d-flex justify-content-between single-acc-row_extra">
                                    <span>Disc Amt</span>
                                    <span className="bis_margin-end">
                                      {" "}
                                      {symbol} {order?.Discount}
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-between single-acc-row_extra">
                                    <span>Taxable Amt</span>
                                    <span className="bis_margin-end">
                                      {" "}
                                      {symbol}{" "}
                                      {(
                                        (order.BasicRate
                                          ? order.BasicRate
                                          : 0) -
                                        (order?.AdSTax ? order?.AdSTax : 0)
                                      )?.toFixed(RoundUpToDecimal)}
                                    </span>
                                  </div>

                                  <div className="d-flex justify-content-between single-acc-row_extra">
                                    <span>Tax</span>
                                    <span className="bis_margin-end">
                                      {symbol}{" "}
                                      {order?.AdSTax ? order?.AdSTax : 0}
                                    </span>
                                  </div>
                                </div>

                                <div className=" rounded-2  text-center right-side-part-2 ">
                                  <h5 className="amt_text">
                                    {symbol}{" "}
                                    {order.NetAmount
                                      ? parseFloat(order.NetAmount)?.toFixed(
                                        RoundUpToDecimal
                                      )
                                      : 0}
                                  </h5>
                                </div>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      </>
                    ) : (
                      <React.Fragment key={ind}>
                        <div
                          className="row rounded-2 align-items-center order-listing-sec"
                          key={ind}
                        >
                          <div className="col-sm-6 col-12 order-listing_cust-call-40 ">
                            <div className="d-flex cust-img-item_desc">
                              <div className="fs-img">
                                <div className="img-card">
                                  <img
                                    src={service1}
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                              </div>
                              <div className="item-info-sec">
                                <UncontrolledDropdown
                                  className="user-dropdown table-Customer-col w-100 "
                                  isOpen={openedRow === ind}
                                  toggle={() => { }}
                                >
                                  <DropdownToggle tag="a">
                                    <div className="avatar-stack mt-1 d-flex">
                                      <span className="fw-bold fs-6 text-dark">
                                        {order.ItemName ? (
                                          <>
                                            {order.ItemName.length > 10
                                              ? order.ItemName.slice(0, 10) +
                                              "..."
                                              : order.ItemName}
                                            &nbsp; ({order?.OrdSrNo})
                                          </>
                                        ) : (
                                          "No Item Data...."
                                        )}
                                      </span>
                                      <img
                                        src={PaymentInputInfoIcon}
                                        onMouseEnter={() =>
                                          handleMouseEnter(order, ind)
                                        }
                                        className="ms-2"
                                        alt="PaymentInputInfoIcon"
                                      />

                                      {mood == "edit" && (
                                        <div className="">
                                          <div className="ms-3 editDeleteHoverAnimation d-flex align-items-center">
                                            {isLoader ? (
                                              <span>
                                                <Spinner
                                                  size="sm"
                                                  color="black"
                                                  className="mx-1 py-1"
                                                />
                                              </span>
                                            ) : (
                                              <>
                                                <img
                                                  src={DeleteIcon}
                                                  alt=""
                                                  width="20px"
                                                  onClick={() =>
                                                    handleAction(
                                                      "BtnEditOrderDelItem",
                                                      "action",
                                                      handleDeleteItem,
                                                      order
                                                      // balanceData.balanceData
                                                    )
                                                  }
                                                  className="me-1 cursor-pointer"
                                                  id={`BtnEditOrderDelItem${ind}`}
                                                />
                                                <Tooltip
                                                  id={`BtnEditOrderDelItem${ind}`}
                                                  direction="left"
                                                  text={
                                                    ToolTipContent.removeOrder
                                                  }
                                                />
                                              </>
                                            )}
                                            <img
                                              src={ActionEditIcon}
                                              alt=""
                                              width="25px"
                                              onClick={() =>
                                                handleAction(
                                                  "BtnEditOrderEditItem",
                                                  "action",
                                                  handleEditItem,
                                                  order
                                                )
                                              }
                                              className="me-1 cursor-pointer"
                                              id={`BtnEditOrderEditItem${ind}`}
                                            />
                                            <Tooltip
                                              id={`BtnEditOrderEditItem${ind}`}
                                              direction="top"
                                              text={
                                                ToolTipContent.editOrderDetails
                                              }
                                            />

                                            {isDublicateLoader ? (
                                              <span>
                                                <Spinner
                                                  size="sm"
                                                  color="black"
                                                  className="mx-1 py-1"
                                                />
                                              </span>
                                            ) : (
                                              <>
                                                <img
                                                  src={duplicateIcon}
                                                  alt=""
                                                  width="18px"
                                                  onClick={() =>
                                                    handleAction(
                                                      "BtnEditOrderDuplicateItem",
                                                      "action",
                                                      handleDublicateItem,
                                                      order
                                                    )
                                                  }
                                                  className="me-1 cursor-pointer"
                                                  id={`BtnEditOrderDuplicateItem${ind}`}
                                                />
                                                <Tooltip
                                                  id={`BtnEditOrderDuplicateItem${ind}`}
                                                  direction="top"
                                                  text={
                                                    ToolTipContent.dublicateItem
                                                  }
                                                />
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      <div className="avatar-item"></div>
                                    </div>
                                  </DropdownToggle>

                                  <DropdownMenu
                                    container="body"
                                    className=" pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1"
                                    style={{
                                      position: "absolute",
                                      top: 0,
                                      width: "350px",
                                    }}
                                  >
                                    <div
                                      className="dropdown-body p-2"
                                      id="dropdownTooltip"
                                    >
                                      <div className="avtar-rows-container">
                                        <span className="fw-bold fs-6 text-dark">
                                          {order.ItemName ? (
                                            <>{order.ItemName}</>
                                          ) : (
                                            "No Item Data...."
                                          )}
                                        </span>
                                        {dropDownData?.barcode ? (
                                          <div className="d-flex">
                                            <img
                                              src={odertableBarcodeIcon}
                                              alt=""
                                            />

                                            <span className="ml-2">
                                              {dropDownData?.barcode}
                                            </span>
                                          </div>
                                        ) : (
                                          <></>
                                        )}
                                        <div className=" border rounded-2">
                                          <span className="ms-1">
                                            {dropDownData?.ItemDesc?.length >
                                              100
                                              ? dropDownData.ItemDesc.slice(
                                                0,
                                                100
                                              ) + "..."
                                              : dropDownData.ItemDesc}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {dropDownData?.ItemDesc?.length > 100 && (
                                      <Tooltip
                                        id="dropdownTooltip"
                                        direction="right"
                                        text={dropDownData.ItemDesc}
                                      />
                                    )}
                                  </DropdownMenu>
                                </UncontrolledDropdown>

                                <div className=" p-1 rounded-2  tridelpr">
                                  <div className="row">
                                    {order.TrialDate != null && (
                                      <div className="d-flex custom-border-right pr-3  custome-col-w col-lg-4 col-12  align-items-center">
                                        <img
                                          src={tridateImg}
                                          alt=""
                                          width="17px"
                                          className="me-1"
                                        />
                                        <span className="me-1 custom-show-lable-tridelr">
                                          Trial{" "}
                                        </span>
                                        <span className="fs-14 fw-medium">
                                          {order.TrialDate != null &&
                                            formatDate(
                                              new Date(order.TrialDate),
                                              getConfig?.DateAndTime,
                                              true
                                            ).slice()}
                                        </span>
                                      </div>
                                    )}
                                    <div className="d-flex custom-border-right custome-col-w col-lg-5 col-12 align-items-center">
                                      <img
                                        src={deldateImg}
                                        alt=""
                                        width="17px"
                                        className="me-1"
                                      />
                                      <span className="me-1 custom-show-lable-tridelr">
                                        {" "}
                                        Delivery{" "}
                                      </span>
                                      <span className="fs-14 fw-medium">
                                        {formatDate(
                                          new Date(order.DelDate),
                                          getConfig?.DateAndTime,
                                          true
                                        )}
                                      </span>
                                    </div>
                                    <div className="d-flex col-lg-3 col-12 custome-col-w align-items-center">
                                      <span className="me-1 ">Priority</span>
                                      <span className="fs-14 fw-medium ms-1">
                                        {order.Urgent && (
                                          <img
                                            src={SpecialIcon}
                                            alt=""
                                            width="14px"
                                            className="me-1"
                                          />
                                        )}

                                        {order.Urgent ? "Urgent" : "Regular"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <>
                                  <div className="d-flex feb_acces_measu_stl_icon">
                                    <div className="d-flex bg-white ">
                                      {EnableInventory == 1 && (
                                        <div className="rounded-circle d-flex align-items-center mx-1">
                                          <img
                                            src={
                                              fabArray.length > 0
                                                ? isFabricIcon
                                                : isnotFabricIcon
                                            }
                                            onClick={() =>
                                              handleAction(
                                                "BtnEditOrderDelItem",
                                                "action",
                                                handleEditItem,
                                                order
                                              )
                                            }
                                            id="fab_img_toolTip"
                                            alt=""
                                            width="35px"
                                            className="me-1 cursor-pointer"
                                          />
                                          <Tooltip
                                            id={`fab_img_toolTip`}
                                            direction="bottom"
                                            text={
                                              fabArray.length > 0
                                                ? "View Fabrics"
                                                : "Add Fabrics"
                                            }
                                          />
                                        </div>
                                      )}
                                      {EnableInventory == 1 && (
                                        <div className="rounded-circle d-flex align-items-center mx-1">
                                          <img
                                            src={
                                              accessoriesArray.length > 0
                                                ? isAccessoriesIcon
                                                : isnotAccessoriesIcon
                                            }
                                            className="me-1 cursor-pointer"
                                            onClick={() =>
                                              handleAction(
                                                "BtnEditOrderDelItem",
                                                "action",
                                                handleEditItem,
                                                order
                                              )
                                            }
                                            id="accs_img_toolTip"
                                            alt=""
                                            width="35px"
                                          />
                                          <Tooltip
                                            id={`accs_img_toolTip`}
                                            direction="bottom"
                                            text={
                                              accessoriesArray.length > 0
                                                ? "View Accessories"
                                                : "Add Accessories"
                                            }
                                          />
                                        </div>
                                      )}
                                      <div className="rounded-circle d-flex align-items-center mx-1">
                                        <img
                                          src={
                                            order?.ordMeasure?.length > 0
                                              ? isMeasurementIcon
                                              : isnotMeasurementIcon
                                          }
                                          className="me-1 cursor-pointer"
                                          onClick={() =>
                                            handleAction(
                                              "BtnEditOrderDelItem",
                                              "action",
                                              handleEditItem,
                                              order
                                            )
                                          }
                                          id="measure_img_toolTip"
                                          alt=""
                                          width="35px"
                                        // onClick={() => handleEditItem(order)}
                                        />
                                        <Tooltip
                                          id={`measure_img_toolTip`}
                                          direction="bottom"
                                          text={
                                            order?.ordMeasure?.length > 0
                                              ? "View Measurement"
                                              : "Add Measurement"
                                          }
                                        />
                                      </div>
                                      <div className="rounded-circle d-flex align-items-center mx-1">
                                        <img
                                          src={
                                            order?.ordstyle?.length > 0
                                              ? isStyleIcon
                                              : isnotStyleIcon
                                          }
                                          className="me-1 cursor-pointer"
                                          onClick={() =>
                                            handleAction(
                                              "BtnEditOrderDelItem",
                                              "action",
                                              handleEditItem,
                                              order
                                              // balanceData.balanceData
                                            )
                                          }
                                          id="style_img_toolTip"
                                          alt=""
                                          width="35px"
                                        // onClick={() => handleEditItem(order)}
                                        />
                                        <Tooltip
                                          id={`style_img_toolTip`}
                                          direction="bottom"
                                          text={
                                            order?.ordMeasure?.length > 0
                                              ? "View Style"
                                              : "Add Style"
                                          }
                                        />
                                      </div>
                                    </div>
                                    {finalImageObjects.length > 0 && (
                                      <>
                                        <div
                                          className="avatar-stack avtar-add-image d-flex w-fit"
                                          id={`avtarImageTooltip`}
                                          onClick={() =>
                                            handleImageModel(finalImageObjects)
                                          }
                                        >
                                          {finalImageObjects
                                            .slice(0, 4)
                                            .map((item, ind) => {
                                              return (
                                                <div
                                                  className="avatar-item "
                                                  key={ind}
                                                >
                                                  <img
                                                    className="avatar rounded-circle"
                                                    src={
                                                      !item.image
                                                        ? service1
                                                        : item.image instanceof File || item.image instanceof Blob
                                                          ? URL.createObjectURL(item.image)
                                                          : item.image.startsWith?.("data:") || item.image.startsWith?.("http")
                                                            ? item.image
                                                            : `${axiosClient.defaults.baseURL}${item.image}`
                                                    }
                                                    alt="1"
                                                    width="25px"
                                                    height="25px"
                                                  />
                                                </div>
                                              );
                                            })}
                                          {finalImageObjects.length > 4 ? (
                                            <div className="avatar-item">
                                              <span className="avatar">
                                                +{finalImageObjects.length - 4}
                                              </span>
                                            </div>
                                          ) : (
                                            <div className="avatar-item">
                                              <span className="avatar"></span>
                                            </div>
                                          )}
                                        </div>
                                        <Tooltip
                                          id={`avtarImageTooltip`}
                                          direction="top"
                                          text={ToolTipContent.imageDetail}
                                        />
                                      </>
                                    )}
                                  </div>
                                </>
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-6 col-12 order-listing_cust-call-60">
                            <div className="row align-items-center rounded-2  basic_amt_accrd_Sec right-side-part">
                              <div className=" right-side-part-1 pl-0">
                                <div className="d-flex justify-content-between ">
                                  <Accordion
                                    className={`custom-z-index border-bottom ctransition w-100 ${showAccordion.includes(ind)
                                      ? "position-absolute px-2  justify-content-between"
                                      : " Accordion-header-bg-tranpernt bg-transperent"
                                      }`}
                                    style={{
                                      zIndex: showAccordion.includes(ind)
                                        ? "11"
                                        : " 10",
                                    }}
                                  >
                                    <Accordion.Item
                                      eventKey="0"
                                      className={`w-100 bg-transperent   ${showAccordion.includes(ind)
                                        ? "custome-acc-item"
                                        : "basic_acc_btn_item"
                                        }`}
                                    >
                                      <Accordion.Header className="w-100   custom-acc-header">
                                        <div
                                          className="w-100  d-flex justify-content-between single-acc-row "
                                          id={`basicAccHeader${ind}`}
                                          onClick={() => {
                                            if (showAccordion.includes(ind)) {
                                              setTimeout(() => {
                                                const newData = showAccordion.filter(
                                                  (res) => res !== ind
                                                );
                                                setShowAccordion(newData);
                                              }, 300);
                                            } else {
                                              setShowAccordion([
                                                ...showAccordion,
                                                ind,
                                              ]);
                                            }
                                          }}
                                        >
                                          <span>Basic Amt</span>
                                          <div>
                                            <img
                                              src={DownArrowIcon}
                                              alt="DownArrowIcon"
                                              width={"12px"}
                                              className="mx-1 ctransition-05"
                                              style={{
                                                rotate: showAccordion.includes(
                                                  ind
                                                )
                                                  ? "0deg"
                                                  : "180deg",
                                              }}
                                            />
                                            <span>
                                              {symbol}{" "}
                                              {order?.BasicRate
                                                ? (+order.BasicRate)?.toFixed(
                                                  RoundUpToDecimal
                                                )
                                                : 0}
                                            </span>
                                          </div>
                                        </div>
                                      </Accordion.Header>
                                      {!showAccordion.includes(ind) && (
                                        <Tooltip
                                          id={`basicAccHeader${ind}`}
                                          direction="left"
                                          text={
                                            ToolTipContent.showBasicAmountDetail
                                          }
                                        />
                                      )}

                                      <Accordion.Body
                                        className="custom-acc-body"
                                        container="body"
                                      >
                                        <Accordion>
                                          <Accordion.Item eventKey="0">
                                            <Accordion.Header className="">
                                              <div className="d-flex justify-content-between border p-1 rounded-2  w-100">
                                                <span>Making</span>
                                                <div>
                                                  {/* <img
                                                    src={DownArrowIcon}
                                                    alt="DownArrowIcon"
                                                    width={"12px"}
                                                    className="mx-1 ctransition-05"
                                                    style={{
                                                      rotate: showAccordion.includes(
                                                        ind
                                                      )
                                                        ? "180deg"
                                                        : "0deg",
                                                    }}
                                                  /> */}
                                                  <span>
                                                    {symbol}{" "}
                                                    {(
                                                      order.BasicRate -
                                                      (order.FabAmt +
                                                        order.AccessoryAmt)
                                                    )?.toFixed(
                                                      RoundUpToDecimal
                                                    )}
                                                  </span>
                                                </div>
                                              </div>
                                            </Accordion.Header>
                                          </Accordion.Item>
                                        </Accordion>

                                        {fabArray.length > 0 && (
                                          <Accordion>
                                            <Accordion.Item eventKey="0">
                                              <Accordion.Header className="">
                                                <div className="d-flex justify-content-between border p-1 rounded-2  w-100">
                                                  <span>Fabric</span>
                                                  <div>
                                                    <img
                                                      src={DownArrowIcon}
                                                      alt="DownArrowIcon"
                                                      width={"12px"}
                                                      className="mx-1 ctransition-05"
                                                      style={{
                                                        rotate: showAccordion.includes(
                                                          ind
                                                        )
                                                          ? "180deg"
                                                          : "0deg",
                                                      }}
                                                    />
                                                    <span>
                                                      {symbol}{" "}
                                                      {order.FabAmt?.toFixed(
                                                        RoundUpToDecimal
                                                      )}
                                                    </span>
                                                  </div>
                                                </div>
                                              </Accordion.Header>

                                              <Accordion.Body className="border p-1 rounded-2">
                                                {fabArray.map((item, i) => {
                                                  return (
                                                    <div
                                                      className="bg-light d-flex  m-1 cust-Fab_listing"
                                                      key={i}
                                                    >
                                                      <div className="d-flex justify-content-start  py-1 px-1  cust-Fab_listing-content-75">
                                                        <div className="d-flex custom-border-right">
                                                          <div className="pr-2">
                                                            <span className="mb-0 fw-bold fs-14">
                                                              {
                                                                item.TOrd_FabricId
                                                              }
                                                            </span>
                                                            <div className="d-flex custom-light-text custom-text-transform">
                                                              <img
                                                                src={
                                                                  odertableBarcodeIcon
                                                                }
                                                                alt=""
                                                              />
                                                              <p className="mb-0 fs-12">
                                                                {
                                                                  item.Barcode_Id
                                                                }
                                                              </p>
                                                            </div>
                                                          </div>
                                                        </div>

                                                        <div className="sec-itemslis">
                                                          <div className="d-flex custom-name">
                                                            <div className="custom-border-right pr-2 pl-2 ">
                                                              <span className="mb-0 fs-12 fw-bold">
                                                                {
                                                                  item
                                                                    ?.articleDetails
                                                                    ?.Article_ID
                                                                }
                                                              </span>
                                                              <p className="mb-0 fs-12 custom-light-text custom-text-transform">
                                                                {item
                                                                  ?.articleDetails
                                                                  ?.ArticleName
                                                                  .length > 5
                                                                  ? item.articleDetails?.ArticleName.slice(
                                                                    0,
                                                                    5
                                                                  ) + "..."
                                                                  : item
                                                                    .articleDetails
                                                                    ?.ArticleName}
                                                              </p>
                                                            </div>
                                                            <div className="custom-border-right pr-2 pl-2 ">
                                                              <span className="mb-0 fs-12 fw-bold">
                                                                {
                                                                  item?.MstSize
                                                                    ?.Size
                                                                }{" "}
                                                                SIZE
                                                              </span>
                                                              <p className="mb-0 fs-12 custom-light-text custom-text-transform">
                                                                {
                                                                  item
                                                                    ?.MstColour
                                                                    ?.ColourName
                                                                }
                                                              </p>
                                                            </div>
                                                            <div className="pr-2 pl-2">
                                                              <span className="mb-0 fs-12 fw-bold">
                                                                QTY
                                                              </span>
                                                              <p className="mb-0 fs-12 custom-light-text custom-text-transform">
                                                                {item?.Quantity}{" "}
                                                                Mtrs
                                                              </p>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      {/* {console.log(item,"fhdfhdf")} */}
                                                      <div className="cust-Fab_listing-content-25">
                                                        <div
                                                          style={{
                                                            backgroundColor:
                                                              "#E4E6EA",
                                                          }}
                                                          className="p-1 me-2 text-center"
                                                        >
                                                          <span>
                                                            {symbol}{" "}
                                                            {(item?.Item_rate).toFixed(
                                                              RoundUpToDecimal
                                                            )}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  );
                                                })}
                                              </Accordion.Body>
                                            </Accordion.Item>
                                          </Accordion>
                                        )}

                                        {accessoriesArray.length > 0 && (
                                          <Accordion>
                                            <Accordion.Item eventKey="0">
                                              <Accordion.Header className="">
                                                <div className="d-flex justify-content-between border p-1 rounded-2  w-100">
                                                  <span>Accessories</span>
                                                  <div>
                                                    <img
                                                      src={DownArrowIcon}
                                                      alt="DownArrowIcon"
                                                      width={"12px"}
                                                      className="mx-1 ctransition-05"
                                                      style={{
                                                        rotate: showAccordion.includes(
                                                          ind
                                                        )
                                                          ? "180deg"
                                                          : "0deg",
                                                      }}
                                                    />
                                                    <span>
                                                      {symbol}{" "}
                                                      {order.AccessoryAmt}
                                                    </span>
                                                  </div>
                                                </div>
                                              </Accordion.Header>

                                              <Accordion.Body className="border p-1 rounded-2">
                                                {accessoriesArray.map(
                                                  (item, i) => {
                                                    return (
                                                      <div
                                                        className="bg-light d-flex  m-1 cust-Fab_listing"
                                                        key={i}
                                                      >
                                                        <div className="d-flex justify-content-start  py-1 px-1  cust-Fab_listing-content-75">
                                                          <div className="d-flex custom-border-right">
                                                            <div className="pr-2">
                                                              <span className="mb-0 fw-bold fs-14">
                                                                {
                                                                  item?.TOrd_FabricId
                                                                }
                                                              </span>
                                                              <div className="d-flex custom-light-text custom-text-transform">
                                                                <img
                                                                  src={
                                                                    odertableBarcodeIcon
                                                                  }
                                                                  alt=""
                                                                />
                                                                <p className="mb-0 fs-12">
                                                                  {
                                                                    item?.Barcode_Id
                                                                  }
                                                                </p>
                                                              </div>
                                                            </div>
                                                          </div>

                                                          <div className="sec-itemslis">
                                                            <div className="d-flex custom-name">
                                                              <div className="custom-border-right pr-2 pl-2 ">
                                                                <span className="mb-0 fs-12 fw-bold">
                                                                  {
                                                                    item
                                                                      ?.articleDetails
                                                                      ?.Article_ID
                                                                  }
                                                                </span>
                                                                <p className="mb-0 fs-12 custom-light-text custom-text-transform">
                                                                  {
                                                                    item
                                                                      ?.articleDetails
                                                                      ?.ArticleName
                                                                  }
                                                                </p>
                                                              </div>
                                                              <div className="custom-border-right pr-2 pl-2 ">
                                                                <span className="mb-0 fs-12 fw-bold">
                                                                  {
                                                                    item
                                                                      ?.MstSize
                                                                      ?.Size
                                                                  }{" "}
                                                                  SIZE
                                                                </span>
                                                                <p className="mb-0 fs-12 custom-light-text custom-text-transform">
                                                                  {
                                                                    item
                                                                      ?.MstColour
                                                                      ?.ColourName
                                                                  }
                                                                </p>
                                                              </div>
                                                              <div className="pr-2 pl-2">
                                                                <span className="mb-0 fs-12 fw-bold">
                                                                  QTY
                                                                </span>
                                                                <p className="mb-0 fs-12 custom-light-text custom-text-transform">
                                                                  {
                                                                    item?.Quantity
                                                                  }{" "}
                                                                  Mtrs
                                                                </p>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div className="cust-Fab_listing-content-25">
                                                          <div
                                                            style={{
                                                              backgroundColor:
                                                                "#E4E6EA",
                                                            }}
                                                            className="p-1 me-2 text-center"
                                                          >
                                                            <span>
                                                              {symbol}{" "}
                                                              {(item?.Item_rate).toFixed(
                                                                RoundUpToDecimal
                                                              )}
                                                            </span>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </Accordion.Body>
                                            </Accordion.Item>
                                          </Accordion>
                                        )}
                                      </Accordion.Body>
                                    </Accordion.Item>

                                    {/* measurement selection====================================================================================================== */}
                                  </Accordion>
                                </div>

                                {showAccordion.includes(ind) && (
                                  <div className="d-flex justify-content-between single-acc-row_extra">
                                    <span>Basic Amt</span>
                                    <span>
                                      {symbol}{" "}
                                      {order?.BasicRate
                                        ? (+order.BasicRate)?.toFixed(
                                          RoundUpToDecimal
                                        )
                                        : 0}
                                    </span>
                                  </div>
                                )}

                                <div className="d-flex justify-content-between single-acc-row_extra">
                                  <span>Disc Amt</span>
                                  <span className="bis_margin-end">
                                    {" "}
                                    {symbol} {order?.Discount}
                                  </span>
                                </div>
                                <div className="d-flex justify-content-between single-acc-row_extra">
                                  <span>Taxable Amt</span>
                                  <span className="bis_margin-end">
                                    {" "}
                                    {symbol}{" "}
                                    {(
                                      (order.BasicRate ? order.BasicRate : 0) -
                                      (order?.AdSTax ? order?.AdSTax : 0)
                                    )?.toFixed(RoundUpToDecimal)}
                                  </span>
                                </div>

                                <div className="d-flex justify-content-between single-acc-row_extra">
                                  <span>Tax</span>
                                  <span className="bis_margin-end">
                                    {symbol} {order?.AdSTax ? order?.AdSTax : 0}
                                  </span>
                                </div>
                              </div>

                              <div className=" rounded-2 text-center right-side-part-2 ">
                                {/* <span className="mb-2 netAmt_text">Net Amount</span> */}
                                <h5 className="amt_text">
                                  {symbol}{" "}
                                  {order.NetAmount
                                    ? parseFloat(order.NetAmount)?.toFixed(
                                      RoundUpToDecimal
                                    )
                                    : 0}
                                </h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* )} */}
                      </React.Fragment>
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>

        {/* delete side bar================================================================================================================================= */}
        <div
          className={`nk-split-content nk-split-stretch d-flex w-100 toggle-slide toggle-slide-right toggle-screen-lg ${isSidebarOpen &&
            "content-active"}`}
        >
          <div
            className="slider-wrap p-3 p-sm-4 m-auto "
            style={{
              height: "100%",
              width: "800px",
              zIndex: 100,
              backgroundColor: "white",
              right: "0",
              overflowY: "scroll",
              position: "absolute",
              boxShadow: isSidebarOpen ? "-10px 0px 50px #00000085" : "none",
            }}
          >
            <DeleteSlider
              toggleSidebar={toggleSidebar}
              selectedRows={selectedRow}
              tab={tab}
              mood={mood}
              action={action}
              from={from}
            // isConfirm={isConfirm}
            // setIsConfirm={setIsConfirm}
            />
          </div>
        </div>

        {/* side bar for view to edit mood========================================================================================================================= */}
        <div
          className={`nk-split-content nk-split-stretch d-flex w-100 toggle-slide toggle-slide-right toggle-screen-lg ${isSidebarViewToEdit &&
            "content-active"}`}
        >
          <div
            className="slider-wrap p-3 p-sm-4 m-auto "
            style={{
              height: "100%",
              width: "800px",
              zIndex: 100,
              backgroundColor: "white",
              right: "0",
              overflowY: "scroll",
              position: "absolute",
              boxShadow: isSidebarViewToEdit
                ? "-10px 0px 50px #00000085"
                : "none",
            }}
          >
            <DeleteSliderViewToEdit
              setMood={setMood}
              toggleSidebar={toogleSideBarViewToEdit}
            // selectedRows={selectedRow}

            // onChangeMood={onChangeMood}
            // isConfirm={isConfirm}
            // setIsConfirm={setIsConfirm}
            />
          </div>
        </div>

        {/* side bar for delete payment=========================================================================================================================================== */}
        <div
          className={`nk-split-content nk-split-stretch d-flex w-100 toggle-slide toggle-slide-right toggle-screen-lg ${isDeletePaymentSidebar &&
            "content-active"}`}
        >
          <div
            className="slider-wrap p-3 p-sm-4 m-auto "
            style={{
              height: "100%",
              width: "800px",
              zIndex: 100,
              backgroundColor: "white",
              right: "0",
              overflowY: "scroll",
              position: "absolute",
              boxShadow: isDeletePaymentSidebar
                ? "-10px 0px 50px #00000085"
                : "none",
            }}
          >
            <DeletePaymentSlider
              togglePaymentSidebar={togglePaymentSidebar}
              selectedPaymentMood={selectedPaymentMood}
            // selectedRows={selectedRow}

            // onChangeMood={onChangeMood}
            // isConfirm={isConfirm}
            // setIsConfirm={setIsConfirm}
            />
          </div>
        </div>
        <Modal isOpen={isImageModel} toggle={closeImageModal} size="xl">
          <ModalBody className="overflow-hidden border-bottom-red custome-swipar-button-css px-5">
            <ImagesSlider images={modelImageArray} />
          </ModalBody>
        </Modal>
      </div>

      <div className="d-flex justify-content-center w-100 mt-80">
        <div
          className="bg-white custom-net-payable-amount mt-80"
          style={{
            zIndex: "15",

            // boxShadow:0px 0px 3px rgba(0, 0, 0, 0.2)
          }}
        >
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Body className="rounded-sm">
                <div className="fw-bold  border-bottom border-bottom px-2 py-1">
                  Order Summary
                </div>
                <Accordion>
                  <Accordion.Header>
                    <div
                      className="d-flex justify-content-between p-1 w-100 fw-normal px-2 border-none"
                      onClick={() =>
                        setShowOrderSummaryAcc(!showOrderSummaryAcc)
                      }
                    >
                      <span className="">Net Payable</span>
                      <div className="">
                        <img
                          src={DownArrowIcon}
                          alt="DownArrowIcon"
                          width={"12px"}
                          className="mx-1 ctransition-05"
                          style={{
                            rotate: showOrderSummaryAcc ? "180deg" : "0deg",
                          }}
                        />
                        <span>
                          {symbol}{" "}
                          {orderList?.orderData?.Order?.totalNetAmount?.toFixed(
                            RoundUpToDecimal
                          )}
                        </span>
                      </div>
                    </div>
                  </Accordion.Header>

                  <Accordion.Body className="px-4 mt-1">
                    <div className="d-flex justify-content-between w-100 ">
                      <span>Total Basic Amt</span>
                      <span>
                        {symbol}{" "}
                        {(
                          orderList?.orderData?.Order?.totalBasicAmt +
                          orderList?.orderData?.Order?.TotalFabAmt
                        )?.toFixed(RoundUpToDecimal)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between  w-100 fs-12">
                      <span>Total Discount</span>
                      <span>
                        {symbol} {orderList?.orderData?.Order?.totalDisAmt}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between  w-100 fs-12">
                      <span>Total Taxable Amt</span>
                      <span>
                        {symbol}{" "}
                        {(
                          orderList?.orderData?.Order?.totalBasicAmt +
                          orderList?.orderData?.Order?.TotalFabAmt
                        )?.toFixed(RoundUpToDecimal) -
                          orderList?.orderData?.Order?.totalTaxAmt}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between  w-100 fs-12">
                      <span>Total Tax</span>
                      <span>
                        {symbol}{" "}
                        {orderList?.orderData?.Order?.totalTaxAmt?.toFixed(
                          RoundUpToDecimal
                        )}
                      </span>
                    </div>
                  </Accordion.Body>
                </Accordion>
                <Accordion>
                  <Accordion.Header>
                    <div
                      className="d-flex justify-content-between p-1 w-100 fs-14 fw-normal px-2 "
                      onClick={() => setShowTotalPaidAcc(!showTotalPaidAcc)}
                    >
                      <span>Total paid</span>
                      <div className="">
                        <img
                          src={DownArrowIcon}
                          alt="DownArrowIcon"
                          width={"12px"}
                          className="mx-1 ctransition-05"
                          style={{
                            rotate: showTotalPaidAcc ? "180deg" : "0deg",
                          }}
                        />
                        <span>
                          {symbol} {orderList?.orderData?.Order?.totalpaid}
                        </span>
                      </div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="px-4 mt-1">
                      <table className="w-100 fs-12">
                        {orderList?.orderData?.Order?.ledgerDetailsData?.map(
                          (entry, index) => (
                            <tr key={index} className="table-broder-bottom ">
                              <td className="py-1">{entry.Date}</td>
                              <td>{entry.VouNo}</td>
                              <td>
                                {entry.PaymentMode === "BANK"
                                  ? "Bank"
                                  : entry.PaymentMode === "CASH"
                                    ? "Cash"
                                    : entry.PaymentMode === "Wallet"
                                      ? "Wallet"
                                      : "Cash Discount"}
                              </td>
                              <td>
                                {entry.PaymentMode === "BANK" ||
                                  entry.PaymentMode === "Wallet" ? (
                                  <>
                                    Txn# {entry.ChequeNo}
                                    <p>{entry.BankName}</p>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </td>
                              <td>
                                {symbol}
                                {entry.Amount}
                              </td>
                              {mood == "edit" && (
                                <td>
                                  <img
                                    src={redCloseIcon}
                                    width="15px"
                                    className="me-1 cursor-pointer"
                                    id="BtnEditOrderDelPay"
                                    onClick={() =>
                                      handleAction(
                                        "BtnEditOrderDelPay",
                                        "action",
                                        handlePaymentDelete,
                                        entry
                                        // balanceData.balanceData
                                      )
                                    }
                                  />
                                </td>
                              )}
                            </tr>
                          )
                        )}
                      </table>
                    </div>
                  </Accordion.Body>
                </Accordion>
              </Accordion.Body>
              <Accordion.Header
                className="custom-accordion-header px-3 pb-2 bg-white"
                onClick={handleAccordionToggle}
              >
                <div className="fw-bold w-100 bg-white d-flex justify-content-between  align-items-center">
                  <span>Balance</span>
                  <div className="d-flex">
                    <div
                      style={{ backgroundColor: "#E4E6EA" }}
                      className="p-1 text-center rounded-2 py-2"
                    >
                      <img
                        src={DownArrowIcon}
                        alt="DownArrowIcon"
                        width={"16px"}
                        className="mx-1 ctransition-05"
                        style={{
                          rotate: isNetPayment ? "180deg" : "0deg",
                        }}
                      />
                      <span>
                        {symbol}{" "}
                        {orderList?.orderData?.Order?.Balance?.toFixed(
                          RoundUpToDecimal
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Accordion.Header>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </>
  );
};

export default OrderList;

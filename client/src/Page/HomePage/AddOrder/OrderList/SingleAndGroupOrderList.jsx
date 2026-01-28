import React, { useEffect, useState } from "react";
// import service1 from "./../../../../images/avatar/ServiceAlbum/service1.png";
import tridateImg from "./../../../../images/icons/tridateImg.svg";
import deldateImg from "./../../../../images/icons/deldateImg.svg";
import SpecialIcon from "./../../../../images/icons/special-icon.svg";
import orderListIcon2 from "./../../../../images/icons/order-list-icon2.svg";
import orderListIcon3 from "./../../../../images/icons/order-list-icon3.svg";
import orderListIcon4 from "./../../../../images/icons/order-list-icon4.svg";

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
import PaymentInputInfoIcon from "../../../../images/icons/payment-input-info-icon.svg";

import odertableBarcodeIcon from "./../../../../images/icons/odertable-barcode.svg";
import { toast } from "react-toastify";
import Icon from "../../../../Components/icon/Icon";
import { useNavigate } from "react-router";
import {
  Button,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  Spinner,
  UncontrolledDropdown,
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
import CustomPagination from "../../CommonTracker/CustomPagination";
import { addDublicateOrder } from "../../../../redux/actions/dublicateSingleOrderAction";
import { formatDate } from "../../../../redux/dateFormateFunction";
import {
  deleteGroupOrderItem,
  getGroupOrderListAsyncData,
  getSingleGroupOrderList,
} from "../../../../redux/actions/groupOrderListAction";
import ListingSkelaton from "../SkeletonDesign/ListingSkelaton";
import { useTheme } from "../../../../Layout/Provider/Themes";
import Tooltip from "../../../../Components/Tooltip/Tooltip";
import ToolTipContent from "../../../../Components/Tooltip/ToolTipContent";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const SingleAndGroupOrderList = () => {
  const { tabId } = useTheme();
  const { handleAction } = usePermissions();

  const symbol = localStorage.getItem("countrySymbol");
  const service = useSelector((state) => state.service.service.orderDetails);
  const getConfig = useSelector((state) => state?.config?.orderType);
  const serviceId = localStorage.getItem(`serviceId${tabId}`);
  const RoundUpToDecimal =
    getConfig?.RoundUpToDecimal == null ||
      getConfig?.RoundUpToDecimal == undefined ||
      getConfig?.RoundUpToDecimal == 0
      ? 2
      : getConfig?.RoundUpToDecimal;
  const EnableInventory = useSelector(
    (state) => state?.config?.orderType.EnableInventory
  );
  //pagination logic...........................................................................
  // const [currentPage, setCurrentPage] = useState(0);
  // const [pageSize, setPageSize] = useState(10);
  // const handlePageChange = (newPage) => {
  //   setCurrentPage(newPage);
  // };

  // const handleRowsPerPageChange = (newRowsPerPage) => {
  //   setCurrentPage(0);
  //   setPageSize(newRowsPerPage);
  // };

  const selectedService = service?.find((item) => item.ItemId === serviceId);

  let orderList = useSelector((state) => state.groupOrderList);

  const navigate = useNavigate();

  const [openedRow, setOpenedRow] = useState(-1);
  const [dropDownData, setDropDownData] = useState({});
  const [isLoader, setIsLoader] = useState(false);
  const handleMouseEnter = (item, ind) => {
    setOpenedRow(ind);
    setDropDownData(item);
  };

  const [isNetPayment, setIsNetPayment] = useState(false);
  const id = localStorage.getItem(`customerId${tabId}`);
  const rows = 5;
  const accordionRow = 2;

  const [oldDtID, setOldDtID] = useState();

  const handleAccordionToggle = () => {
    setIsNetPayment(!isNetPayment);
  };

  const handleBacktoOrder = () => {
    dispatch({ type: "GET_SINGLE_ORDER_ITEM", payload: {} });
    dispatch({ type: "GET_FABRIC_ACC_LIST", payload: {} });

    dispatch({ type: "GET_SINGLE_GROUP_ORDER_ITEM", payload: {} });
    dispatch({ type: "ADD_GROUP_ORDER", payload: {} });
    dispatch({ type: "GET_SINGLE_GROUP_SERVICE", payload: {} });
    dispatch({ type: "GET_GROUP_FABRIC_ACC_LIST", payload: {} });
    // dispatch({ type: "GET_SINGLE_GROUP_ORDER_ITEM", payload: {} });
    setOldDtID(localStorage.getItem(`TOrdDtID${tabId}`));

    navigate("/add-order", {
      state: { from: "order-list", oldDtID: oldDtID },
    });
  };
  const [showAccordion, setShowAccordion] = useState([]);
  const [activeAccordionId, setActiveAccordionId] = useState(null);

  const [isImageModel, setIsImageModel] = useState(false);
  const [modelImageArray, setModelImageArray] = useState([]);
  const handleImageModel = (images) => {
    setModelImageArray(images);
    setIsImageModel(!isImageModel);
  };
  const closeImageModal = () => {
    setIsImageModel(false);
  };

  const handleEditItem = (item) => {
    localStorage.setItem(`TOrdDtID${tabId}`, item.TOrdDtId);
    localStorage.setItem(`TOrdHdID${tabId}`, item.TOrdHdID);
    localStorage.setItem(`serviceId${tabId}`, item.ItemId);

    // // console.log();

    if (item.groupItemList.length > 0) {
      dispatch(getSingleGroupOrderList(item.TOrdDtId));
      navigate("/group-order-home-page", {
        state: { from: "group-order-list" },
      });
    } else {
      // // console.log("=========================single===================");
      dispatch(getSingleOrderList(item.TOrdDtId));
      navigate("/add-order-home-page", {
        state: {
          from: "single-order-list",
        },
      });
    }
    //
  };

  const [isDublicateLoader, setIsDublicateLoader] = useState(false);
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

  const dispatch = useDispatch();

  // const formatDate = (dateString) => {
  //   const originalDate = new Date(dateString);
  //   const formattedDate = new Intl.DateTimeFormat("en-US", {
  //     year: "numeric",
  //     month: "short",
  //     day: "2-digit",
  //   }).format(originalDate);
  //   return formattedDate;
  // };

  const TOrdHdID = localStorage.getItem(`TOrdHdID${tabId}`);

  useEffect(() => {
    if (TOrdHdID != null) {
      dispatch(getGroupOrderListAsyncData(TOrdHdID));
    }
  }, [tabId]);
  // Removed duplicate useEffect - already called with [tabId] dependency above
  // This was causing the API to be called twice on component mount
  // useEffect(() => {
  //   if (TOrdHdID != null) {
  //     dispatch(getGroupOrderListAsyncData(TOrdHdID));
  //   }
  // }, []);

  const handleDeleteItem = (item) => {
    setIsLoader(true);
    if (item.groupItemList.length > 0) {
      dispatch(deleteGroupOrderItem(item.TOrdDtId)).then((res) => {
        if (res?.success) {
          const TOrdHdID = localStorage.getItem(`TOrdHdID${tabId}`);
          dispatch(getGroupOrderListAsyncData(TOrdHdID));
          toast.success(res.message);
          setIsLoader(false);
        } else {
          setTimeout(() => {
            setIsLoader(false);
          }, 400);
        }
      });
      setTimeout(() => {
        setIsLoader(false);
      }, 6000);
    } else {
      dispatch(deleteOrderItem(item.TOrdDtId)).then((res) => {
        if (res?.success) {
          const TOrdHdID = localStorage.getItem(`TOrdHdID${tabId}`);
          dispatch(getGroupOrderListAsyncData(TOrdHdID));
          toast.success(res.message);
          setIsLoader(false);
        } else {
          setTimeout(() => {
            setIsLoader(false);
          }, 400);
        }
      });
      setTimeout(() => {
        setIsLoader(false);
      }, 6000);
    }
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

  return (
    <>
      <div className="my-1">
        <div className="d-flex justify-content-end">
          <Button
            outline
            color="light"
            // onClick={() =>
            //   handleAction(
            //     "BtnBkAnOrderAddMoreItem",
            //     "action",
            //     handleBacktoOrder,
            //     null

            //   )
            // }
            onClick={handleBacktoOrder}
            className=""
            id="BtnBkAnOrderAddMoreItem"
          >
            {/* <img src={viewIcon} alt="viewIcon" /> */}
            <span className="fs-4">+</span>
            <span className="ms-1">Add More Item</span>
          </Button>
          <Tooltip
            id={`BtnBkAnOrderAddMoreItem`}
            direction="left"
            text={ToolTipContent.addNewOrder}
          />
        </div>
      </div>
      <div className="shadow p-1  bg-white cust-orderlist-padding ">
        <div
          className=" rounded-2 p-1 position-relative cust-orderlist-padding"
        // style={{ maxHeight: "500px", minHeight: "500px ", overflow: "auto" }}
        >
          {orderList.isLoader ? (
            <ListingSkelaton />
          ) : (
            <>
              {orderList?.orderData?.Order?.TOrdDtls?.map((order, ind) => {
                const newImageObjects = Object.keys(order)
                  .filter(
                    (key) =>
                      (key.startsWith("attach_img_") ||
                        key.startsWith("attach_garment_img_")) &&
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

                const finalImageObjects = newImageObjects.slice(
                  0,
                  newImageObjects.length / 2
                );

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
                  <React.Fragment key={ind}>
                    {order.ItemName && (
                      <div className="row  rounded-2 order-listing-sec order-listing-sec">
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
                                    <span
                                      className="fw-bold fs-6 text-dark"
                                    // onMouseEnter={() =>
                                    //   handleMouseEnter(order, ind)
                                    // }
                                    // onMouseLeave={handleMouseLeave}
                                    >
                                      {/* Sherwani... */}
                                      {order.ItemName ? (
                                        <>
                                          {order.ItemName.length > 10
                                            ? order.ItemName.slice(0, 10) +
                                            "..."
                                            : order.ItemName}
                                        </>
                                      ) : (
                                        "Sherwani......."
                                      )}
                                    </span>
                                    <img
                                      src={PaymentInputInfoIcon}
                                      onMouseEnter={() =>
                                        handleMouseEnter(order, ind)
                                      }
                                      className="ms-1"
                                      // onClick={() => setIsOpen(!isOpen)}
                                      alt="PaymentInputInfoIcon"
                                    />
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
                                                "BtnBkAnOrderDelItem",
                                                "action",
                                                handleDeleteItem,
                                                order
                                              )
                                            }
                                            // onClick={() =>
                                            //   handleDeleteItem(order)
                                            // }
                                            className="me-1 cursor-pointer"
                                            id={`BtnBkAnOrderDelItem${ind}`}
                                          />
                                          <Tooltip
                                            id={`BtnBkAnOrderDelItem${ind}`}
                                            direction="top"
                                            text={ToolTipContent.removeOrder}
                                          />
                                        </>
                                      )}
                                      <img
                                        src={ActionEditIcon}
                                        alt=""
                                        width="25px"
                                        // onClick={() =>
                                        //   handleAction(
                                        //     "BtnBkAnOrderEditItem",
                                        //     "action",
                                        //     handleEditItem,
                                        //     order
                                        //   )
                                        // }
                                        onClick={() => handleEditItem(order)}
                                        className="me-1 cursor-pointer"
                                        id={`BtnBkAnOrderEditItem${ind}`}
                                      />
                                      <Tooltip
                                        id={`BtnBkAnOrderEditItem${ind}`}
                                        direction="top"
                                        text={ToolTipContent.editOrderDetails}
                                      />
                                    </div>
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
                                      <div
                                        className=" border rounded-2"
                                        id={`ItemDesc${order.TOrdDtId}`}
                                      >
                                        <span className="ms-1">
                                          {dropDownData?.ItemDesc?.length > 100
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
                              <Tooltip
                                id={`ItemDesc${order.TOrdDtId}`}
                                direction="right"
                                text={dropDownData.ItemDesc}
                              />

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
                                    <span className="me-1">Priority</span>
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
                                      item?.ItemType === "Cut Length" ||
                                      item?.ItemType === "Fabric" ||
                                      item?.ItemType === "fabric" ||
                                      item?.ItemType === "cut length"
                                  );
                                  const accessoriesArray = item.fabricList.filter(
                                    (item) =>
                                      item?.ItemType === "Accessories" ||
                                      item?.ItemType === "accessories"
                                  );

                                  const newImageObjects = Object.keys(item)
                                    .filter(
                                      (key) =>
                                        (key.startsWith("attach_img_") ||
                                          key.startsWith(
                                            "attach_garment_img_"
                                          )) &&
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

                                  const finalImageObjects = newImageObjects.slice(
                                    0,
                                    newImageObjects.length / 2
                                  );

                                  return (
                                    <div
                                      className="row justify-content-between align-items-center custom-group-icon"
                                      key={ind}
                                    >
                                      <div className="col-3 d-flex mt-2 custom-group-item-lable">
                                        <span>{item.ItemName} &nbsp; {item.OrdSrNo ? `(${item.OrdSrNo})` : ""} </span>
                                      </div>

                                      <div className="col-9 d-flex feb_acces_measu_stl_icon">
                                        <div className="d-flex bg-white border rounded-2">
                                          {EnableInventory == 1 && (
                                            <div className="rounded-circle d-flex align-items-center mx-1">
                                              <img
                                                id="BtnBkAnOrderEditItem"
                                                src={
                                                  fabArray.length > 0
                                                    ? isFabricIcon
                                                    : isnotFabricIcon
                                                }
                                                alt=""
                                                width="35px"
                                                // onClick={() =>
                                                //   handleAction(
                                                //     "BtnBkAnOrderEditItem",
                                                //     "action",
                                                //     handleEditItem,
                                                //     order
                                                //    )
                                                // }
                                                onClick={() =>
                                                  handleEditItem(order)
                                                }
                                              />
                                            </div>
                                          )}
                                          {EnableInventory == 1 && (
                                            <div className="rounded-circle d-flex align-items-center mx-1">
                                              <img
                                                id="BtnBkAnOrderEditItem"
                                                src={
                                                  accessoriesArray.length > 0
                                                    ? isAccessoriesIcon
                                                    : isnotAccessoriesIcon
                                                }
                                                alt=""
                                                width="35px"
                                                // onClick={() =>
                                                //   handleAction(
                                                //     "BtnBkAnOrderEditItem",
                                                //     "action",
                                                //     handleEditItem,
                                                //     order

                                                //   )
                                                // }
                                                onClick={() =>
                                                  handleEditItem(order)
                                                }
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
                                              id="BtnBkAnOrderEditItem"
                                              width="35px"
                                              // onClick={() =>
                                              //   handleAction(
                                              //     "BtnBkAnOrderEditItem",
                                              //     "action",
                                              //     handleEditItem,
                                              //     order
                                              //     // balanceData.balanceData
                                              //   )
                                              // }
                                              onClick={() =>
                                                handleEditItem(order)
                                              }
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
                                              id="BtnBkAnOrderEditItem"
                                              width="35px"
                                              // onClick={() =>
                                              //   handleAction(
                                              //     "BtnBkAnOrderEditItem",
                                              //     "action",
                                              //     handleEditItem,
                                              //     order
                                              //     // balanceData.balanceData
                                              //   )
                                              // }
                                              onClick={() =>
                                                handleEditItem(order)
                                              }
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
                                                      src={item.image}
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
                                                  +
                                                  {finalImageObjects.length - 4}
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
                          <div className=" row align-items-center rounded-2  basic_amt_accrd_Sec right-side-part">
                            <div className="right-side-part-1 pl-0">
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
                                            }, 300); // 200 milliseconds = 0.2 seconds
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
                                        direction="top"
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
                                                  )?.toFixed(RoundUpToDecimal)}
                                                </span>
                                              </div>
                                            </div>
                                          </Accordion.Header>
                                        </Accordion.Item>
                                      </Accordion>
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
                                  {symbol} {order?.AdSTax}
                                </span>
                              </div>
                            </div>

                            <div className=" rounded-2  text-center right-side-part-2">
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
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment key={ind}>
                    {order.ItemName && (
                      <div
                        className="row rounded-2  align-items-center order-listing-sec"
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
                                          &nbsp;
                                          {order.OrdSrNo ? `(${order.OrdSrNo})` : ""}
                                        </>
                                      ) : (
                                        "Sherwani......."
                                      )}
                                    </span>
                                    <img
                                      src={PaymentInputInfoIcon}
                                      onMouseEnter={() =>
                                        handleMouseEnter(order, ind)
                                      }
                                      className="ms-1"
                                      // onClick={() => setIsOpen(!isOpen)}
                                      alt="PaymentInputInfoIcon"
                                    />

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
                                                "BtnBkAnOrderDelItem",
                                                "action",
                                                handleDeleteItem,
                                                order
                                                // balanceData.balanceData
                                              )
                                            }
                                            className="me-1 cursor-pointer"
                                            id={`BtnBkAnOrderDelItem${ind}`}
                                          />
                                          <Tooltip
                                            id={`BtnBkAnOrderDelItem${ind}`}
                                            direction="top"
                                            text={ToolTipContent.removeOrder}
                                          />
                                        </>
                                      )}
                                      <img
                                        src={ActionEditIcon}
                                        alt=""
                                        width="25px"
                                        // onClick={() =>
                                        //   handleAction(
                                        //     "BtnBkAnOrderEditItem",
                                        //     "action",
                                        //     handleEditItem,
                                        //     order
                                        //     // balanceData.balanceData
                                        //   )
                                        // }
                                        onClick={() => handleEditItem(order)}
                                        className="me-1 cursor-pointer"
                                        id={`BtnBkAnOrderEditItem${ind}`}
                                      />
                                      <Tooltip
                                        id={`BtnBkAnOrderEditItem${ind}`}
                                        direction="top"
                                        text={ToolTipContent.editOrderDetails}
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
                                            // onClick={() =>
                                            //   handleAction(
                                            //     "BtnBkAnOrderDuplicateItem",
                                            //     "action",
                                            //     handleDublicateItem,
                                            //     order

                                            //   )
                                            // }
                                            onClick={() =>
                                              handleDublicateItem(order)
                                            }
                                            className="me-1 cursor-pointer"
                                            id={`BtnBkAnOrderDuplicateItem${ind}`}
                                          />
                                          <Tooltip
                                            id={`BtnBkAnOrderDuplicateItem${ind}`}
                                            direction="top"
                                            text={ToolTipContent.dublicateItem}
                                          />
                                        </>
                                      )}
                                    </div>

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
                                    className="dropdown-body p-1"
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

                                      <div
                                        className=" border rounded-2"
                                        id={`ItemDesc${order.TOrdDtId}`}
                                      >
                                        <span className="ms-1">
                                          {dropDownData?.ItemDesc?.length > 100
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
                              <Tooltip
                                id={`ItemDesc${order.TOrdDtId}`}
                                direction="right"
                                text={dropDownData.ItemDesc}
                              />

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

                              {/* {!selectedService?.IsGroup ? ( */}
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
                                          id="fab_img_toolTip"
                                          alt=""
                                          width="35px"
                                          // onClick={() =>
                                          //   handleAction(
                                          //     "BtnBkAnOrderEditItem",
                                          //     "action",
                                          //     handleEditItem,
                                          //     order
                                          //     // balanceData.balanceData
                                          //   )
                                          // }
                                          onClick={() => handleEditItem(order)}
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
                                          id="accs_img_toolTip"
                                          alt=""
                                          width="35px"
                                          // onClick={() =>
                                          //   handleAction(
                                          //     "BtnBkAnOrderEditItem",
                                          //     "action",
                                          //     handleEditItem,
                                          //     order
                                          //     // balanceData.balanceData
                                          //   )
                                          // }
                                          onClick={() => handleEditItem(order)}
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
                                        id="measure_img_toolTip"
                                        alt=""
                                        width="35px"
                                        // onClick={() =>
                                        //   handleAction(
                                        //     "BtnBkAnOrderEditItem",
                                        //     "action",
                                        //     handleEditItem,
                                        //     order
                                        //     // balanceData.balanceData
                                        //   )
                                        // }
                                        onClick={() => handleEditItem(order)}
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
                                        id="style_img_toolTip"
                                        alt=""
                                        width="35px"
                                        // onClick={() =>
                                        //   handleAction(
                                        //     "BtnBkAnOrderEditItem",
                                        //     "action",
                                        //     handleEditItem,
                                        //     order
                                        //     // balanceData.balanceData
                                        //   )
                                        // }
                                        onClick={() => handleEditItem(order)}
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
                                                  src={item.image}
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
                              {/* ) : (
                              <></>
                            )} */}
                            </div>
                          </div>
                        </div>

                        <div className="col-sm-6 col-12 order-listing_cust-call-60">
                          <div className="row align-items-center rounded-2  basic_amt_accrd_Sec right-side-part">
                            <div className="right-side-part-1 pl-0">
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
                                            }, 300); // 200 milliseconds = 0.2 seconds
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
                                                  )?.toFixed(RoundUpToDecimal)}
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
                                                            {item.TOrd_FabricId}
                                                          </span>
                                                          <div className="d-flex custom-light-text custom-text-transform">
                                                            <img
                                                              src={
                                                                odertableBarcodeIcon
                                                              }
                                                              alt=""
                                                            />
                                                            <p className="mb-0 fs-12">
                                                              {item.Barcode_Id}
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
                                                                item?.MstColour
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
                                                          {item?.Basic_Amt ==
                                                            0 ||
                                                            item?.Basic_Amt ==
                                                            null
                                                            ? item.Item_rate
                                                            : item.Basic_Amt *
                                                            item?.Quantity}
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
                                                            {item?.Basic_Amt ==
                                                              0 ||
                                                              item?.Basic_Amt ==
                                                              null
                                                              ? item.Item_rate
                                                              : item.Basic_Amt *
                                                              item?.Quantity}
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
                                  {symbol} {order?.AdSTax}
                                </span>
                              </div>
                            </div>

                            <div className=" rounded-2  text-center right-side-part-2">
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
                    )}
                  </React.Fragment>
                );
              })}
            </>
          )}
        </div>

        <Modal isOpen={isImageModel} toggle={closeImageModal} size="xl">
          <ModalBody className="overflow-hidden border-bottom-red custome-swipar-button-css px-5">
            <ImagesSlider images={modelImageArray} />
          </ModalBody>
        </Modal>
      </div>

      <div className="d-flex justify-content-center w-100 mt-80">
        <div className="bg-white  custom-net-payable-amount">
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Body className="px-2 mt-2">
                <div className="fw-bold fs-16">Order Summary</div>
                <div className="d-flex justify-content-between p-1 w-100 fs-12">
                  <span>Total Basic Amt</span>
                  <span>
                    {symbol}{" "}
                    {(
                      orderList?.orderData?.Order?.totalBasicAmt +
                      orderList?.orderData?.Order?.TotalFabAmt
                    )?.toFixed(RoundUpToDecimal)}
                  </span>
                </div>
                <div className="d-flex justify-content-between p-1 w-100 fs-12">
                  <span>Total Discount</span>
                  <span>
                    {symbol} {orderList?.orderData?.Order?.totalDisAmt}
                  </span>
                </div>
                <div className="d-flex justify-content-between p-1 w-100 fs-12">
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
                <div className="d-flex justify-content-between p-1 w-100 fs-12">
                  <span>Total Tax</span>
                  <span>
                    {symbol}{" "}
                    {orderList?.orderData?.Order?.totalTaxAmt?.toFixed(
                      RoundUpToDecimal
                    )}
                  </span>
                </div>
              </Accordion.Body>
              <Accordion.Header
                className="custom-accordion-header px-3 pb-2 bg-white"
                onClick={handleAccordionToggle}
              >
                <div className="fw-bold w-100 bg-white d-flex justify-content-between  align-items-center">
                  <span>Net Payable</span>
                  <div className="d-flex">
                    <div
                      style={{ backgroundColor: "#E4E6EA" }}
                      className="p-1 text-center rounded-2 py-2 w-100"
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
                        {symbol} {orderList?.orderData?.Order?.totalNetAmount}
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

export default SingleAndGroupOrderList;

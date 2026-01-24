import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";

import {
  Button,
  DropdownMenu,
  DropdownToggle,
  UncontrolledTooltip,
  UncontrolledDropdown,
  Spinner,
} from "reactstrap";
import SpecialIcon from "./../../../../images/icons/special-icon.svg";
import odertableBarcodeIcon from "./../../../../images/icons/odertable-barcode.svg";

import DeleteItemIcon from "../../../../images/icons/delete-item-icon.svg";
import viewIcon from "../../../../images/icons/viewIcon.svg";
import { Tooltip as ReactTooltip } from "react-tooltip";
import tridateImg from "./../../../../images/icons/tridateImg.svg";
import deldateImg from "./../../../../images/icons/deldateImg.svg";
import PaymentInputInfoIcon from "../../../../images/icons/payment-input-info-icon.svg";
import isStyleIcon from "./../../../../images/icons/isStyle-icon.svg";
import isMeasurementIcon from "./../../../../images/icons/isMeasurement-icon.svg";
import isAccessoriesIcon from "./../../../../images/icons/isAccessories-icon.svg";
import isFabricIcon from "./../../../../images/icons/isFabric-icon.svg";
import isnotStyleIcon from "./../../../../images/icons/isnotStyle-icon.svg";
import isnotMeasurementIcon from "./../../../../images/icons/isnotMeasurement-icon.svg";
import isnotAccessoriesIcon from "./../../../../images/icons/isnotAccessories-icon.svg";
import isnotFabricIcon from "./../../../../images/icons/isnotFabric-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import DownArrowIcon from "./../../../../images/icons/up-arrow.svg";

import { toast } from "react-toastify";
import service1 from "./../../../../images/avatar/ServiceAlbum/service1.png";
import { formatDate } from "../../../../redux/dateFormateFunction";
import {
  deleteOrderItem,
  getOrderListAsyncData,
  getSingleOrderList,
} from "../../../../redux/actions/orderListAction";
import { useNavigate } from "react-router";
import { deleteGroupOrderItem, getGroupOrderListAsyncData } from "../../../../redux/actions/groupOrderListAction";
import { useTheme } from "../../../../Layout/Provider/Themes";
import Tooltip from "../../../../Components/Tooltip/Tooltip";
import backArrowIcon from "./../../../../images/icons/backArrowIcon.svg";

const DeleteSlider = ({
  toggleSidebar,
  selectedRows,
  tab,
  mood,
  action,
  from,
  // isConfirm,
  // setIsConfirm,
}) => {
  
  
  
  const { tabId } = useTheme();
  const symbol = localStorage.getItem("countrySymbol");
  const getConfig = useSelector((state) => state?.config?.orderType);
  const RoundUpToDecimal =
    getConfig?.RoundUpToDecimal == 0 ||
    getConfig?.RoundUpToDecimal == undefined ||
    getConfig?.RoundUpToDecimal == null
      ? 2
      : getConfig?.RoundUpToDecimal;

  const [showAccordion, setShowAccordion] = useState(false);
  const [showFabAccordion, setShowFabAccordion] = useState(false);
  const [showAccAccordion, setShowAccAccordion] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [dropDownData, setDropDownData] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const handleOTP = () => {
  //   setSendOTP(true);
  //   dispatch(sendOrderDeleteOtp(conSelectedRows, email)).then((res) => {
  //
  //     if (res?.data?.success == true) {
  //       toast.success(res.data.message);

  //       setIsCountingDown(true);
  //     } else {
  //       toast.error(res.data.message);
  //     }
  //   });
  // };

  // const handleVerify = () => {
  //   try {
  //     dispatch(verifyOrderDeleteOtp(email, otp)).then((res) => {
  //
  //       if (res.success) {
  //         toast.success(res.message);
  //         toggleSidebar(false);
  //       }
  //       // if (res == false || res == undefined) {
  //       else {
  //         toast.error(res.message);
  //       }
  //     });
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }
  // };

  // const [isConfirm, setIsConfirm] = useState(false);

  // const TOrdHdID = localStorage.getItem(`TOrdHdID${tabId}`);
  // dispatch(getGroupOrderListAsyncData(TOrdHdID));
  const [deleteLoader, setDeleteLoader] = useState(false);
  const handleVerify = () => {
    setDeleteLoader(true);
    if (action == "edit") {
      toggleSidebar(false);
      localStorage.setItem(`TOrdDtID${tabId}`, selectedRows.TOrdDtId);
      localStorage.setItem(`TOrdHdID${tabId}`, selectedRows.TOrdHdID);
      localStorage.setItem(`serviceId${tabId}`, selectedRows.ItemId);

      dispatch(getSingleOrderList(selectedRows.TOrdDtId));
      navigate("/add-order-home-page", {
        state: { from: from, tab: tab, mood: mood },
      });
    } else if (action == "delete") {
      if(selectedRows.groupItemList.length === 0){
        dispatch(deleteOrderItem(selectedRows.TOrdDtId)).then((res) => {
          if (res?.success) {
            const TOrdHdID = localStorage.getItem(`TOrdHdID${tabId}`);
            dispatch(getGroupOrderListAsyncData(TOrdHdID));
            setDeleteLoader(false);
            toggleSidebar(false);
            setConfirmText("");
            toast.success(res.message);
            // setIsLoader(false);
            // }
            // else {
            //   setTimeout(() => {
            //     setIsLoader(false);
            //   }, 400);
          }
        });
      }else{
        dispatch(deleteGroupOrderItem(selectedRows.TOrdDtId)).then((res) => {
          if (res?.success) {
            const TOrdHdID = localStorage.getItem(`TOrdHdID${tabId}`);
            dispatch(getGroupOrderListAsyncData(TOrdHdID));
            setDeleteLoader(false);
            toggleSidebar(false);
            setConfirmText("");
            toast.success(res.message);
            // setIsLoader(false);
            // }
            // else {
            //   setTimeout(() => {
            //     setIsLoader(false);
            //   }, 400);
          }
        });
      }
      setTimeout(() => {
        setDeleteLoader(false);
      }, 6000);
    }
  };

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setConfirmText(newValue);
  };

  // const [openedRow, setOpenedRow] = useState(-1);

  const handleMouseEnter = (item) => {
    // setOpenedRow(ind);
    setDropDownData(item);
  };

  const handleToggleSidebar = () => {
    toggleSidebar(false); // Toggle the sidebar
  };

  const fabArray = selectedRows?.fabricList?.filter(
    (item) =>
      item?.ItemType === "Cut Length" ||
      item?.ItemType === "Fabric" ||
      item?.ItemType === "fabric" ||
      item?.ItemType === "cut length"
  );
  const accessoriesArray = selectedRows?.fabricList?.filter(
    (item) =>
      item?.ItemType === "Accessories" || item?.ItemType === "accessories"
  );
  return (
    <div className="overflow-auto">
      <Button outline color="light" onClick={handleToggleSidebar}>
        <img
          src={backArrowIcon}
          alt="viewIcon"
          // style={{
          //   rotate: "180deg",
          // }}
        />
        <span className="ms-1">Back</span>
      </Button>

      <div className="d-flex align-items-center mt-2 mb-2">
        <span className="fs-5 fw-bold">
          {action == "edit" ? "Edit Item" : "Delete Item"}
        </span>
        {/* <div className="ms-2 p-0">
          <div className="d-flex text-dark" data-tooltip-id="my-tooltip-1">
            <img src={PaymentInputInfoIcon} alt="PaymentInputInfoIcon" />
          </div>

          <ReactTooltip
            // end
            id="my-tooltip-1"
            place="end"
            variant=""
            effect="solid"
            content="Lorem ipsum dolor sit amet, consectetuer adipiscing elit"
            style={{
              outlineBottom: "4px solid #db2314",
              padding: "10px",
              zIndex: "999999 !important",
            }}
            className="p-2 border-bottom border-2 border-danger"
          />
        </div> */}
      </div>
      <div className="bg-light p-3 d-flex ">
        <div>
          <img src={DeleteItemIcon} alt="" width={70} />
        </div>
        <div className="ms-4">
          <ul style={{ listStyleType: "disc" }} className="text-justify">
            <li>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Perferendis, vero. Vero quae, magni amet repellat magnam ipsum
              accusamus tenetur.
            </li>
            <li>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam,
              quos molestiae?
            </li>
            <li>Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
          </ul>
        </div>
      </div>
      <div className="d-flex align-items-center mt-2 mb-2">
        <span className="fs-5 fw-bold">Item Detail</span>
        {/* <div className="ms-2 p-0">
          <div className="d-flex text-dark" data-tooltip-id="my-tooltip-1">
            <img src={PaymentInputInfoIcon} alt="PaymentInputInfoIcon" />
          </div>

          <ReactTooltip
            // end
            id="my-tooltip-1"
            place="end"
            variant=""
            effect="solid"
            content="Lorem ipsum dolor sit amet, consectetuer adipiscing elit"
            style={{
              outlineBottom: "4px solid #db2314",
              padding: "10px",
              zIndex: "999999 !important",
            }}
            className="p-2 border-bottom border-2 border-danger"
          />
        </div> */}
      </div>

      <div className="row rounded-2  align-items-center order-listing-sec">
        <div className="col-md-12 col-12 order-listing_cust-call-40 ">
          <div className="d-flex cust-img-item_desc">
            <div className="fs-img">
              <div className="img-card">
                <img src={service1} alt="" className="img-fluid" />
              </div>
            </div>
            <div className="item-info-sec">
              <UncontrolledDropdown
                className="user-dropdown table-Customer-col w-100 "
                // isOpen={openedRow === ind}
                toggle={() => {}}
              >
                <DropdownToggle tag="a">
                  <div className="avatar-stack mt-1 d-flex">
                    <span
                      className="fw-bold fs-6 text-dark"
                      onMouseEnter={() => handleMouseEnter(selectedRows)}
                      // onMouseLeave={handleMouseLeave}
                    >
                      {selectedRows?.ItemName ? (
                        <>
                          {selectedRows?.ItemName.length > 10
                            ? selectedRows?.ItemName.slice(0, 10) + "..."
                            : selectedRows?.ItemName}
                        </>
                      ) : (
                        "Sherwani......."
                      )}
                    </span>
                  </div>
                </DropdownToggle>
              </UncontrolledDropdown>

              <div className=" p-1 rounded-2  tridelpr">
                <div className="row">
                  {selectedRows?.TrialDate != null && (
                    <div className="d-flex custom-border-right pr-3  custome-col-w col-lg-4 col-12  align-items-center">
                      <img
                        src={tridateImg}
                        alt=""
                        width="17px"
                        className="me-1"
                      />
                      <span className="me-1">Trial </span>
                      <span className="fs-14 fw-medium">
                        {selectedRows?.TrialDate != null &&
                          formatDate(
                            new Date(selectedRows?.TrialDate),
                            getConfig?.DateAndTime,
                            false
                          ).slice()}
                        {/* formatDate(order.TrialDate) */}
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
                    <span className="me-1"> Delivery </span>
                    <span className="fs-14 fw-medium">
                      {formatDate(
                        new Date(selectedRows?.DelDate),
                        getConfig?.DateAndTime,
                        false
                      )}
                    </span>
                  </div>
                  <div className="d-flex col-lg-3 col-12 custome-col-w align-items-center">
                    <span className="me-1">Priority</span>
                    <span className="fs-14 fw-medium">
                      {selectedRows?.Urgent && (
                        <img
                          src={SpecialIcon}
                          alt=""
                          width="14px"
                          className="me-1"
                        />
                      )}

                      {selectedRows?.Urgent ? "Urgent" : "Regular"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="d-flex feb_acces_measu_stl_icon">
                <div className="d-flex bg-white ">
                  <div className="rounded-circle d-flex align-items-center m-1">
                    <img
                      src={
                        fabArray?.length > 0 ? isFabricIcon : isnotFabricIcon
                      }
                      id="fab_img_toolTip"
                      alt=""
                      width="35px"
                    />
                    <Tooltip
                      id={`fab_img_toolTip`}
                      direction="bottom"
                      text={
                        fabArray?.length > 0 ? "View Fabrics" : "Add Fabrics"
                      }
                    />
                  </div>
                  <div className="rounded-circle d-flex align-items-center m-1">
                    <img
                      src={
                        accessoriesArray?.length > 0
                          ? isAccessoriesIcon
                          : isnotAccessoriesIcon
                      }
                      id="accs_img_toolTip"
                      alt=""
                      width="35px"
                    />
                    <Tooltip
                      id={`accs_img_toolTip`}
                      direction="bottom"
                      text={
                        accessoriesArray?.length > 0
                          ? "View Accessories"
                          : "Add Accessories"
                      }
                    />
                  </div>
                  <div className="rounded-circle d-flex align-items-center m-1">
                    <img
                      src={
                        selectedRows?.ordMeasure?.length > 0
                          ? isMeasurementIcon
                          : isnotMeasurementIcon
                      }
                      id="measure_img_toolTip"
                      alt=""
                      width="35px"
                    />
                    <Tooltip
                      id={`measure_img_toolTip`}
                      direction="bottom"
                      text={
                        selectedRows?.ordMeasure?.length > 0
                          ? "View Measurement"
                          : "Add Measurement"
                      }
                    />
                  </div>
                  <div className="rounded-circle d-flex align-items-center m-1">
                    <img
                      src={
                        selectedRows?.ordstyle?.length > 0
                          ? isStyleIcon
                          : isnotStyleIcon
                      }
                      id="style_img_toolTip"
                      alt=""
                      width="35px"
                    />
                    <Tooltip
                      id={`style_img_toolTip`}
                      direction="bottom"
                      text={
                        selectedRows?.ordMeasure?.length > 0
                          ? "View Style"
                          : "Add Style"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12 col-12 order-listing_cust-call-60">
          <div className="d-flex align-items-center rounded-2  basic_amt_accrd_Sec">
            <div className="accod-sec ">
              <div className="d-flex justify-content-between single-acc-row_extra">
                <Accordion
                  className={`custom-z-index border-bottom ctransition w-100 `}
                  style={{ backgroundColor: "#f5f6fa" }}
                >
                  <Accordion.Item
                    eventKey="0"
                    className={`w-100 single-acc-row_extra`}
                    style={{ backgroundColor: "#f5f6fa" }}
                  >
                    <Accordion.Header className="w-100 custom-acc-header">
                      <div
                        className="w-100  d-flex justify-content-between single-acc-row p-0"
                        onClick={() => setShowAccordion(!showAccordion)}
                      >
                        <span>Basic Amt</span>
                        <div>
                          <img
                            src={DownArrowIcon}
                            alt="DownArrowIcon"
                            width={"12px"}
                            className="mx-1 ctransition-05 "
                            style={{
                              paddingLeft: 0,
                              rotate: showAccordion ? "0deg" : "180deg",
                            }}
                          />
                          <span>
                            {symbol}{" "}
                            {selectedRows?.BasicRate
                              ? +selectedRows?.BasicRate
                              : 0}
                          </span>
                        </div>
                      </div>
                    </Accordion.Header>

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
                                    selectedRows?.BasicRate -
                                    (selectedRows?.FabAmt +
                                      selectedRows?.AccessoryAmt)
                                  )?.toFixed(RoundUpToDecimal)}
                                </span>
                              </div>
                            </div>
                          </Accordion.Header>
                        </Accordion.Item>
                      </Accordion>

                      {fabArray?.length > 0 && (
                        <Accordion>
                          <Accordion.Item eventKey="0">
                            <Accordion.Header className="">
                              <div
                                className="d-flex justify-content-between border p-1 rounded-2  w-100"
                                onClick={() =>
                                  setShowFabAccordion(!showFabAccordion)
                                }
                              >
                                <span>Fabric</span>
                                <div>
                                  <img
                                    src={DownArrowIcon}
                                    alt="DownArrowIcon"
                                    width={"12px"}
                                    className="mx-1 ctransition-05"
                                    style={{
                                      rotate: showFabAccordion
                                        ? "0deg"
                                        : "180deg",
                                    }}
                                  />
                                  <span>
                                    {symbol} {selectedRows?.FabAmt}
                                  </span>
                                </div>
                              </div>
                            </Accordion.Header>

                            <Accordion.Body className="border p-1 rounded-2">
                              {fabArray?.map((item, i) => {
                                return (
                                  <div className="bg-light d-flex  m-1 cust-Fab_listing">
                                    <div className="d-flex justify-content-start  py-1 px-1  cust-Fab_listing-content-75">
                                      <div className="d-flex custom-border-right">
                                        <div className="pr-2">
                                          <span className="mb-0 fw-bold fs-14">
                                            {item.TOrd_FabricId}
                                          </span>
                                          <div className="d-flex custom-light-text custom-text-transform">
                                            <img
                                              src={odertableBarcodeIcon}
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
                                              {item?.articleDetails?.Article_ID}
                                            </span>
                                            <p className="mb-0 fs-12 custom-light-text custom-text-transform">
                                              {item?.articleDetails?.ArticleName
                                                .length > 5
                                                ? item.articleDetails?.ArticleName.slice(
                                                    0,
                                                    5
                                                  ) + "..."
                                                : item.articleDetails
                                                    ?.ArticleName}
                                            </p>
                                          </div>
                                          <div className="custom-border-right pr-2 pl-2 ">
                                            <span className="mb-0 fs-12 fw-bold">
                                              {item?.MstSize?.Size} SIZE
                                            </span>
                                            <p className="mb-0 fs-12 custom-light-text custom-text-transform">
                                              {item?.MstColour?.ColourName}
                                            </p>
                                          </div>
                                          <div className="pr-2 pl-2">
                                            <span className="mb-0 fs-12 fw-bold">
                                              QTY
                                            </span>
                                            <p className="mb-0 fs-12 custom-light-text custom-text-transform">
                                              {item?.Quantity} Mtrs
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="cust-Fab_listing-content-25">
                                      <div
                                        style={{
                                          backgroundColor: "#E4E6EA",
                                        }}
                                        className="p-1 me-2 text-center"
                                      >
                                        <span>
                                          {symbol} {item?.Basic_Amt}
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

                      {accessoriesArray?.length > 0 && (
                        <Accordion>
                          <Accordion.Item eventKey="0">
                            <Accordion.Header className="">
                              <div
                                className="d-flex justify-content-between border p-1 rounded-2  w-100"
                                onClick={() =>
                                  setShowAccAccordion(!showAccAccordion)
                                }
                              >
                                <span>Accessories</span>
                                <div>
                                  <img
                                    src={DownArrowIcon}
                                    alt="DownArrowIcon"
                                    width={"12px"}
                                    className="mx-1 ctransition-05"
                                    style={{
                                      rotate: showAccAccordion
                                        ? "0deg"
                                        : "180deg",
                                    }}
                                  />
                                  <span>
                                    {symbol} {selectedRows?.AccessoryAmt}
                                  </span>
                                </div>
                              </div>
                            </Accordion.Header>

                            <Accordion.Body className="border p-1 rounded-2">
                              {accessoriesArray?.map((item, i) => {
                                return (
                                  <div
                                    className="bg-light d-flex  m-1 cust-Fab_listing"
                                    key={ind}
                                  >
                                    <div className="d-flex justify-content-start  py-1 px-1  cust-Fab_listing-content-75">
                                      <div className="d-flex custom-border-right">
                                        <div className="pr-2">
                                          <span className="mb-0 fw-bold fs-14">
                                            {item?.TOrd_FabricId}
                                          </span>
                                          <div className="d-flex custom-light-text custom-text-transform">
                                            <img
                                              src={odertableBarcodeIcon}
                                              alt=""
                                            />
                                            <p className="mb-0 fs-12">
                                              {item?.Barcode_Id}
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="sec-itemslis">
                                        <div className="d-flex custom-name">
                                          <div className="custom-border-right pr-2 pl-2 ">
                                            <span className="mb-0 fs-12 fw-bold">
                                              {item?.articleDetails?.Article_ID}
                                            </span>
                                            <p className="mb-0 fs-12 custom-light-text custom-text-transform">
                                              {
                                                item?.articleDetails
                                                  ?.ArticleName
                                              }
                                            </p>
                                          </div>
                                          <div className="custom-border-right pr-2 pl-2 ">
                                            <span className="mb-0 fs-12 fw-bold">
                                              {item?.MstSize?.Size} SIZE
                                            </span>
                                            <p className="mb-0 fs-12 custom-light-text custom-text-transform">
                                              {item?.MstColour?.ColourName}
                                            </p>
                                          </div>
                                          <div className="pr-2 pl-2">
                                            <span className="mb-0 fs-12 fw-bold">
                                              QTY
                                            </span>
                                            <p className="mb-0 fs-12 custom-light-text custom-text-transform">
                                              {item?.Quantity} Mtrs
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="cust-Fab_listing-content-25">
                                      <div
                                        style={{
                                          backgroundColor: "#E4E6EA",
                                        }}
                                        className="p-1 me-2 text-center"
                                      >
                                        <span>
                                          {symbol} {item?.Basic_Amt}
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
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* measurement selection====================================================================================================== */}
                </Accordion>
              </div>

              {/* {showAccordion && (
                <div className="d-flex justify-content-between single-acc-row_extra">
                  <span>Basic Amt</span>
                  <span>
                    {symbol} {selectedRows?.BasicRate ? +selectedRows?.BasicRate : 0}
                  </span>
                </div>
              )} */}

              <div className="d-flex justify-content-between single-acc-row_extra">
                <span>Disc Amt</span>
                <span className="bis_margin-end">
                  {" "}
                  {symbol} {selectedRows?.Discount}
                </span>
              </div>
              <div className="d-flex justify-content-between single-acc-row_extra">
                <span>Taxable Amt</span>
                <span className="bis_margin-end">
                  {" "}
                  {symbol}{" "}
                  {(
                    (selectedRows?.BasicRate ? selectedRows?.BasicRate : 0) -
                    (selectedRows?.AdSTax ? selectedRows?.AdSTax : 0)
                  )?.toFixed(RoundUpToDecimal)}
                </span>
              </div>
              <div className="d-flex justify-content-between single-acc-row_extra">
                <span>Tax</span>
                <span className="bis_margin-end">
                  {symbol} {selectedRows?.AdSTax}
                </span>
              </div>
            </div>

            <div className=" rounded-2 netpay-sec text-center">
              {/* <span className="mb-2 netAmt_text">Net Amount</span> */}
              <h5 className="amt_text">
                {symbol}{" "}
                {selectedRows?.NetAmount
                  ? parseFloat(selectedRows?.NetAmount)?.toFixed(
                      RoundUpToDecimal
                    )
                  : 0}
              </h5>
            </div>
          </div>
        </div>
      </div>

      <div>
        <span className="fs-5 fw-bold">Permanently delete objects?</span>
      </div>
      <div className="mt-2 w-50 p-2">
        <div>
          To confirm deletion, type{" "}
          <i>
            <b>permanently delete</b>
          </i>{" "}
          in the text input field.
        </div>

        <div>
          <input
            type="text"
            id="default-01"
            value={confirmText}
            onChange={handleTextChange}
            placeholder="Search"
            className="form-control-lg form-control pl-4 mb-2 "
          />
        </div>
      </div>
      <div className="d-flex justify-content-end ">
        <Button
          color="light"
          onClick={() => setConfirmText("")}
          className="mr-2"
        >
          <span className="ms-1">Cancel</span>
        </Button>
        {deleteLoader ? (
          <Button>
            <Spinner size="sm" className="mx-1" />
          </Button>
        ) : (
          <Button
            color="light"
            onClick={handleVerify}
            disabled={!confirmText || confirmText !== "permanently delete"}
            className="btn btn-light"
          >
            Delete Object
          </Button>
        )}{" "}
      </div>
    </div>
  );
};

export default DeleteSlider;

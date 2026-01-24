import React, { useEffect, useState } from "react";
import CategoryIcon from "./../../../images/icons/add-order-caterory-icon.svg";
import saleTypeIcon from "./../../../images/icons/add-order-saletype-icon.svg";
import SpecialIcon from "./../../../images/icons/special-icon.svg";
import PriorityIcon from "./../../../images/icons/add-order-priority-icon.svg";
import orderTypeIcon from "./../../../images/icons/add-order-ordertype-icon.svg";
import tridateImg from "./../../../images/icons/tridateImg.svg";
import deldateImg from "./../../../images/icons/deldateImg.svg";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerStyle } from "../../../redux/actions/styleAction";
import ActionEditIcon from "./../../../images/icons/edit-icon.png";
import AdvanceDetailForm from "./SearchCustomer/AdvanceDetailForm";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Spinner,
  UncontrolledTooltip,
} from "reactstrap";
import Icon from "../../../Components/icon/Icon";
import EditAdvanceDetailForm from "./SearchCustomer/EditAdvanceDetailForm";
import {
  createorddtls,
  getSingleOrderDtlsAsyncData,
} from "../../../redux/actions/createorddtlsAction";
import { toast } from "react-toastify";
import { formatDate } from "../../../redux/dateFormateFunction";
import Tooltip from "../../../Components/Tooltip/Tooltip";
import ToolTipContent from "../../../Components/Tooltip/ToolTipContent";
import { getConfig } from "../../../redux/actions/configAction";
import { useTheme } from "../../../Layout/Provider/Themes";
import { usePermissions } from "../../../Layout/Provider/PermissionsContext";

const OrderDetail = ({ data }) => {
  const { tabId } = useTheme();
  const { handleAction } = usePermissions();

  const BU_Id = localStorage.getItem("BU_Id");

  const dispatch = useDispatch();
  const [advanceData, setAdvanceData] = useState({});
  const getConfigData = useSelector((state) => state?.config?.orderType);

  const [orderModel, setOrderModel] = useState(false);
  const [ordModalLoading, setOrdModalLoading] = useState(false);
  const getcreateorddtls = useSelector(
    (state) => state.createorddtls.ordDetails?.upCrtOrder
    // (state) => state.getcreateorddtls?.ordDetails.upCrtOrder
  );

  // Removed duplicate getConfig call - already called in parent SkelatonPage
  // useEffect(() => {
  //   if (BU_Id) {
  //     dispatch(getConfig(BU_Id));
  //   }
  // }, []);
  const TOrdHdID = localStorage.getItem(`TOrdHdID${tabId}`);

  useEffect(() => {
    if (TOrdHdID != "null") {
      dispatch(getSingleOrderDtlsAsyncData(TOrdHdID));
    }
  }, [TOrdHdID, dispatch]);


  const customer = useSelector((state) => state.customerDetails);
  const selectedCustomer = customer?.single.data;
  const mood = localStorage.getItem(`mood${tabId}`);
  let formattedTrialDate = formatDate(
    new Date(getcreateorddtls?.TrialDate),
    getConfigData?.DateAndTime,
    true
    // "dd-MMM-yyyy 12"
  );

  let formattedDelDate = formatDate(
    new Date(getcreateorddtls?.DelDate),
    getConfigData?.DateAndTime,
    true
    // "dd-MMM-yyyy 12"
  );
  // let formattedDelDate = getcreateorddtls?.DelDate
  //   ? new Intl.DateTimeFormat("en-US", {
  //       year: "numeric",
  //       month: "short",
  //       day: "2-digit",
  //     }).format(new Date(getcreateorddtls?.DelDate))
  //   : "";

  let formattedPODate = formatDate(
    new Date(getcreateorddtls?.PoDate),
    getConfigData?.DateAndTime,
    true
    // "dd-MMM-yyyy 12"
  );

  let formattedTOrdDate = formatDate(
    new Date(getcreateorddtls?.TOrdDate),
    getConfigData?.DateAndTime,
    true
    // "dd-MMM-yyyy 12"
  );
  // let formattedPODate = getcreateorddtls?.PoDate
  //   ? new Intl.DateTimeFormat("en-US", {
  //       year: "numeric",
  //       month: "short",
  //       day: "2-digit",
  //     }).format(new Date(getcreateorddtls?.PoDate))
  //   : "";

  const orderType = useSelector((state) => state?.orderType?.orderType);

  const findOrderType = getcreateorddtls?.OrderTypeId
    ? orderType?.find((iteem) => {
      return iteem.OrderTypeId === getcreateorddtls?.OrderTypeId;
    })
    : "";

  const handleUpdateDetails = () => {
    setOrderModel(true);
  };
  const handleCloseOrderModel = () => {
    setOrderModel(false);
  };

  // edit modal

  const submitOrderModel = () => {
    if (advanceData.poNo.length !== 0 && advanceData.poDate === null) {
      toast.error("Please Enter Purchase Order Date      ");
    } else if (advanceData.poNo.length === 0 && advanceData.poDate !== null) {
      toast.error("Please Enter Purchase Order Number");
    } else {
      setOrdModalLoading(true);
      dispatch(createorddtls(advanceData, BU_Id)).then((res) => {
        if (res?.success === true) {
          localStorage.setItem(`TOrdHdID${tabId}`, res.upCrtOrder.TOrdHdID);

          setOrderModel(false);
          toast.success(res.message);
          setOrdModalLoading(false);
        } else {
          setOrdModalLoading(false);
        }
      });
    }
  };
  setTimeout(() => {
    setOrdModalLoading(false);
  }, 5000);

  const handleAdvanceData = (data) => {
    setAdvanceData(data);
  };
  // Removed duplicate getCustomerStyle call - already called in parent SkelatonPage
  // useEffect(() => {
  //   dispatch(getCustomerStyle(BU_Id));
  // }, []);

  return (
    <>
      <div
        className={`w-100 bg-white  rounded w-xl-50 ms-0 ms-xl-2 mt-xl-0 mt-4   position-relative   order-dtl-box-sec  ${data}`}
      >
        <div className="first-design">
          <div className=" row custom-row-1500 ">
            <div className="text-start custom-border-right col-lg-2 col-md-6 col-12 mt-2 custome-px-1 custome-coll-45">
              <div className="d-flex ">
                <img src={saleTypeIcon} alt="" width="20px" className="me-1 " />
                <span className="custom-light-text custom-text-transform">
                  sale Type
                </span>
              </div>
              <span className="fs-14 fw-medium text-uppercase">
                {getcreateorddtls?.SalesType ? getcreateorddtls?.SalesType : ""}
              </span>
            </div>

            <div className="custom-border-right col-lg-2 col-md-6 col-12 mt-2 custome-px-1 custome-coll-45">
              <div className="d-flex custom-light-text custom-text-transform text-md-start text-center">
                <img src={orderTypeIcon} alt="" width="20px" className="me-1" />
                <span className="">order Type</span>
              </div>
              <span className="fs-14 fw-medium text-uppercase">
                {getcreateorddtls?.MstOrderType != undefined
                  ? getcreateorddtls?.MstOrderType?.OrderType
                  : findOrderType.OrderType}
              </span>
            </div>

            <div className="text-start custom-border-right col-lg-3 col-md-6 col-12 mt-2 custome-px-1 custome-coll-45">
              <div className="d-flex custom-light-text custom-text-transform">
                <img src={tridateImg} alt="" width="17px" className="me-1" />
                Trial Date
              </div>
              <span className="fs-14 fw-medium">
                {getcreateorddtls?.TrialDate ? formattedTrialDate : "N/A"}
              </span>
            </div>
            <div className="text-start col-lg-2 col-md-6 col-12 mt-2 custome-px-1 custome-coll-45 xs-custom-border-right">
              <div className="d-flex custom-light-text custom-text-transform">
                <img src={PriorityIcon} alt="" width="18px" className="me-1" />
                Priority
              </div>

              {getcreateorddtls?.UrgentType === "1" ? (
                <span className="fs-14 fw-medium text-center ms-1">
                  {/* <img src={SpecialIcon} alt="" width="14px" className="me-1" /> */}
                  Regular
                </span>
              ) : (
                <span className="fs-14 fw-medium text-danger">
                  <img src={SpecialIcon} alt="" width="14px" className="me-1" />
                  URGENT
                </span>
              )}
            </div>
            <div className="text-start col-lg-3 col-md-6 col-12 cpe-0  custome-px-1 custome-coll-45 cmt-2_1500">
              <div className="order-md-last ">
                <div className=" text-end fw-bold pb-1 pt-1 pe-2 last-reg-box">
                  <span>
                    {" "}
                    {getcreateorddtls?.TOrdNo !== undefined
                      ? getcreateorddtls?.TOrdNo
                      : ""}
                  </span>
                  <div className="d-flex justify-content-end align-items-center cjc-start">
                    <img
                      src={tridateImg}
                      alt=""
                      width="13px"
                      className="cmx-1"
                    />

                    <span className="fw-medium fs-12">
                      {getcreateorddtls?.TOrdDate ? formattedTOrdDate : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-start custom-border-right col-lg-2 col-md-6 col-12 mt-2 custome-px-1 custome-coll-45  ">
              <div className="d-flex custom-light-text custom-text-transform">
                <img src={CategoryIcon} alt="" width="20px" className="me-1 " />
                Designer
              </div>
              <span className="fs-14 fw-medium text-uppercase" id="designerFn">
                {getcreateorddtls?.SalesmanName?.length > 10
                  ? getcreateorddtls?.SalesmanName?.slice(0, 10) + "..."
                  : getcreateorddtls?.SalesmanName}
              </span>
              {getcreateorddtls?.SalesmanName?.length > 10 ? (
                <>
                  <Tooltip
                    id={`designerFn`}
                    direction="right"
                    text={getcreateorddtls?.SalesmanName}
                  />
                </>
              ) : (
                ""
              )}
            </div>

            <div className="text-start custom-border-right col-lg-2 col-md-6 col-12 mt-2 custome-px-1  custome-coll-45">
              <div className="d-flex custom-light-text custom-text-transform">
                <img src={CategoryIcon} alt="" width="20px" className="me-1 " />
                master
              </div>
              <span className="fs-14 fw-medium text-uppercase" id="masterfn">
                {getcreateorddtls?.MasterName?.length > 10
                  ? getcreateorddtls?.MasterName?.slice(0, 10) + "..."
                  : getcreateorddtls?.MasterName}
              </span>

              {getcreateorddtls?.MasterName?.length > 10 ? (
                <>
                  <Tooltip
                    id={`masterfn`}
                    direction="right"
                    text={getcreateorddtls?.MasterName}
                  />
                </>
              ) : (
                ""
              )}
            </div>

            <div className="text-start custom-border-right col-lg-3 col-md-6 col-12 mt-2 custome-px-1  custome-coll-45">
              <div className="d-flex custom-light-text custom-text-transform">
                <img src={deldateImg} alt="" width="17px" className="me-1" />
                Delivery Date
              </div>
              <span className="fs-14 fw-medium">
                {getcreateorddtls?.DelDate ? formattedDelDate : "N/A"}
              </span>
            </div>


            {getcreateorddtls?.PoDate !== null &&
              getcreateorddtls?.PoNo !== "" ? (
              <>
                {getcreateorddtls?.PoDate !== null ? (
                  <div className="text-start  custCol-lg-3 col-md-6 col-12 mt-2 custome-px-1  custome-coll-45">
                    <div className="d-flex custom-light-text custom-text-transform">
                      <img
                        src={tridateImg}
                        alt=""
                        width="17px"
                        className="me-1"
                      />
                      P.O Date
                    </div>
                    <span className="fs-14 fw-medium">
                      {getcreateorddtls?.PoDate !== null
                        ? formattedPODate
                        : "N/A"}
                    </span>
                  </div>
                ) : (
                  ""
                )}

                {getcreateorddtls?.PoNo !== "" ? (
                  <div className="text-start  col-lg-2 col-md-6 col-12 mt-2 custome-px-1  custome-coll-45">
                    <div className="text-start">Purchase Order#</div>
                    <span className="fs-14 fw-medium">
                      {getcreateorddtls?.PoNo}
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </div>
          <div className=" position-absolute order_details_editIcon">
            {/* {mood == "edit" && ( */}
            <div
              className="bg-light text-center custom-rounded-left ps-1"
              style={{ paddingRight: 5 }}
              id="BtnBkAnOrderEditOrdDetail"
            >
              <img
                src={ActionEditIcon}
                alt=""
                className="bg-white rounded-circle my-1 cursor-pointer"
                // onClick={() =>
                //   handleAction(
                //     "BtnBkAnOrderEditOrdDetail",
                //     "action",
                //     handleUpdateDetails

                //   )
                // }
                onClick={handleUpdateDetails}
              />
              <Tooltip
                id={`BtnBkAnOrderEditOrdDetail`}
                direction="left"
                text={ToolTipContent.editOrderDetails}
              />
            </div>
            {/* )} */}
          </div>
        </div>

        <div className="second-design">
          <div className=" row ">
            <div className="text-start custom-border-right col-4 mt-2 custome-px-1 ">
              <div className="d-flex ">
                <img src={saleTypeIcon} alt="" width="20px" className="me-1 " />
                <span className="custom-light-text custom-text-transform">
                  sale Type
                </span>
              </div>
              <span className="fs-14 fw-medium text-uppercase">
                {getcreateorddtls?.SalesType ? getcreateorddtls?.SalesType : ""}
              </span>
            </div>
            <div className="text-start custom-border-right col-4 mt-2 custome-px-1">
              <div className="d-flex custom-light-text custom-text-transform text-md-start text-center">
                <img src={orderTypeIcon} alt="" width="20px" className="me-1" />
                <span className="">order Type</span>
              </div>
              <span className="fs-14 fw-medium text-uppercase">
                {getcreateorddtls?.MstOrderType != undefined
                  ? getcreateorddtls?.MstOrderType?.OrderType
                  : findOrderType.OrderType}
              </span>
            </div>
            <div className="text-end custom-border-right col-4 mt-2 custome-px-1 ">
              <div className="order-md-last ">
                <div className=" text-end fw-bold pb-1 pt-1 pe-2 last-reg-box">
                  {/* <span className="text-end w-100"> */}{" "}
                  {getcreateorddtls?.TOrdNo !== undefined
                    ? getcreateorddtls?.TOrdNo
                    : ""}
                  {/* </span> */}
                  <div className="d-flex justify-content-end align-items-center cjc-start">
                    <img
                      src={tridateImg}
                      alt=""
                      width="13px"
                      className="cmx-1"
                    />

                    <span className="fw-medium fs-12">
                      {getcreateorddtls?.TOrdDate ? formattedTOrdDate : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-start custom-border-right col-4 mt-2 custome-px-1">
              <div className="d-flex custom-light-text custom-text-transform">
                <img src={tridateImg} alt="" width="17px" className="me-1" />
                Trial Date
              </div>
              <span className="fs-14 fw-medium">
                {getcreateorddtls?.TrialDate ? formattedTrialDate : "N/A"}
              </span>
            </div>
            <div className="text-start custom-border-right col-4 mt-2 custome-px-1">
              <div className="d-flex custom-light-text custom-text-transform">
                <img src={deldateImg} alt="" width="17px" className="me-1" />
                Delivery Date
              </div>
              <span className="fs-14 fw-medium">
                {getcreateorddtls?.DelDate ? formattedDelDate : "N/A"}
              </span>
            </div>
            <div className="text-start custom-border-right col-4 mt-2 custome-px-1">
              <div className="d-flex custom-light-text custom-text-transform">
                <img src={PriorityIcon} alt="" width="18px" className="me-1" />
                Priority
              </div>

              {getcreateorddtls?.UrgentType === "1" ? (
                <span className="fs-14 fw-medium text-center ms-1">
                  {/* <img src={SpecialIcon} alt="" width="14px" className="me-1" /> */}
                  Regular
                </span>
              ) : (
                <span className="fs-14 fw-medium text-danger">
                  <img src={SpecialIcon} alt="" width="14px" className="me-1" />
                  URGENT
                </span>
              )}
              {/* <span className="fs-14 fw-medium text-danger">
              <img src={SpecialIcon} alt="" width="14px" className="me-1" />
              URGENT
            </span> */}
            </div>
            <div className="text-start custom-border-right col-4 mt-2 custome-px-1 ">
              <div className="d-flex custom-light-text custom-text-transform">
                <img src={CategoryIcon} alt="" width="20px" className="me-1 " />
                Designer
              </div>
              <span className="fs-14 fw-medium text-uppercase" id="designerFn">
                {getcreateorddtls?.SalesmanName?.length > 10
                  ? getcreateorddtls?.SalesmanName?.slice(0, 10) + "..."
                  : getcreateorddtls?.SalesmanName}
              </span>
              {getcreateorddtls?.SalesmanName?.length > 10 ? (
                <>
                  <Tooltip
                    id={`designerFn`}
                    direction="right"
                    text={getcreateorddtls?.SalesmanName}
                  />
                </>
              ) : (
                ""
              )}
            </div>

            <div className="text-start custom-border-right col-4 mt-2 custome-px-1">
              <div className="d-flex custom-light-text custom-text-transform">
                <img src={CategoryIcon} alt="" width="20px" className="me-1 " />
                master
              </div>
              <span className="fs-14 fw-medium text-uppercase" id="masterfn">
                {getcreateorddtls?.MasterName?.length > 10
                  ? getcreateorddtls?.MasterName?.slice(0, 10) + "..."
                  : getcreateorddtls?.MasterName}
              </span>

              {getcreateorddtls?.MasterName?.length > 10 ? (
                <>
                  <Tooltip
                    id={`masterfn`}
                    direction="right"
                    text={getcreateorddtls?.MasterName}
                  />
                </>
              ) : (
                ""
              )}
            </div>
            <div className="text-start custom-border-right col-4 mt-2 custome-px-1"></div>
            {getcreateorddtls?.PoDate !== null &&
              getcreateorddtls?.PoNo !== "" ? (
              <>
                {getcreateorddtls?.PoDate !== null ? (
                  <div className="text-start  custom-border-right col-4 mt-2 custome-px-1">
                    <div className="d-flex custom-light-text custom-text-transform">
                      <img
                        src={tridateImg}
                        alt=""
                        width="17px"
                        className="me-1"
                      />
                      P.O Date
                    </div>
                    <span className="fs-14 fw-medium">
                      {getcreateorddtls?.PoDate !== null
                        ? formattedPODate
                        : "N/A"}
                    </span>
                  </div>
                ) : (
                  ""
                )}

                {getcreateorddtls?.PoNo !== "" ? (
                  <div className="text-start  col-lg-2 col-md-6 col-12 mt-2 custome-px-1  custome-coll-45">
                    <div className="text-start">Purchase Order#</div>
                    <span className="fs-14 fw-medium">
                      {getcreateorddtls?.PoNo}
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </div>
          <div className=" position-absolute order_details_editIcon">
            {/* {mood == "edit" && ( */}
            <div
              className="bg-light text-center custom-rounded-left ps-1"
              style={{ paddingRight: 5 }}
              id="BtnBkAnOrderEditOrdDetail"
            >
              <img
                src={ActionEditIcon}
                alt=""
                className="bg-white rounded-circle my-1 cursor-pointer"
                // onClick={() =>
                //   handleAction(
                //     "BtnBkAnOrderEditOrdDetail",
                //     "action",
                //     handleUpdateDetails

                //   )
                // }
                onClick={handleUpdateDetails}
              />
              <Tooltip
                id={`BtnBkAnOrderEditOrdDetail`}
                direction="left"
                text={ToolTipContent.editOrderDetails}
              />
            </div>
            {/* )} */}
          </div>
        </div>

        <div className="third-design ps-3">
          <div className="row text-end custom-border-right mt-2 custome-px-1 custom-margin-30">
            <div className="text-start custom-border-right mt-2 custome-px-1 col-6">
              <div className="d-flex ">
                <img src={saleTypeIcon} alt="" width="20px" className="me-1 " />
                <span className="custom-light-text custom-text-transform">
                  sale Type
                </span>
              </div>
              <span className="fs-14 fw-medium text-uppercase">
                {getcreateorddtls?.SalesType ? getcreateorddtls?.SalesType : ""}
              </span>
            </div>
            <div className="order-md-last col-6">
              <div className=" text-end fw-bold pb-1 pt-1 pe-2 last-reg-box">
                {/* <span className="text-end w-100"> */}{" "}
                {getcreateorddtls?.TOrdNo !== undefined
                  ? getcreateorddtls?.TOrdNo
                  : ""}
                {/* </span> */}
                <div className="d-flex justify-content-end align-items-center cjc-start">
                  <img src={tridateImg} alt="" width="13px" className="cmx-1" />

                  <span className="fw-medium fs-12">
                    {getcreateorddtls?.TOrdDate ? formattedTOrdDate : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="text-start custom-border-right mt-2 custome-px-1 col-6">
              <div className="d-flex custom-light-text custom-text-transform text-md-start text-center">
                <img src={orderTypeIcon} alt="" width="20px" className="me-1" />
                <span className="">order Type</span>
              </div>
              <span className="fs-14 fw-medium text-uppercase">
                {getcreateorddtls?.MstOrderType != undefined
                  ? getcreateorddtls?.MstOrderType?.OrderType
                  : findOrderType.OrderType}
              </span>
            </div>
            <div className="text-start custom-border-right  mt-2 custome-px-1 col-6">
              <div className="d-flex custom-light-text custom-text-transform">
                <img src={PriorityIcon} alt="" width="18px" className="me-1" />
                Priority
              </div>

              {getcreateorddtls?.UrgentType === "1" ? (
                <span className="fs-14 fw-medium text-center ms-1">
                  {/* <img src={SpecialIcon} alt="" width="14px" className="me-1" /> */}
                  Regular
                </span>
              ) : (
                <span className="fs-14 fw-medium text-danger">
                  <img src={SpecialIcon} alt="" width="14px" className="me-1" />
                  URGENT
                </span>
              )}
              {/* <span className="fs-14 fw-medium text-danger">
              <img src={SpecialIcon} alt="" width="14px" className="me-1" />
              URGENT
            </span> */}
            </div>

            <div className="text-start custom-border-right mt-2 custome-px-1 col-6">
              <div className="d-flex custom-light-text custom-text-transform">
                <img src={tridateImg} alt="" width="17px" className="me-1" />
                Trial Date
              </div>
              <span className="fs-14 fw-medium">
                {getcreateorddtls?.TrialDate ? formattedTrialDate : "N/A"}
              </span>
            </div>
            <div className="text-start custom-border-right  mt-2 custome-px-1 col-6">
              <div className="d-flex custom-light-text custom-text-transform">
                <img src={deldateImg} alt="" width="17px" className="me-1" />
                Delivery Date
              </div>
              <span className="fs-14 fw-medium">
                {getcreateorddtls?.DelDate ? formattedDelDate : "N/A"}
              </span>
            </div>

            <div className="text-start custom-border-right mt-2 custome-px-1 col-6">
              <div className="d-flex custom-light-text custom-text-transform">
                <img src={CategoryIcon} alt="" width="20px" className="me-1 " />
                Designer
              </div>
              <span className="fs-14 fw-medium text-uppercase" id="designerFn">
                {getcreateorddtls?.SalesmanName?.length > 10
                  ? getcreateorddtls?.SalesmanName?.slice(0, 10) + "..."
                  : getcreateorddtls?.SalesmanName}
              </span>
              {getcreateorddtls?.SalesmanName?.length > 10 ? (
                <>
                  <Tooltip
                    id={`designerFn`}
                    direction="right"
                    text={getcreateorddtls?.SalesmanName}
                  />
                </>
              ) : (
                ""
              )}
            </div>

            <div className="text-start custom-border-right mt-2 custome-px-1 col-6">
              <div className="d-flex custom-light-text custom-text-transform">
                <img src={CategoryIcon} alt="" width="20px" className="me-1 " />
                master
              </div>
              <span className="fs-14 fw-medium text-uppercase" id="masterfn">
                {getcreateorddtls?.MasterName?.length > 10
                  ? getcreateorddtls?.MasterName?.slice(0, 10) + "..."
                  : getcreateorddtls?.MasterName}
              </span>

              {getcreateorddtls?.MasterName?.length > 10 ? (
                <>
                  <Tooltip
                    id={`masterfn`}
                    direction="right"
                    text={getcreateorddtls?.MasterName}
                  />
                </>
              ) : (
                ""
              )}
            </div>
            {getcreateorddtls?.PoDate !== null &&
              getcreateorddtls?.PoNo !== "" ? (
              <>
                {getcreateorddtls?.PoDate !== null ? (
                  <div className="text-start custom-border-right mt-2 custome-px-1 col-6">
                    <div className="d-flex custom-light-text custom-text-transform">
                      <img
                        src={tridateImg}
                        alt=""
                        width="17px"
                        className="me-1"
                      />
                      P.O Date
                    </div>
                    <span className="fs-14 fw-medium">
                      {getcreateorddtls?.PoDate !== null
                        ? formattedPODate
                        : "N/A"}
                    </span>
                  </div>
                ) : (
                  ""
                )}

                {getcreateorddtls?.PoNo !== "" ? (
                  <div className="text-start custom-border-right mt-2 custome-px-1 col-6">
                    <div className="text-start">Purchase Order#</div>
                    <span className="fs-14 fw-medium">
                      {getcreateorddtls?.PoNo}
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className=" position-absolute order_details_editIcon">
          {/* {mood == "edit" && ( */}
          <div
            className="bg-light text-center custom-rounded-left ps-1"
            style={{ paddingRight: 5 }}
            id="BtnBkAnOrderEditOrdDetail"
          >
            <img
              src={ActionEditIcon}
              alt=""
              className="bg-white rounded-circle my-1 cursor-pointer"
              // onClick={() =>
              //   handleAction(
              //     "BtnBkAnOrderEditOrdDetail",
              //     "action",
              //     handleUpdateDetails

              //   )
              // }
              onClick={handleUpdateDetails}
            />
            <Tooltip
              id={`BtnBkAnOrderEditOrdDetail`}
              direction="left"
              text={ToolTipContent.editOrderDetails}
            />
          </div>
          {/* )} */}
        </div>
      </div>

      {/* <button onClick={checkCameraAvailability}>Check Camera</button>
      <button onClick={handleButtonClick}>
        {cameraAvailable ? "Capture Photo" : "Upload Photo"}
      </button> */}

      <Modal isOpen={orderModel} size="xl" className="rounded-top-4 ">
        <div className="bg-1c2b4c text-white py-2 px-4 rounded-top-4">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>
              <span>Update Order Detail</span>
            </div>
            <Icon name="cross" onClick={handleCloseOrderModel}></Icon>
          </div>
        </div>
        <ModalBody className=" mb-5 " style={{ minHeight: "400px" }}>
          <EditAdvanceDetailForm onDataChange={handleAdvanceData} />
        </ModalBody>
        <ModalFooter className="mt-5 border-bottom-red">
          <div className="d-flex justify-content-end ">
            <Button
              outline
              color="light"
              className="mr-4"
              onClick={handleCloseOrderModel}
            >
              Cancel
            </Button>

            <Button className="bg-1c2b4c  px-4" onClick={submitOrderModel}>
              {ordModalLoading ? (
                <Spinner size="sm" color="light" className="mx-0" />
              ) : (
                "Save"
              )}
            </Button>
            {/* <Button className="bg-1c2b4c" onClick={submitOrderModel}>
              Proceed
            </Button> */}
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default OrderDetail;

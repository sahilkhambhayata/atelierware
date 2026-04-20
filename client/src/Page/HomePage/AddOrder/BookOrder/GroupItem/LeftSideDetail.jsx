import React, { useEffect, useRef, useState } from "react";
import { axiosClient } from "./../../../../../axios/axios";
import barcodeImg from "./../../../../../images/icons/odertable-barcode.svg";
import fabricIcon from "./../../../../../images/icons/fabric-icon.svg";
import Skeleton from "@mui/material/Skeleton";
import isStyleIcon from "./../../../../../images/icons/isStyle-icon.svg";
import isMeasurementIcon from "./../../../../../images/icons/isMeasurement-icon.svg";
import isAccessoriesIcon from "./../../../../../images/icons/isAccessories-icon.svg";
import isFabricIcon from "./../../../../../images/icons/isFabric-icon.svg";
import isnotStyleIcon from "./../../../../../images/icons/isnotStyle-icon.svg";
import isnotMeasurementIcon from "./../../../../../images/icons/isnotMeasurement-icon.svg";
import isnotAccessoriesIcon from "./../../../../../images/icons/isnotAccessories-icon.svg";
import isnotFabricIcon from "./../../../../../images/icons/isnotFabric-icon.svg";
import Icon from "../../../../../Components/icon/Icon";
import Accordion from "react-bootstrap/Accordion";
import FabricSearch from "./LeftSide/FabricSearch";
import AccessoriesSearch from "./LeftSide/AccessoriesSearch";
import "swiper/css"; // Import Swiper's base CSS
import "swiper/css/navigation"; // Import navigation CSS
import "swiper/css/pagination"; // Import pagination CSS
import { Navigation } from "swiper/modules";
import service1 from "./../../../../../images/avatar/ServiceAlbum/service1.png";
import PaymentEditIcon from "./../../../../../images/icons/payment-edit-icon.svg";
import { useLocation, useNavigate } from "react-router";
import { Modal } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { useDispatch, useSelector } from "react-redux";
import CategoryIcon from "./../../../../../images/icons/add-order-caterory-icon.svg";
import { getSingleGroupItemData } from "../../../../../redux/actions/serviceAction";
import UpArrowIcon from "./../../../../../images/icons/up-arrow.svg";
import { getSingleGroupOrderList } from "../../../../../redux/actions/groupOrderListAction";
import { getSingleOrderList } from "../../../../../redux/actions/orderListAction";
import {
  setGroupAccessoriesAmount,
  setGroupFabricAmount,
} from "../../../../../redux/actions/getGroupFabriAccAmountAction";
import Tooltip from "../../../../../Components/Tooltip/Tooltip";
import { useTheme } from "../../../../../Layout/Provider/Themes";
import { getDiscription } from "../../../../../redux/actions/getDiscriptionAction";
import SherwaniImage from "./../../../../../images/avatar/sherwani-image.png";
import { toast } from "react-toastify";

const LeftSideDetail = () => {
  const createOrderData = useSelector(
    (state) => state.createorddtls?.ordDetails?.upCrtOrder
  );
  const { tabId } = useTheme();
  const symbol = localStorage.getItem("countrySymbol");

  const groupData = useSelector(
    (state) => state?.groupOrderList?.single?.orderItemList
  );

  const tabsString = localStorage.getItem("tabs");
  const tabs = JSON.parse(tabsString);

  const location = useLocation();

  let TOrdHdID =
    createOrderData?.TOrdHdID != null || undefined
      ? createOrderData.TOrdHdID
      : null;

  // localStorage.setItem(`TOrdHdID${tabId}`, TOrdHdID);

  const [fab, setFab] = useState();

  const [activeImg, setActiveImg] = useState(1);
  const swiperRef = useRef(null);

  const [fabricCount, setFabricCount] = useState(0);
  const [accessoriesCount, setAccessoriesCount] = useState(0);

  const [fabric, setFabric] = useState([]);

  const handleAddFabricSuccess = (parameter) => {
    setAccordionFabric(false);
  };

  const handleFabricData = (data) => {
    setFabric([...fabric, data]);
  };

  const [accessories, setAccessories] = useState([]);
  // const totalAccessoriesRate = accessories.reduce(
  //   (total, item) => total + item.rate,
  //   0
  // );
  const handleAccessoriesData = (accessoryData) => {
    setAccessories([...accessories, accessoryData]);
  };

  const [switchValue, setSwitchValue] = useState("fabric");

  const [selectedImages, setSelectedImages] = useState([]);

  const handleAccessoriesFabric = (data) => {
    setAccessoriesCount(data);
  };

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const isFromSingleOrderPage =
    location.state && location.state.from == "single-page";

  useEffect(() => {
    if (isFromSingleOrderPage) {
      const TOrdDtID = localStorage.getItem(`TOrdDtID${tabId}`);

      dispatch(getSingleGroupOrderList(TOrdDtID));
    }
  }, [isFromSingleOrderPage]);

  const [totalFabricAmount, setTotalFabricAmount] = useState(0);
  const [totalAccAmount, setTotalAccAmount] = useState(0);

  useEffect(() => {
    let totalFabSum = 0;
    let totalAccSum = 0;

    groupData?.groupItemList?.length > 0 &&
      groupData?.groupItemList.map((item, i) => {
        const fabArray = item?.fabricList?.filter(
          (val) => val?.ItemType === "Cut Length" || val?.ItemType === "Fabric" || val?.ItemType === "fabric" || val?.ItemType === "cut length"
        );
        const accArray = item?.fabricList?.filter(
          (val) => val?.ItemType === "Accessories" || val?.ItemType === "accessories"
        );

        const FabAmount = fabArray?.reduce((sum, fabric) => {
          const product = fabric.Quantity * fabric.articleDetails.Sale_Rate;

          return sum + product;
        }, 0);
        const AccAmount = accArray?.reduce((sum, fabric) => {
          const product = fabric.Quantity * fabric.articleDetails.Sale_Rate;

          return sum + product;
        }, 0);

        totalFabSum += FabAmount;
        totalAccSum += AccAmount;
      });
    setTotalFabricAmount(totalFabSum);
    setTotalAccAmount(totalAccSum);
  }, [groupData]);

  useEffect(() => {
    dispatch(setGroupFabricAmount(totalFabricAmount));
    dispatch(setGroupAccessoriesAmount(totalAccAmount));
  }, [totalFabricAmount, totalAccAmount]);

  const [editSingleLoader, setEditSingleLoader] = useState(false);

  const mood = localStorage.getItem(`mood${tabId}`);
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
  // }, [tabId, location.state]);


  const handleEditOrder = (e, item) => {
    if (mood == "view") {
      toast.error("You have no rights to change");
    } else {
      setEditSingleLoader(true);
      e.stopPropagation();
      localStorage.setItem(`TOrdDtID${tabId}`, item.TOrdDtId);
      localStorage.setItem(`TOrdHdID${tabId}`, item.TOrdHdID);
      localStorage.setItem(`serviceId${tabId}`, item.ItemId);

      dispatch(getSingleOrderList(item.TOrdDtId)).then((res) => {
        if (res.success) {
          setEditSingleLoader(false);
          navigate("/add-order-home-page", {
            state: { from: "group-page", id: item },
          });
        }
      });
    }
    // navigate("/add-order-home-page", {
    //   state: { from: "group-page", id: item },
    // });
    // dispatch(getSingleOrderList(item.TOrdDtId));
    // navigate("/add-order", {
    //   state: { from: "group-page", id: item },
    // });
  };

  // const groupOrderList = useSelector(
  //   (state) => state?.groupOrderList?.single?.orderItemList?.groupItemList
  // );

  // const [deletefabricModal, setDeleteFabricModal] = useState(false);

  // const [deleteFabric, setDeleteFabric] = useState();

  // const handleRemoveFabric = (ind) => {
  //   setDeleteFabricModal(true);
  //   setDeleteFabric(ind);

  //   // const updatedFabric = [...fabric];
  //   // updatedFabric.splice(ind, 1);
  //   // setFabric(updatedFabric);
  // };

  // const handleDeleteFabric = (ind) => {
  //   const updatedFabric = [...fabric];
  //   updatedFabric.splice(ind, 1);
  //   setFabric(updatedFabric);
  //   setDeleteFabricModal(false);
  // };

  const [accordionFabric, setAccordionFabric] = useState(false);

  const toggleFabric = () => {
    setAccordionFabric(!accordionFabric);
  };

  const [showImage, setShowImage] = useState(false);

  const handleImageModel = (ind) => {
    setActiveImg(ind);
    setShowImage(true);
  };

  const handleImageModelClose = () => {
    setShowImage(false);
  };

  const serviceId = localStorage.getItem(`serviceId${tabId}`);

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

  const service = useSelector((state) => state.service);

  const selectedGroupItem = service?.singleGroupService?.data?.itemDetails;

  const groupDetails = useSelector(
    (state) => state?.addGroupOrderDetails?.creategroupitem?.GROUPITEM
  );

  const TOrdDtID = localStorage.getItem(`TOrdDtID${tabId}`);
  const EnableInventory = useSelector(
    (state) => state?.config?.orderType.EnableInventory
  );

  const [itemDesc, setItemDesc] = useState("");
  const handleInputChange = (e) => {
    setItemDesc(e.target.value);
  };

  useEffect(() => {
    if (groupData?.ItemDescription) {
      setItemDesc(groupData?.ItemDescription);
    } else if (selectedGroupItem?.ItemDescription) {
      setItemDesc(selectedGroupItem?.ItemDescription);
    }
  }, [selectedGroupItem, groupData]);

  useEffect(() => {
    if (
      itemDesc &&
      itemDesc !==
      (selectedGroupItem?.ItemDescription || groupData?.ItemDescription)
    ) {
      dispatch(getDiscription(itemDesc));
    }
  }, [itemDesc, dispatch, selectedGroupItem, groupData]);
  const handleKeyDown = (e) => {
    if (mood === "view") {
      e.preventDefault();
      toast.error("You have no rights to change");
    }
  };
  return (
    <div className="">
      <div className="d-flex">
        {groupData?.ItemImage ? (
          <img src={service1} alt="" />
        ) : (
          <div className="text-lg-center ">
            <img
              src={CategoryIcon}
              alt=""
              width="100px"
              height="100px"
              className="bg-light py-2 px-3"
            />
          </div>
        )}
        {groupData ? (
          <div className="ml-2 custom-title-ItemName w-100">
            <p className="fw-bold fs-3 mb-0 ml-2 ml-1">
              {groupData.ItemName}
            </p>
            <input
              className="border p-2 rounded-2 h-full w-100"
              type="text"
              name="itemDesc"
              value={itemDesc}
              readOnly={mood === "view"}
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
            />
          </div>
        ) : selectedGroupItem ? (
          <div className="ml-2 custom-title-ItemName w-100">
            <p className="fw-bold fs-3 mb-0 ml-2 ml-1">
              {selectedGroupItem?.ItemName}
            </p>
            <input
              className="border p-2 rounded-2 h-full w-100"
              type="text"
              name="itemDesc"
              value={itemDesc}
              onChange={handleInputChange}
            />
          </div>
        ) : (
          <div>
            <Skeleton
              variant="rectengle"
              width={150}
              height={40}
              className="m-1 ms-3"
            />
            <Skeleton
              variant="rectengle"
              width={300}
              height={30}
              className="m-1 ms-3"
            />
          </div>
        )}
      </div>

      <div className="mt-2 mt-lg-5 acc-sv-box">
        <div className="position-relative nk-accordion-searchbox avtar-img-gid  ">
          {groupData?.groupItemList?.length > 0 ? (
            groupData?.groupItemList.map((item, i) => {
              const fabArray = item?.fabricList?.filter(
                (val) =>
                  val?.ItemType === "Cut Length" || val?.ItemType === "Fabric" || val?.ItemType === "fabric" || val?.ItemType === "cut length"
              );
              const accArray = item?.fabricList?.filter(
                (val) => val?.ItemType === "Accessories" || val?.ItemType === "accessories"
              );

              const totalFabricAmount = fabArray?.reduce((sum, fabric) => {
                const product =
                  fabric.Quantity * fabric.articleDetails.Sale_Rate;

                return sum + product;
              }, 0);

              const totalAccAmount = accArray?.reduce((sum, fabric) => {
                const product =
                  fabric.Quantity * fabric.articleDetails.Sale_Rate;

                return sum + product;
              }, 0);

              const finalImageObjects = Object.keys(item)
                .filter(
                  (key) =>
                    key.startsWith("attach_img_") &&
                    !key.endsWith("_desc") &&
                    item[key] !== null
                )
                .map((imgKey) => {
                  const descKey = `${imgKey}_desc`;
                  return {
                    image: item[imgKey],
                    desc: item.hasOwnProperty(descKey) ? item[descKey] : null,
                  };
                });

              return (
                <Accordion className="shadow mt-3" key={i}>
                  <Accordion.Item eventKey="0" className="w-100 cst-jac-acc">
                    <Accordion.Header
                      className="custom-accordion-searchbox"
                      onClick={toggleFabric}
                    >
                      <div className="form-control-lg form-control custom-accordion-header d-flex align-items-center justify-content-between cst-grd-p ">
                        <div className="d-flex align-items-center fw-bold">
                          <span className="me-1 me-sm-2"> {item.ItemName}</span>

                          <img
                            src={PaymentEditIcon}
                            alt=""
                            width="25px"
                            className="ml-1 img-fluid PaymentEditIcon"
                            onClick={(e) => handleEditOrder(e, item)}
                          />

                          <div className="d-flex feb_acces_measu_stl_icon">
                            <div className="d-flex bg-white ">
                              <div className="rounded-circle d-flex align-items-center mx-1">
                                <img
                                  src={
                                    fabArray.length > 0
                                      ? isFabricIcon
                                      : isnotFabricIcon
                                  }
                                  id="fab_img_toolTip"
                                  alt=""
                                  width="25px"
                                  onClick={(e) => handleEditOrder(e, item)}
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
                              <div className="rounded-circle d-flex align-items-center mx-1">
                                <img
                                  src={
                                    accArray.length > 0
                                      ? isAccessoriesIcon
                                      : isnotAccessoriesIcon
                                  }
                                  id="accs_img_toolTip"
                                  alt=""
                                  width="25px"
                                  onClick={(e) => handleEditOrder(e, item)}
                                />
                                <Tooltip
                                  id={`accs_img_toolTip`}
                                  direction="bottom"
                                  text={
                                    accArray.length > 0
                                      ? "View Accessories"
                                      : "Add Accessories"
                                  }
                                />
                              </div>
                              <div className="rounded-circle d-flex align-items-center mx-1 ">
                                <img
                                  src={
                                    item?.ordMeasure?.length > 0
                                      ? isMeasurementIcon
                                      : isnotMeasurementIcon
                                  }
                                  id="measure_img_toolTip"
                                  alt=""
                                  width="25px"
                                  onClick={(e) => handleEditOrder(e, item)}
                                // onClick={() => handleEditItem(item)}
                                />
                                <Tooltip
                                  id={`measure_img_toolTip`}
                                  direction="bottom"
                                  text={
                                    item?.ordMeasure?.length > 0
                                      ? "View Measurement"
                                      : "Add Measurement"
                                  }
                                />
                              </div>
                              <div className="rounded-circle d-flex align-items-center mx-1 ">
                                <img
                                  src={
                                    item?.ordstyle?.length > 0
                                      ? isStyleIcon
                                      : isnotStyleIcon
                                  }
                                  id="style_img_toolTip"
                                  alt=""
                                  width="25px"
                                  onClick={(e) => handleEditOrder(e, item)}
                                // onClick={() => handleEditItem(item)}
                                />
                                <Tooltip
                                  id={`style_img_toolTip`}
                                  direction="bottom"
                                  text={
                                    item?.ordMeasure?.length > 0
                                      ? "View Style"
                                      : "Add Style"
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className=" ml-1">
                            <div className="avatar-stack d-flex align-items-center ">
                              {/*  {imageArray.slice(0, 4).map((item, ind) => {
                                  return (
                                    <div className="avatar-item" key={ind}>
                                      <img
                                        onClick={(e) => handleImageModel(ind)}
                                        className="avatar rounded-circle"
                                        src={item}
                                        alt="1"
                                        width="25px"
                                      />
                                    </div>
                                  );
                                })}
                                <div className="avatar-item">
                                  <span className="avatar">
                                    +{imageArray.length - 4}
                                  </span>
                                </div>*/}
                              {finalImageObjects.length > 0 && (
                                <div
                                  className="avatar-stack mt-1 d-flex"
                                // onClick={() =>
                                //   handleImageModel(finalImageObjects)
                                // }
                                >
                                  {finalImageObjects
                                    .slice(0, 4)
                                    .map((item, ind) => {
                                      return (
                                        <div className="avatar-item" key={ind}>
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
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <span className="fw-bold ">
                            {symbol} {/* {item.NetAmount} */}
                            {item.Rate != null
                              ? item.Rate + totalFabricAmount + totalAccAmount
                              : totalFabricAmount +
                              totalAccAmount +
                              item.Amount}
                            {/* {item.BasicRate +
                              totalFabricAmount +
                              totalAccAmount} */}
                          </span>
                        </div>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body
                      className="p-2 cst-jac-acc-body"
                      container="body"
                    >
                      {/* <Accordion>
                        <Accordion.Item eventKey="0">
                          <div className="custom-accordion-searchbox">
                            <div className="fw-medium d-flex justify-content-between form-control-lg form-control custom-accordion-header">
                              <span className="">Making</span>
                              <span>
                                {" "}
                                {item.BasicRate -
                                  (totalFabricAmount + totalAccAmount) >
                                0
                                  ? item.BasicRate -
                                    (totalFabricAmount + totalAccAmount)
                                  : 0}
                              </span>
                            </div>
                          </div>
                        </Accordion.Item>
                      </Accordion> */}

                      <Accordion>
                        <Accordion.Item eventKey="0">
                          <div className="custom-accordion-searchbox">
                            <div className="fw-medium d-flex justify-content-between form-control-lg form-control custom-accordion-header">
                              <span className="">Making</span>
                              <span>
                                {symbol}
                                {item.Rate}
                              </span>
                            </div>
                          </div>
                        </Accordion.Item>
                      </Accordion>
                      {fabArray?.length > 0 && (
                        <Accordion>
                          <Accordion.Item eventKey="0">
                            <Accordion.Header className="custom-accordion-searchbox">
                              <div className="fw-medium d-flex justify-content-between form-control-lg form-control custom-accordion-header getFebric_sec">
                                <div className="lable_title_acc_feb">
                                  <span>Fabric</span>
                                  <span className="bg-success fabric_pillBox  text-white rounded-pill  ml-1">
                                    0{fabArray?.length}
                                  </span>
                                </div>
                                <span>
                                  {symbol} {totalFabricAmount}
                                </span>
                              </div>
                            </Accordion.Header>
                            <Accordion.Body className="border p-1 rounded-2">
                              {fabArray?.map((fabric, index) => {
                                return (
                                  <div className="p-1 rounded-3 border">
                                    <div
                                      className="d-flex justify-content-between icons_hide_css"
                                      key={index}
                                    >
                                      <div className="row justify-content-start m-1 p-1 w-100  rounded-2">
                                        <div className="d-flex justify-content-center col-md-1 col-sm-6 col-12 p-0 cust_col-fab_Ass">
                                          <img
                                            src={SherwaniImage}
                                            alt=""
                                            width="55px"
                                            height="55px"
                                            className="rounded-2 img-fluid feb_access"
                                          />
                                        </div>
                                        <div className="d-flex custom-border-right p-0 col-md-2 col-sm-6 col-12 cust_feb_asse_name">
                                          <div className="pr-sm-2 pr-0 ml-1">
                                            <span
                                              className="mb-0 fw-bold fs-14"
                                              id={`ArticleName${index}`}
                                            >
                                              {fabric.articleDetails.ArticleName
                                                .length >= 12
                                                ? fabric.articleDetails.ArticleName.slice(
                                                  0,
                                                  12
                                                ) + "..."
                                                : fabric.articleDetails
                                                  .ArticleName}
                                            </span>
                                            {fabric.articleDetails.ArticleName
                                              .length >= 12 && (
                                                <Tooltip
                                                  id={`ArticleName${index}`}
                                                  direction="right"
                                                  text={
                                                    fabric.articleDetails
                                                      .ArticleName
                                                  }
                                                />
                                              )}
                                            <div className="d-flex custom-light-text custom-text-transform">
                                              {fabric.Barcode_Id != null && (
                                                <>
                                                  <img
                                                    src={barcodeImg}
                                                    alt=""
                                                  />
                                                  <p className="mb-0 fs-12">
                                                    {fabric.Barcode_Id}
                                                  </p>
                                                </>
                                              )}
                                            </div>
                                            <div className="d-flex custom-light-text custom-text-transform">
                                              {/* <img src={barcodeImg} alt="" /> */}
                                              <p
                                                className="mb-0 fs-12"
                                                id={`discriptionsls${index}`}
                                              >
                                                {fabric?.Descriptions?.length >=
                                                  12
                                                  ? fabric?.Descriptions?.slice(
                                                    0,
                                                    12
                                                  ) + "..."
                                                  : fabric?.Descriptions}
                                              </p>

                                              {fabric?.Descriptions?.length >=
                                                12 && (
                                                  <Tooltip
                                                    id={`discriptionsls${index}`}
                                                    direction="right"
                                                    text={fabric?.Descriptions}
                                                  />
                                                )}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-md-7 col-sm-8 col-12 pl-md-2 pl-0 justify-content-center get-feb-row_cust">
                                          <div className="fw-bold "></div>
                                          <div className="row custom-name ">
                                            <div className="custom-border-right col-sm-3 col-12 px-2 custom-text-transform custom-light-text custo_col_respo3">
                                              <span
                                                className="mb-0 fs-12 "
                                                id={`Item_name${index}`}
                                              >
                                                {fabric.articleDetails
                                                  .Article_desc.length >= 8
                                                  ? fabric.articleDetails.Article_desc.slice(
                                                    0,
                                                    8
                                                  ) + "..."
                                                  : fabric.articleDetails
                                                    .Article_desc}

                                                {fabric.articleDetails
                                                  .Article_desc.length >= 8 && (
                                                    <Tooltip
                                                      id={`Item_name${index}`}
                                                      direction="right"
                                                      text={
                                                        fabric.articleDetails
                                                          .Article_desc
                                                      }
                                                    />
                                                  )}
                                                {/* 100% COTTON */}
                                                {/* {fabric.Item_name} */}
                                              </span>

                                              <p className="mb-0 fs-12">
                                                {fabric?.Brandtbl?.BrandName}
                                                {/* PALADINO */}
                                              </p>
                                            </div>
                                            <div className="custom-border-right px-2 col-sm-3 col-12 custom-light-text custo_col_respo3">
                                              <span className="mb-0 fs-12">
                                                {fabric.OutFitSize} SIZE
                                                {/* SMALL SIZE */}
                                              </span>
                                              <p className="mb-0 fs-12">
                                                {/* LIGHT BROWN */}
                                                {fabric?.MstColour?.ColourName}
                                              </p>
                                            </div>
                                            <div className="px-2 col-sm-3 col-12 custom-light-text custom-text-transform custo_col_respo3">
                                              <span className="mb-0 fs-12">
                                                QTY
                                              </span>
                                              <p className="mb-0 fs-12">
                                                {fabric.Quantity} {fabric.Unit}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="border text-center my-3 d-flex align-items-center justify-content-center rounded fw-bold col-md-2 col-sm-3 col-8 p-0 feb_Asse_rs_sec">
                                        <label
                                          htmlFor=""
                                          className="mb-0 fs-14 "
                                        >
                                          {symbol}{" "}
                                          {fabric.Quantity *
                                            fabric.articleDetails.Sale_Rate}
                                        </label>
                                      </div>
                                    </div>
                                    {fabric.IsDyeing ? (
                                      <>
                                        <div className="d-flex align-items-center gap-2 bg-body-secondary py-2">
                                          <p
                                            className={`mb-0 fs-14 text-dark fw-bold`}
                                          >
                                            Dyeing{" "}
                                          </p>

                                          <div>
                                            {fabric.IsDyeing && (
                                              <p className={`mb-0  mt-1 fs-12`}>
                                                <span className="fw-bold">
                                                  {fabric.DyeingOption}
                                                </span>{" "}
                                                : {fabric.DyeingComment}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                );
                              })}
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      )}

                      {accArray?.length > 0 && (
                        <Accordion>
                          <Accordion.Item eventKey="0">
                            <Accordion.Header className="custom-accordion-searchbox">
                              <div className="fw-medium d-flex justify-content-between form-control-lg form-control custom-accordion-header getFebric_sec">
                                <div className="lable_title_acc_feb">
                                  <span>Accessories</span>
                                  <span className="bg-success fabric_pillBox  text-white rounded-pill  ml-1">
                                    0{accArray?.length}
                                  </span>
                                </div>
                                <span>
                                  {symbol} {totalAccAmount}
                                </span>
                              </div>
                            </Accordion.Header>
                            <Accordion.Body className="border p-1 rounded-2">
                              {accArray?.map((acc, index) => {
                                return (
                                  <div
                                    className="d-flex justify-content-between p-1 rounded-3 border icons_hide_css"
                                    key={index}
                                  >
                                    <div className="row justify-content-start m-1 p-1 w-100  rounded-2">
                                      <div className="d-flex justify-content-center col-md-1 col-sm-6 col-12 p-0 cust_col-fab_Ass">
                                        <img
                                          src={SherwaniImage}
                                          alt=""
                                          width="55px"
                                          height="55px"
                                          className="rounded-2 img-fluid feb_access"
                                        />
                                      </div>
                                      <div className="d-flex custom-border-right p-0 col-md-2 col-sm-6 col-12 cust_feb_asse_name">
                                        <div className="pr-sm-2 pr-0 ml-1">
                                          <span
                                            className="mb-0 fw-bold fs-14"
                                            id={`ArticleName${index}`}
                                          >
                                            {acc.articleDetails.ArticleName
                                              .length >= 12
                                              ? acc.articleDetails.ArticleName.slice(
                                                0,
                                                12
                                              ) + "..."
                                              : acc.articleDetails.ArticleName}
                                          </span>
                                          {acc.articleDetails.ArticleName
                                            .length >= 12 && (
                                              <Tooltip
                                                id={`ArticleName${index}`}
                                                direction="right"
                                                text={
                                                  acc.articleDetails.ArticleName
                                                }
                                              />
                                            )}
                                          <div className="d-flex custom-light-text custom-text-transform">
                                            {acc.Barcode_Id != null && (
                                              <>
                                                <img src={barcodeImg} alt="" />
                                                <p className="mb-0 fs-12">
                                                  {acc.Barcode_Id}
                                                </p>
                                              </>
                                            )}
                                          </div>
                                          <div className="d-flex custom-light-text custom-text-transform">
                                            {/* <img src={barcodeImg} alt="" /> */}
                                            <p
                                              className="mb-0 fs-12"
                                              id={`discriptionsls${index}`}
                                            >
                                              {acc?.Descriptions?.length >= 12
                                                ? acc?.Descriptions?.slice(
                                                  0,
                                                  12
                                                ) + "..."
                                                : acc?.Descriptions}
                                            </p>

                                            {acc?.Descriptions?.length >=
                                              12 && (
                                                <Tooltip
                                                  id={`discriptionsls${index}`}
                                                  direction="right"
                                                  text={acc?.Descriptions}
                                                />
                                              )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="col-md-7 col-sm-8 col-12 pl-md-2 pl-0 justify-content-center get-feb-row_cust">
                                        <div className="fw-bold "></div>
                                        <div className="row custom-name ">
                                          <div className="custom-border-right col-sm-3 col-12 px-2 custom-text-transform custom-light-text custo_col_respo3">
                                            <span
                                              className="mb-0 fs-12 "
                                              id={`Item_name${index}`}
                                            >
                                              {acc.articleDetails.Article_desc
                                                .length >= 8
                                                ? acc.articleDetails.Article_desc.slice(
                                                  0,
                                                  8
                                                ) + "..."
                                                : acc.articleDetails
                                                  .Article_desc}

                                              {acc.articleDetails.Article_desc
                                                .length >= 8 && (
                                                  <Tooltip
                                                    id={`Item_name${index}`}
                                                    direction="right"
                                                    text={
                                                      acc.articleDetails
                                                        .Article_desc
                                                    }
                                                  />
                                                )}
                                              {/* 100% COTTON */}
                                              {/* {acc.Item_name} */}
                                            </span>

                                            <p className="mb-0 fs-12">
                                              {
                                                acc.articleDetails?.Brandtbl
                                                  ?.BrandName
                                              }
                                              {/* PALADINO */}
                                            </p>
                                          </div>
                                          <div className="custom-border-right px-2 col-sm-3 col-12 custom-light-text custom-text-transform custo_col_respo3">
                                            <span className="mb-0 fs-12">
                                              {acc.OutFitSize} SIZE
                                              {/* SMALL SIZE */}
                                            </span>
                                            <p className="mb-0 fs-12">
                                              {/* LIGHT BROWN */}
                                              {acc?.MstColour?.ColourName}
                                            </p>
                                          </div>
                                          <div className="px-2 col-sm-3 col-12 custom-light-text custom-text-transform custo_col_respo3">
                                            <span className="mb-0 fs-12">
                                              QTY
                                            </span>
                                            <p className="mb-0 fs-12">
                                              {acc.Quantity} {acc.Unit}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="border text-center my-3 d-flex align-items-center justify-content-center rounded fw-bold col-md-1 col-sm-2 col-8 p-0 feb_Asse_rs_sec">
                                      <label htmlFor="" className="mb-0 fs-14 ">
                                        {symbol}{" "}
                                        {acc.Quantity *
                                          acc.articleDetails.Sale_Rate}
                                      </label>
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
                </Accordion>
              );
            })
          ) : groupDetails?.length > 0 ? (
            groupDetails?.map((item, i) => {
              return (
                <Accordion className="shadow mt-3">
                  <Accordion.Item eventKey="0" className="w-100 cst-jac-acc">
                    <Accordion.Header
                      className="custom-accordion-searchbox"
                      onClick={toggleFabric}
                    >
                      <div className="form-control-lg form-control custom-accordion-header d-flex align-items-center justify-content-between cst-grd-p ">
                        <div className="d-flex align-items-center fw-bold">
                          <span className="me-1 me-sm-2"> {item.ItemName}</span>

                          <img
                            src={PaymentEditIcon}
                            alt=""
                            width="25px"
                            className="ml-1 img-fluid PaymentEditIcon"
                            onClick={(e) => handleEditOrder(e, item)}
                          />
                        </div>
                        <div>
                          <span className="fw-bold ">
                            {symbol} {item.BasicRate}
                          </span>
                        </div>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body
                      className="p-2 cst-jac-acc-body"
                      container="body"
                    >
                      <Accordion>
                        <Accordion.Item eventKey="0">
                          <div className="custom-accordion-searchbox">
                            <div className="fw-medium d-flex justify-content-between form-control-lg form-control custom-accordion-header">
                              <span className="">Making</span>
                              <span>
                                {symbol} {item.BasicRate}
                              </span>
                            </div>
                          </div>
                        </Accordion.Item>
                      </Accordion>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              );
              //   })
              // )
            })
          ) : (
            <div className="">
              <Skeleton
                variant="rectengle"
                width="100%"
                height={30}
                className="shadow mt-3"
              />
              <Skeleton
                variant="rectengle"
                width="100%"
                height={30}
                className="shadow mt-3"
              />
              <Skeleton
                variant="rectengle"
                width="100%"
                height={30}
                className="shadow mt-3"
              />
            </div>
          )}

          {EnableInventory == 1 && (
            <Accordion
              className={`shadow mt-3`}
              activeKey={accordionFabric ? "0" : null}
            >
              <Accordion.Item eventKey="0">
                <Accordion.Header
                  className="custom-accordion-searchbox"
                  onClick={toggleFabric}
                >
                  <div
                    className={`form-control-lg form-control search-input pl-5 taxtcolor-light `}
                  >
                    <div className="d-flex align-items-center">
                      <span className=" landing-26">Fabric / Accessories</span>
                    </div>
                  </div>
                  <img
                    src={fabricIcon}
                    alt=""
                    className="position-absolute fs-5 d-flex "
                    style={{ top: "30%", left: "10px", opacity: "0.8" }}
                  />

                  <div className="position-absolute rounded-circle fs-5  p-1 d-flex align-items-center fab-arrowposition">
                    <img
                      src={UpArrowIcon}
                      alt=""
                      width="15px"
                      style={{
                        transition: "all 0.2s ease-in-out",
                        rotate: accordionFabric ? "0deg" : "180deg",
                      }}
                    />
                  </div>
                </Accordion.Header>
                <Accordion.Body className="position-relative pb-2">
                  {switchValue === "fabric" ? (
                    <FabricSearch
                      mood={mood}
                      handleAddFabricSuccess={handleAddFabricSuccess}
                      onDataChange={handleFabricData}
                    />
                  ) : (
                    <AccessoriesSearch
                      onCountChange={handleAccessoriesFabric}
                      accessoriesCount={accessoriesCount}
                      onDataChange={handleAccessoriesData}
                    />
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          )}
        </div>
      </div>

      <Modal
        isOpen={showImage}
        toggle={handleImageModelClose}
        size="lg"
        className="rounded-top-4 add-order-singe-image-slider"
      >
        <div className="p-4 rounded-top-4">
          <div className="d-flex">
            <div>
              <span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                incidunt in repudiandae ad tempore nam eligendi magni earum
                error? Vel odio tempore praesentium illo voluptatem ipsum hic
                rem. Nisi, fugit?
              </span>
            </div>
            <Icon
              name="cross"
              onClick={handleImageModelClose}
              style={{ cursor: "pointer" }}
            ></Icon>
          </div>
          <Swiper
            navigation={true}
            loop
            modules={[Navigation]} // Add both Navigation and Pagination modules
            className="mySwiper"
            initialSlide={activeImg}
            onSlideChange={(swiper) => setActiveImg(swiper.activeImg)}
            ref={swiperRef}
          >
            {selectedImages.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="p-2">
                  <img
                    src={img}
                    alt="avatarImages"
                    className="w-100"
                  // width="full"
                  // height="300px"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Modal>
    </div>
  );
};

export default LeftSideDetail;

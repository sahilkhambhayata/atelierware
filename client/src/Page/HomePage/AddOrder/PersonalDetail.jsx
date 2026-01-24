import React, { useEffect, useRef, useState } from "react";
import avatar1 from "./../../../images/avatar/add-order-img-1.png";
import Avatar1 from "./../../../images/avatar/avatar1.png";
import CallIcon from "./../../../images/icons/add-order-phone-icon.svg";
import TinIcon from "./../../../images/icons/add-order-tin-icon.svg";
import UserIcon from "./../../../images/icons/add-order-user-icon.svg";
import EmailIcon from "./../../../images/icons/add-order-email-icon.svg";
import LocationIcon from "./../../../images/icons/add-order-location-icon.svg";
import CategoryIcon from "./../../../images/icons/add-order-caterory-icon.svg";
import multyCategoryIcon from "./../../../images/icons/add-order-multycaterory-icon.svg";
import orderTypeIcon from "./../../../images/icons/add-order-ordertype-icon.svg";
import CorporateIcon from "./../../../images/icons/corporate-icon-rounded.svg";
import tridateImg from "./../../../images/icons/tridateImg.svg";
import Icon from "../../../Components/icon/Icon";
import ActionEditIcon from "./../../../images/icons/edit-icon.png";
import { useDispatch, useSelector } from "react-redux";
import { getOrderType } from "../../../redux/actions/orderTypeAction";
import { getCustomerStyle } from "../../../redux/actions/styleAction";
import { useLocation, useNavigate } from "react-router";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  UncontrolledTooltip,
} from "reactstrap";

import PersonalDetailForm from "./SearchCustomer/PersonalDetailForm";
import EditPersonalDetailForm from "./EditPersonalDetailForm";
import {
  UpdateCustomer,
  createDebouncedSearchCustomer,
  getCustomerDetailsAsyncData,
  getSingleCustomer,
} from "../../../redux/actions/customerAction";
import SearchCustomerSkeleton from "./SkeletonDesign/SearchCustomerSkeleton";
import { toast } from "react-toastify";
import Tooltip from "../../../Components/Tooltip/Tooltip";
import ToolTipContent from "../../../Components/Tooltip/ToolTipContent";
import { useTheme } from "../../../Layout/Provider/Themes";
import { formatDate } from "../../../redux/dateFormateFunction";
import { getConfig } from "../../../redux/actions/configAction";
import { usePermissions } from "../../../Layout/Provider/PermissionsContext";
import ProfileImageSlider from "./ProfileImageSlider";

const PersonalDetail = ({ data }) => {
  const BU_Id = localStorage.getItem("BU_Id");
  const CompanyId = localStorage.getItem("CompanyId");
  const BranchId = localStorage.getItem("BranchId");
  const { tabId } = useTheme();
  const customerId = localStorage.getItem(`customerId${tabId}`);
  const mood = localStorage.getItem(`mood${tabId}`);

  const { handleAction } = usePermissions();
  const location = useLocation();

  const [customerModel, setCustomerModel] = useState(false);
  const [isModalOpen, setModalIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [ordModalLoading, setOrdModalLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const customer = useSelector((state) => state?.customerDetails);
  const getConfigData = useSelector((state) => state?.config?.orderType);

  const SingleCustomer = useSelector(
    (state) => state?.customerDetails.single.data
  );

  const customerDetails = useSelector((state) => state?.customerDetails);

  const styleDetails = useSelector((state) => state.styleDetails);

  const type = styleDetails?.data?.find(
    (item) => item?.CustTypeId === SingleCustomer?.CustTypeId
  );

  const [dataCustomer, setDataCustomer] = useState({});

  const handleUpdateDetails = () => {
    setCustomerModel(true);
  };
  const handleselctCust = () => {
    setModalIsOpen(true);
  };

  const handleCloseCustomerModel = () => {
    setCustomerModel(false);
    setModalIsOpen(false);
  };

  const handleCustomerDataChange = (data) => {
    setDataCustomer(data);
  };
  const debouncedSearchRef = useRef(createDebouncedSearchCustomer());

  const handleSearchCustomerChange = (e) => {
    setSearchCustomer(e.target.value);
    debouncedSearchRef.current(dispatch, e.target.value, BU_Id);
    // dispatch(getCustomerDetailsAsyncData(e.target.value, BU_Id));
  };

  const handleupdateCustomerDtls = () => {
    setOrdModalLoading(true);
    dispatch(
      UpdateCustomer(
        dataCustomer.data,
        dataCustomer.image,
        SingleCustomer.AccountId,
        CompanyId,
        BranchId
      )
    ).then((res) => {
      if (res?.success === true) {
        toast.success(res.message);
        dispatch(getSingleCustomer(SingleCustomer.AccountId));
        setCustomerModel(false);
        setOrdModalLoading(false);
      } else {
        setOrdModalLoading(false);
      }
    });
  };

  setTimeout(() => {
    setOrdModalLoading(false);
  }, 5000);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 1200);
    };
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  // const addCustomer = () => {
  //   dispatch(getSingleCustomer(customerId));
  // };

  const handleSingleCustomer = (id) => {
    localStorage.setItem(`customerId${tabId}`, id);
    dispatch(getSingleCustomer(id));
    setModalIsOpen(false);
  };

  useEffect(() => {
    // dispatch(getOrderType(BU_Id));
    dispatch(getCustomerStyle(BU_Id));
  }, []);

  useEffect(() => {
    if (customerId) {
      dispatch(getSingleCustomer(customerId));
    }
  }, [customerId, dispatch]);

  const [imgModel, setImgModel] = useState(false);

  const handleProfileImage = () => {
    setImgModel(!imgModel);
  };
  const closeImageModal = () => {
    setImgModel(false);
  };

  const [profileImage, setProfileImage] = useState([]);

  useEffect(() => {
    if (SingleCustomer) {
      const images = [
        SingleCustomer.profile_img,
        SingleCustomer.profile_back,
        SingleCustomer.profile_front,
        SingleCustomer.profile_side,
      ];
      setProfileImage(images);
    }
  }, [SingleCustomer]);

  return (
    <>
      {/* <div
        className={`bg-white px-3 pt-3 rounded w-100 me-2 pe-0  position-relative ${data}`}
      ></div> */}
      <div
        className={`card-order-details bg-white w-100 position-relative  ${data}`}
      >
        <div className="card-title">
          <h6 className="card-title-name">
            {/* djghdfjk */}
            {SingleCustomer ? SingleCustomer?.AccName : "name"}
          </h6>
        </div>
        <div className="d-flex  custome-flex-column ">
          <div className="me-sm-1 text-md-start text-center card-pr-image custom-avatar-handle">
            <div className="img" onClick={handleProfileImage}>
              {SingleCustomer?.profile_img ? (
                <img
                  src={SingleCustomer?.profile_img}
                  alt=""
                  width="61px"
                  height="70px"
                  className="img-fluid avtar-img object-contain"
                />
              ) : (
                <img
                  src={CategoryIcon}
                  alt=""
                  width="61px"
                  height="70px"
                  className="img-fluid  object-contain bg-light p-1"
                />
              )}
              <div className="avatar-stack mt-1 d-flex">
                {SingleCustomer?.profile_front && (
                  <div className="avatar-item ">
                    <img
                      className="avatar rounded-circle"
                      src={SingleCustomer?.profile_front}
                      alt="1"
                      // width="25px"
                      // height="25px"
                    />
                  </div>
                )}
                {SingleCustomer?.profile_back && (
                  <div className="avatar-item ">
                    <img
                      className="avatar rounded-circle"
                      src={SingleCustomer?.profile_back}
                      alt="1"
                      // width="25px"
                      // height="25px"
                    />
                  </div>
                )}

                {SingleCustomer?.profile_side &&
                  SingleCustomer?.profile_front &&
                  SingleCustomer?.profile_back && (
                    <div className="avatar-item">
                      <span className="avatar">+1</span>
                    </div>
                  )}
              </div>
            </div>

            <div className=" col-md-6 col-lg-1 text-center text-md-start px-lg-1 top-user-icon ">
              {/* <img src={UserIcon} alt="" className="img-fluid" /> */}
              {SingleCustomer?.CustType === "1" ? (
                <img
                  src={UserIcon}
                  alt=""
                  width={25}
                  height={25}
                  className="img-fluid"
                />
              ) : (
                <img
                  src={CorporateIcon}
                  alt=""
                  width={25}
                  height={25}
                  className="img-fluid"
                />
              )}
            </div>
          </div>

          <div className="w-100 mr-4 card-pr-dtl">
            <div className="row w-100 align-items-top rows-gtr-0 margin_bottom_mb_on">
              <div className="col-lg-3 col-md-6 phone-tin-sec ps-lg-2 pe-1  phone-tic-30">
                <div className="d-flex custom-light-text phone-con">
                  <img src={CallIcon} alt="" className="me-1" />
                  {/* {personalData?.mobileNo} */}
                  <span>
                    {SingleCustomer ? SingleCustomer?.MobileNo : "mobile"}
                  </span>
                  {/* +91 123456789 */}
                </div>

                {SingleCustomer && SingleCustomer?.CustType !== "1" ? (
                  <>
                    <div className="d-flex custom-light-text phone-con mt-1">
                      <img src={TinIcon} alt="" className="me-1" />
                      <span>{SingleCustomer?.VatTNo}</span>
                    </div>
                  </>
                ) : (
                  <div className="d-flex custom-light-text custom-text-transform phone-con mt-1 opacity-0">
                    <img src={TinIcon} alt="" className="me-1 " />
                  </div>
                )}
              </div>
              <div
                className=" col-md-6 col-lg-1 text-center text-md-start px-lg-1 user-icon my-auto "
                id="custType-tooltip"
              >
                {/* <img src={UserIcon} alt="" className="img-fluid" /> */}
                {SingleCustomer?.CustType === "1" ? (
                  <img
                    src={UserIcon}
                    alt=""
                    width={30}
                    height={30}
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src={CorporateIcon}
                    alt=""
                    width={30}
                    height={30}
                    className="img-fluid"
                  />
                )}
              </div>
              <Tooltip
                className="custom-w"
                id={`custType-tooltip`}
                direction={isMobile ? "top" : "right"}
                text={
                  SingleCustomer?.CustType === "1"
                    ? "Individual User"
                    : "Corporate User"
                }
              />
              <div className="col-lg-4 col-md-6 custom-border-right px-lg-1 email-location-sec email-loc-40">
                <div className="border-2">
                  <div
                    className="d-flex custom-light-text el-icon"
                    id="single-email-tooltip"
                  >
                    <img
                      src={EmailIcon}
                      alt="Email-icon"
                      className="me-1 img-fluid"
                    />
                    <span>
                      {SingleCustomer?.Email?.length > 22
                        ? SingleCustomer?.Email?.slice(0, 22) + "..."
                        : SingleCustomer?.Email}
                    </span>
                  </div>
                  {SingleCustomer?.Email?.length > 22 && (
                    <Tooltip
                      className="custom-w"
                      id={`single-email-tooltip`}
                      direction={isMobile ? "top" : "right"}
                      text={SingleCustomer?.Email}
                    />
                  )}
                  <div
                    className="d-flex align-items-start custom-light-text custom-text-transform el-icon mt-1"
                    id="adde-tooltip"
                  >
                    <img src={LocationIcon} alt="" className="me-1 img-fluid" />
                    <span>
                      {SingleCustomer?.Address?.split(" ").length > 3
                        ? SingleCustomer?.Address.split(" ")
                            .slice(0, 3)
                            .join(" ") + " ..."
                        : SingleCustomer?.Address}
                    </span>
                    {/* 12, shfg hsfghsf sfghs hsfghs */}
                  </div>
                  {SingleCustomer?.Address?.split(" ").length > 3 && (
                    <Tooltip
                      id={`adde-tooltip`}
                      direction={isMobile ? "top" : "right"}
                      text={SingleCustomer?.Address}
                    />
                  )}
                </div>
              </div>
              <div className="col-lg-3 col-md-6 category-multycategory-icon  px-lg-1 cat-mul-30">
                <div className="cmc-icon">
                  <div className="d-flex custom-light-text custom-text-transform">
                    <img src={CategoryIcon} alt="" className="me-1" />
                    <span>
                      {type?.CustType != null || undefined
                        ? type?.CustType
                        : "Type"}
                    </span>
                  </div>

                  {/* <div className="d-flex align-items-start custom-light-text custom-text-transform mt-1 opacity-0 ">
                    <img src={multyCategoryIcon} alt="" className="me-1" />

                    <span>{type?.CustType}</span>
                  </div> */}
                </div>
              </div>
            </div>

            <div className="bg-light p-1 px-2 mt-2  pl-3   custwidtth rounded-top-2 cust-position">
              <div className="row w-100">
                <div className="col-sm-4 col-12 ps-2 ps-lg-0 text-lg-center px-0 ">
                  Last Order Date{" "}
                  <span className=" fw-medium">
                    {SingleCustomer && SingleCustomer?.LastOrderDate
                      ? formatDate(
                          new Date(SingleCustomer?.LastOrderDate),
                          getConfigData?.DateAndTime,
                          false
                        )
                      : " N/A"}
                  </span>
                </div>
                <div className="col-sm-4 col-12 ps-2 ps-lg-0 text-lg-center px-0">
                  Last Order
                  <span className="fw-medium">
                    {" "}
                    {SingleCustomer && SingleCustomer?.LastOrderNo
                      ? "#" + SingleCustomer?.LastOrderNo
                      : "N/A"}
                  </span>
                </div>
                <div className="col-sm-4 col-12 ps-2 ps-lg-0 text-lg-center px-0">
                  Current Balance
                  <span className="fw-medium">
                    {" "}
                    {SingleCustomer && SingleCustomer?.CurrentBalance
                      ? SingleCustomer?.CurrentBalance
                      : "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center position-absolute pr-search-edit_icon">
            <div
              className="bg-light text-center custom-rounded-left pt-2 d-flex flex-column ps-1"
              style={{ paddingRight: 5 }}
            >
              {location.pathname !== "/order-tracker-single-order" && (
                <>
                  <Icon
                    name="search"
                    className="bg-white rounded-circle p-1 cursor-pointer "
                    onClick={handleselctCust}
                    id={"searchIcon"}
                  ></Icon>
                  <Tooltip
                    id={`searchIcon`}
                    direction="top"
                    text={ToolTipContent.searchCustomer}
                  />
                </>
              )}
              <div>
                <img
                  src={ActionEditIcon}
                  alt=""
                  className="bg-white rounded-circle my-2 cursor-pointer"
                  // onClick={() =>
                  //   handleAction(
                  //     "BtnBkAnOrderEditCustDetail",
                  //     "action",
                  //     handleUpdateDetails,
                  //    null

                  //   )
                  // }
                  onClick={handleUpdateDetails}
                  id="BtnBkAnOrderEditCustDetail"
                />
                <Tooltip
                  id={`BtnBkAnOrderEditCustDetail`}
                  direction="top"
                  text={ToolTipContent.editCustomerDetail}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* //customerModel// */}
      <Modal isOpen={customerModel} size="xl" className="rounded-top-4 ">
        <div className="bg-1c2b4c text-white py-2 px-4 rounded-top-4">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>
              <span>Update Customer Detail</span>
            </div>
            <Icon
              name="cross"
              className="cursor-pointer"
              onClick={handleCloseCustomerModel}
            ></Icon>
          </div>
        </div>
        <ModalBody className=" " style={{ minHeight: "400px" }}>
          <EditPersonalDetailForm
            onDataChange={handleCustomerDataChange}
            editSingleData={SingleCustomer}
          />
        </ModalBody>
        <ModalFooter className=" border-bottom-red">
          <div className="d-flex justify-content-end ">
            <Button
              outline
              color="light"
              className="mr-4"
              onClick={handleCloseCustomerModel}
            >
              Cancel
            </Button>

            <Button
              className="bg-1c2b4c px-4"
              onClick={handleupdateCustomerDtls}
            >
              {ordModalLoading ? (
                <Spinner size="sm" color="light" className="mx-0" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      <Modal isOpen={isModalOpen} size="xl" className={``}>
        <ModalBody className="overflow-hidden border-bottom-red">
          <div className="d-flex justify-content-end ">
            <div
              className="position-absolute modal-cross-icon-position"
              id="croddIconmodalcolse"
            >
              <Icon
                name="cross"
                className="cross-icon cursor-pointer"
                onClick={handleCloseCustomerModel}
              ></Icon>
              <Tooltip
                id={`croddIconmodalcolse`}
                direction="left"
                text={ToolTipContent.closeModel}
              />
            </div>
          </div>
          <div className="d-sm-flex justify-content-between align-items-center">
            <div className="position-relative nk-header-searchbox w-100">
              <input
                type="text"
                id="default-01"
                name="searchCustomer"
                value={searchCustomer}
                onChange={(e) => handleSearchCustomerChange(e)}
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
          <div className=" rounded-2  p-2 pt-0">
            {customer.isLoader ? (
              <span>
                <SearchCustomerSkeleton />
              </span>
            ) : (
              <></>
            )}
            {!customer.isLoader &&
              customer?.customer?.data?.slice(0, 5).map((item, ind) => {
                return (
                  <div
                    className="row align-items-center justify-content-between border py-1 cursor-position onHover"
                    key={ind}
                    onClick={() => handleSingleCustomer(item.AccountId)}
                  >
                    <div className="col-lg-1 col-2 pe-0">
                      <img
                        src={Avatar1}
                        alt=""
                        className="img-width"
                        id={`profile_img_${ind}`}
                      />
                      <Tooltip
                        id={`profile_img_${ind}`}
                        direction="right"
                        text={ToolTipContent.customerProfileImage}
                      />
                    </div>

                    <div className="col-lg-4 col-10  custom-border-right ">
                      <h6 className="mb-1 fs-14">{item.AccName}</h6>
                      <div className="d-flex align-items-center justify-content-between ">
                        <div>
                          <span>{item.MobileNo}</span>
                          <p>{item.Email ? item.Email : "null"}</p>
                        </div>
                        <div className="" id={`Corporate_User${ind}`}>
                          {item.CustType === "1" ? (
                            <img
                              src={UserIcon}
                              alt=""
                              width={30}
                              height={30}
                              className="img-fluid"
                            />
                          ) : (
                            <img
                              src={CorporateIcon}
                              alt=""
                              width={30}
                              height={30}
                              className="img-fluid"
                            />
                          )}
                          <Tooltip
                            id={`Corporate_User${ind}`}
                            direction="top"
                            text={
                              item.CustType === "1" ? "Individual" : "Corporate"
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className=" col-12 col-lg-7   my-3 my-lg-0">
                      <div className="row custom-media-mob">
                        <div
                          className="d-flex align-items-center  col-xl-3 col-4 justify-content-center img-con py-0 py-sm-1 "
                          id={`LastBillDate${ind}`}
                        >
                          <img
                            src={tridateImg}
                            alt=""
                            width="17px"
                            className="me-1"
                          />

                          {item.LastBillDate !== null
                            ? item.LastBillDate
                            : "N/A"}
                          <Tooltip
                            id={`LastBillDate${ind}`}
                            direction="top"
                            text={ToolTipContent.lastBillDate}
                          />
                        </div>
                        <div
                          className="d-flex align-items-center  col-xl-3 col-4 justify-content-center img-con py-0 py-sm-1 "
                          id={`LastBillNo${ind}`}
                        >
                          <img
                            src={orderTypeIcon}
                            alt=""
                            width="20px"
                            className="me-1"
                          />
                          {item.LastBillNo !== null
                            ? "#" + item.LastBillNo
                            : "N/A"}

                          <Tooltip
                            id={`LastBillNo${ind}`}
                            direction="top"
                            text={ToolTipContent.lastBillNo}
                          />
                        </div>
                        <div
                          className="d-flex align-items-center  col-xl-3 col-4 justify-content-center img-con py-0 py-sm-1 "
                          id={`CurrentBalance${ind}`}
                        >
                          <img
                            src={orderTypeIcon}
                            alt=""
                            width="20px"
                            className="me-1"
                          />
                          {item.CurrentBalance !== null
                            ? item.CurrentBalance
                            : "0.00"}
                          <Tooltip
                            id={`CurrentBalance${ind}`}
                            direction="top"
                            text={ToolTipContent.currentBalance}
                          />
                        </div>
                      </div>
                    </div>

                    {/* <div className="col-md-6 ">
                      <div className="d-flex ">
                        <div className="img ">
                          <img src={Avatar1} alt="" />
                        </div>
                        <div className="d-flex align-items-center mx-auto justify-content-between custom-border-right">
                          <div>
                            <h6 className="mb-0">{item.AccName}</h6>
                            <span>{item.MobileNo}</span>
                            <p>{item.Email ? item.Email : "null"}</p>
                          </div>
                          <div className="">
                            <img src={UserIcon} alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 d-flex justify-content-between">
                      <div className="d-flex align-items-center justify-content-center">
                        <img
                          src={tridateImg}
                          alt=""
                          width="17px"
                          className="me-1"
                        />
                        11/09/2023
                      </div>

                      <div className="d-flex align-items-center  justify-content-center">
                        <img
                          src={orderTypeIcon}
                          alt=""
                          width="20px"
                          className="me-1"
                        />
                        #{item.AccountId}
                      </div>

                      <div className="d-flex  justify-content-center">
                        {symbol} 2123
                      </div>
                    </div> */}
                  </div>
                );
              })}
            {!customer.isLoader && !customer?.customer?.data ? (
              <span>no data found...</span>
            ) : (
              <></>
            )}
            {/* ))} */}
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={imgModel} toggle={closeImageModal} size="md">
        <ModalBody className="overflow-hidden border-bottom-red custome-swipar-button-css px-5">
          <ProfileImageSlider images={profileImage} />
        </ModalBody>
      </Modal>
    </>
  );
};

export default PersonalDetail;

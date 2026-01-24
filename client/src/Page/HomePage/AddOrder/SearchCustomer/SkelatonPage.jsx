import React, { useEffect, useRef, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import PersonalDetail from "./../PersonalDetail";
import SkelatonTable from "./../SkeletonDesign/SkelatonTable";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Spinner,
  UncontrolledTooltip,
} from "reactstrap";

import Icon from "../../../../Components/icon/Icon";
import Avatar1 from "./../../../../images/avatar/avatar1.png";
import UserIcon from "./../../../../images/icons/add-order-user-icon.svg";
import CorporateIcon from "./../../../../images/icons/corporate-icon-rounded.svg";
import tridateImg from "./../../../../images/icons/tridateImg.svg";
import orderTypeIcon from "./../../../../images/icons/add-order-ordertype-icon.svg";
import PersonalDetailForm from "./PersonalDetailForm";
import AdvanceDetailForm from "./AdvanceDetailForm";
import ServiceAlbum from "./ServiceAlbum";
import ProductAlbum from "./ProductAlbum";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addCustomer,
  createDebouncedSearchCustomer,
  getCustomerDetailsAsyncData,
} from "../../../../redux/actions/customerAction";
import AddOrderHeader from "../AddOrderHeader";
import OrderDetail from "../OrderDetail";
import SearchCustomerSkeleton from "../SkeletonDesign/SearchCustomerSkeleton";
import { createorddtls } from "../../../../redux/actions/createorddtlsAction";
import { getConfig } from "../../../../redux/actions/configAction";
import { getCustomerStyle } from "../../../../redux/actions/styleAction";
import ToolTipContent from "../../../../Components/Tooltip/ToolTipContent";
import Tooltip from "../../../../Components/Tooltip/Tooltip";
import { useTheme } from "../../../../Layout/Provider/Themes";
import Head from "../../../../Layout/head/Head";
import { formatDate } from "../../../../redux/dateFormateFunction";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const SkelatonPage = () => {
  const BU_Id = localStorage.getItem("BU_Id");
  const BranchId = localStorage.getItem("BranchId");
  const companyId = localStorage.getItem("CompanyId");
  const customer = useSelector((state) => state?.customerDetails);
  const dispatch = useDispatch();
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchService, setSearchService] = useState("");
  const { tabId } = useTheme();
  const getConfigData = useSelector((state) => state?.config?.orderType);
  const [dataCustomer, setDataCustomer] = useState({});
  const { handleAction } = usePermissions();
  const [advanceData, setAdvanceData] = useState({});
  const rolePermission = useSelector(
    (state) => state.permissionByRoleReducer.rolePermission.Data
  );

  const allowedPageCodes = rolePermission?.flatMap((module) =>
    module.PAGE.map((page) => page.PageCode)
  );

  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    if (!toastShown && rolePermission) {
      if (allowedPageCodes?.some((code) => code?.includes("PgBookAnOrder"))) {
        // User is authorized, no action needed
      } else {
        toast.error(
          "You are not authorised to perform this action, for more details contact your account admin."
        );
        navigate("/dashboard");
        setToastShown(true); // Set the flag to indicate that the toast has been shown
      }
    }
  }, [toastShown, rolePermission]);
  const debouncedSearchRef = useRef(createDebouncedSearchCustomer());
  useEffect(() => {
    if (BU_Id) {
      debouncedSearchRef.current(dispatch,searchCustomer, BU_Id)
      // dispatch(getCustomerDetailsAsyncData(searchCustomer, BU_Id));
    }
  }, [searchCustomer, BU_Id]);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ordModalLoading, setOrdModalLoading] = useState(false);
  const [odsLoading, setOdsLoading] = useState(false);

  const [isModalOpen, setModalIsOpen] = useState(true);

  const [customerModel, setCustomerModel] = useState(false);
  const [orderModel, setOrderModel] = useState(false);
  const [Image, setImage] = useState(false);
  const location = useLocation();

  const isFromOrderHomePage =
    location.state && location.state.from === "add-order-home-page";

  const isFromGroupPage =
    location.state && location.state.from === "group-page";
  // const singleItemOfGroup = location.state && location.state.id;

  const isFromSingleOrderListPage =
    location.state && location.state.from === "order-list";
  const oldDtID = location.state && location.state.oldDtID;

  const isFromGroupOrderListPage =
    location.state && location.state.from === "group-order-list";
  const groupOldDtID = location.state && location.state.groupOldDtID;

  const isFromOrderTracker =
    location.state && location.state.from === "order-tracker";
  const isFromItemTracker =
    location.state && location.state.from === "item-tracker";

  useEffect(() => {
    if (
      isFromOrderHomePage ||
      isFromSingleOrderListPage ||
      isFromGroupPage ||
      isFromGroupOrderListPage ||
      isFromOrderTracker ||
      isFromItemTracker
    ) {
      setImage(true);
    }
  }, [location.state]);

  

  // const TOrdDtID = localStorage.getItem(`TOrdDtID${tabId}`);
  const handleServiceBack = () => {
    if (location.state) {
      if (isFromSingleOrderListPage) {
        localStorage.setItem(`TOrdDtID${tabId}`, oldDtID);
        navigate("/order-list", {
          state: { from: "single-item" },
        });
      } else if (isFromGroupOrderListPage) {
        localStorage.setItem(`TOrdDtID${tabId}`, groupOldDtID);
        navigate("/order-list", {
          state: { from: "group-item" },
        });
      } else if (isFromOrderTracker) {
        
        
        localStorage.setItem(`TOrdDtID${tabId}`, oldDtID);
        navigate(
          // `/order-tracker-single-order/${location.state.TOrdNo}/${location.state.mood}`,
          `/order-tracker-single-order`,
          {
            state: {
              from: "order-tracker",
              TOrdNo: location.state.TOrdNo,
              mood: location.state.mood,
            },
          }
        );
      } else if (isFromItemTracker) {
        localStorage.setItem(`TOrdDtID${tabId}`, oldDtID);
        navigate(
          // `/order-tracker-single-order/${location.state.TOrdNo}/${location.state.mood}`,
          `/order-tracker-single-order`,
          {
            state: {
              from: "item-tracker",
              TOrdNo: location.state.TOrdNo,
              mood: location.state.mood,
            },
          }
        );
      } else if (isFromOrderHomePage) {
        localStorage.setItem(`TOrdDtID${tabId}`, oldDtID);
        navigate("/add-order-home-page");
      }

      // window.history.back();

    } else if (isFromGroupPage) {
      localStorage.setItem(`TOrdDtID${tabId}`, groupOldDtID);
      navigate("/group-order-home-page");
    } else {
      setOrderModel(true);
      setIsSameOrd(true);
      setImage(false);
    }
  };

  const [isSameOrd, setIsSameOrd] = useState(false);

  useEffect(() => {
    if (!location.state) {
      localStorage.setItem(`TOrdHdID${tabId}`, null);
      localStorage.setItem(`TOrdDtID${tabId}`, null);
      localStorage.setItem(`serviceId${tabId}`, null);
    }
    // if (location.state && isFromGroupPage) {
    //   toggleImage();

    // }
    if (location.state && isFromSingleOrderListPage) {
      toggleImage;
      localStorage.setItem(`TOrdDtID${tabId}`, null);
    }

    // setSelectedService(item);

    // dispatch({ type: "GET_SINGLE_ORDER_ITEM", payload: {} });
  }, [location.state]);

  // isModalOpen && localStorage.removeItem("customerId");

  const handleAddCustomer = () => {
    setCustomerModel(true);
  };
  const [addCustomerData, setAddCustomerData] = useState();

  const isValidEmail = (email) => {
    // Email regex pattern
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };
  const submitCustomerModel = () => {
    if (
      dataCustomer.data.name === "" ||
      dataCustomer.data.mobileNo === "" ||
      dataCustomer.data.email === ""
    ) {
      toast.error("Name, Mobile No and Email Should Be Required");
    } else if (!isValidEmail(dataCustomer.data.email)) {
      toast.error("Email must be a valid email");
    } else {
      setOdsLoading(true);
      setLoading(true);
      dispatch(
        addCustomer(
          dataCustomer.data,
          dataCustomer.image,
          BU_Id,
          companyId,
          BranchId
        )
      ).then((res) => {
        localStorage.setItem(`customerId${tabId}`, res.status.AccountId);
        if (res?.success === true) {
          setAddCustomerData(dataCustomer.data);
          toast.success(res.messgae);
          setCustomerModel(false);
          setLoading(false);
          setOdsLoading(false);
          // const id = localStorage.getItem(`customerId${tabId}`);
          // navigate("/add-order-home-page", { state: { id } });

          setOrderModel(true);
          setDataCustomer({
            name: "",
            address: "",
            countryCode: "",
            countryId: "",
            dialcode: "",
            mobileNo: "",
            email: "",
            CustTypeId: "",
            category: "",
            BODDate: null,
            AniDate: null,
            selectedStatus: "",
            vatTno: "",
          });
          localStorage.setItem(`customerId${tabId}`, res.status.AccountId);
        } else {
          setTimeout(() => {
            setLoading(false);
            setOdsLoading(false);
          }, 1000);
        }
      });
    }
    setTimeout(() => {
      setLoading(false);
      setOdsLoading(false);
    }, 5000);
  };

  useEffect(() => {
    dispatch(getCustomerStyle(BU_Id));
  }, []);
  //for  order create or not

  // const BU_Id = localStorage.getItem("BU_Id");

  useEffect(() => {
    if (BU_Id) {
      dispatch(getConfig(BU_Id));
    }
  }, []);

  const submitOrderModel = () => {
    if (advanceData.poNo.length !== 0 && advanceData.poDate === null) {
      toast.error("Please Enter Purchase Order Date      ");
    } else if (advanceData.poNo.length === 0 && advanceData.poDate !== null) {
      toast.error("Please Enter Purchase Order Number");
    } else {
      setOrdModalLoading(true);
      if (isSameOrd) {
        setImage(true);
        setOrdModalLoading(false);
      } else {
        dispatch(createorddtls(advanceData, BU_Id)).then((res) => {
          if (res?.success === true) {
            localStorage.setItem(`TOrdHdID${tabId}`, res.upCrtOrder.TOrdHdID);
            // setOrderModel(false);
            setImage(true);

            // toast.success(res.message);
            setOrdModalLoading(false);
          } else {
            // toast.error(res.message);
            setTimeout(() => {
              setOrdModalLoading(false);
            }, 5000);
          }
        });
      }
    }
    // setOrdModalLoading(false);
    setTimeout(() => {
      setOrdModalLoading(false);
    }, 5000);
  };

  const id = localStorage.getItem(`customerId${tabId}`);

  // const [addOrderSuccesss,setAddOrderSuccesss] = useState(false)
  const toggleImage = () => {
    setImage(false);
    setModalIsOpen(false);
    // localStorage.setItem(`TOrdDtID${tabId}`, null);

    if (isFromOrderTracker || isFromItemTracker) {
      if (selectedService.IsGroup) {
        navigate("/group-order-home-page", {
          state: {
            from: "order-tracker",
            TOrdNo: location.state.TOrdNo,
            mood: location.state.mood,
          },
        });
      } else {
        navigate("/add-order-home-page", {
          state: {
            from: "order-tracker",
            TOrdNo: location.state.TOrdNo,
            mood: location.state.mood,
          },
        });
      }
    } else {
      if (selectedService.IsGroup) {
        navigate("/group-order-home-page",{
          state:{
            from:"new-order"
          }
        });
      } else {
        navigate("/add-order-home-page",{
          state:{
            from:"new-order"
          }
        });
      }
    }
  };
  const handleSearchCustomerChange = (e) => {
    setSearchCustomer(e.target.value);
  };

  const [switchValue, setSwitchValue] = useState("Service");
  const handleSwitchChange = (value) => {
    setSwitchValue(value);
  };
  const handleCloseCustomerModel = () => {
    setCustomerModel(false);
  };

  const handleCloseOrderModel = () => {
    setOrderModel(false);
    // setTabId("0000000");
  };

  // useEffect(() => {
  //   const maskedMobileNo = maskNumber(dataCustomer?.data?.MobNo);

  //   const maskedEmail = maskEmail(dataCustomer?.data?.Email);

  //   const updatedData = {
  //     ...data,
  //     maskedMobileNo,
  //     maskedEmail,
  //   };
  //   setDataCustomer(updatedData);
  // }, [advanceData]);

  const handleCustomerDataChange = (data) => {
    if (data.data.mobileNo === "##") {
      data.data = {
        ...data.data,
        mobileNo: "9999999999",
      };
    }

    setDataCustomer(data);
  };

  const handleAdvanceData = (data) => {
    setAdvanceData(data);
  };

  const [selectedService, setSelectedService] = useState();

  const handleImageClick = (item) => {
    setSelectedService(item);
  };

  const handleSearchServiceChange = (e) => {
    setSearchService(e.target.value);
  };

  useEffect(() => {
    if (selectedService != undefined) {
      localStorage.setItem(`serviceId${tabId}`, selectedService.ItemId);
      toggleImage();
    }
  }, [selectedService]);

  const handleSingleCustomer = (id) => {
    setOrderModel(true);
    // setTabId(id);
    localStorage.setItem(`customerId${tabId}`, id);
  };

  // const navigate = useNavigate();
  const handleBackToOrderTracker = () => {
    navigate("/dashboard");
  };
  return (
    <>
      <Head title="Book Order"></Head>
      <div className="pr-0 bg-light">
        <AddOrderHeader />
        <div className="px-lg-5 px-md-3 px-0 my-5">
          <div className="d-xl-flex justify-content-between mx-lg-5 mx-md-3 mx-0">
            <PersonalDetail />
            <OrderDetail />
          </div>

          {<SkelatonTable />}
        </div>

        <Modal
          isOpen={isModalOpen}
          size="xl"
          className={`${orderModel && Image ? "opacity-0" : ""} `}
        >
          <ModalBody className="overflow-hidden border-bottom-red">
            <div className="d-sm-flex justify-content-between align-items-center">
              <div>
                <Button outline onClick={handleBackToOrderTracker}>
                  Back
                </Button>
              </div>
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
              <div className="mx-auto  mx-sm-0 text-sm-start text-center my-2 my-sm-0">
                <Button
                  id="BtnBkAnOrderAddCust"
                  color="danger"
                  className="btn-icon "
                  // onClick={() =>
                  //   handleAction(
                  //     "BtnBkAnOrderAddCust",
                  //     "action",
                  //     handleAddCustomer,

                  //   )
                  // }
                  onClick={handleAddCustomer}
                >
                  <Icon name="plus"></Icon>
                  <span className="me-2">Add Customer</span>
                </Button>
              </div>
            </div>
            <div className=" rounded-2  p-2 pt-0">
              {/* {Array.from({ length: rows }, (_, ind) => ( */}

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
                        <div className="d-flex align-items-center justify-content-between ">
                          <div>
                            <h6 className="mb-1 fs-14">{item.AccName}</h6>
                            <span>{item.MobileNo ? item.MobileNo : ""}</span>
                            <p>{item.Email ? item.Email : ""}</p>
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
                                item.CustType === "1"
                                  ? "Individual"
                                  : "Corporate"
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className=" col-12 col-lg-7   my-3 my-lg-0">
                        <div className="row custom-media-mob">
                          <div
                            className="d-flex align-items-center  col-xl-3 col-4 justify-content-center img-con py-0 py-sm-1 "
                            id={`LastOrderDate${ind}`}
                          >
                            <img
                              src={tridateImg}
                              alt=""
                              width="17px"
                              className="me-1"
                            />

                            {item.LastOrderDate !== null
                              ? formatDate(
                                  new Date(item.LastOrderDate),
                                  getConfigData?.DateAndTime,
                                  false
                                ).slice()
                              : "N/A"}

                            <Tooltip
                              id={`LastOrderDate${ind}`}
                              direction="top"
                              text={ToolTipContent.LastOrderDate}
                            />
                          </div>

                          <div
                            className="d-flex align-items-center  col-xl-3 col-4 justify-content-center img-con py-0 py-sm-1 "
                            id={`LastOrderNo${ind}`}
                          >
                            <img
                              src={orderTypeIcon}
                              alt=""
                              width="20px"
                              className="me-1"
                            />
                            {item.LastOrderNo !== null
                              ? "#" + item.LastOrderNo
                              : "N/A"}

                            <Tooltip
                              id={`LastOrderNo${ind}`}
                              direction="top"
                              text={ToolTipContent.LastOrderNo}
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
                              text={ToolTipContent.totalBalance}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {!customer.isLoader && !customer?.customer?.data ? (
                <span className="fs-6 d-flex justify-content-center my-2">No Customer Account Found</span>
              ) : (
                <></>
              )}
            </div>
          </ModalBody>
        </Modal>

        <Modal isOpen={customerModel} size="xl" className="rounded-top-4 ">
          <div className="bg-1c2b4c text-white py-2 px-4 rounded-top-4">
            <div className="d-flex justify-content-between align-items-center w-100">
              <div>
                <span>Add Customer Detail</span>
              </div>
              <Icon
                name="cross"
                onClick={handleCloseCustomerModel}
                className="cursor-pointer"
              ></Icon>
            </div>
          </div>
          <ModalBody className="  " style={{ minHeight: "400px" }}>
            <PersonalDetailForm
              handleCustomerDataChange={handleCustomerDataChange}
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

              <Button className="bg-1c2b4c" onClick={submitCustomerModel}>
                {loading ? (
                  <Spinner size="sm" color="light" className="mx-1" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </ModalFooter>
        </Modal>

        <Modal isOpen={orderModel} size="xl" className="rounded-top-4 ">
          <div className="bg-1c2b4c text-white py-2 px-4 rounded-top-4">
            <div className="d-flex justify-content-between align-items-center w-100">
              <div>
                <span>Order Detail</span>
              </div>
              <Icon name="cross" onClick={handleCloseOrderModel}></Icon>
            </div>
          </div>
          <ModalBody className=" mb-5 " style={{ minHeight: "400px" }}>
            <AdvanceDetailForm onDataChange={handleAdvanceData} />
          </ModalBody>
          <ModalFooter className="mt-5 border-bottom-red">
            <div className="d-flex justify-content-end ">
              <Button
                outline
                color="light"
                className="mr-4"
                onClick={handleCloseOrderModel}
                id="order-detail_cancel_modal"
              >
                Cancel
              </Button>
              <Tooltip
                id={`order-detail_cancel_modal`}
                direction="left"
                text={ToolTipContent.backToCustomer}
              />

              <Button className="bg-1c2b4c" onClick={submitOrderModel}>
                {ordModalLoading ? (
                  <Spinner size="sm" color="light" className="mx-1" />
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

        <Modal isOpen={Image} size="xl">
          <div className="w-100 p-2 mt-2">
            <div className="d-flex align-items-center justify-content-between">
              <Button outline color="light" onClick={handleServiceBack}>
                Back
              </Button>

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

              <div className="switches-container cursor-pointer">
                <div className="text-center cursor-pointer w-100 ">
                  <div className="text-center">Service</div>
                </div>
              </div>
            </div>
          </div>
          <Icon
            name="cross"
            onClick={handleServiceBack}
            className="position-absolute fs-16 text-white rounded-full p-1"
            style={{ right: "10px", top: "3px", background: "#364a63" }}
          ></Icon>
          <ModalBody className="p-2">
            <div className="overflowFixServices">
              <div className="border border-2 py-2 px-1 rounded-2">
                {switchValue === "Service" ? (
                  <ServiceAlbum
                    onImageClick={handleImageClick}
                    searchService={searchService}
                  />
                ) : (
                  <ProductAlbum onImageClick={handleImageClick} />
                )}
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

export default SkelatonPage;

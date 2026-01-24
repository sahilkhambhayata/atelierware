import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Dropdown, DropdownItem, Spinner } from "reactstrap";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router";
import { DropdownToggle, DropdownMenu, UncontrolledDropdown } from "reactstrap";
import Head from "../../../Layout/head/Head";
import Content from "../../../Layout/Content/Content";
import { Block } from "../../../Components/Block/Block";
import Icon from "../../../Components/icon/Icon";
import { orderTabBar } from "../CommonTracker/orderTabBar";
import CustomColumnChooser from "../CommonTracker/CustomColumnChooser";
import CustomPagination from "../CommonTracker/CustomPagination";
import ActionCard from "../../../Components/ActionCard/ActionCard";
import HelpComment from "../../../Layout/header/dropdown/help/HelpComment";
import Export from "../../../Layout/header/dropdown/export/Export";
import { toast } from "react-toastify";

import { getBranch } from "../../../redux/actions/branchAction";
import {
  createDebouncedSearchOrder,
  getOrderDetails,
  getOrderDetailsAsyncData,
  searchOrder,
  // getSingleOrder,
  sortOrdersData,
} from "../../../redux/actions/orderDetailAction";
import FilterDateComponent from "../CommonTracker/FilterDateComponent";
import { filterTabData } from "../CommonTracker/filterTabData";
import OrderUnderBooking from "./UnderBooking/OrderUnderBooking";
import OrderFresh from "./FreshOrder/OrderFresh";
import OrderUnderProcess from "./UnderProcess/OrderUnderProcess";
import OrderReadyDelivery from "./ReadyForDeliverey/OrderReadyDelivery";
import OrderDelivered from "./Delivered/OrderDelivered";
import FilterAmountComponent from "../CommonTracker/FilterAmountComponent";
import FilterSortComponent from "../CommonTracker/FilterSortComponent";
import OrderSearch from "./Searched/OrderSearch";
import {
  getColumnListData,
  updateColumnListData,
} from "../../../redux/actions/columnListAction";
import DeleteSlider from "./OrderCustomTableCells/DeleteSlider";

import OrderAll from "./AllOrder/OrderAll";
import { getOrderCount } from "../../../redux/actions/orderCount";

import Cimages from "./../Images/CommonImageFile";
import Cicon from "./../Images/CommonIconFile";
import { sendEmailOfInvoice } from "../../../redux/actions/sendInvoiceEmailAction";
import { useTheme } from "../../../Layout/Provider/Themes";
import { usePermissions } from "../../../Layout/Provider/PermissionsContext";

const OrderTracker = () => {
  const token = localStorage.getItem("token");

  const config = useSelector((state) => state?.config);
  const order = useSelector((state) => state?.orderDetails);
  const orderCount = useSelector((state) => state?.orderCount.orderCount);
  const columList = useSelector((state) => state?.columnsDetails);
  const dispatch = useDispatch();
  const { tabId } = useTheme();
  const navigate = useNavigate();
  const BranchId = localStorage.getItem("BranchId");
  const BU_Id = localStorage.getItem("BU_Id");
  const CompanyId = localStorage.getItem("CompanyId");
  useEffect(() => {
    localStorage.setItem(`TOrdHdID${tabId}`, null);
    localStorage.setItem(`serviceId${tabId}`, null);
    localStorage.setItem(`TOrdDtID${tabId}`, null);
    localStorage.setItem(`customerId${tabId}`, null);
  }, []);

  const userId = localStorage.getItem("userId");
  // const CompanyId = localStorage.getItem("CompanyId");
  const searchStatus = useSelector((state) => state?.orderDetails);

  const searchOrderValue = useSelector(
    (state) => state?.orderDetails?.searchResults
  );

  let newColumns = [];
  let newVisibleColumns = [];
  const [isClosed, setIsClosed] = useState(0);
  const [visibleColumn, setVisibleColumns] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [selectedRows, setSelectedRows] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [modelColumns, setModelColumns] = useState(false);
  const [columns, setColumns] = useState([
    { name: "order", title: "ORDER#" },
    { name: "customer", title: "Customer" },
    { name: "commitments", title: "Commitments" },
    // { name: "status", title: "Status" },
    { name: "designer", title: "Designer" },
    { name: "value", title: "Order Amount" },
    // { name: "paid", title: "Paid" },
    // { name: "balance", title: "Balance" },
    { name: "more", title: " " },
  ]);

  const [trans, setTrans] = useState("under-booking");
  const [tableName, setTableName] = useState("TblOmsOrdTracrUB");
  const [hidden, setHidden] = useState([]);
  const [modelFilter, setModelFilter] = useState(false);
  const [activeTab, setActiveTab] = useState();
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [selectedSortFilter, setSelectedSortFilter] = useState(0);
  const [sortByOrderNo, setSortByOrderNo] = useState(true);
  const [sortByOrderDate, setSortByOrderDate] = useState(true);
  const [sortByTrialDate, setSortByTrialDate] = useState(true);
  const [sortByDeliveredDate, setSortByDeliveredDate] = useState(true);
  const [maxAmount, setMaxAmount] = useState(250000);
  const [minAmount, setMinAmount] = useState(0);
  const [isOpenDropdown, setisOpenDropdown] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const orderSearchData = useSelector((state) => state.itemSerachData);
  const [serachLoader, setSearchLoader] = useState(false);
  const [refreshLoader, setRefreshLoader] = useState(false);
  const { handleAction } = usePermissions();

  const rolePermission = useSelector(
    (state) => state.permissionByRoleReducer.rolePermission.Data
  );

  const allowedPageCodes = rolePermission?.flatMap((module) =>
    module.PAGE.map((page) => page.PageCode)
  );

  useEffect(() => {
    setIsClosed(0);
    setTableName("TblOmsOrdTracrUB");
  }, []);

  // useEffect(() => {
  //   if (
  //     orderSearchData.search != "" &&
  //     orderSearchData.search != undefined &&
  //     orderSearchData.search != null
  //   ) {
  //     setIsClosed(6);
  //   }
  // }, [orderSearchData.search]);

  useEffect(() => {
    setPageSize(50);
    setCurrentPage(0);
  }, [isClosed]);

  const handleTabClick = (ind, title) => {
    if (orderSearchData.search !== "") {
      setIsClosed(6);
      setColumns([]);
      setTrans("search-result");
    } else {
      setIsClosed(ind);
      setColumns([]);
      setTrans(title);
    }
  };

  useEffect(() => {
    if (orderSearchData.search !== "" && orderSearchData.search != undefined) {
      setIsClosed(6);
      setColumns([
        { name: "order", title: "ORDER#" },
        { name: "ordertype", title: "OrderType" },
        { name: "customer", title: "Customer" },
        { name: "commitments", title: "Commitments" },
        { name: "status", title: "Status" },
        { name: "designer", title: "Designer" },
        { name: "value", title: "Order Amount" },
        { name: "more", title: " " },
      ]);
      setTrans("search-result");
    } else {
      setIsClosed(0);
      setColumns([
        { name: "order", title: "ORDER#" },
        { name: "ordertype", title: "OrderType" },
        { name: "customer", title: "Customer" },
        { name: "commitments", title: "Commitments" },
        { name: "status", title: "Status" },
        { name: "designer", title: "Designer" },
        { name: "value", title: "Order Amount" },
        // { name: "balance", title: "Balance" },
        { name: "more", title: " " },
      ]);
      setTrans("under-booking");
    }
  }, [orderSearchData]);

  const handleSelectRowsChange = (selectedRows) => {
    setSelectedRows(selectedRows);
  };

  const handleSelectAllRows = (selectedRows) => {
    setSelectedRows(selectedRows);
  };

  useEffect(() => {
    const handleColumns = () => {
      switch (isClosed) {
        case 0:
          setTableName("TblOmsOrdTracrUB");
          newColumns = [
            { name: "order", title: "ORDER#" },
            { name: "ordertype", title: "OrderType" },
            { name: "customer", title: "Customer" },
            { name: "commitments", title: "Commitments" },
            { name: "status", title: "Status" },
            { name: "designer", title: "Designer" },
            { name: "value", title: "Order Amount" },
            { name: "more", title: " " },
          ];
          break;
        case 1:
          setTableName("TblOmsOrdTracrFO");
          newColumns = [
            { name: "order", title: "ORDER#" },
            { name: "ordertype", title: "OrderType" },

            { name: "customer", title: "Customer" },
            { name: "commitments", title: "Commitments" },
            { name: "status", title: "Status" },
            { name: "designer", title: "Designer" },
            { name: "value", title: "Order Amount" },
            { name: "lastdate", title: "Last Date" },
            { name: "balance", title: "Balance" },
            { name: "more", title: " " },
          ];
          break;
        case 2:
          setTableName("TblOmsOrdTracrUP");
          newColumns = [
            { name: "order", title: "ORDER#" },
            { name: "ordertype", title: "OrderType" },

            { name: "customer", title: "Customer" },
            { name: "commitments", title: "Commitments" },
            { name: "status", title: "Status" },
            { name: "designer", title: "Designer" },
            { name: "value", title: "Order Amount" },
            { name: "paid", title: "Paid" },
            { name: "balance", title: "Balance" },
            { name: "more", title: " " },
          ];
          break;
        case 3:
          setTableName("TblOmsOrdTracrRD");
          newColumns = [
            { name: "order", title: "ORDER#" },
            { name: "ordertype", title: "OrderType" },

            { name: "customer", title: "Customer" },
            { name: "commitments", title: "Commitments" },
            { name: "status", title: "Status" },
            { name: "designer", title: "Designer" },
            { name: "shipped", title: "Shipped" },
            { name: "value", title: "Order Amount" },
            { name: "paid", title: "Paid" },
            { name: "balance", title: "Balance" },
            { name: "more", title: " " },
          ];
          break;
        case 4:
          setTableName("TblOmsOrdTracrDlrd");
          newColumns = [
            { name: "order", title: "ORDER#" },
            { name: "ordertype", title: "OrderType" },

            { name: "customer", title: "Customer" },
            { name: "commitments", title: "Commitments" },
            { name: "status", title: "Status" },
            { name: "designer", title: "Designer" },
            { name: "value", title: "Order Amount" },
            { name: "paid", title: "Paid" },
            { name: "balance", title: "Balance" },
            { name: "deliveredStatus", title: "Delivered" },
            { name: "rating", title: "Rating" },
            { name: "more", title: " " },
          ];
          break;
        case 5:
          setTableName("TblOmsOrdTracrUB");
          newColumns = [
            { name: "order", title: "ORDER#" },
            { name: "ordertype", title: "OrderType" },

            { name: "customer", title: "Customer" },
            { name: "commitments", title: "Commitments" },
            { name: "status", title: "Status" },
            { name: "designer", title: "Designer" },
            { name: "value", title: "Order Amount" },
            { name: "paid", title: "Paid" },
            { name: "balance", title: "Balance" },
            { name: "more", title: " " },
          ];
          break;
        case 6:
          newColumns = [
            { name: "order", title: "ORDER#" },
            { name: "ordertype", title: "OrderType" },

            { name: "customer", title: "Customer" },
            { name: "commitments", title: "Commitments" },
            { name: "status", title: "Status" },
            { name: "designer", title: "Designer" },
            { name: "value", title: "Order Amount" },
            { name: "more", title: " " },
          ];
          break;
        case 7:
          newColumns = [
            { name: "order", title: "ORDER#" },
            { name: "ordertype", title: "OrderType" },

            { name: "customer", title: "Customer" },
            { name: "commitments", title: "Commitments" },
            { name: "status", title: "Status" },
            { name: "designer", title: "Designer" },
            { name: "value", title: "Order Amount" },
            { name: "more", title: " " },
          ];
          break;
        default:
          newColumns = [];
      }
      setColumns(newColumns);
    };
    handleColumns();
  }, [isClosed, tableName]);

  useEffect(() => {
    if (columList.data !== null) {
      if (
        columList?.data?.[tableName] !== null &&
        columList?.data?.[tableName] !== ""
      ) {
        newVisibleColumns = columList?.data?.[tableName]?.split(", ");
        setVisibleColumns(newVisibleColumns);
      } else {
        newVisibleColumns = columns.map((column) => column.name);
        setVisibleColumns(newVisibleColumns);
      }
    } else {
      newVisibleColumns = columns.map((column) => column.name);
      setVisibleColumns(newVisibleColumns);
    }
  }, [columList, tableName]);

  useEffect(() => {
    const hiddenColumns = columns
      .filter((column) => !visibleColumn?.includes(column.name))
      .map((column) => column?.name);
    setHidden(hiddenColumns);
  }, [visibleColumn]);

  useEffect(() => {
    if (userId !== undefined) {
      if (isClosed !== 6) {
        dispatch(getColumnListData(userId, tableName)).then((res) => {
          if (res.success) {
          } else {
            toast.error("Network error");
          }
        });
      }
    }
  }, [userId, tableName]);

  const handleColumnToggle = (columnName) => {
    setHidden((prevHiddenColumns) => {
      if (prevHiddenColumns.includes(columnName)) {
        return prevHiddenColumns.filter((col) => col !== columnName);
      } else {
        return [...prevHiddenColumns, columnName];
      }
    });
    setVisibleColumns((prevVisibleColumns) => {
      if (hidden?.includes(columnName)) {
        return [...prevVisibleColumns, columnName];
      } else {
        return prevVisibleColumns.filter((col) => col !== columnName);
      }
    });
  };

  const handleApply = () => {
    dispatch(updateColumnListData(userId, tableName, visibleColumn));
    setModelColumns(false);
  };

  const handleCancel = async () => {
    setModelColumns(false);
  };

  const handleFilter = () => {
    fetchData();
    setModelFilter(false);
  };

  const handleCancelFilter = () => {
    setModelFilter(false);
    setActiveTab();
    setSelectedFilter(0);
    // fetchData();
  };

  const handleFilterSelection = (filter) => {
    setSelectedFilter(filter);
  };

  const handleDelete = () => {
    setSidebarOpen(true);
  };

  const handleRefresh = async () => {
    setRefreshLoader(true);
    try {
      if (activeTab !== 6 && BranchId && BU_Id) {
        await dispatch(getOrderCount());

        await dispatch(
          getOrderDetailsAsyncData(
            currentPage,
            pageSize,
            BU_Id,
            isClosed,
            activeTab,
            selectedFilter,
            startDate,
            endDate,
            minAmount,
            maxAmount
            // selectedSortFilter
          )
        ).then((res) => {
          if (res.success) {
            setRefreshLoader(false);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
    // dispatch(getOrderCount());
  };

  const handleSendBillEmail = () => {
    dispatch(sendEmailOfInvoice(selectedRows)).then((res) => {
      if (res.success) {
        toast.success(res.message);
      }
    });
  };
  const handleSortFilterSelection = (filterIndex) => {
    if (filterIndex === 0) {
      setSelectedSortFilter(0);
      const sortedData = order?.order?.orderDetails?.sort(customOrderNo);
      dispatch(sortOrdersData(sortedData));
      setSortByOrderNo(!sortByOrderNo);
    } else if (filterIndex === 1) {
      setSelectedSortFilter(1);
      const sortedData = order?.order?.orderDetails?.sort(customOrderDate);
      dispatch(sortOrdersData(sortedData));
      setSortByOrderDate(!sortByOrderDate);
    } else if (filterIndex === 2) {
      setSelectedSortFilter(2);
      const sortedData = order?.order?.orderDetails?.sort(customTrialDate);
      dispatch(sortOrdersData(sortedData));
      setSortByTrialDate(!sortByTrialDate);
    } else if (filterIndex === 3) {
      setSelectedSortFilter(3);
      const sortedData = order?.order?.orderDetails?.sort(customDeliveryDate);
      dispatch(sortOrdersData(sortedData));
      setSortByDeliveredDate(!sortByDeliveredDate);
    }
  };

  // const handleOrder = () => {
  //   navigate("/add-order");

  // };
  const handleOrder = () => {
    const url = `/#/add-order`;
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // window.open("/#/add-order", "_blank");
  };

  //pagination logic----------------

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setCurrentPage(0);

    if (newRowsPerPage == 0) {
      setPageSize(order.order.TotalCount);
    } else {
      setPageSize(newRowsPerPage);
    }
  };

  //sort by filter logic-------------------------------------------------------------------
  const customOrderNo = (a, b) => {
    const first = a.TOrdHdID;
    const second = b.TOrdHdID;
    if (sortByOrderNo) {
      if (first < second) {
        return -1;
      }
      if (first > second) {
        return 1;
      }
    } else {
      if (first > second) {
        return -1;
      }
      if (first < second) {
        return 1;
      }
    }
    return 0;
  };

  const customOrderDate = (a, b) => {
    const first = new Date(a.TOrdDate);
    const second = new Date(b.TOrdDate);
    if (sortByOrderDate) {
      if (first < second) {
        return -1;
      }
      if (first > second) {
        return 1;
      }
    } else {
      if (first > second) {
        return -1;
      }
      if (first < second) {
        return 1;
      }
    }
    return 0;
  };
  const customTrialDate = (a, b) => {
    const first = new Date(a.TrialDate);
    const second = new Date(b.TrialDate);
    if (sortByTrialDate) {
      if (first < second) {
        return -1;
      }
      if (first > second) {
        return 1;
      }
    } else {
      if (first > second) {
        return -1;
      }
      if (first < second) {
        return 1;
      }
    }
    return 0;
  };

  const customDeliveryDate = (a, b) => {
    const first = new Date(a.DelDate);
    const second = new Date(b.DelDate);
    if (sortByDeliveredDate) {
      if (first < second) {
        return -1;
      }
      if (first > second) {
        return 1;
      }
    } else {
      if (first > second) {
        return -1;
      }
      if (first < second) {
        return 1;
      }
    }
    return 0;
  };

  const toggleDropdown = () => {
    setModelColumns(!modelColumns);
  };

  const toggleSidebar = (isOpen) => {
    setSidebarOpen(isOpen);
  };

  const toggleFilter = () => {
    setModelFilter(!modelFilter);
  };

  useEffect(() => {
    if (isClosed !== 6 && BU_Id != null) {
      dispatch(getOrderCount());
    }
  }, [BranchId, BU_Id, CompanyId]);

  const fetchData = async () => {
    try {
      if (activeTab !== 6 && BU_Id && token) {
        await dispatch(
          getOrderDetailsAsyncData(
            currentPage,
            pageSize,
            BU_Id,
            isClosed,
            activeTab,
            selectedFilter,
            startDate,
            endDate,
            minAmount,
            maxAmount
            // selectedSortFilter
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  // const itemSearchData = useSelector((state) => state.itemSerachData);
  const debouncedSearchRef = useRef(createDebouncedSearchOrder());

  useEffect(() => {
    // if (isClosed === 6) {
    //   setSearchLoader(true);

    //   dispatch(
    //     searchOrder(
    //       currentPage,
    //       pageSize,
    //       BU_Id,
    //       orderSearchData?.orderSwitchStatus,
    //       orderSearchData.search,
    //       orderSearchData.searchStatus
    //     )
    //   ).then((res) => {
    //     if (res.success) {
    //       setSearchLoader(false);
    //     } else {
    //       setSearchLoader(false);
    //     }
    //   });
    // }
    if (isClosed === 6) {
      setSearchLoader(true);

      debouncedSearchRef
        .current(
          dispatch,
          currentPage,
          pageSize,
          BU_Id,
          orderSearchData?.orderSwitchStatus,
          orderSearchData.search,
          orderSearchData.searchStatus
        )
        ?.then((res) => {
          if (res?.success) {
            setSearchLoader(false);
          }
        });
    }

    // Cleanup function to cancel debounce when dependencies change or component unmounts
    return () => {
      debouncedSearchRef.current.cancel();
    };
  }, [orderSearchData, isClosed, dispatch, pageSize, currentPage]);

  // const navigate = useNavigate();
  useEffect(() => {
    if (isClosed !== 6 && BU_Id) {
      fetchData();
    }
  }, [
    BranchId,
    BU_Id,
    CompanyId,
    currentPage,
    pageSize,
    token,
    isClosed,
    // activeTab,
    // selectedFilter,
    // endDate,
    // startDate,
    // minAmount,
    // maxAmount,
    localStorage,
  ]);

  // useEffect(() => {
  //   fetchData();
  // }, []);
  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     // Check if any of the required keys in localStorage has changed
  //     if (
  //       localStorage.getItem("BranchId") !== BranchId ||
  //       localStorage.getItem("BU_Id") !== BU_Id ||
  //       localStorage.getItem("CompanyId") !== CompanyId
  //     ) {
  //       // Update the state with the new values from localStorage
  //       setBranchId(localStorage.getItem("BranchId"));
  //       setBU_Id(localStorage.getItem("BU_Id"));
  //       setCompanyId(localStorage.getItem("CompanyId"));
  //     }
  //   };

  //   // Add event listener for storage change
  //   window.addEventListener("storage", handleStorageChange);

  //   return () => {
  //     // Clean up event listener
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, [BranchId, BU_Id, CompanyId]);

  // useEffect(() => {
  //   if (isClosed < 6) {
  //     fetchData();
  //   }
  // },[])
  return (
    <>
      <Head title="Order Tracker"></Head>
      <Content>
        {/* <div className="d-felx justify-end custome-justify ">
          <div className="d-flex actions-card-container">
            <ActionCard
              actionIcon={Cicon.OrderBalanceIcon}
              actionTitle="Order balance"
              actionSubTitle="{symbol} 1959.75"
              bgColor="#36353F"
            />
            <ActionCard
              actionIcon={Cicon.ReadyDeliveryIcon}
              actionTitle="Ready Delivery"
              actionSubTitle="(09)"
              bgColor="#CE7100"
            />
            <ActionCard
              actionIcon={Cicon.FullUrgent}
              actionTitle="Urgent Orders"
              actionSubTitle="5 Days ago(06)"
              bgColor="#FC5B54"
            />
          </div>
        </div> */}

        <div className="row justify-between align-items-center my-1 ps-sm-3 ">
          <div className="d-flex align-items-center col-md-4 custome-order-rf ">
            <div>
              <Button
                // id="PgBookAnOrder"
                // color="danger"
                className="btn-icon "
                // onClick={handleOrder}
                onClick={() =>
                  handleAction("PgBookAnOrder", "page", handleOrder)
                }
                style={{ backgroundColor: "#E90020", borderColor: "#E90020" }}
              >
                <Icon name="plus"></Icon>
                <span className="me-2">Orders</span>
              </Button>
            </div>

            <div className="d-flex align-items-center refresh-Icon">
              {refreshLoader ? (
                <Spinner size="sm" className="mx-1 " />
              ) : (
                <img
                  src={Cicon.UndoIcon}
                  alt="UndoIcon"
                  id="BtnOrdTrckrRefresh"
                  className="fw-bolder fs-3 m-1 me-1 ms-2 "
                  // onClick={() =>
                  //   handleAction(
                  //     "BtnOrdTrckrRefresh",
                  //     "action",
                  //     handleRefresh,
                  //     null

                  //   )
                  // }
                  onClick={handleRefresh}
                />
              )}
              <div
                className={`${!isOpenDropdown ? "slide-container-box" : ""}`}
              >
                <div className="d-flex">
                  <div
                    className={`form-check-label ${
                      !isOpenDropdown
                        ? ` ${
                            selectedRows.length > 0 ? "slide-in" : "slide-out"
                          }`
                        : ""
                    } `}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={Cicon.DeleteIcon}
                        alt="DeleteIcon"
                        id="BtnOrdTrckrDelOrderMul"
                        className="fw-bolder fs-3 m-1 me-3 cursor-pointer"
                        // onClick={handleDelete}
                        onClick={() =>
                          handleAction(
                            "BtnOrdTrckrDelOrderMul",
                            "action",
                            handleDelete
                            // balanceData.balanceData
                          )
                        }
                      />
                      {isClosed !== 0 ? (
                        <>
                          <img
                            id="BtnOrdTrckrInvMailMul"
                            src={Cicon.EmailIcon}
                            onClick={() =>
                              handleAction(
                                "BtnOrdTrckrInvMailMul",
                                "action",
                                handleSendBillEmail
                                // balanceData.balanceData
                              )
                            }
                            // onClick={handleSendBillEmail}
                            alt="EmailIcon"
                            className="fw-bolder fs-3 m-1 me-3 cursor-pointer"
                          />
                          {/* <img
                            src={Cicon.PrintIcon}
                            alt="PrintIcon"
                            className="fw-bolder fs-3 m-1 me-3 "
                          /> */}
                        </>
                      ) : (
                        <></>
                      )}

                      {/* <div className="add-custom-width">
                        <Status />
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center   export-pagination-container col-md-8 justify-content-md-end">
            <div className="d-flex export-buton">
              <Export ic={isClosed} />
            </div>

            <div className="d-felx  align-items-center ml-3 custom-ml-0">
              <div className="pagination bg-white rounded-10">
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={
                    isClosed == 6
                      ? searchOrderValue.totalPages
                      : order.order.totalPages
                  }
                  isClosed={isClosed}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={[0, 50, 100, 150, 200]}
                  rowsPerPage={pageSize}
                  labelRowsPerPage="Rows/page"
                />
              </div>
            </div>
          </div>
        </div>

        <Block className="px-1 px-sm-0 ">
          <Card className="card-bordered card-stretch ">
            <div className="card-inner-group">
              <div className="card-inner py-1">
                <div className="d-flex justify-content-between custom-navbar">
                  <Navbar bg="" expand="lg">
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                      <Nav className="">
                        {orderSearchData?.search === "" ? (
                          <>
                            {orderTabBar
                              .filter((val) => val.ind !== 6)
                              .map((tab, index) => (
                                <Nav.Item key={tab.ind}>
                                  <Nav.Link
                                    // href={`#${tab.title}`}
                                    className={`tab mx-1 ${
                                      isClosed === tab.ind ? "active" : ""
                                    }`}
                                    onClick={() =>
                                      handleTabClick(tab.ind, tab.title)
                                    }
                                    // disabled={orderCount[tab.head] == 0}
                                  >
                                    <span className={`tab-label ${tab.title}`}>
                                      {tab.title.charAt(0).toUpperCase() +
                                        tab.title.slice(1)}
                                    </span>
                                    <div className={`capsule ${tab.title}`}>
                                      {index !== 6 ? (
                                        <span className="capsule-text">
                                          {orderCount[tab.head]}
                                        </span>
                                      ) : (
                                        <span className="capsule-text">
                                          {searchOrderValue.TotalCount}
                                        </span>
                                      )}
                                    </div>
                                  </Nav.Link>
                                </Nav.Item>
                              ))}
                            <div className="opacity-0">
                              <Nav.Item>
                                <Nav.Link href="" className={`tab  active`}>
                                  <span className={`tab-label `}>
                                    Search-Result
                                  </span>
                                  <div className={`capsule `}>
                                    <span className="capsule-text">5</span>
                                  </div>
                                </Nav.Link>
                              </Nav.Item>
                            </div>
                          </>
                        ) : (
                          <>
                            {orderTabBar.map((tab, index) => {
                              return (
                                <Nav.Item key={tab.ind}>
                                  <Nav.Link
                                    // href="javascript:void(0)"
                                    className={`tab  ${
                                      isClosed === index ? "active" : ""
                                    }`}
                                  >
                                    <span
                                      className={`tab-label  ${isClosed ===
                                        index && tab.title}`}
                                    >
                                      {tab.title.charAt(0).toUpperCase() +
                                        tab.title.slice(1)}
                                    </span>
                                    <div
                                      className={`capsule ${isClosed ===
                                        index && tab.title}`}
                                    >
                                      {index !== 6 ? (
                                        <span className="capsule-text">
                                          {orderCount[tab.head]}
                                        </span>
                                      ) : (
                                        <span className="capsule-text">
                                          {order.searchResults.TotalCount}
                                        </span>
                                      )}
                                    </div>
                                  </Nav.Link>
                                </Nav.Item>
                              );
                            })}
                          </>
                        )}

                        <div className={`tab-indicator-order ${trans}`} />
                      </Nav>
                    </Navbar.Collapse>
                  </Navbar>

                  <div className="d-flex align-items-center ">
                    <UncontrolledDropdown
                      isOpen={modelFilter}
                      toggle={toggleFilter}
                      className="user-dropdown"
                    >
                      <DropdownToggle tag="a" className="dropdown-toggle ">
                        <div className="filter-button-dropdown">
                          <Icon
                            name="filter"
                            className="fs-4 filter-icon"
                          ></Icon>
                        </div>
                      </DropdownToggle>
                      <DropdownMenu
                        end
                        className="mt-2"
                        style={{
                          minWidth: "350px",
                          maxWidth: "350px",
                          height: "auto",
                        }}
                      >
                        <div className="dropdown-body d-flex">
                          <div
                            className="bg-light-pink ps-2"
                            style={{
                              minWidth: "150px",
                              maxWidth: "150px",
                              height: "auto",
                            }}
                          >
                            <p className="fw-bolder fs-4">Filter</p>

                            <div>
                              <ul className="">
                                {filterTabData?.map((tab, index) => (
                                  <li
                                    key={index}
                                    style={{
                                      fontSize: "16px",
                                      marginBottom: "9px",
                                      cursor: "pointer",
                                    }}
                                    className={`fw-medium ps-1 rounded-2 cursor-pointer ${
                                      activeTab === index ? "bg-white" : ""
                                    }`}
                                    onClick={() => setActiveTab(index)}
                                  >
                                    {tab.title}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="tab-content w-75 h-100 ">
                            {filterTabData?.map((tab, index) => (
                              <div
                                key={index}
                                className={`tab-pane fade ${
                                  activeTab === index ? "show active" : ""
                                }`}
                              >
                                {index === 0 ||
                                index === 1 ||
                                index === 3 ||
                                index === 4 ? (
                                  <FilterDateComponent
                                    filterList={
                                      filterTabData[activeTab]?.filterList
                                    }
                                    onFilterSelect={handleFilterSelection}
                                    selectedFilter={selectedFilter}
                                  />
                                ) : index === 2 || index === 5 ? (
                                  <FilterAmountComponent
                                    minAmount={minAmount}
                                    maxAmount={maxAmount}
                                    onMinAmountChange={(newMinAmount) =>
                                      setMinAmount(newMinAmount)
                                    }
                                    onMaxAmountChange={(newMaxAmount) =>
                                      setMaxAmount(newMaxAmount)
                                    }
                                  />
                                ) : (
                                  <FilterSortComponent
                                    filterList={
                                      filterTabData[activeTab]?.filterList
                                    }
                                    onFilterSelect={handleSortFilterSelection}
                                    selectedSortFilter={selectedSortFilter}
                                    sortByOrderNo={sortByOrderNo}
                                    sortByOrderDate={sortByOrderDate}
                                    sortByTrialDate={sortByTrialDate}
                                    sortByDeliveredDate={sortByDeliveredDate}
                                  />
                                )}
                              </div>
                            ))}
                            <div
                              className=" ms-1 mt-3 me-3"
                              style={{ minHeight: "70px" }}
                            >
                              {selectedFilter === 6 && (
                                <div
                                  style={{ backgroundColor: "#f5f5f5" }}
                                  className="p-1"
                                >
                                  <div className="d-flex rounded-3 align-items-center date-picker">
                                    <div className="me-2">
                                      <span className="fw-bolder">
                                        From Date
                                      </span>
                                      <div className="position-relative d-flex">
                                        <DatePicker
                                          className="rounded-2 border-light date-picker-input"
                                          selected={startDate}
                                          dateFormat="dd/MM"
                                          onChange={(date) =>
                                            setStartDate(date)
                                          }
                                        />
                                        <Icon
                                          name="calender-date"
                                          className="position-absolute date-picker-icon "
                                        ></Icon>
                                      </div>
                                    </div>

                                    <div>
                                      <span className="fw-bolder me-2 ms-3">
                                        To Date
                                      </span>
                                      <div className="position-relative d-flex">
                                        <DatePicker
                                          className="rounded-2 border-light date-picker-input"
                                          selected={endDate}
                                          dateFormat="dd/MM"
                                          onChange={(date) => setEndDate(date)}
                                        />
                                        <Icon
                                          name="calender-date"
                                          className="position-absolute date-picker-icon"
                                        ></Icon>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="d-flex justify-content-center ">
                              <Button
                                // color="primary"
                                className=" m-2 align-center btn-custom"
                                onClick={handleCancelFilter}
                              >
                                Cancle
                              </Button>
                              <Button
                                id="BtnOrdTrckrFilter"
                                // color="primary"
                                className=" m-2 align-center btn-custom"
                                // onClick={() =>
                                //   handleAction(
                                //     "BtnOrdTrckrFilter",
                                //     "action",
                                //     handleFilter

                                //   )
                                // }
                                onClick={handleFilter}
                              >
                                Show Results
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DropdownMenu>
                    </UncontrolledDropdown>

                    <div className="filter-button ">
                      <ul className="d-flex align-items-center">
                        <UncontrolledDropdown
                          isOpen={modelColumns}
                          toggle={toggleDropdown}
                          className="user-dropdown"
                        >
                          <DropdownToggle tag="a" className="dropdown-toggle">
                            <li className="custom-icon">
                              <Icon name="setting" className="setting-icon" />
                            </li>
                          </DropdownToggle>
                          <DropdownMenu end className=" dropdown-menu-s1 ">
                            <div className="dropdown-body">
                              <div className="nk-notification">
                                <CustomColumnChooser
                                  columns={columns}
                                  hiddenColumns={hidden}
                                  onColumnToggle={handleColumnToggle}
                                />
                              </div>
                            </div>
                            <div className="dropdown-foot center">
                              <div className="d-flex">
                                <Button
                                  outline
                                  color="light"
                                  onClick={handleCancel}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  color="dark"
                                  id="BtnOrdTrckrColSet"
                                  className="ms-2"
                                  // onClick={() =>
                                  //   handleAction(
                                  //     "BtnOrdTrckrColSet",
                                  //     "action",
                                  //     handleApply,
                                  //     null
                                  //     // balanceData.balanceData
                                  //   )
                                  // }
                                  onClick={handleApply}
                                >
                                  Apply
                                </Button>
                              </div>
                            </div>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                        <li className="h-line"></li>
                        <HelpComment />
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-inner p-0 order-table">
                <div className="ordered-table">
                  {isClosed === 6 ? (
                    <OrderSearch
                      onSelectAllChange={handleSelectRowsChange}
                      onSelectRowsChange={handleSelectRowsChange}
                      onSelectAllRows={handleSelectAllRows}
                      columns={columns}
                      hiddenColumns={hidden}
                      currentPage={currentPage}
                      pageSize={pageSize}
                      // activeTab={activeTab}
                      // selectedFilter={selectedFilter}
                    />
                  ) : isClosed === 0 ? (
                    <OrderUnderBooking
                      onSelectAllChange={handleSelectRowsChange}
                      onSelectRowsChange={handleSelectRowsChange}
                      onSelectAllRows={handleSelectAllRows}
                      columns={columns}
                      hiddenColumns={hidden}
                      currentPage={currentPage}
                      pageSize={pageSize}
                    />
                  ) : isClosed === 2 ? (
                    <OrderFresh
                      onSelectAllChange={handleSelectRowsChange}
                      onSelectRowsChange={handleSelectRowsChange}
                      onSelectAllRows={handleSelectAllRows}
                      columns={columns}
                      hiddenColumns={hidden}
                      currentPage={currentPage}
                      pageSize={pageSize}
                      // activeTab={activeTab}
                      // selectedFilter={selectedFilter}
                    />
                  ) : isClosed === 3 ? (
                    <OrderUnderProcess
                      onSelectAllChange={handleSelectRowsChange}
                      onSelectRowsChange={handleSelectRowsChange}
                      onSelectAllRows={handleSelectAllRows}
                      columns={columns}
                      hiddenColumns={hidden}
                      currentPage={currentPage}
                      pageSize={pageSize}
                      // activeTab={activeTab}
                      // selectedFilter={selectedFilter}
                    />
                  ) : isClosed === 4 ? (
                    <OrderReadyDelivery
                      onSelectAllChange={handleSelectRowsChange}
                      onSelectRowsChange={handleSelectRowsChange}
                      onSelectAllRows={handleSelectAllRows}
                      columns={columns}
                      hiddenColumns={hidden}
                      currentPage={currentPage}
                      pageSize={pageSize}
                      // activeTab={activeTab}
                      // selectedFilter={selectedFilter}
                    />
                  ) : isClosed === 5 ? (
                    <OrderDelivered
                      onSelectAllChange={handleSelectRowsChange}
                      onSelectRowsChange={handleSelectRowsChange}
                      onSelectAllRows={handleSelectAllRows}
                      columns={columns}
                      hiddenColumns={hidden}
                      currentPage={currentPage}
                      pageSize={pageSize}
                      // activeTab={activeTab}
                      // selectedFilter={selectedFilter}
                    />
                  ) : isClosed === 6 ? (
                    <OrderAll
                      onSelectAllChange={handleSelectRowsChange}
                      onSelectRowsChange={handleSelectRowsChange}
                      onSelectAllRows={handleSelectAllRows}
                      columns={columns}
                      hiddenColumns={hidden}
                      currentPage={currentPage}
                      pageSize={pageSize}
                    />
                  ) 
                   : isClosed === 7 ? (
                    <OrderAll
                      onSelectAllChange={handleSelectRowsChange}
                      onSelectRowsChange={handleSelectRowsChange}
                      onSelectAllRows={handleSelectAllRows}
                      columns={columns}
                      hiddenColumns={hidden}
                      currentPage={currentPage}
                      pageSize={pageSize}
                    />
                  ) : (
                    <p>No data found</p>
                  )}
                </div>
              </div>

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
                    position: "absolute",
                    boxShadow: isSidebarOpen
                      ? "-10px 0px 50px #00000085"
                      : "none",
                    overflowY: "auto",
                  }}
                >
                  <DeleteSlider
                    toggleSidebar={toggleSidebar}
                    selectedRows={selectedRows}
                  />
                </div>
              </div>
            </div>
          </Card>
        </Block>
      </Content>
    </>
  );
};

export default OrderTracker;

import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Dropdown, DropdownItem, Spinner } from "reactstrap";
import Head from "../../../Layout/head/Head";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import Content from "../../../Layout/Content/Content";
import { Block } from "../../../Components/Block/Block";
import { DropdownToggle, DropdownMenu, UncontrolledDropdown } from "reactstrap";
import Icon from "../../../Components/icon/Icon";

import Status from "../../../Layout/header/dropdown/status/Status";
import DatePicker from "react-datepicker";

import { itemTabBar } from "../CommonTracker/itemTabBar";
import CustomColumnChooser from "../CommonTracker/CustomColumnChooser";
import CustomPagination from "../CommonTracker/CustomPagination";
import ActionCard from "../../../Components/ActionCard/ActionCard";
import HelpComment from "../../../Layout/header/dropdown/help/HelpComment";
import Export from "../../../Layout/header/dropdown/export/Export";
import { useDispatch, useSelector } from "react-redux";
import { getBranch } from "../../../redux/actions/branchAction";
import FilterDateComponent from "../CommonTracker/FilterDateComponent";
import { filterTabData } from "../CommonTracker/filterTabData";
import {
  createDebouncedSearchItem,
  getItemDetailsAsyncData,
  searchItem,
  sortItemData,
} from "../../../redux/actions/itemDetailAction";
import ItemPending from "./Pending/ItemPending";
import ItemUnderProduction from "./UnderProduction/ItemUnderProduction";
import ItemReadyForTrial from "./ReadyForTrial/ItemReadyForTrial";
import ItemReadyForDelivery from "./ReadyForDelivery/ItemReadyForDelivery";
import ItemDelivered from "./Delivered/ItemDelivered";
import FilterAmountComponent from "../CommonTracker/FilterAmountComponent";
import FilterSortComponent from "../CommonTracker/FilterSortComponent";
import ItemSearch from "./searched/ItemSearch";
import {
  getColumnListData,
  updateColumnListData,
} from "../../../redux/actions/columnListAction";
// import DeleteSlider from "./ItemCustomTableCells/DeleteSlider";
import Cimages from "./../Images/CommonImageFile";
import Cicon from "./../Images/CommonIconFile";
import { getItemCount } from "../../../redux/actions/orderCount";
import ItemAll from "./AllItem/ItemAll";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { usePermissions } from "../../../Layout/Provider/PermissionsContext";
import { getConfig } from "../../../redux/actions/configAction";

const ItemHomePage = () => {
  const token = localStorage.getItem("token");
  // const user = useSelector((state) => state.loginUser);
  const config = useSelector((state) => state?.config);
  const itemCount = useSelector((state) => state?.orderCount.itemCount);
  const itemData = useSelector((state) => state?.itemDetails);
  const columList = useSelector((state) => state?.columnsDetails);
  // const searchStatus = useSelector((state) => state?.itemDetails);
  const dispatch = useDispatch();
  const BranchId = localStorage.getItem("BranchId");
  const BU_Id = localStorage.getItem("BU_Id");
  const userId = localStorage.getItem("userId");
  const CompanyId = config?.orderType?.CompanyId;
  const [isClosed, setIsClosed] = useState(0);
  const [visibleColumn, setVisibleColumns] = useState([]);
  const itemSearchValue = useSelector((state) => state?.itemDetails.itemSearch);
  const navigate = useNavigate();

  //role management logic start=====================================================================
  const { handleAction } = usePermissions();
  const rolePermission = useSelector(
    (state) => state.permissionByRoleReducer.rolePermission.Data
  );
  const allowedPageCodes = rolePermission?.flatMap((module) =>
    module.PAGE.map((page) => page.PageCode)
  );
  const [toastShown, setToastShown] = useState(false);
  useEffect(() => {
    if (BU_Id) {
      dispatch(getConfig(BU_Id));
    }
  }, []);
  useEffect(() => {
    if (!toastShown && rolePermission) {
      if (allowedPageCodes?.some((code) => code?.includes("PgItemTracker"))) {
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
  //role management logic end=================================================================================

  useEffect(() => {
    setPageSize(50);
    setCurrentPage(0);
  }, [isClosed]);

  useEffect(() => {
    setIsClosed(0);
  }, []);

  const handleTabClick = (ind, title) => {
    if (itemSearchData.search !== "") {
      setIsClosed(6);
      setColumns([]);
      setTrans("SearchResult");
    } else {
      setIsClosed(ind);
      setColumns([]);
      setTrans(title);
    }
  };

  const itemSearchData = useSelector((state) => state.itemSerachData);

  // useEffect(() => {
  //   if (itemData.searchStatus) {
  //     setIsClosed(5);
  //     setColumns([]);
  //     setTrans("search-result");
  //   } else {
  //     setIsClosed(0);
  //     setColumns([]);
  //     setTrans("under-booking");
  //   }
  // }, [itemData.searchStatus]);

  useEffect(() => {
    if (itemSearchData.search != undefined && itemSearchData.search !== "") {
      setIsClosed(6);
      setColumns([]);
      setTrans("SearchResult");
    } else {
      setIsClosed(0);
      setColumns([]);
      setTrans("UnderBooking");
    }
  }, [itemSearchData]);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);

  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectRowsChange = (selectedRows) => {
    setSelectedRows(selectedRows);
  };
  const handleSelectAllRows = (selectedRows) => {
    setSelectedRows(selectedRows);
  };

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [modelColumns, setModelColumns] = useState(false);
  const [columns, setColumns] = useState([]);
  const [trans, setTrans] = useState("UnderBooking"); // Set an initial tab

  let newVisibleColumns = [];
  const [tableName, setTableName] = useState("TblOmsItemTracrPanding");
  const [hidden, setHidden] = useState([]);

  let newColumns = [];
  useEffect(() => {
    const handleColumns = () => {
      switch (isClosed) {
        case 0:
          setTableName("TblOmsItemTracrPanding");
          newColumns = [
            { name: "service1", title: " SERVICE#" },
            { name: "customer", title: "CUSTOMER" },
            { name: "status", title: "STATUS" },
            { name: "service2", title: "SERVICE" },
            { name: "description", title: "DESCRIPTION" },
            { name: "fabric", title: "FABRIC" },
            { name: "accessory", title: "ACCESSORY" },
            { name: "commitment", title: "COMMITMENT" },
            { name: "lastActivity", title: "LAST ACTIVITY" },
            { name: "remarks", title: "REMARKS" },
            { name: "itemLocation", title: "ITEM LOCATION" },
            // { name: "deliveryAddress", title: "DELIVERY ADDRESS" },
            // { name: "shipmentInfo", title: "SHIPMENT INFO" },
            { name: "more", title: " " },
          ];
          break;
        case 1:
          setTableName("TblOmsItemTracrUP");
          newColumns = [
            { name: "service1", title: " SERVICE#" },
            { name: "customer", title: "CUSTOMER" },
            { name: "status", title: "STATUS" },
            { name: "service2", title: "SERVICE" },
            { name: "description", title: "DESCRIPTION" },
            { name: "fabric", title: "FABRIC" },
            { name: "accessory", title: "ACCESSORY" },
            { name: "commitment", title: "COMMITMENT" },
            { name: "worker", title: "WORKER" },
            { name: "lastActivity", title: "LAST ACTIVITY" },
            // { name: "issuedOn", title: "ISSUED ON" },
            { name: "trialCount", title: "TRIAL COUNT" },
            { name: "remarks", title: "REMARKS" },
            { name: "itemLocation", title: "ITEM LOCATION" },
            // { name: "shipmentInfo", title: "SHIPMENT INFO" },
            { name: "more", title: " " },
          ];
          break;
        case 2:
          setTableName("TblOmsItemTracrRT");
          newColumns = [
            { name: "service1", title: " SERVICE#" },
            { name: "customer", title: "CUSTOMER" },
            { name: "status", title: "STATUS" },
            { name: "service2", title: "SERVICE" },
            { name: "description", title: "DESCRIPTION" },
            { name: "fabric", title: "FABRIC" },
            { name: "accessory", title: "ACCESSORY" },

            { name: "commitment", title: "COMMITMENT" },

            { name: "worker", title: "WORKER" },
            { name: "lastActivity", title: "LAST ACTIVITY" },
            // { name: "issuedOn", title: "ISSUED ON" },
              { name: "trialCount", title: "TRIAL COUNT" },
            { name: "remarks", title: "REMARKS" },
            { name: "itemLocation", title: "ITEM LOCATION" },
            // { name: "shipmentInfo", title: "SHIPMENT INFO" },
            { name: "more", title: " " },
          ];
          break;
        case 3:
          setTableName("TblOmsItemTracrRD");
          newColumns = [
            { name: "service1", title: " SERVICE#" },
            { name: "customer", title: "CUSTOMER" },
            { name: "status", title: "STATUS" },
            { name: "service2", title: "SERVICE" },
            { name: "description", title: "DESCRIPTION" },
            { name: "fabric", title: "FABRIC" },
            { name: "accessory", title: "ACCESSORY" },

            { name: "commitment", title: "COMMITMENT" },

            { name: "readyOn", title: "READY ON" },
            { name: "lastActivity", title: "LAST ACTIVITY" },
            { name: "remarks", title: "REMARKS" },
            { name: "trialCount", title: "TRIAL COUNT" },
            { name: "itemLocation", title: "ITEM LOCATION" },
            { name: "shipmentInfo", title: "SHIPMENT INFO" },
            { name: "more", title: " " },
          ];
          break;
        case 4:
          setTableName("TblOmsItemTracrDlrd");
          newColumns = [
            { name: "service1", title: " SERVICE#" },
            { name: "customer", title: "CUSTOMER" },
            { name: "status", title: "STATUS" },
            { name: "service2", title: "SERVICE" },
            { name: "description", title: "DESCRIPTION" },
            { name: "fabric", title: "FABRIC" },
            { name: "accessory", title: "ACCESSORY" },

            { name: "commitment", title: "COMMITMENT" },

            { name: "deliveredOn", title: "DELIVERED ON" },
            { name: "lastActivity", title: "LAST ACTIVITY" },
            { name: "remarks", title: "REMARKS" },
            // { name: "rating", title: "RATING" },
            { name: "shipmentInfo", title: "SHIPMENT INFO" },
            { name: "more", title: " " },
          ];
          break;
        case 6:
          newColumns = [
            { name: "service1", title: " SERVICE#" },
            { name: "customer", title: "CUSTOMER" },
            { name: "status", title: "STATUS" },
            { name: "service2", title: "SERVICE" },
            { name: "description", title: "DESCRIPTION" },
            { name: "fabric", title: "FABRIC" },
            { name: "accessory", title: "ACCESSORY" },

            { name: "commitment", title: "COMMITMENT" },
            // //
            { name: "lastActivity", title: "LAST ACTIVITY" },

            { name: "more", title: " " },
          ];
          break;
        case 5:
          setTableName("TblOmsItemTracrPanding");
          newColumns = [
            { name: "service1", title: " SERVICE#" },
            { name: "customer", title: "CUSTOMER" },
            { name: "status", title: "STATUS" },
            { name: "service2", title: "SERVICE" },
            { name: "description", title: "DESCRIPTION" },
            { name: "fabric", title: "FABRIC" },
            { name: "accessory", title: "ACCESSORY" },

            { name: "commitment", title: "COMMITMENT" },

            { name: "lastActivity", title: "LAST ACTIVITY" },
            { name: "remarks", title: "REMARKS" },
            { name: "itemLocation", title: "ITEM LOCATION" },
            { name: "deliveryAddress", title: "DELIVERY ADDRESS" },
            // { name: "shipmentInfo", title: "SHIPMENT INFO" },
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
        dispatch(getColumnListData(userId, tableName));
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
      if (hidden.includes(columnName)) {
        // If the column is in hidden, add it to visibleColumn
        return [...prevVisibleColumns, columnName];
      } else {
        // If the column is not in hidden, remove it from visibleColumn
        return prevVisibleColumns.filter((col) => col !== columnName);
      }
    });
  };
  const toggleDropdown = () => {
    setModelColumns(!modelColumns);
  };
  const handleApply = () => {
    dispatch(updateColumnListData(userId, tableName, visibleColumn));
    setModelColumns(false); // Close the dropdown
  };

  const handleCancel = () => {
    setModelColumns(false); // Close the dropdown
  };

  const [modelFilter, setModelFilter] = useState(false);
  const toggleFilter = () => {
    setModelFilter(!modelFilter);
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

  const [activeTab, setActiveTab] = useState();

  const [selectedFilter, setSelectedFilter] = useState(0);

  const handleFilterSelection = (filter) => {
    setSelectedFilter(filter);
  };
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  // const handleDelete = () => {
  //   setSidebarOpen(true);
  // };

  const toggleSidebar = (isOpen) => {
    setSidebarOpen(isOpen);
    // if (deleteFragment === "") {
    //   setIsClosed(0);
    // } else if (deleteFragment === "fresh-order") {
    //   setIsClosed(1);
    // } else if (deleteFragment === "under-process") {
    //   setIsClosed(2);
    // } else if (deleteFragment === "ready-delivery") {
    //   setIsClosed(3);
    // } else if (deleteFragment === "delivered") {
    //   setIsClosed(4);
    // }
  };
  const [selectedSortFilter, setSelectedSortFilter] = useState(0);

  const [sortByOrderNo, setSortByOrderNo] = useState(true);
  const [sortByOrderDate, setSortByOrderDate] = useState(true);
  const [sortByTrialDate, setSortByTrialDate] = useState(true);
  const [sortByDeliveredDate, setSortByDeliveredDate] = useState(true);

  const handleSortFilterSelection = (filterIndex) => {
    if (filterIndex === 0) {
      setSelectedSortFilter(0);
      const sortedData = itemData?.item?.orderItemList?.sort(customOrderNo);
      dispatch(sortItemData(sortedData));
      setSortByOrderNo(!sortByOrderNo);
      // setSortByOrderNo((prevSort) => (prevSort === "asc" ? "desc" : "asc"));
    } else if (filterIndex === 1) {
      setSelectedSortFilter(1);
      const sortedData = itemData?.item?.orderItemList?.sort(customOrderDate);
      dispatch(sortItemData(sortedData));
      setSortByOrderDate(!sortByOrderDate);
    } else if (filterIndex === 2) {
      setSelectedSortFilter(2);
      const sortedData = itemData?.item?.orderItemList?.sort(customTrialDate);
      dispatch(sortItemData(sortedData));
      setSortByTrialDate(!sortByTrialDate);
    } else if (filterIndex === 3) {
      setSelectedSortFilter(3);
      const sortedData = itemData?.item?.orderItemList?.sort(
        customDeliveryDate
      );
      dispatch(sortItemData(sortedData));
      setSortByDeliveredDate(!sortByDeliveredDate);
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
    const first = new Date(a.orderHead.TOrdDate);
    const second = new Date(b.orderHead.TOrdDate);

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

  const handleOrder = () => {
    setOrder(true);
  };

  //pagination logic----------------

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const [maxAmount, setMaxAmount] = useState(25000);
  const [minAmount, setMinAmount] = useState(0);
  const [isOpenDropdown, setisOpenDropdown] = useState(false);

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setCurrentPage(0);

    if (newRowsPerPage == 0) {
      setPageSize(itemData.item.TotalCount);
    } else {
      setPageSize(newRowsPerPage);
    }
  };
  const [refreshLoader, setRefreshLoader] = useState(false);
  const handleRefresh = async () => {
    setRefreshLoader(true);
    try {
      if (activeTab !== 6 && BranchId && BU_Id) {
        // await dispatch(getItemCount());
        await dispatch(
          getItemDetailsAsyncData(
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
          )
        ).then((res) => {
          if (res.success) {
            setRefreshLoader(false);
          }
        });
        //     //   }
        //     // }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   // if (BranchId) {
  //   dispatch(getBranch(BranchId));
  //   // }
  // }, [BranchId]);

  const fetchData = async () => {
    try {
      if (activeTab !== 6 && BranchId && BU_Id) {
        await dispatch(
          getItemDetailsAsyncData(
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
          )
        );
        //     //   }
        //     // }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCount = async () => {
    try {
      if (activeTab !== 6 && BranchId && BU_Id) {
        await dispatch(getItemCount());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedSearchRef = useRef(createDebouncedSearchItem());

  useEffect(() => {
    // if (isClosed === 6) {
    //   setSearchLoader(true);
    //   dispatch(
    //     searchItem(
    //       currentPage,
    //       pageSize,
    //       BU_Id,
    //       itemSearchData.itemSwitchStatus,
    //       itemSearchData.search,
    //       itemSearchData.searchStatus
    //     )
    //   ).then((res) => {
    //     if (res.success) {
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
          itemSearchData.itemSwitchStatus,
          itemSearchData.search,
          itemSearchData.searchStatus
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
  }, [itemSearchData, isClosed, dispatch, currentPage, pageSize]);

  const [serachLoader, setSearchLoader] = useState(false);

  useEffect(() => {
    if (isClosed < 6 && BU_Id != null) {
      fetchCount();
    }
  }, [BranchId, BU_Id, CompanyId]);
  useEffect(() => {
    if (isClosed < 6 && BU_Id != null) {
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
    // itemSearchData
    // itemSearchData.search
  ]);
  return (
    <>
      <Head title="Item Tracker"></Head>
      <Content>
        {/* <div className="d-felx justify-end">
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
            <div className="d-flex align-items-center refresh-Icon">
              {refreshLoader ? (
                <Spinner size="sm" className="mx-1 " />
              ) : (
                <img
                  src={Cicon.UndoIcon}
                  alt="UndoIcon"
                  id="handleRefresh"
                  className="fw-bolder fs-3 m-1 me-1 ms-2 cursor-pointer "
                  // onClick={() =>
                  //   handleAction(
                  //     "BtnItemTrckrRef",
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
                      {/* <img
                        src={Cicon.DeleteIcon}
                        alt="DeleteIcon"
                        className="fw-bolder fs-3 m-1 me-3 "
                        onClick={handleDelete}
                      /> */}
                      {/* <img
                        src={Cicon.EmailIcon}
                        alt="EmailIcon"
                        className="fw-bolder fs-3 m-1 me-3 "
                      />
                      <img
                        src={Cicon.PrintIcon}
                        alt="PrintIcon"
                        className="fw-bolder fs-3 m-1 me-3 "
                      /> */}

                      {/* <div className="add-custom-width">
                        <Status setisOpenDropdown={setisOpenDropdown} />
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center  export-pagination-container col-md-8 justify-content-md-end">
            <div className="d-flex export-buton">
              <Export ic={isClosed} />
            </div>
            <div className="d-felx  align-items-center ml-3 custom-ml-0">
              <div className="pagination bg-white rounded-10">
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={
                    isClosed == 6
                      ? itemSearchValue.totalPages
                      : itemData.item.totalPages
                  }
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={[0, 50, 100, 150, 200]}
                  rowsPerPage={pageSize}
                  labelRowsPerPage="Rows/page"
                  isClosed={isClosed}
                />
              </div>
            </div>
          </div>
        </div>

        <Block className="px-1 px-sm-0">
          <Card className="card-bordered card-stretch">
            <div className="card-inner-group">
              <div className="card-inner py-1">
                <div className="d-flex justify-content-between custom-navbar">
                  <Navbar bg="" expand="lg">
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                      <Nav className="mr-auto">
                        {itemSearchData.search === "" ? (
                          <>
                            {itemTabBar
                              .filter((val) => val.ind !== 6)
                              .map((tab, index) => (
                                <Nav.Item key={tab.ind}>
                                  <Nav.Link
                                    // href={`#${tab.title}`}
                                    className={`tab ${
                                      isClosed === index ? "active" : ""
                                    }`}
                                    onClick={() =>
                                      handleTabClick(index, tab.title)
                                    }
                                  >
                                    <span className={`tab-label ${tab.title}`}>
                                      {tab.name.charAt(0).toUpperCase() +
                                        tab.name.slice(1)}
                                    </span>

                                    <div className={`capsule ${tab.title}`}>
                                      {index < 6 ? (
                                        <span className="capsule-text">
                                          {itemCount[tab.title]}
                                        </span>
                                      ) : (
                                        <span className="capsule-text">
                                          {itemSearchValue.TotalCount}
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
                                    <span className="capsule-text"></span>
                                  </div>
                                </Nav.Link>
                              </Nav.Item>
                            </div>
                          </>
                        ) : (
                          <>
                            {itemTabBar.map((tab, index) => {
                              return (
                                <Nav.Item key={tab.ind}>
                                  <Nav.Link
                                    // href="javascript:void(0)"
                                    className={`tab ${
                                      isClosed === index ? "active" : ""
                                    }`}
                                    // onClick={() =>
                                    //   handleTabClick(index, tab.title)
                                    // }
                                  >
                                    <span className={`tab-label ${tab.title}`}>
                                      {tab.title.charAt(0).toUpperCase() +
                                        tab.title.slice(1)}
                                    </span>
                                    <div className={`capsule ${tab.title}`}>
                                      {index < 6 ? (
                                        <span className="capsule-text">
                                          {itemCount[tab.title]}
                                        </span>
                                      ) : (
                                        <span className="capsule-text">
                                          {itemData.itemSearch.TotalCount}
                                        </span>
                                      )}
                                    </div>
                                  </Nav.Link>
                                </Nav.Item>
                              );
                            })}
                          </>
                        )}

                        <div className={`tab-indicator ${trans}`} />
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
                                {filterTabData.map((tab, index) => (
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
                          <div className="tab-content w-75 h-100 relative ">
                            {filterTabData.map((tab, index) => (
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
                                  // Render a different component for other indices
                                  // <OtherComponent />
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
                                  // Replace "OtherComponent" with the component you want to render
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
                                          // showMonthYearDropdown
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
                            <div className="d-flex justify-content-center absolute bottom-2">
                              <Button
                                // color="primary"
                                className=" m-2 align-center btn-custom "
                                onClick={handleCancelFilter}
                              >
                                Cancle
                              </Button>
                              <Button
                                // color="primary"
                                id="BtnItemTrckrFilter"
                                className="m-2 align-center btn-custom"
                                // onClick={() =>
                                //   handleAction(
                                //     "BtnItemTrckrFilter",
                                //     "action",
                                //     handleFilter,

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
                                  className="ms-2"
                                  // onClick={() =>
                                  //   handleAction(
                                  //     "BtnItemTrckrColSet",
                                  //     "action",
                                  //     handleApply,
                                  //     null

                                  //   )
                                  // }
                                  onClick={handleApply}
                                  id="BtnItemTrckrColSet"
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
                  {isClosed === 6 && Object.keys(itemSearchValue).length > 0 ? (
                    <ItemSearch
                      onSelectAllChange={handleSelectRowsChange}
                      onSelectRowsChange={handleSelectRowsChange}
                      onSelectAllRows={handleSelectAllRows}
                      // columns={columns}
                      hiddenColumns={hidden}
                      currentPage={currentPage}
                      pageSize={pageSize}
                      // currentPage={ currentPage}
                      // BU_Id={BU_Id}
                      // isClosed={isClosed}
                      // BU_Id isClosed}
                    />
                  ) : isClosed === 0 ? (
                    <ItemPending
                      onSelectAllChange={handleSelectRowsChange}
                      onSelectRowsChange={handleSelectRowsChange}
                      onSelectAllRows={handleSelectAllRows}
                      // columns={columns}
                      hiddenColumns={hidden}
                      currentPage={currentPage}
                      pageSize={pageSize}
                      // currentPage={ currentPage}
                      // BU_Id={BU_Id}
                      // isClosed={isClosed}
                      // BU_Id isClosed}
                    />
                  ) : isClosed === 1 ? (
                    <ItemUnderProduction
                      onSelectAllChange={handleSelectRowsChange}
                      onSelectRowsChange={handleSelectRowsChange}
                      onSelectAllRows={handleSelectAllRows}
                      // columns={columns}
                      hiddenColumns={hidden}
                      currentPage={currentPage}
                      pageSize={pageSize}
                      // currentPage={ currentPage}
                      // BU_Id={BU_Id}
                      // isClosed={isClosed}
                      // BU_Id isClosed}
                    />
                  ) : isClosed === 2 ? (
                    <ItemReadyForTrial
                      onSelectAllChange={handleSelectRowsChange}
                      onSelectRowsChange={handleSelectRowsChange}
                      onSelectAllRows={handleSelectAllRows}
                      // columns={columns}
                      hiddenColumns={hidden}
                      currentPage={currentPage}
                      pageSize={pageSize}
                      // currentPage={ currentPage}
                      // BU_Id={BU_Id}
                      // isClosed={isClosed}
                      // BU_Id isClosed}
                    />
                  ) : isClosed === 3 ? (
                    <ItemReadyForDelivery
                      onSelectAllChange={handleSelectRowsChange}
                      onSelectRowsChange={handleSelectRowsChange}
                      onSelectAllRows={handleSelectAllRows}
                      // columns={columns}
                      hiddenColumns={hidden}
                      currentPage={currentPage}
                      pageSize={pageSize}
                      // currentPage={ currentPage}
                      // BU_Id={BU_Id}
                      // isClosed={isClosed}
                      // BU_Id isClosed}
                    />
                  ) : isClosed === 4 ? (
                    <ItemDelivered
                      onSelectAllChange={handleSelectRowsChange}
                      onSelectRowsChange={handleSelectRowsChange}
                      onSelectAllRows={handleSelectAllRows}
                      // columns={columns}
                      hiddenColumns={hidden}
                      currentPage={currentPage}
                      pageSize={pageSize}
                      // currentPage={ currentPage}
                      // BU_Id={BU_Id}
                      // isClosed={isClosed}
                      // BU_Id isClosed}
                    />
                  ) : isClosed === 5 ? (
                    <ItemAll
                      onSelectAllChange={handleSelectRowsChange}
                      onSelectRowsChange={handleSelectRowsChange}
                      onSelectAllRows={handleSelectAllRows}
                      // columns={columns}
                      hiddenColumns={hidden}
                      currentPage={currentPage}
                      pageSize={pageSize}
                    />
                  ) : null}
                </div>
              </div>
              {/* <div
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
                  }}
                >
                  <DeleteSlider
                    toggleSidebar={toggleSidebar}
                    selectedRows={selectedRows}
                    // setFragment={setFragment}
                    // allSelectedRows={}
                  />
                </div>
              </div> */}
            </div>
          </Card>
        </Block>
      </Content>
    </>
  );
};

export default ItemHomePage;

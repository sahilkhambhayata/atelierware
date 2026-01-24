import React, { useEffect, useState } from "react";
// import odertableBarcodeIcon from "../../../../images/icons/odertable-barcode.svg";
// import avatar1 from "../../../../images/avatar/order-tbl-value-img-1.png";

import Cicon from "./../../Images/CommonIconFile";
import Cimages from "./../../Images/CommonImageFile";
// import { NoDataCell } from "@devexpress/dx-react-grid-material-ui";
import {
  searchOrder,
  // getSingleOrder,
} from "../../../../redux/actions/orderDetailAction";
import Paper from "@mui/material/Paper";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnResizing,
  TableColumnVisibility,
  TableRowDetail,
  TableFixedColumns,
} from "@devexpress/dx-react-grid-material-ui";

import {
  IntegratedPaging,
  IntegratedSorting,
  PagingState,
  RowDetailState,
  SortingState,
} from "@devexpress/dx-react-grid";
import RowsDetails from "../OrderCustomTableCells/RowsDetails";
import CustomTableRow from "../OrderCustomTableCells/CustomTableRow";
import CustomOrderCell from "../OrderCustomTableCells/CustomOrderCell";
// import CustomOrderCell from "./CustomOrderCell";
import CustomCustomerCell from "../OrderCustomTableCells/CustomCustomerCell";
import CustomCommitmentsCell from "../OrderCustomTableCells/CustomCommitmentsCell";
import CustomValueCell from "../OrderCustomTableCells/CustomValueCell";
import CustomStatusCell from "../OrderCustomTableCells/CustomStatusCell";
import CustomMoreCell from "../OrderCustomTableCells/CustomMoreCell";

import { useDispatch, useSelector } from "react-redux";

import TrakerSkeleton from "../../CommonTracker/TrakerSkeleton";
import CustomDesignerCell from "../OrderCustomTableCells/CustomDesignerCell";
import EditSliderSingle from "../OrderCustomTableCells/EditSliderSingle";
import DeleteSliderSingle from "../OrderCustomTableCells/DeleteSliderSingle";
import CustomOrderType from "../OrderCustomTableCells/CustomOrderType";

// row colaps Add Component  (RowDetails)

const CustomTableRowDetail = React.memo(
  ({ val, rowDetails, customerData, balanceData }) => {
    return (
      <>
        <RowsDetails
          data={rowDetails}
          customerData={customerData}
          val={val}
          tab="other"
          balanceData={balanceData}
        />
      </>
    );
  }
);
// TableHeading
const CustomTableHeaderRow = React.memo(
  ({ selectAll, handleSelectAll, ...restProps }) => {
    return (
      <TableHeaderRow
        {...restProps}
        cellComponent={({ column, ...cellProps }) => (
          <TableHeaderRow.Cell
            {...cellProps}
            className={`table-heading position-sticky top-0 z-3   custom-${
              column.name
            }-header ${cellProps.className || ""} ${
              column.name === "more" ? "last-column-header" : ""
            } ${column.name === "order" ? "first-column-header" : ""}`}
            style={{ textAlign: "center" }}
          >
            {column.name === "order" ? (
              // Custom header cell content for the "order" column
              <>
                <div className="d-flex align-items-center justify-content-center">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="selectAllCheckbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="selectAllCheckbox"
                    ></label>
                  </div>

                  {column.sortingEnabled ? (
                    <TableHeaderRow.SortLabel column={column} />
                  ) : (
                    cellProps.children
                  )}
                </div>
              </>
            ) : // Default header cell content for other columns
            column.sortingEnabled ? (
              <TableHeaderRow.SortLabel column={column} />
            ) : (
              cellProps.children
            )}
          </TableHeaderRow.Cell>
        )}
      />
    );
  }
);

const OrderSearch = ({
  onSelectAllChange,
  onSelectRowsChange,
  onSelectAllRows,
  columns,
  hiddenColumns,
  currentPage,
  pageSize,
  // isClosed,
  // BU_Id,
}) => {
  // const eptyObj ={};

  function isObjectEmpty(order) {
    for (const key in order) {
      if (order.hasOwnProperty(key)) {
        return false; // The object has at least one property, so it's not empty
      }
    }
    return true; // The object is empty (no own properties)
  }

  //   const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const order = useSelector((state) => state?.orderDetails);
  const searchOrderData = useSelector(
    (state) => state?.orderDetails?.searchResults
  );

  const [editSidebarOpen, setEditSidebarOpen] = useState(false);
  const [selectedEditRow, setSelectedEditRow] = useState();

  const handleEdit = (id) => {
    setEditSidebarOpen(true);
    setSelectedEditRow(id);
  };

  const toggleEditSidebar = (isOpen) => {
    setEditSidebarOpen(isOpen);
  };

  useEffect(() => {
    if (isObjectEmpty(order)) {
      setIsLoading(true);
      // setDataLoaded(false);
    } else {
      setIsLoading(false);
      // setDataLoaded(true);
    }
    // setApiCallCompleted(true);
  }, [isLoading, order]);

  const [selectedRows, setSelectedRows] = useState([]);

  const [defaultColumnWidths] = useState([
    { columnName: "order", align: "left",width: 300 },
    { columnName: "ordertype", width: 150 },

    { columnName: "customer", width: 250 },
    { columnName: "commitments", width: 250 },
    { columnName: "status", width: 200 },
    { columnName: "designer", width: 200 },

    { columnName: "value", width: 170 },
    { columnName: "more",align: "right", width: 155 },
  ]);
  const [leftColumns] = useState(["order"]);
  const [rightColumns] = useState(["more"]);
  // const [rightColumns] = useState(["more"]);

  const [defaultHiddenColumnNames] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleRowSelection = (orderId) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(orderId)) {
        return prevSelectedRows.filter((id) => id !== orderId);
      } else {
        return [...prevSelectedRows, orderId];
      }
    });
  };

  useEffect(() => {
    onSelectRowsChange(selectedRows);
    if (selectedRows.length === 0) {
      setSelectAll(false);
    } else if (selectedRows.length === order?.order.orderDetails.length) {
      setSelectAll(true);
    }
  }, [selectedRows]);

  const [selectedDeleteRow, setSelectedDeleteRow] = useState();
  const handleDelete = (id) => {
    setSidebarOpen(true);
    setSelectedDeleteRow(id);
  };
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = (isOpen) => {
    setSidebarOpen(isOpen);
  };

  // const [rows, setRows] = useState([]);
  const rows = [];

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectAll(false);
      onSelectAllChange(false);
      setSelectedRows([]);
      // onSelectAllRows([]);
    } else {
      setSelectAll(true);
      onSelectAllChange(true);
      setSelectedRows(rows.map((row) => row.order.props.orderData.mainId));
      // onSelectAllRows(rows.map((row) => row.order.props.orderData.mainId));
    }
  };

  const dispatch = useDispatch();
  const BU_Id = localStorage.getItem("BU_Id");

  // useEffect(() => {
  //   if (Object.keys(searchOrderData).length > 0) {
  //     // Clear the rows state
  //     setRows([]);

  //     // Push new data into the rows state

  //   } else {
  //     setRows([]);
  //   }
  // }, [searchOrderData?.orderDetails]);

  
  searchOrderData?.orderDetails?.forEach((val, ind) => {
    rows.push({
      order: (
        <CustomOrderCell
          orderData={{
            customid: `g${val.TOrdHdID}`,
            index: ind,
            id: "#" + val.TOrdNo,
            date: val.TOrdDate,
            barcodeIcon: Cicon.odertableBarcodeIcon,
            barcodeText: val.OrdBarcode,
            mainId: `g${val.TOrdHdID}`,
            urgentData: {
              OrderPriority: val.OrderPriority,
              totalItems: val.totalItems,
              Total_Regular_Items: val.Total_Regular_Items,
              Total_Urgent_Items: val.Total_Urgent_Items,
            },
          }}
          onSelectAllChange={onSelectAllChange}
          isSelected={selectedRows.includes(`g${val.TOrdHdID}`)}
          onSelectionChange={handleRowSelection}
        />
      ),
      ordertype: (
        <CustomOrderType
          orderTypeData={{
            customid: `g${val?.TOrdHdID}`,
            index: ind,
            orderType: val.MstOrderType.OrderType,
            data: val,
          }}
        />
      ),
      customer: (
        <CustomCustomerCell
          customerData={{
            index: ind,
            customerName: val ? val?.CustName?.slice(0, 15) : "false",
            customerMail:
              order?.order.EnableDataPrivacy == 1 ? val.MaskedEmail : val.Email,
            customerPhoneNumber:
              order?.order.EnableDataPrivacy == 1
                ? val.MaskedMobNo
                : val?.MobNo,
            data: val,
            tab: "other",
          }}
        />
      ),
      commitments: (
        <CustomCommitmentsCell
          commitmentsData={{
            index: ind,
            ctriDate: val.TrialDate,
            cdelDate: val.DelDate,
            data: val,
            tab: "other",
          }}
        />
      ),
      status: (
        <CustomStatusCell
          statusData={{
            index: ind,
            val: val.IsClosed,
            data: val,
            tab: "other",
          }}
        />
      ),
      designer: (
        <CustomDesignerCell
          ValueData={{
            index: ind,
            designerImg:
              val?.designer !== null &&
              val?.designer.Image !== null &&
              val?.designer.Image !== "data:image/jpeg;base64,"
                ? val?.designer.Image
                : "",
            designerName:
              val?.designer !== null && val?.designer.EmpName !== null
                ? val?.designer.EmpName
                : "",
            masterImg:
              val?.master !== null &&
              val?.master.Image !== null &&
              val?.master.Image !== "data:image/jpeg;base64,"
                ? val?.master.Image
                : "",
            masterName:
              val?.master !== null && val?.master.WorkerName !== null
                ? val?.master.WorkerName
                : "",
            data: val,
            tab: "other",
          }}
        />
      ),
      value: (
        <CustomValueCell
          ValueData={{
            index: ind,
            amount: val?.OrdAmt,
            data: val,
            tab: "other",
          }}
        />
      ),
      more: (
        <CustomMoreCell
          balanceData={{ balanceData: val, index: ind }}
          isLoading={isLoading}
          rowNo={val?.TOrdHdID}
          tab="other"
          onDelete={() => handleDelete(val?.TOrdHdID)}
          onEdit={() => handleEdit(val)}
        />
      ),
      rowDetais: val.TOrdDtls,
    });
  });
  // searchOrderData?.orderDetails?.forEach((val, ind) => {
  //
  //   rows.push({
  //     order: (
  //       <CustomOrderCell
  //         orderData={{
  //           customid: `g${val.TOrdHdID}`,
  //           index: ind,

  //           id: "#" + val.TOrdNo,
  //           date: val.TOrdDate,

  //           barcodeIcon: Cicon.odertableBarcodeIcon,
  //           barcodeText: val.OrdBarcode,
  //           mainId: `g${val.TOrdHdID}`,
  //           // urgentData: val?.UrgentTypeData,
  //         }}
  //         onSelectAllChange={onSelectAllChange}
  //         isSelected={selectedRows.includes(`g${val.TOrdHdID}`)}
  //         onSelectionChange={handleRowSelection}
  //       />
  //     ),
  //     customer: (
  //       <CustomCustomerCell
  //         customerData={{
  //           index: ind,
  //           customerName: val ? val?.CustName?.slice(0, 15) : "false",
  //           customerMail: val.Email,
  //           customerPhoneNumber: val?.MobNo,
  //         }}
  //       />
  //     ),
  //     commitments: (
  //       <CustomCommitmentsCell
  //         commitmentsData={{
  //           index: ind,
  //           ctriDate: val.TrialDate,
  //           cdelDate: val.DelDate,
  //         }}
  //       />
  //     ),
  //     status: (
  //       <CustomStatusCell
  //         statusData={{
  //           index: ind,
  //           val: val.IsClosed,
  //         }}
  //       />
  //     ),
  //     designer: (
  //       <CustomDesignerCell
  //         ValueData={{
  //           index: ind,
  //           designerImg: "",
  //           // val.designer !== null && val?.designer?.Photo !== null
  //           //   ? val.designer.Photo
  //           //   : "",
  //           designerName: "",
  //           // val.designer !== null && val?.designer?.EmpName !== null
  //           //   ? val.designer.EmpName
  //           //   : "",
  //           masterImg: "",
  //           // val.master !== null && val?.master?.Photo !== null
  //           //   ? val.master.Photo
  //           //   : "",
  //           masterName: "",
  //           // val.master !== null && val?.master?.WorkerName !== null
  //           //   ? val.master.WorkerName
  //           //   : "",
  //         }}
  //       />
  //     ),

  //     value: (
  //       <CustomValueCell
  //         ValueData={{
  //           index: ind,
  //           amount: val?.OrdAmt,
  //
  //           // vtriDate: "11/09/2023",
  //           // delImg: Cimages.masterImage,
  //           // vdelDate: "11/09/2023",
  //         }}
  //       />
  //     ),
  //     // paid: (
  //     //   <CustomPaidCell
  //     //     paidData={{
  //     //       paidVal: val.TotalPaid,
  //     //     }}
  //     //     isLoading={isLoading}
  //     //   />
  //     // ),
  //     // balance: (
  //     //   <CustomBalanceCell
  //     //     // balanceData={{
  //     //     //   balanceVal: val,
  //     //     // }}
  //     //     balanceData={val}
  //     //     isLoading={isLoading}
  //     //   />
  //     // ),

  //     more: (
  //       <CustomMoreCell
  //         balanceData={{ balanceData: val, index: ind }}
  //         isLoading={isLoading}
  //         rowNo={val?.TOrdHdID}
  //         // mobNo={val?.MobNo}
  //         // currentPage={currentPage}
  //         // pageSize={pageSize}
  //         // BU_Id={BU_Id}
  //         // isClosed={isClosed}
  //         onDelete={() => handleDelete(val?.TOrdHdID)}
  //         onEdit={() => handleEdit(val)}
  //         // BU_Id={BU_Id}
  //         // isClosed={isClosed}
  //       />
  //     ),
  //     rowDetais: val.TOrdDtls,
  //   });
  // });
  const [currentCangePage, setCurrentChangePage] = useState(currentPage);
  const handleCurrentPage = () => {
    setCurrentChangePage(currentPage);
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order.serachLoader) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [order]);

  return (
    <div className="nk-app-root nk-auth" style={{ position: "relative" }}>
      <div className="nk-main">
        <div className="nk-content min-h-auto">
          <div className="nk-split  nk-split-lg">
            <div className="main-table overflow-x-auto w-100">
              {loading ? (
                <TrakerSkeleton rows={5} />
              ) : (
                <div style={{ position: "relative" }}>
                  <Paper>
                    <Grid
                      rows={order.serachLoader ? [] : rows}
                      columns={[
                        { name: "order", title: "ORDER#" },
                        { name: "ordertype", title: "OrderType" },

                        { name: "customer", title: "Customer" },
                        { name: "commitments", title: "Commitments" },
                        { name: "status", title: "Status" },
                        { name: "designer", title: "Designer" },

                        { name: "value", title: "Order Amount" },
                        { name: "more", title: " " },
                      ]}
                    >
                      <SortingState
                        defaultSorting={[
                          { columnName: "order", direction: "desc" },
                        ]}
                      />
                      <IntegratedSorting />
                      <PagingState
                        currentPage={currentPage}
                        onCurrentPageChange={handleCurrentPage}
                        pageSize={pageSize}
                      />
                      <IntegratedPaging />

                      <Table rowComponent={CustomTableRow} />
                      <RowDetailState toggleDetailRowExpanded />
                      <TableRowDetail
                        contentComponent={({ row }) => (
                          <CustomTableRowDetail
                            val={row.more.props.accountId}
                            rowNo={row.more.props.rowNo}
                            rowDetails={row.rowDetais}
                            balanceData={row.more.props.balanceData.balanceData}
                            customerData={row.customer.props.customerData}
                          />
                        )}
                      />
                      <TableColumnResizing
                        defaultColumnWidths={defaultColumnWidths}
                      />

                      <CustomTableHeaderRow
                        showSortingControls
                        selectAll={selectAll}
                        handleSelectAll={handleSelectAll}
                      />
                      <TableFixedColumns
                        leftColumns={leftColumns}
                        rightColumns={rightColumns}
                      />
                      <TableColumnVisibility
                        defaultHiddenColumnNames={defaultHiddenColumnNames}
                        hiddenColumnNames={hiddenColumns}
                      />
                    </Grid>
                  </Paper>
                </div>
              )}
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
                  overflowY: "auto",
                  position: "absolute",
                  boxShadow: isSidebarOpen
                    ? "-10px 0px 50px #00000085"
                    : "none",
                }}
              >
                <DeleteSliderSingle
                  toggleSidebar={toggleSidebar}
                  selectedRows={selectedDeleteRow}
                />
              </div>
            </div>

            <div
              className={`nk-split-content nk-split-stretch d-flex w-100 toggle-slide toggle-slide-right toggle-screen-lg ${editSidebarOpen &&
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
                  overflowY: "scroll",
                  boxShadow: editSidebarOpen
                    ? "-10px 0px 50px #00000085"
                    : "none",
                }}
              >
                <EditSliderSingle
                  toggleSidebar={toggleEditSidebar}
                  selectedRows={selectedEditRow}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSearch;

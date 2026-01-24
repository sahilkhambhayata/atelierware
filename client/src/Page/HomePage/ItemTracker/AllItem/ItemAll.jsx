import React, { useEffect, useState } from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Paper from "@mui/material/Paper";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnResizing,
  TableColumnVisibility,
  TableRowDetail,
  // TableHeaderRow,
  TableFixedColumns,
  // TableFixedColumns,
} from "@devexpress/dx-react-grid-material-ui";

import {
  IntegratedPaging,
  IntegratedSorting,
  PagingState,
  RowDetailState,
  SortingState,
} from "@devexpress/dx-react-grid";
// import RowsDetails from "../OrderTracker/RowsDetails";
import { useDispatch, useSelector } from "react-redux";
import TrakerSkeleton from "../../CommonTracker/TrakerSkeleton";
import { getItemDetails } from "../../../../redux/actions/itemDetailAction";

import CustomService1Cell from "./../ItemCustomTableCells/CustomService1Cell";
import CustomService2Cell from "./../ItemCustomTableCells/CustomService2Cell";
import CustomDescriptionCell from "./../ItemCustomTableCells/CustomDescriptionCell";
import CustomFebricCell from "./../ItemCustomTableCells/CustomFebricCell";
import CustomAssessoryCell from "./../ItemCustomTableCells/CustomAssessoryCell";
import CustomCustomerCell from "./../ItemCustomTableCells/CustomCustomerCell";
import CustomCommitmentCell from "./../ItemCustomTableCells/CustomCommitmentCell";
import CustomStatusCell from "./../ItemCustomTableCells/CustomStatusCell";
import CustomLastActivityCell from "./../ItemCustomTableCells/CustomLastActivityCell";
import CustomRemarksCell from "./../ItemCustomTableCells/CustomRemarksCell";
import CustomItemLocationCell from "./../ItemCustomTableCells/CustomItemLocationCell";
import CustomDeliveryAddressCell from "./../ItemCustomTableCells/CustomDeliveryAddressCell";
import CustomShipmentInfoCell from "./../ItemCustomTableCells/CustomShipmentInfoCell";
import CustomMoreCell from "./../ItemCustomTableCells/CustomMoreCell";
// import DeleteSlider from "../ItemCustomTableCells/DeleteSlider";
import ItemTrakerSkeleton from "../ItemTrakerSkeleton";
// import DeleteSliderSingle from "../ItemCustomTableCells/DeleteSliderSingle";
import Cimages from "./../../Images/CommonImageFile";
import Cicon from "./../../Images/CommonIconFile";
import EditItemSliderSingle from "../ItemCustomTableCells/EditItemSliderSingle";

//  Add Dynamic Class For All Rows (tr)
const Owlstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 100,
  width: "30%",
  // p: 4,
};

const CustomTableRow = ({ row, ...restProps }) => {
  const currentDate = new Date();
  const delDate = row.commitment.props.commitmentsData.cdelDate;
  // const delDate = "2023-10-10";   // for demo
  const delDatecon = new Date(delDate);
  const day = Math.floor((delDatecon - currentDate) / (24 * 60 * 60 * 1000)); // convert to days
  const greenLine = day >= 3;
  const OrengeLine = day <= 2 && day >= 0;
  const redLine = day <= -1;
  const dynamicClass = row.service1.props.service1Data.mainId;
  const isSelected = row.service1.props.isSelected;
  const customClass = `${dynamicClass}-your-custom-class  ${isSelected &&
    "custome-border-outline"}  ${greenLine &&
    "item-row-left-br-green"} ${OrengeLine &&
    "item-row-left-br-orenge"} ${redLine && "item-row-left-br-red"}  `;

  return <Table.Row {...restProps} className={customClass} />;
};

// row colaps Add Component  (RowDetails)
const CustomTableRowDetail = React.memo(({ rowNo, rowDetails }) => {
  return <> {/* <RowsDetails data={rowDetails} />{" "} */}</>;
});

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
            } ${column.name === "service1" ? "first-column-header" : ""}`}
            style={{ textAlign: "center" }}
          >
            {column.name === "service1" ? (
              // Custom header cell content for the "order" column
              <>
                <div className="d-flex align-items-center justify-content-center">
                  {/* <div className="custom-control custom-checkbox">
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
                  </div> */}

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

const ItemAll = ({
  onSelectAllChange,
  onSelectRowsChange,
  onSelectAllRows,
  columns,
  hiddenColumns,
  currentPage,
  pageSize,
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

  const [isLoading, setIsLoading] = useState(true);
  const itemData = useSelector((state) => state?.itemDetails);
  const [apiCallCompleted, setApiCallCompleted] = useState(false);
  const [leftColumns] = useState(["service1"]);
  const [rightColumns] = useState(["more"]);
  const [defaultHiddenColumnNames, setDefaultHiddenColumnNames] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editSidebarOpen, setEditSidebarOpen] = useState(false);
  const [selectedEditRow, setSelectedEditRow] = useState();
  const EnableInventory = useSelector(
    (state) => state?.config?.orderType.EnableInventory
  );
  const [selectedRows, setSelectedRows] = useState([]);
  const rows = [];
  const [selectedDeleteRow, setSelectedDeleteRow] = useState();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (EnableInventory === 1) {
      setDefaultHiddenColumnNames([]);
    } else {
      setDefaultHiddenColumnNames(["fabric", "accessory"]);
    }
  }, [EnableInventory]);

  useEffect(() => {
    if (isObjectEmpty(itemData)) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
    setApiCallCompleted(true);
  }, [isLoading, itemData]);

  const [defaultColumnWidths] = useState([
    { columnName: "service1", align: "left", width: 200 },
    { columnName: "customer", width: 250 },
    { columnName: "service2", width: 200 },
    { columnName: "description", width: 220 },
    { columnName: "status", width: 300 },
    { columnName: "fabric", width: 200 },
    { columnName: "accessory", width: 200 },

    { columnName: "commitment", width: 220 },

    { columnName: "lastActivity", width: 180 },
    { columnName: "remarks", width: 180 },
    { columnName: "itemLocation", width: 180 },
    { columnName: "deliveryAddress", width: 180 },
    // { columnName: "shipmentInfo", width: 180 },
    { columnName: "more", align: "right", width: 160 },
  ]);

  const handleEdit = (id) => {
    setEditSidebarOpen(true);
    setSelectedEditRow(id);
  };

  const toggleEditSidebar = (isOpen) => {
    setEditSidebarOpen(isOpen);
  };

  const handleRowSelection = (itemId) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(itemId)) {
        return prevSelectedRows.filter((id) => id !== itemId);
      } else {
        return [...prevSelectedRows, itemId];
      }
    });
    // onSelectRowsChange(selectedRows);
  };

  useEffect(() => {
    onSelectRowsChange(selectedRows);
    if (selectedRows.length === 0) {
      setSelectAll(false);
    } else if (selectedRows.length === itemData?.item?.orderDetails?.length) {
      setSelectAll(true);
    }
  }, [selectedRows]);

  const handleDelete = (id) => {
    setSidebarOpen(true);
    setSelectedDeleteRow(id);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectAll(false);
      onSelectAllChange(false);
      setSelectedRows([]);
      onSelectAllRows([]);
    } else {
      setSelectAll(true);
      onSelectAllChange(true);
      setSelectedRows(
        rows.map((row) => row.service1.props.service1Data.mainId)
      );
      onSelectAllRows(
        rows.map((row) => row.service1.props.service1Data.mainId)
      );
    }
  };
  const toggleSidebar = (isOpen) => {
    setSidebarOpen(isOpen);
  };

  itemData?.item?.orderItemList?.forEach((val) => {
    const newImageObjects = Object.keys(val)
      .filter((key) => key.startsWith("attach_img_") && val[key] !== null)
      .map((imgKey) => {
        const descKey = `${imgKey}_desc`;
        return {
          image: val[imgKey],
          desc: val.hasOwnProperty(descKey) ? val[descKey] : null,
        };
      });

    const finalImageObjects = newImageObjects.slice(
      0,
      newImageObjects.length / 2
    );

    rows.push({
      service1: (
        <CustomService1Cell
          service1Data={{
            customid: `g${val.TOrdDtId}`,
            id: "#" + val.OrdSrNo,
            date: val.DeliveredDt,
            barcodeIcon: Cicon.odertableBarcodeIcon,
            barcodeText: val.barcode,
            mainId: `${val.TOrdDtId}`,
            data: val,
            tab: "other",
          }}
          // isLoading={isLoading}
          // onSelectAllChange={onSelectAllChange}
          // isSelected={selectedRows.includes(`${val.TOrdDtId}`)}
          // onSelectionChange={handleRowSelection}
        />
      ),
      service2: (
        <CustomService2Cell
          service2Data={{
            desc: val.ItemName,
            imgCount: val.imgCount == null ? 0 : val.imgCount,
            id: val.TOrdDtId,
            imageArray: finalImageObjects,
            data: val,
            tab: "other",
          }}
          // images={imageArray}
        />
      ),
      description: (
        <CustomDescriptionCell
          descriptionData={{
            desc: val.ItemDesc,
            data: val,
            tab: "other",
            // desc: "Service Description",
          }}
          className="align-top-cell"
        />
      ),
      fabric: (
        <CustomFebricCell
          febricData={{
            // val.fabricList.map(())
            val: val.fabricList,
            data: val,
            tab: "other",
          }}
        />
      ),
      accessory: (
        <CustomAssessoryCell
          accessoryData={{
            val: val.accessoriesList,
            data: val,
            tab: "other",
          }}
        />
      ),
      customer: (
        <CustomCustomerCell
          customerData={{
            name: `${val?.orderHead?.CustName}`,

            // name: "JAne Cooper",
            mobNo: `${val?.orderHead?.MobNo}`,
            // mobNo: "=91 23******21",
            email: `${val?.orderHead?.Email}`,
            data: val,
            tab: "other",
            // email:"ta***********com",
          }}
        />
      ),
      commitment: (
        <CustomCommitmentCell
          commitmentsData={{
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
            val: val.itemstatus,
            currentStatus: val?.currentStatus?.CurrentStatus,
            TOrdDtId: val.TOrdDtId,
            data: val,
            tab: "other",
          }}
        />
      ),

      lastActivity: (
        <CustomLastActivityCell
          lastActivityData={{
            modifyDesc: val.LastUpdatedActivity,
            modifyDate: val.LastUpdateddate,
            modifierName: val.LastUpdatedName,
            data: val,
            tab: "other",
          }}
        />
      ),

      remarks: (
        <CustomRemarksCell
          remarksData={{
            // desc: val.TrialRemarks ? val.TrialRemarks : null,
            desc: val.MRemarks,
            data: val,
            tab: "other",
          }}
        />
      ),

      itemLocation: (
        <CustomItemLocationCell
          itemLocationData={{
            desc: val?.ItemLocation,
            data: val,
            tab: "other",
          }}
        />
      ),

      deliveryAddress: (
        <CustomDeliveryAddressCell
          deliveryAddressData={{
            desc: "In-Store",
            data: val,
            tab: "other",
          }}
        />
      ),
      // shipmentInfo: (
      //   <CustomShipmentInfoCell
      //     shipmentData={{
      //       runner: "Beardish",
      //       messerment: "20 x 45 x 120 cm | 250gms",
      //       time: "23 jan 2019, 10:45pm",
      //       code: "768F5K2",
      //     }}
      //   />
      // ),
      more: (
        <CustomMoreCell
          data={val}
          tab="other"
          // rowNo={val.TOrdHdID}
          // BU_Id={BU_Id}
          onDelete={() => handleDelete(val.TOrdDtId)}
          onEdit={() => handleEdit(val)}
        />
      ),
      rowDetais: val.TOrdDtls,
    });
  });

  // const [verify, setVerify] = useState(false);
  // const [search, setSearch] = useState("");
  const [currentCangePage, setCurrentChangePage] = useState(currentPage);
  const handleCurrentPage = () => {
    setCurrentChangePage(currentPage);
  };
  return (
    <div className="nk-app-root nk-auth" style={{ position: "relative" }}>
      <div className="nk-main">
        <div className="nk-content min-h-auto">
          <div className="nk-split  nk-split-lg">
            <div className="main-table overflow-x-auto w-100">
              <div style={{ position: "relative" }}>
                <Paper>
                  {apiCallCompleted && itemData.isLoader ? (
                    <TrakerSkeleton rows={5} />
                  ) : (
                    <Grid
                      rows={itemData.isLoader ? [] : rows}
                      columns={[
                        { name: "service1", title: " SERVICE#" },
                        { name: "customer", title: "CUSTOMER" },
                        { name: "service2", title: "SERVICE" },
                        { name: "description", title: "DESCRIPTION" },
                        { name: "status", title: "STATUS" },
                        { name: "fabric", title: "FABRIC" },
                        { name: "accessory", title: "ACCESSORY" },

                        { name: "commitment", title: "COMMITMENT" },

                        { name: "lastActivity", title: "LAST ACTIVITY" },
                        { name: "remarks", title: "REMARKS" },
                        { name: "itemLocation", title: "ITEM LOCATION" },
                        { name: "deliveryAddress", title: "DELIVERY ADDRESS" },
                        // { name: "shipmentInfo", title: "SHIPMENT INFO" },
                        { name: "more", title: " " },
                      ]}
                    >
                      <SortingState
                        defaultSorting={[
                          { columnName: "service1", direction: "desc" },
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
                      {/* <TableHeaderRow />
                      <TableFixedColumns
                        // leftColumns={leftColumns}
                        rightColumns={rightColumns}
                      /> */}
                      {/* <RowDetailState toggleDetailRowExpanded />
                      <TableRowDetail
                        contentComponent={({ row }) => (
                          <CustomTableRowDetail
                            rowNo={row.more.props.rowNo}
                            rowDetails={row.rowDetais}
                          />
                        )}
                        // contentComponent={CustomTableRowDetail}
                      /> */}
                      <TableColumnResizing
                        defaultColumnWidths={defaultColumnWidths}
                      />

                      <CustomTableHeaderRow
                        showSortingControls
                        // selectAll={selectAll}
                        // handleSelectAll={handleSelectAll}
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
                  )}
                </Paper>
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
                  overflowY: "scroll",
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
            </div> */}

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
                <EditItemSliderSingle
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

export default ItemAll;

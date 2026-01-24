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
import CustomStatus1Cell from "../ItemCustomTableCells/CustomStatus1Cell";
import EditSliderSingle from "../../OrderTracker/OrderCustomTableCells/EditSliderSingle";
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
              <>
                <div className="d-flex align-items-center justify-content-center">
                  {column.sortingEnabled ? (
                    <TableHeaderRow.SortLabel column={column} />
                  ) : (
                    cellProps.children
                  )}
                </div>
              </>
            ) : column.sortingEnabled ? (
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

const ItemPending = ({
  onSelectAllChange,
  onSelectRowsChange,
  onSelectAllRows,
  columns,
  hiddenColumns,
  currentPage,
  pageSize,
}) => {
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
  const [selectedRows, setSelectedRows] = useState([]);
  const [leftColumns] = useState(["service1"]);
  const [rightColumns] = useState(["more"]);
  const [defaultHiddenColumnNames, setDefaultHiddenColumnNames] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const rows = [];

  const [currentCangePage, setCurrentChangePage] = useState(currentPage);
  const [editSidebarOpen, setEditSidebarOpen] = useState(false);
  const [selectedEditRow, setSelectedEditRow] = useState();
  const EnableInventory = useSelector(
    (state) => state?.config?.orderType.EnableInventory
  );

  const handleEdit = (id) => {
    setEditSidebarOpen(true);
    setSelectedEditRow(id);
  };

  useEffect(() => {
    if (EnableInventory === 1) {
      setDefaultHiddenColumnNames([]);
    } else {
      setDefaultHiddenColumnNames(["fabric", "accessory"]);
    }
  }, [EnableInventory]);

  const toggleEditSidebar = (isOpen) => {
    setEditSidebarOpen(isOpen);
  };

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
    { columnName: "status", width: 300 },
    { columnName: "service2", width: 200 },
    { columnName: "description", width: 220 },
    { columnName: "fabric", width: 200 },
    { columnName: "accessory", width: 200 },
    { columnName: "commitment", width: 220 },
    { columnName: "lastActivity", width: 180 },
    { columnName: "remarks", width: 180 },
    { columnName: "itemLocation", width: 180 },
    { columnName: "more", align: "right", width: 160 },
  ]);

  const handleRowSelection = (itemId) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(itemId)) {
        return prevSelectedRows.filter((id) => id !== itemId);
      } else {
        return [...prevSelectedRows, itemId];
      }
    });
  };

  useEffect(() => {
    onSelectRowsChange(selectedRows);
    if (selectedRows.length === 0) {
      setSelectAll(false);
    } else if (selectedRows.length === itemData?.item?.orderDetails?.length) {
      setSelectAll(true);
    }
  }, [selectedRows]);

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
            tab: "under-booking",
          }}
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
            tab: "under-booking",
          }}
        />
      ),
      description: (
        <CustomDescriptionCell
          descriptionData={{
            desc: val.ItemDesc,
            data: val,
            tab: "under-booking",
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
            tab: "under-booking",
          }}
        />
      ),
      accessory: (
        <CustomAssessoryCell
          accessoryData={{
            val: val.accessoriesList,
            data: val,
            tab: "under-booking",
          }}
        />
      ),
      customer: (
        <CustomCustomerCell
          customerData={{
            name: val?.orderHead?.CustName ? val?.orderHead?.CustName : "",

            // name: "JAne Cooper",
            mobNo: val?.orderHead?.MobNo ? val?.orderHead?.MobNo : "",
            // mobNo: "=91 23******21",
            email: val?.orderHead?.Email ? val?.orderHead?.Email : "",
            data: val,
            tab: "under-booking",
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
            tab: "under-booking",
          }}
        />
      ),
      status: (
        <CustomStatus1Cell
          statusData={{
            val: val,
            currentId: val.ItemStatus,
            currentStatus: val.currentStatus.CurrentStatus,
            TOrdDtId: val.TOrdDtId,
            data: val,
            tab: "under-booking",
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
            tab: "under-booking",
          }}
        />
      ),

      remarks: (
        <CustomRemarksCell
          remarksData={{
            // desc: val.TrialRemarks ? val.TrialRemarks : null,
            desc: val.MRemarks,
            data: val,
            tab: "under-booking",
          }}
        />
      ),

      itemLocation: (
        <CustomItemLocationCell
          itemLocationData={{
            desc: val?.ItemLocation,
            data: val,
            tab: "under-booking",
          }}
        />
      ),

      more: <CustomMoreCell data={val} tab="under-booking" />,
      rowDetais: val.TOrdDtls,
    });
  });

  const handleCurrentPage = () => {
    setCurrentChangePage(currentPage);
  };

  return (
    <div className="nk-app-root nk-auth" style={{ position: "relative" }}>
      <div className="nk-main">
        <div className="nk-content min-h-auto">
          <div className="nk-split nk-split-lg">
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

                      <TableColumnResizing
                        defaultColumnWidths={defaultColumnWidths}
                      />

                      <CustomTableHeaderRow showSortingControls />
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

export default ItemPending;

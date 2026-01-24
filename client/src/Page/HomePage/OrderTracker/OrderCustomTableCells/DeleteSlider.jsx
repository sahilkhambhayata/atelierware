import React, { useEffect, useState } from "react";
import {
  Button,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import DeleteItemIcon from "../../../../images/icons/delete-item-icon.svg";
import viewIcon from "../../../../images/icons/viewIcon.svg";
import { Tooltip as ReactTooltip } from "react-tooltip";
import DotIcon from "../../../../images/icons/dot-icon.svg";
import Icon from "../../../../Components/icon/Icon";
import PaymentInputInfoIcon from "../../../../images/icons/payment-input-info-icon.svg";
import CustomPagination from "../../CommonTracker/CustomPagination";
import Paper from "@mui/material/Paper";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnResizing,
} from "@devexpress/dx-react-grid-material-ui";
import { useDispatch, useSelector } from "react-redux";
import {
  IntegratedPaging,
  IntegratedSorting,
  PagingState,
  SortingState,
} from "@devexpress/dx-react-grid";
// import { deleteData } from "./DeleteColumn/deleteData";
import backArrowIcon from "./../../../../images/icons/backArrowIcon.svg";

import jecek from "../../../../images/icons/service-jecet01.svg";
import {
  deleteOrder,
  // getOrderDetailsAsyncData,
  // getSingleOrder,
  sendOrderDeleteOtp,
  verifyOrderDeleteOtp,
} from "../../../../redux/actions/orderDetailAction";
import DeleteOrder from "./DeleteColumn/DeleteOrder";
import DeleteCustomer from "./DeleteColumn/DeleteCustomer";
import DeleteCommitment from "./DeleteColumn/DeleteCommitment";
import DeleteValue from "./DeleteColumn/DeleteValue";
import { BlockDes } from "../../../../Components/Block/Block";
import { toast } from "react-toastify";

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
            }-header ${cellProps.className || ""}`}
            style={{ textAlign: "center" }}
          >
            {column.name === "service1" ? (
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

const DeleteSlider = ({ toggleSidebar, selectedRows }) => {
  
  const [sendOTP, setSendOTP] = useState(false);
  // const [pageSize, setPageSize] = useState(5);
  const [otp, setOtp] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [conSelectedRows, setConSelectedRows] = useState([]);
  const [conSelectAll, setConSelectAll] = useState(false);
  const email = useSelector(
    (state) => state?.loginUser?.user?.user?.RecoveryEmail
  );
  let deleteRows = [];
  const order = useSelector(
    (state) => state?.orderDetails?.order?.orderDetails
  );

  const [filteredOrderDetails, setFilteredOrderDetails] = useState();

  useEffect(() => {
    if (selectedRows !== undefined) {
      setFilteredOrderDetails(
        order?.filter((order) => selectedRows?.includes(order.TOrdHdID))
      );
      // setConSelectedRows(selectedRows);
    }
  }, [selectedRows]);

  useEffect(() => {
    setConSelectedRows(
      selectedRows.map((e) => {
        return `g${e}`;
      })
    );
  }, [selectedRows]);

  const handleRowSelection = (orderId) => {
    setConSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(orderId)) {
        return prevSelectedRows.filter((id) => id !== orderId);
      } else {
        return [...prevSelectedRows, orderId];
      }
    });
  };

  const deleteColumn = [
    {
      name: "orderno",
      title: "ORDER#",
    },
    {
      name: "customer",
      title: "CUSTOMER",
    },
    {
      name: "commitment",
      title: "COMMITMENT",
    },
    {
      name: "value",
      title: "VALUE",
    },
  ];

  
  filteredOrderDetails?.forEach((val) => {
    deleteRows.push({
      orderno: (
        <DeleteOrder
          service={{
            id: `g${val.TOrdHdID}`,
            disId: val.TOrdNo,
          }}
          isSelected={conSelectedRows.includes(`g${val.TOrdHdID}`)}
          // isSelected={selectedRows.includes(`g${val.TOrdHdID}`)}
          onSelectionChange={handleRowSelection}
        />
      ),
      customer: (
        <DeleteCustomer
          service={{
            img: jecek,
            name: val.CustName,
          }}
        />
      ),
      commitment: (
        <DeleteCommitment
          date={{
            tDate: val.TrialDate,
            dDate: val.DelDate,
          }}
        />
      ),
      value: (
        <DeleteValue
          customer={{
            name: val.NetAmt,
          }}
        />
      ),
    });
  });

  const handleSelectAll = () => {
    if (conSelectAll) {
      setConSelectedRows([]);
    } else {
      setConSelectAll(true);
      setConSelectedRows(
        rows?.map((row) => row.service1.props.service1Data.mainId)
      );
    }
  };

  const dispatch = useDispatch();

  const handleOTP = () => {
    setSendOTP(true);
    dispatch(sendOrderDeleteOtp(conSelectedRows, email)).then((res) => {
      if (res?.data?.success == true) {
        toast.success(res.data.message);

        setIsCountingDown(true);
      } else {
        toast.error(res.data.message);
      }
    });
    setIsCountingDown(true);
  };

  const [isLoader, setIsLoader] = useState(false);

  const handleVerify = () => {
    setIsLoader(true);
    try {
      // dispatch(verifyOrderDeleteOtp(email, otp)).then((res) => {
      //   if (res.success) {
      dispatch(deleteOrder(conSelectedRows)).then((responce) => {
        if (responce.success) {
          setIsLoader(false);
          toast.success(responce.message);

          toggleSidebar(false);
          handleResendClick();
        }
      });
      // }
      // else {
      //   toast.error(res.message);
      //   setIsLoader(false);
      //   setIsCountingDown(false); // Stop the countdown
      //   setCountdown(60);
      //   setOtp("");
      // }
      // });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (isCountingDown) {
      startCountdown();
    }
  }, [isCountingDown]);

  const handleResendClick = () => {
    if (!isCountingDown) {
      setIsCountingDown(true);
      setCountdown(60);
      startCountdown();
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(timer);
          setIsCountingDown(false);
          return 10; // Reset the countdown to 180 seconds
        }
        return prevCountdown - 1;
      });
    }, 1000); // Update the countdown every 1 second
  };

  const handleCurrentPage = () => {
    setCurrentChangePage(currentPage);
  };

  const handleOTPChange = (e) => {
    const newValue = e.target.value;
    setOtp(newValue);
  };

  const [defaultDeleteColumnWidths] = useState([
    { columnName: "orderno", width: 135 },
    { columnName: "customer", width: 180 },
    { columnName: "commitment", width: 280 },
    { columnName: "value", width: 140 },
  ]);

  const handleToggleSidebar = () => {
    setIsCountingDown(false); // Stop the countdown
    setCountdown(60); // Reset the countdown value
    setOtp("");
    setIsLoader(false)
    setSendOTP(false); // Toggle the sendOTP state
    toggleSidebar(false);
  };

  return (
    <div className="">
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
        <span className="fs-5 fw-bold">Delete Order</span>
        {/* <div className="ms-2 p-0">
          <div className="d-flex text-dark" data-tooltip-id="my-tooltip-1">
            <img src={PaymentInputInfoIcon} alt="PaymentInputInfoIcon" />
          </div>

          <ReactTooltip
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
              Deleting orders is an irreversible action and will result in the
              permanent loss of all associated data, including orders and all
              its items, production details, and transaction history. Please
              ensure you have backed up or recorded necessary details before
              proceeding.
            </li>
            <li>
              Impact on Inventory and Reports : Deleting orders may affect
              inventory levels and sales reports. Ensure that all stock
              adjustments, if required, are completed, and all relevant reports
              are updated accordingly.
            </li>
            <li>
              Pending Payments and Refunds: If there are any pending payments,
              deposits, or refunds associated with this order, make sure to
              resolve them before deletion. Failure to do so may result in
              discrepancies in your financial records.
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-2 mb-2">
        <span className="fs-5 fw-bold ">Selected Order</span>
      </div>

      <div className="order-table ">
        <div
          className="ordered-table overflow-x-auto"
          // style={{ maxHeight: "300px" }}
        >
          <Paper>
            <Grid rows={deleteRows} columns={deleteColumn}>
              <SortingState
                defaultSorting={[{ columnName: "service1", direction: "desc" }]}
              />
              <IntegratedSorting />
              {/* <PagingState
                currentPage={currentPage}
                onCurrentPageChange={handleCurrentPage}
                // pageSize={pageSize}
              />
              <IntegratedPaging /> */}

              <Table />

              <TableColumnResizing
                defaultColumnWidths={defaultDeleteColumnWidths}
              />

              <CustomTableHeaderRow
                showSortingControls
                selectAll={conSelectAll}
                handleSelectAll={handleSelectAll}
              />
            </Grid>
            {/* )} */}
          </Paper>
        </div>
      </div>

      {/* <div className="mt-2 w-50 p-2">
        <div>An OTP will be send to your Admin Email</div>
       
        <div className={`${!sendOTP ? "d-none" : "d-block"}`}>
          <div>
            <span
              style={{
                color: "red",
                cursor: isCountingDown ? "not-allowed" : "pointer",
              }}
              onClick={handleResendClick}
            >
              {isCountingDown ? (
                <div className="d-flex justify-content-end">
                  <BlockDes>Resend OTP({countdown}s)</BlockDes>
                </div>
              ) : (
                "Resend OTP"
              )}
            </span>
          </div>
          <input
            type="text"
            id="default-01"
            value={otp}
            onChange={handleOTPChange}
            placeholder="Enter OTP"
            className="form-control-lg form-control pl-4 mb-2 "
          />
        </div>
        {!sendOTP ? (
          <Button
            color="light"
            onClick={handleOTP}
            disabled={conSelectedRows.length == 0}
          >
            <span className="ms-1">Send OTP</span>
          </Button>
        ) : isLoader ? (
          <>
            <span>
              <Spinner size="sm" color="light" className="mx-1 py-1" />
            </span>
          </>
        ) : (
          <Button color="light" onClick={handleVerify}>
            <span className="ms-1">Verify</span>
          </Button>
        )}
      </div> */}

      <div>
        <div className="mt-5">
          <span className="fs-5 fw-bold">Permanently Delete Order?</span>
        </div>
        <div className=" w-50 p-2">
          <div>
            To confirm deletion, type{" "}
            <i>
              <b>permanently delete</b>
            </i>{" "}
            in the text input field.
          </div>

          <div className="mt-1">
            <input
              type="text"
              id="default-01"
              value={otp}
              onChange={handleOTPChange}
              placeholder="Search"
              className="form-control-lg form-control pl-4 mb-2 "
            />
          </div>
        </div>
        <div className="d-flex justify-content-end  align-items-center">
          <Button color="light" onClick={() => setOtp("")} className="mr-2">
            <span className="ms-1">Cancel</span>
          </Button>

          {isLoader ? (
            <Button color="light" className="btn btn-light">
              <Spinner size="sm" className="mx-1 " />
            </Button>
          ) : (
            <Button
              color="light"
              onClick={handleVerify}
              disabled={!otp || otp !== "permanently delete"}
              className="btn btn-light"
            >
              Delete Object
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteSlider;

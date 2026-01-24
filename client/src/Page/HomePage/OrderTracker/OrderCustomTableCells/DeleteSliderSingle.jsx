import React, { useEffect, useState } from "react";
import {
  Button,
  DropdownToggle,
  UncontrolledDropdown,
  Spinner,
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
// import DeleteOrder from "./DeleteColumn/DeleteOrder";
import DeleteCustomer from "./DeleteColumn/DeleteCustomer";
import DeleteCommitment from "./DeleteColumn/DeleteCommitment";
import DeleteValue from "./DeleteColumn/DeleteValue";
import DeleteOrderSingle from "./DeleteColumn/DeleteOrderSingle";
import { BlockDes } from "../../../../Components/Block/Block";
import { toast } from "react-toastify";
import { getOrderCount } from "../../../../redux/actions/orderCount";

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

const DeleteSliderSingle = ({ toggleSidebar, selectedRows }) => {
  const [sendOTP, setSendOTP] = useState(false);
  const [search, setSearch] = useState();
  const [pageSize, setPageSize] = useState(5);
  const [otp, setOtp] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const conSelectedRows = [selectedRows];
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
    }
  }, [selectedRows]);

  const columns = [
    { name: "orderno", title: "ORDER#" },
    { name: "customer", title: "CUSTOMER" },
    { name: "commitment", title: "COMMITMENT" },
    { name: "value", title: "VALUE" },
  ];

  const defaultDeleteColumnWidths = [
    { columnName: "orderno", width: 135 },
    { columnName: "customer", width: 180 },
    { columnName: "commitment", width: 280 },
    { columnName: "value", width: 140 },
  ];

  filteredOrderDetails?.forEach((val) => {
    deleteRows.push({
      orderno: (
        <DeleteOrderSingle
          service={{
            id: `g${val.TOrdHdID}`,
            disId: val.TOrdNo,
          }}
          //   isSelected={conSelectedRows.includes(`g${val.TOrdHdID}`)}
          //   // isSelected={selectedRows.includes(`g${val.TOrdHdID}`)}
          //   onSelectionChange={handleRowSelection}
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
  };

  const [isLoader, setIsLoader] = useState(false);

  const handleVerify = () => {
    setIsLoader(true);
    try {
      // dispatch(verifyOrderDeleteOtp(email, otp)).then((res) => {
      //   if (res.success) {
      // if (otp == 111) {
      dispatch(getOrderCount());
      dispatch(deleteOrder(conSelectedRows)).then((responce) => {
        if (responce.success) {
          setIsLoader(false);
          // toast.success(res.message);
          setOtp("");
          setSendOTP(false);
          handleToggleSidebar();
          handleResendClick();
        }
      });
      // }
      // if (res == false || res == undefined) {
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
          return 10;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  // const handleCurrentPage = () => {
  //   setCurrentChangePage(currentPage);
  // };

  const handleOTPChange = (e) => {
    const newValue = e.target.value;
    setOtp(newValue);
  };

  const handleToggleSidebar = () => {
    setIsCountingDown(false); // Stop the countdown
    setCountdown(60); // Reset the countdown value
    setOtp("");
    setIsLoader(false)

    setSendOTP(false); // Toggle the sendOTP state
    toggleSidebar(false); // Toggle the sidebar
  };

  return (
    <div>
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
            // end
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
              {" "}
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
      <div className="d-flex justify-content-between mb-2 align-items-center custom-deleteSlider-pagination-search">
        {/* <div className="position-relative nk-header-searchbox px-lg-0 d-flex justify-content-between align-items-center">
          <input
            type="text"
            id="default-01"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search"
            className="form-control-lg form-control pl-4 w-100"
          />
          <Icon
            name="search"
            className="position-absolute nk-img-position-set pl-2"
          ></Icon>

          <UncontrolledDropdown className="user-dropdown position-absolute nk-img-position-end end-0 pr-2">
            <DropdownToggle tag="a" className="">
              <img
                src={DotIcon}
                name="search"
                style={{ cursor: "pointer" }}
                // className="cursor-pointer "
              ></img>
            </DropdownToggle>
          </UncontrolledDropdown>
        </div> */}

        <div className="d-felx  align-items-center ml-3 pagination-w-100">
          <div className="pagination bg-white rounded-10">
            {/* <CustomPagination
              currentPage={currentPage}
              totalPages={100}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[0, 5, 10, 20, 30]}
              rowsPerPage={pageSize}
              labelRowsPerPage="Rows/page"
            /> */}
          </div>
        </div>
      </div>
      <div className="order-table ">
        <div
          className="ordered-table overflow-hidden"
          style={{ maxHeight: "280px" }}
        >
          <Paper>
            <Grid rows={deleteRows} columns={columns}>
              <Table />

              <TableColumnResizing
                defaultColumnWidths={defaultDeleteColumnWidths}
              />

              <CustomTableHeaderRow
              // showSortingControls
              // selectAll={conSelectAll}
              // handleSelectAll={handleSelectAll}
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
                <div className="d-flex justify-content-end" onClick={handleOTP}>
                  Resend OTP
                </div>
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
          <Button color="light" onClick={handleOTP}>
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
          <span className="fs-5 fw-bold">Permanently delete objects?</span>
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
        <div className="d-flex justify-content-end align-items-center">
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

export default DeleteSliderSingle;

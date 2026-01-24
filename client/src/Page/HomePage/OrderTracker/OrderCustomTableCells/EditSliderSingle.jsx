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
import { getSingleCustomer } from "../../../../redux/actions/customerAction";
import { getSingleOrderDtlsAsyncData } from "../../../../redux/actions/createorddtlsAction";
import { getGroupOrderListAsyncData } from "../../../../redux/actions/groupOrderListAction";
import { useNavigate } from "react-router";
import { useTheme } from "../../../../Layout/Provider/Themes";

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

const EditSliderSingle = ({ toggleSidebar, selectedRows }) => {
  const { tabId } = useTheme();
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
      const selectedIds = Array.isArray(selectedRows)
        ? selectedRows
        : [selectedRows.TOrdHdID];
      setFilteredOrderDetails(
        order?.filter((order) => selectedIds.includes(order.TOrdHdID))
      );
    }
  }, [selectedRows, order]);

  const deleteColumn = [
    {
      name: "orderno",
      title: "ORDER",
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
    dispatch(sendOrderDeleteOtp([conSelectedRows[0].TOrdHdID], email)).then(
      (res) => {
        if (res?.data?.success == true) {
          toast.success(res.data.message);

          setIsCountingDown(true);
        } else {
          toast.error(res.data.message);
        }
      }
    );
  };

  const [isLoader, setIsLoader] = useState(false);
  const navigate = useNavigate();

  const handleVerify = () => {
    setIsLoader(true);
    try {
      dispatch(verifyOrderDeleteOtp(email, otp)).then((res) => {
        if (res.success) {
          localStorage.setItem(`customerId${tabId}`, selectedRows.AccountId);
          localStorage.setItem(`TOrdHdID${tabId}`, selectedRows.TOrdHdID);

          dispatch(getSingleCustomer(selectedRows.AccountId));
          dispatch(getSingleOrderDtlsAsyncData(selectedRows.TOrdHdID)).then(
            (res) => {
              localStorage.setItem(`mood${tabId}`, "edit");
              localStorage.setItem(`TOrdHdID${tabId}`, selectedRows.TOrdHdID);

              const sendingData = {
                AccountId: selectedRows.AccountId,
                TOrdHdID: selectedRows.TOrdHdID,
                from: "order-tracker",
                mood: "edit",
                tab: "other",
                TOrdDtId: selectedRows.TOrdDtls[0].TOrdDtId,
                ItemId: selectedRows.TOrdDtls[0].ItemId,
                TOrdNo: selectedRows.TOrdNo,
              };

              // const url = `/#/order-tracker-single-order/${selectedRows.TOrdNo}/edit`;
              const url = `/#/order-tracker-single-order`;
              const a = document.createElement("a");
              a.href = url;
              a.target = "_blank";
              a.rel = "noopener noreferrer";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);

              localStorage.setItem(
                "orderEditData",
                JSON.stringify(sendingData)
              );
              handleToggleSidebar();
            }
          );
        }
        // if (res == false || res == undefined) {
        else {
          toast.error(res.message);
          setIsLoader(false);
          setIsCountingDown(false); // Stop the countdown
          setCountdown(60);
          setOtp("");
        }
      });
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
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleRowsPerPageChange = (newRowsPerPage) => {
    setCurrentPage(0);
    setPageSize(newRowsPerPage);
  };

  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearch(newValue);
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
        <span className="fs-5 fw-bold">Edit Order</span>
        <div className="ms-2 p-0">
          {/* <div className="d-flex text-dark" data-tooltip-id="my-tooltip-1">
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
          /> */}
        </div>
      </div>
      <div className="bg-light p-3 d-flex ">
        <div>
          <img src={DeleteItemIcon} alt="" width={70} />
        </div>
        <div className="ms-4">
          <ul style={{ listStyleType: "disc" }} className="text-justify">
            <li>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Perferendis, vero. Vero quae, magni amet repellat magnam ipsum
              accusamus tenetur.
            </li>
            <li>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam,
              quos molestiae?
            </li>
            <li>Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
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
          className="ordered-table overflow-x-auto"
          style={{ maxHeight: "300px" }}
        >
          <Paper>
            <Grid rows={deleteRows} columns={deleteColumn}>
              <SortingState
                defaultSorting={[{ columnName: "service1", direction: "desc" }]}
              />
              <IntegratedSorting />
              <PagingState
                currentPage={currentPage}
                onCurrentPageChange={handleCurrentPage}
                pageSize={pageSize}
              />
              <IntegratedPaging />

              <Table />

              <TableColumnResizing
                defaultDeleteColumnWidths={defaultDeleteColumnWidths}
              />

              <CustomTableHeaderRow
                showSortingControls
                // selectAll={conSelectAll}
                // handleSelectAll={handleSelectAll}
              />
            </Grid>
            {/* )} */}
          </Paper>
        </div>
      </div>

      <div className="mt-2 w-50 p-2">
        <div>An OTP will be send to your Admin Email </div>
        <div>{/* <span className="fw-bold">{email}</span> */}</div>
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
      </div>
    </div>
  );
};

export default EditSliderSingle;

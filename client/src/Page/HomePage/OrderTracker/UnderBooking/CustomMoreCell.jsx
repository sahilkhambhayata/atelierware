import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, Spinner } from "reactstrap";

import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownItem,
  Form,
  UncontrolledTooltip,
} from "reactstrap";

import { toast } from "react-toastify";

import Button from "../../../../Components/button/Button";
import { useNavigate } from "react-router";

import Cimages from "./../../Images/CommonImageFile";
import Cicon from "./../../Images/CommonIconFile";
import { getSingleCustomer } from "../../../../redux/actions/customerAction";
import { getSingleOrderDtlsAsyncData } from "../../../../redux/actions/createorddtlsAction";
import { getGroupOrderListAsyncData } from "../../../../redux/actions/groupOrderListAction";
import PayNowModel from "../OrderCustomTableCells/PayNowModel";
import { sendEmailOfInvoice } from "../../../../redux/actions/sendInvoiceEmailAction";
import Tooltip from "../../../../Components/Tooltip/Tooltip";
import ToolTipContent from "../../../../Components/Tooltip/ToolTipContent";
import { useTheme } from "../../../../Layout/Provider/Themes";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomMoreCell = ({ balanceData, rowNo, onDelete }) => {
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [emailLoader, setEmailLoader] = useState(false);
  const { tabId } = useTheme();
  const toggleDropdown = (event) => {
    event.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };
  const { handleAction } = usePermissions();

  const handleSendBillEmail = (data) => {
    setEmailLoader(true);
    localStorage.setItem(`TOrdHdID${tabId}`, data.TOrdHdID);

    dispatch(sendEmailOfInvoice([data.TOrdHdID])).then((res) => {
      if (res.success) {
        toast.success("Send Email Of Invoice Success");
        setEmailLoader(false);
      }
    });
    //now i want call api which have
  };

  const handleDelete = (ev) => {
    // ev.preventDefault();

    // setShowPopup(!showPopup);
    // setPopupContent("content1");
    onDelete();
  };
  const handlePrintEstimate = (data) => {
    const sendingData = {
      TOrdHdID: data.TOrdHdID,
    };
    localStorage.setItem(`TOrdHdID${tabId}`, data.TOrdHdID);
    localStorage.setItem("orderEditData", JSON.stringify(sendingData));
    const url = `/#/estimate`;
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // const url = "/#/estimate";

    // // navigate('/#/estimate')
    // window.open(url, "_blank");
  };

  const navigate = useNavigate();

  const [viewLoader, setViewLoader] = useState(false);

  const handleWorkSheet = (data) => {
    

    localStorage.setItem(`TOrdHdID${tabId}`, data.TOrdHdID);
    const sendingData = {
      TOrdHdID: data.TOrdHdID,
    };

    localStorage.setItem("orderEditData", JSON.stringify(sendingData));
    const url = `/#/worksheet`;
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // localStorage.setItem(`TOrdHdID${tabId}`, data.TOrdHdID);
    // // const url = "/#/worksheet";
    // // window.open(url);
    // navigate("/worksheet", { state: data.TOrdHdID });
  };

  const handleBOMSheet = (data) => {
    
    setEditLoader(true);

    dispatch(getGroupOrderListAsyncData(data.TOrdHdID)).then((res) => {
     
      if (res.success) {
        setEditLoader(false);

        if (res.Order.TOrdDtls.length > 0) {
          // Check if at least one item has a non-empty fabric list
          const hasFabric = res?.Order?.TOrdDtls?.some(
            (item) => item?.fabricList?.length > 0
          );

          if (hasFabric) {
            // If at least one fabric list is present, proceed to navigate
            const sendingData = {
              TOrdHdID: data.TOrdHdID,
            };
            localStorage.setItem("orderEditData", JSON.stringify(sendingData));

            const url = `/#/print-bom`;
            const a = document.createElement("a");
            a.href = url;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } else {
            // If no fabric list is present, show an error toast
            toast.error("This order has no Fabric");
          }
        } else {
          toast.error("This order has no Items");
        }
      }
    });
  };

  const [editLoader, setEditLoader] = useState(false);

  const handleEdit = (data) => {
    setEditLoader(true);
    localStorage.setItem(`customerId${tabId}`, data.AccountId);
    localStorage.setItem(`TOrdHdID${tabId}`, data.TOrdHdID);

    dispatch(getSingleCustomer(data.AccountId));
    dispatch(getSingleOrderDtlsAsyncData(data.TOrdHdID)).then((res) => {
      setEditLoader(false);

      localStorage.setItem(`mood${tabId}`, "edit");
      localStorage.setItem(`TOrdHdID${tabId}`, data.TOrdHdID);

      const sendingData = {
        AccountId: data.AccountId,
        TOrdHdID: data.TOrdHdID,
        from: "order-tracker",
        mood: "edit",
        tab: "under-booking",
        TOrdDtId: data.TOrdDtls[0].TOrdDtId,
        ItemId: data.TOrdDtls[0].ItemId,
        // balanceData: balanceData?.balanceData,
        TOrdNo: data.TOrdNo,
      };
      // const url = `/#/order-tracker-single-order/${data.TOrdNo}/edit`;
      const url = `/#/order-tracker-single-order`;
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      localStorage.setItem("orderEditData", JSON.stringify(sendingData));
    });
  };

  useEffect(() => {
    const childElement = document.querySelector(".custom-open-dropdown");

    if (dropdownOpen) {
      if (childElement !== null) {
        childElement.parentElement.classList.add("overflow-unset");
      }
    } else {
      if (childElement !== null) {
        childElement.parentElement.classList.remove("overflow-unset");
      }
    }
  }, [dropdownOpen]);

  //new logic=====================================================================================================
  const [isPayment, setIsPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const handlePayment = () => {
    // e.stopPropagation();
    setIsPayment(true);
  };
  const handlePaymentMethod = (value) => {
    setPaymentMethod(value);
  };
  const [paymentDelete, setPaymentDelete] = useState(false);

  const handlePaymentModal = (value) => {
    if (value === false) {
      setPaymentMethod("cash");
      setDisplayForm(true);
      setDisplaySummary(false);
    }
    setIsPayment(value);
    window.location.reload();
  };

  const [deletedData, setDeleteData] = useState();
  const handlePaymentDelete = (value) => {
    setDeleteData(value);
    setPaymentDelete(value);
  };

  const [displayForm, setDisplayForm] = useState(true);
  const [displaySummary, setDisplaySummary] = useState(false);

  const handleDisplaySummary = (value) => {
    setDisplaySummary(value);
  };

  const handleDispalyForm = (value) => {
    setDisplayForm(value);
  };

  return (
    <div className={`  ${dropdownOpen ? "custom-open-dropdown" : ""} `}>
      <div className="action td-padding">
        <div className="action-icons d-flex justify-content-center ">
          <div
            className="printer single-icon"
            id={`BtnOrdTrckrPrintInvoice${balanceData.index}`}
            onClick={() =>
              handleAction(
                // "printwotracker",
                "BtnOrdTrckrPrintInvoice",
                "action",
                handlePrintEstimate,
                balanceData.balanceData
              )
            }
          >
            <em className="fs-4 ni ni-printer" />
          </div>
          <div
            id={`BtnOrdTrckrInvMail${balanceData.index}`}
            className="message single-icon"
          >
            {emailLoader ? (
              <div>
                <Spinner size="sm" color="light" className="mx-2 mt-1 border" />
              </div>
            ) : (
              <div className="">
                <em
                  className="fs-4 ni ni-mail"
                  onClick={() =>
                    handleAction(
                      // "printwotracker",
                      "BtnOrdTrckrInvMail",
                      "action",
                      handleSendBillEmail,
                      balanceData.balanceData
                    )
                  }
                  // onClick={(e) =>
                  //   handleSendBillEmail(e, balanceData.balanceData)
                  // }
                />
              </div>
            )}
          </div>
          <div id={`action${balanceData.index}`}>
            {editLoader ? (
              <Spinner size="sm" color="light" className="mx-2 mt-1 " />
            ) : (
              <UncontrolledDropdown
                isOpen={dropdownOpen}
                toggle={(event) => toggleDropdown(event)}
                // id={`action${balanceData.index}`}
              >
                <DropdownToggle className="dropdownToggle-button single-icon more">
                  <em className="fs-4 ni ni-more-h roted-180" />
                </DropdownToggle>
                <DropdownMenu
                  container="body"
                  end
                  className=" dropdown-menu-s1"
                >
                  <ul className="link-list-opt no-bdr action-icons">
                    <li>
                      <DropdownItem
                        tag="a"
                        id="BtnOrdTrckrEditOrder"
                        onClick={() =>
                          handleAction(
                            // "printwotracker",
                            "BtnOrdTrckrEditOrder",
                            "action",
                            handleEdit,
                            balanceData.balanceData
                          )
                        }
                        // onClick={() => handleEdit(balanceData.balanceData)}
                      >
                        <img src={Cicon.ActionEditIcon} alt="ActionEditIcon" />
                        <span>Edit</span>
                      </DropdownItem>
                    </li>
                    <li>
                      <DropdownItem
                        tag="a"
                        id="BtnOrdTrckrDeleteOrder"
                        onClick={() =>
                          handleAction(
                            // "printwotracker",
                            "BtnOrdTrckrDeleteOrder",
                            "action",
                            handleDelete
                          )
                        }
                      >
                        <img
                          src={Cicon.ActionDeleteIcon}
                          alt="ActionDeleteIcon"
                        />
                        <span>Delete</span>
                      </DropdownItem>
                    </li>

                    <li>
                      <DropdownItem
                        tag="a"
                        id="BtnOrdTrckrPrintWorksheet"
                        onClick={() =>
                          handleAction(
                            "BtnOrdTrckrPrintWorksheet",
                            "action",
                            handleWorkSheet,
                            balanceData.balanceData
                          )
                        }
                        // onClick={() => handleWorkSheet(balanceData.balanceData)}
                        // disabled={!isActionPermitted("printwotracker11")}
                      >
                        <img
                          src={Cicon.ActionPrintIcon}
                          alt="ActionPrintIcon"
                        />
                        <span>Print Worksheet</span>
                      </DropdownItem>
                    </li>

                    <li>
                      <DropdownItem
                        tag="a"
                        id="BtnOrdTrckrPrintBOM"
                        // disabled={}
                        onClick={() =>
                          handleAction(
                            "BtnOrdTrckrPrintBOM",
                            "action",
                            handleBOMSheet,
                            balanceData.balanceData
                          )
                        }
                        // onClick={(ev) => ev.preventDefault()}
                      >
                        <img
                          src={Cicon.ActionPrintBOMIcon}
                          alt="ActionPrintIcon"
                        />
                        <span>Print BOM</span>
                      </DropdownItem>
                    </li>
                    <li>
                      <DropdownItem
                        tag="a"
                        id="BtnOrdTrckrPrintBarcode"
                        onClick={() =>
                          handleAction(
                            "BtnOrdTrckrPrintBarcode",
                            "action"
                            // handleWorkSheet,
                            // balanceData.balanceData
                          )
                        }
                        // onClick={(ev) => ev.preventDefault()}
                      >
                        <img
                          src={Cicon.ActionPrintBarcodeIcon}
                          alt="ActionPrintIcon"
                        />
                        <span>Print Barcode</span>
                      </DropdownItem>
                    </li>
                  </ul>
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
          </div>
        </div>
        <Tooltip
          id={`BtnOrdTrckrPrintInvoice${balanceData.index}`}
          direction="top"
          text={ToolTipContent.printInvoice}
        />
        <Tooltip
          id={`BtnOrdTrckrInvMail${balanceData.index}`}
          direction="top"
          text={ToolTipContent.emailInvoice}
        />
        <Tooltip
          id={`action${balanceData.index}`}
          direction="top"
          text={ToolTipContent.orderAction}
        />

        {balanceData?.balanceData?.OrdAmt > 0 && (
          <div className="balance-btn text-center mt-0">
            <Button
              outline
              color="light"
              id="BtnOrdTrckrPayment"
              onClick={() =>
                handleAction(
                  "BtnOrdTrckrPayment",
                  "action",
                  handlePayment
                  // balanceData.balanceData
                )
              }
              // onClick={(e) => handlePayment(e)}
            >
              <img src={Cicon.balanceIcon} alt="balance icon" />
              <span className="ms-1">Pay Now</span>
            </Button>
          </div>
        )}
        {/* <div className="action-btn text-center mt-1 ">
          {viewLoader ? (
            <Button outline color="light">
              <Spinner size="sm" color="light" className="mx-0" />
            </Button>
          ) : (
            <Button
              outline
              color="light"
              onClick={() => handleView(balanceData.balanceData)}
            >
              <img src={Cicon.viewIcon} alt="viewIcon" />
              <span className="ms-1">View</span>
            </Button>
          )}
        </div> */}
      </div>

      <div className="">
        <Modal
          isOpen={isPayment}
          size={
            (paymentMethod === "cash" ||
              paymentMethod === "wallet" ||
              paymentMethod === "bank") &&
            displaySummary &&
            displayForm
              ? "xl"
              : "lg"
          }
          className="py-0"
        >
          <PayNowModel
            TOrdHdID={balanceData.balanceData.TOrdHdID}
            AccountId={balanceData.balanceData.AccountId}
            onPaymentMethod={handlePaymentMethod}
            onPaymentModal={handlePaymentModal}
            onPaymentDelete={handlePaymentDelete}
            onForm={handleDispalyForm}
            onSummary={handleDisplaySummary}
            // tab="under-booking"
          />
        </Modal>
      </div>
    </div>
  );
};

export default CustomMoreCell;

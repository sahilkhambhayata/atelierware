import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Modal, Skeleton } from "@mui/material";
import { useForm } from "react-hook-form";
import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownItem,
  Form,
  Spinner,
} from "reactstrap";
import { toast } from "react-toastify";

import Button from "../../../../Components/button/Button";

import { useNavigate } from "react-router";

import Cimages from "./../../Images/CommonImageFile";
import Cicon from "./../../Images/CommonIconFile";
import { getSingleCustomer } from "../../../../redux/actions/customerAction";
import { getSingleOrderDtlsAsyncData } from "../../../../redux/actions/createorddtlsAction";
import { getGroupOrderListAsyncData } from "../../../../redux/actions/groupOrderListAction";
import { sendEmailOfInvoice } from "../../../../redux/actions/sendInvoiceEmailAction";
import { useTheme } from "../../../../Layout/Provider/Themes";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";
import Tooltip from "../../../../Components/Tooltip/Tooltip";
import ToolTipContent from "../../../../Components/Tooltip/ToolTipContent";

const CustomMoreCell = ({ balanceData, rowNo, onDelete, onEdit }) => {
  const user = useSelector((state) => state.loginUser);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [emailLoader, setEmailLoader] = useState(false);

  const { handleAction } = usePermissions();

  const toggleDropdown = () => {
    // e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };
  const { tabId } = useTheme();
  const handleDelete = (ev) => {
    onDelete();
  };

  const navigate = useNavigate();



  const [editLoader, setEditLoader] = useState(false);

  // const handleEdit = () => {
  //   onEdit();
  // };

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

  const handleWorkSheet = (data) => {

    const sendingData = {
      TOrdHdID: data.TOrdHdID,
    };
    localStorage.setItem("orderEditData", JSON.stringify(sendingData));
    localStorage.setItem(`TOrdHdID${tabId}`, data.TOrdHdID);
    const url = `/#/worksheet`;
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // e.stopPropagation();
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

  const handlePrintBill = (data) => {
    const sendingData = {
      TOrdHdID: data.TOrdHdID,
    };
    localStorage.setItem("orderEditData", JSON.stringify(sendingData));
    localStorage.setItem(`TOrdHdID${tabId}`, data.TOrdHdID);
    const url = `/#/invoice`;
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // e.stopPropagation();
    // const url = "/#/invoice";

    // window.open(url, "_blank");
  };

  const handleSendBillEmail = (data) => {
    // e.stopPropagation();
    setEmailLoader(true);
    localStorage.setItem(`TOrdHdID${tabId}`, data.TOrdHdID);

    dispatch(sendEmailOfInvoice([data.TOrdHdID])).then((res) => {
      if (res.success) {
        setEmailLoader(false);
      }
    });
    //now i want call api which have
  };
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();

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
  // const transformedPermissionReducer = useSelector(
  //   (state) => state.transformedPermissionReducer
  // );

  return (
    <div className={` ${dropdownOpen ? "custom-open-dropdown" : ""} `}>
      <div className="action td-padding">
        <div className="action-icons d-flex justify-content-center ">
          <div
            id={`BtnOrdTrckrPrintInvoice${balanceData.index}`}
            className="printer single-icon"
            onClick={() =>
              handleAction(
                // "printwotracker",
                "BtnOrdTrckrPrintInvoice",
                "action",
                handlePrintBill,
                balanceData.balanceData
              )
            }
            // onClick={(e) => handlePrintBill(e, balanceData.balanceData)}
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
              <Spinner size="sm" color="light" className="mx-2 mt-1" />
            ) : (
              <UncontrolledDropdown
                isOpen={dropdownOpen}
                toggle={(e) => toggleDropdown(e)}
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
                        // onClick={handleDelete}
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
                        // disabled={!isActionPermitted('printwotracker')}
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
    </div>
  );
};

export default CustomMoreCell;

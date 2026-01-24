import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Modal, Skeleton } from "@mui/material";
import Button from "../../../../Components/button/Button";

import icon from "./../../Images/CommonIconFile";

import { useForm } from "react-hook-form";
import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownItem,
  Form,
  Dropdown,
  Spinner,
} from "reactstrap";
import { useNavigate } from "react-router";
import { getSingleCustomer } from "../../../../redux/actions/customerAction";
import { getSingleOrderDtlsAsyncData } from "../../../../redux/actions/createorddtlsAction";
import {
  getGroupOrderListAsyncData,
  getSingleGroupOrderList,
} from "../../../../redux/actions/groupOrderListAction";
import { getSingleItemWorksheetPrintOrder } from "../../../../redux/actions/workSheetAction";
import { toast } from "react-toastify";
import { useTheme } from "../../../../Layout/Provider/Themes";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";
import { getSingleOrderList } from "../../../../redux/actions/orderListAction";

const CustomMoreCell = ({ data, tab, onEdit }) => {
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { handleAction } = usePermissions();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const { tabId } = useTheme();

  const [editLoader, setEditLoader] = useState(false);

  const handleEdit = (data) => {
    if (tab == "other") {
      onEdit();
    } else {
      setEditLoader(true);
      let results = [];
      let isGroupOrder = false;
      localStorage.setItem(`customerId${tabId}`, data.orderHead.AccountId);
      localStorage.setItem(`TOrdHdID${tabId}`, data.TOrdHdID);

      dispatch(getSingleCustomer(data.orderHead.AccountId));
      dispatch(getSingleOrderDtlsAsyncData(data.TOrdHdID));
      dispatch(getGroupOrderListAsyncData(data.TOrdHdID)).then((res) => {
        if (res.success) {
          setEditLoader(false);

          res.Order.TOrdDtls.forEach((item) => {
            if (item?.groupItemList?.length > 0) {
              const groupMatches = item.groupItemList.filter(
                (data1) => data1.TOrdDtId === data.TOrdDtId
              );

              if (groupMatches.length > 0) {
                results.push(item);

                localStorage.setItem(`TOrdDtID${tabId}`, item.TOrdDtId);
                isGroupOrder = true;
              }
            }

            if (item.TOrdDtId === data.TOrdDtId) {
              results.push(item);
              localStorage.setItem(`TOrdDtID${tabId}`, data.TOrdDtId);
            }
          });
        }
        if (isGroupOrder) {
          const sendingData = {
            AccountId: data.orderHead.AccountId,
            TOrdHdID: data.TOrdHdID,
            from: "item-tracker",
            mood: "edit",
            tab: "under-booking",
            TOrdDtId: results?.[0]?.TOrdDtId,
            ItemId: results?.[0]?.ItemId,
            // balanceData: results,
            TOrdNo: data.orderHead.TOrdNo,
          };
          dispatch(getSingleGroupOrderList(results?.[0]?.TOrdDtId));
          const url = `/#/group-order-home-page`;
          const a = document.createElement("a");
          a.href = url;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          localStorage.setItem("orderEditData", JSON.stringify(sendingData));
        } else {
          const sendingData = {
            AccountId: data.orderHead.AccountId,
            TOrdHdID: data.TOrdHdID,
            from: "item-tracker",
            mood: "edit",
            tab: "under-booking",
            TOrdDtId: data?.TOrdDtId,
            ItemId: data.ItemId,

            TOrdNo: data.orderHead.TOrdNo,
          };
          dispatch(getSingleOrderList(data?.TOrdDtId));

          const url = `/#/add-order-home-page`;
          const a = document.createElement("a");
          a.href = url;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          document.body.appendChild(a);

          a.click();
          document.body.removeChild(a);
          localStorage.setItem("orderEditData", JSON.stringify(sendingData));
        }
      });
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  const navigate = useNavigate();
  const handleWorksheet = (item) => {
    const sendingData = {
      TOrdHdID: item.TOrdHdID,
      TOrdDtID: item.TOrdDtId,
    };

    localStorage.setItem("orderEditData", JSON.stringify(sendingData));
    const url = `/#/item-worksheet`;
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    localStorage.setItem(`TOrdHdID${tabId}`, item.TOrdHdID);
    localStorage.setItem(`TOrdDtID${tabId}`, item.TOrdDtId);
  };

  return (
    <div className={` ${dropdownOpen ? "custom-open-dropdown" : ""} `}>
      <div className="action td-padding">
        <div className="action-icons d-flex justify-content-center ">
          {editLoader ? (
            <Spinner size="sm" color="light" className="mx-0" />
          ) : (
            <UncontrolledDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle className="dropdownToggle-button single-icon more">
                <em className="fs-4 ni ni-more-h roted-180" />
              </DropdownToggle>
              <DropdownMenu container="body" end className=" dropdown-menu-s1">
                <ul className="link-list-opt no-bdr action-icons">
                  <li>
                    <DropdownItem
                      tag="a"
                      id="BtnItemTrckrEditItem"
                      onClick={() =>
                        handleAction(
                          "BtnItemTrckrEditItem",
                          "action",
                          handleEdit,
                          data
                          // balanceData.balanceData
                        )
                      }
                    >
                      <img src={icon.ActionEditIcon} alt="ActionEditIcon" />
                      <span>Edit</span>
                    </DropdownItem>
                  </li>
                  
                  <li>
                    <DropdownItem
                      tag="a"
                      disabled={data?.ordMeasure?.length <= 0}
                      id="BtnItemTrckrPrintWorksheet"
                      onClick={() =>
                        handleAction(
                          "BtnItemTrckrPrintWorksheet",
                          "action",
                          handleWorksheet,
                          data
                          // balanceData.balanceData
                        )
                      }
                    >
                      <img src={icon.ActionPrintIcon} alt="ActionPrintIcon" />
                      <span>Print Worksheet</span>
                    </DropdownItem>
                  </li>
                </ul>
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomMoreCell;

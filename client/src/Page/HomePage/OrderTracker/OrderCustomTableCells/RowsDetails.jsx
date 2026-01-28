import React, { useEffect, useState } from "react";
// import barcodeImg from "../../../../images/icons/odertable-barcode.svg";
// import chatIcon from "../../../../images/icons/chatIcon.svg";
// import Status from "../../../../Layout/header/dropdown/status/Status";
import { useNavigate } from "react-router-dom";
import Button from "../../../../Components/button/Button";
import tridateImg from "../../../../images/icons/tridateImg.svg";
import deldateImg from "../../../../images/icons/deldateImg.svg";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import Icon from "../../../../Components/icon/Icon";
import { useDispatch, useSelector } from "react-redux";
// import RowDetailsStatus from "./RowDetailsStatus";
import Cicon from "./../../Images/CommonIconFile";
import { formatDate } from "../../../../redux/dateFormateFunction";
import { getSingleCustomer } from "../../../../redux/actions/customerAction";
import { getSingleOrderDtlsAsyncData } from "../../../../redux/actions/createorddtlsAction";
import {
  getGroupOrderListAsyncData,
  getSingleGroupOrderList,
} from "../../../../redux/actions/groupOrderListAction";
import { useTheme } from "../../../../Layout/Provider/Themes";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";
import Tooltip from "../../../../Components/Tooltip/Tooltip";
import { getSingleOrderList } from "../../../../redux/actions/orderListAction";

// import Cimages from "./../../Images/CommonImageFile";

const RowsDetails = ({ val, data, tab, customerData, balanceData }) => {
  const { tabId } = useTheme();
  const { handleAction } = usePermissions();


 
  const handleWorkSheet = (item) => {
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
    // e.stopPropagation();
    localStorage.setItem(`TOrdHdID${tabId}`, item.TOrdHdID);
    localStorage.setItem(`TOrdDtID${tabId}`, item.TOrdDtId);
  };

  const getConfig = useSelector((state) => state?.config?.orderType);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editLoader, setEditLoader] = useState(false);

  const handleEdit = (data) => {
    setEditLoader(true);
    let results = [];
    let isGroupOrder = false;
    localStorage.setItem(`customerId${tabId}`, val);
    localStorage.setItem(`TOrdHdID${tabId}`, data.TOrdHdID);


    
    dispatch(getSingleCustomer(val));
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
          AccountId: val,
          TOrdHdID: data.TOrdHdID,
          from: "item-tracker",
          mood: "edit",
          tab: "under-booking",
          TOrdDtId: results?.[0]?.TOrdDtId,
          ItemId: results?.[0]?.ItemId,
          // balanceData: results,
          TOrdNo: data.OrdSrNo.split('-')[0],
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
          AccountId: val,
          TOrdHdID: data.TOrdHdID,
          from: "item-tracker",
          mood: "edit",
          tab: "under-booking",
          TOrdDtId: data?.TOrdDtId,
          ItemId: data.ItemId,
          // balanceData: results,
          TOrdNo: data.OrdSrNo.split('-')[0],
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
  };

  return (
    <div className="table-container" key={data.id}>
      <div className="table-header">
        <div className="table-row">
          {/* <div className="table-cell checkbox-cell">
            <div className="custom-control custom-checkbox   thead-checkbox ml-1">
              <input
                type="checkbox"
                className="custom-control-input"
                id={`subid${data.TOrdDtId}`}
                onChange={handleSelectAll}
              />
              <label
                className="custom-control-label"
                htmlFor={`subid${data.id}`}
              ></label>
            </div>
          </div> */}
          <div className="table-cell">Garment Id</div>
          <div className="table-cell">Garment details</div>
          <div className="table-cell">Member details</div>
          <div className="table-cell">Commitments</div>
          <div className="table-cell">Measurement</div>
          <div className="table-cell">Status</div>
          <div className="table-cell">Last Update</div>
          <div className="table-cell lastMoreDropDown"></div>
        </div>
      </div>

      <div className="table-body">
        {/* {console.log(data,"This is main data")} */}
        {data?.map((item, ind) => {
          let formattedTrialDate =
            item.TrialDate !== null
              ? formatDate(
                  new Date(item.TrialDate),
                  getConfig?.DateAndTime,
                  true
                  // "dd-MMM-yyyy 12"
                )
              : "";

          let formattedDelDate = formatDate(
            new Date(item.DelDate),
            getConfig?.DateAndTime,
            true
            // "dd-MMM-yyyy 12"
          );

          let lastUpdateDate = formatDate(
            new Date(item.LastUpdateddate),
            getConfig?.DateAndTime,
            true
          );

          return (
            <>
              <div className="main-row" key={ind}>
                <div className="table-row tr-space">
                  {/* <div className="table-cell checkbox-cell">
                    <div className="custom-control custom-checkbox   thead-checkbox ml-1">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id={`subSubid${item.TOrdDtId}`}
                        checked={selectedRows.includes(`${item.TOrdDtId}`)}
                        onChange={() => handleSubSubidChange(item.TOrdDtId)}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor={`subSubid${item.TOrdDtId}`}
                      ></label>
                    </div>
                  </div> */}

                  <div className="table-cell">
                    <div className="GarmentIdBox">
                      <div className="Garment-title heading-title">
                        {item.OrdSrNo}
                      </div>
                      <div className="barcode-icon-text align-items-center  d-flex justify-content-center">
                        <div className="barcode-icon">
                          <img
                            src={Cicon.odertableBarcodeIcon}
                            alt="barcodeIcon"
                          />
                        </div>

                        <div className="barcode-text heading-subTitle">
                          {item.barcode}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="table-cell">
                    <div className="GarmentDetailsBox">
                      <div className="GarmentSname heading-title">
                        {item.ItemName}
                      </div>
                      <div
                        className="GarmentSfild heading-subTitle"
                        id={`ItemDesc${item.TOrdDtId}`}
                      >
                        {item?.ItemDesc?.length > 50
                          ? item?.ItemDesc?.slice(0, 50) + "..."
                          : item?.ItemDesc}
                      </div>
                    </div>
                    <Tooltip
                      id={`ItemDesc${item.TOrdDtId}`}
                      direction="right"
                      text={item.ItemDesc}
                    />
                  </div>

                  <div className="table-cell">
                    <div className="memberDetailsBox">
                      <div className="memberName heading-title">
                        {customerData.customerName}
                      </div>
                      <div className="memberPhone heading-subTitle">
                        {customerData.customerPhoneNumber}
                      </div>
                    </div>
                  </div>

                  <div className="table-cell">
                    <div className="commitmentsBox">
                      <div className="tri-text-date d-flex align-items-center justify-content-center">
                        <div className="img-sec ">
                          <img
                            src={tridateImg}
                            alt=""
                            className="comitments-images"
                          />
                        </div>
                        <div className="tri-date heading-subTitle ml-1">
                          {formattedTrialDate}
                        </div>
                      </div>
                      <div className="del-text-date d-flex align-items-center justify-content-center">
                        <div className="img-sec ">
                          <img
                            src={deldateImg}
                            alt=""
                            className="comitments-images"
                          />
                        </div>{" "}
                        <div className="tri-date heading-subTitle ml-1">
                          {formattedDelDate}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="table-cell">
                    <div className="measurementStatus heading-title">
                      {data[0].ordMeasure.length > 0 ? "Done" : "Pending"}
                    </div>
                  </div>

                  <div className="table-cell">
                    <Button
                      color="light"
                      className={` bg-white `}
                      style={{ border: "2px solid #559bfb" }}
                    >
                      <span
                        className="text-uppercase"
                        style={{ color: "#559bfb" }}
                      >
                        {item?.Statuses[0]?.StatusName}
                      </span>
                    </Button>
                  </div>

                  <div className="table-cell">
                    <div className="lastUpdate heading-title">
                      {lastUpdateDate}
                    </div>
                  </div>

                  <div className="table-cell lastMoreDropDown-cell justify-content-center">
                    <div className="moreIcon">
                      {editLoader ? (
                        <Spinner size="sm" color="light" className="mx-0" />
                      ) : (
                        <UncontrolledDropdown>
                          <DropdownToggle className="dropdownToggle-button single-icon more">
                            <em className="fs-4 ni ni-more-h roted-180 " />
                          </DropdownToggle>
                          <DropdownMenu
                            end
                            className="dropdown-menu-s1 "
                            style={{ width: "200px" }}
                          >
                            <ul className="link-list-opt no-bdr cursor-pointer">
                              <li>
                                <DropdownItem
                                  tag="a"
                                  id="BtnOrdTrckrEditOrder"
                                  onClick={() =>
                                    handleAction(
                                      "BtnOrdTrckrEditOrder",
                                      "action",
                                      handleEdit,
                                      item
                                    )
                                  }
                                  // onClick={() => handleEdit(item)}
                                >
                                  <Icon name="edit-fill"></Icon>
                                  <span>Edit</span>
                                </DropdownItem>
                              </li>
                              <li>
                                <DropdownItem
                                  tag="a"
                                  disabled={data[0].ordMeasure.length <= 0}
                                  id="BtnOrdTrckrPrintWorksheet"
                                  onClick={() =>
                                    handleAction(
                                      "BtnOrdTrckrPrintWorksheet",
                                      "action",
                                      handleWorkSheet,
                                      item
                                    )
                                  }
                                  // onClick={() => handleWorkSheet(item)}
                                  // disabled={!isActionPermitted('printwotracker')}
                                >
                                  <img
                                    src={Cicon.ActionPrintIcon}
                                    alt="ActionPrintIcon"
                                    width={20}
                                    className="me-2"
                                  />
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
                <div className="tab-des d-flex justify-content-between">
                  <div className="ml-5 text">{item.MRemarks}</div>
                  <div className="img-icon">
                    <img src={Cicon.chatIcon} alt="" />
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default RowsDetails;

import React, { useEffect, useState } from "react";
import CategoryIcon from "../../../../images/icons/add-order-caterory-icon.svg";
import saleTypeIcon from "../../../../images/icons/add-order-saletype-icon.svg";
import SpecialIcon from "../../../../images/icons/special-icon.svg";
import PriorityIcon from "../../../../images/icons/add-order-priority-icon.svg";
import orderTypeIcon from "../../../../images/icons/add-order-ordertype-icon.svg";
import tridateImg from "../../../../images/icons/tridateImg.svg";
// import urgentIcon from "../../../../images/icons/Customer-Urgent.svg";
// import SpecialIcon from "../../../../images/icons/special-icon.svg";
import deldateImg from "../../../../images/icons/deldateImg.svg";
import DatePicker from "react-datepicker";
import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownItem,
  Spinner,
  UncontrolledTooltip,
} from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import { getSaleType } from "../../../../redux/actions/saleTypeAction";
import { getMasterList } from "../../../../redux/actions/masterAction";
import { getConfig } from "../../../../redux/actions/configAction";
import { getOrderType } from "../../../../redux/actions/orderTypeAction";
import { getDesignerList } from "../../../../redux/actions/designerAction";
import Tooltip from "../../../../Components/Tooltip/Tooltip";
import ToolTipContent from "../../../../Components/Tooltip/ToolTipContent";
import { useTheme } from "../../../../Layout/Provider/Themes";

const EditAdvanceDetailForm = ({ onDataChange }) => {
  const createorddtls = useSelector(
    (state) => state.createorddtls.ordDetails.upCrtOrder
  );
  const { tabId } = useTheme();
  const config = useSelector((state) => state.config?.orderType);
  const master = useSelector((state) => state.master.orderDetails);
  const designer = useSelector((state) => state.designer.orderDetails);
  const customer = useSelector((state) => state.customerDetails);
  const customerId = localStorage.getItem(`customerId${tabId}`);
  const CompanyId = localStorage.getItem("CompanyId");
  const BranchId = localStorage.getItem("BranchId");

  const selectedCustomer = customer?.single.data;
  const CustomerTOrdHdID = selectedCustomer?.TOrdHdID;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenOrderType, setIsDropdownOpenOrderType] = useState(false);
  const [isDropdownOpenPriority, setIsDropdownOpenPriority] = useState(false);
  const [isDropdownOpenDesigner, setIsDropdownOpenDesigner] = useState(false);
  const [isDropdownOpenMaster, setIsDropdownOpenMaster] = useState(false);
  const [getConfigDetail, setGetConfigDetail] = useState(config);
  const dateFormat =
  config?.DateAndTime?.replace("true", "HH:mm aa").replace("false", "") ??
  "dd/MM/yyyy HH:mm"; 
  const weekend =
    getConfigDetail?.WeekOff !== null ? getConfigDetail?.WeekOff : "NoWEe KOFF";

  const disableMondays = (date) => {
    const weekendUpperCase = weekend.toUpperCase().trim();

    switch (weekendUpperCase) {
      case "SUNDAY":
        return date.getDay() !== 0;
      case "MONDAY":
        return date.getDay() !== 1;
      case "TUESDAY":
        return date.getDay() !== 2;
      case "WEDNESDAY":
        return date.getDay() !== 3;
      case "THURSDAY":
        return date.getDay() !== 4;
      case "FRIDAY":
        return date.getDay() !== 5;
      case "SATURDAY":
        return date.getDay() !== 6;
      case "NOWEEKOFF":
        return true;
      default:
        return true;
    }
  };

  const { orderType } = useSelector((state) => state?.orderType);
  const saleType = useSelector((state) => state?.saleType?.salesType);

  const [advanceData, setAdvanceData] = useState({
    TOrdHdID: createorddtls.TOrdHdID,
    getCompanyId: CompanyId,
    getBranchId: BranchId,
    saleTypeId: createorddtls.saleTypeId,
    saleType: createorddtls.SalesType,
    ordeType: "",
    OrderTypeId: "",
    priority: createorddtls.UrgentType === "1" ? "Regular" : "Urgent",
    trialDate: new Date(createorddtls.TrialDate),
    deliveryDate: new Date(createorddtls.DelDate),
    designer: createorddtls.SalesmanName,
    designerId: "",
    master: createorddtls.MasterName,
    masterId: "",
    orderDate: createorddtls.TOrdDate,
    orderNo: "",
    poDate:
      createorddtls.PoDate === null ? null : new Date(createorddtls.PoDate),
    poNo: createorddtls.PoNo === "" ? "" : createorddtls.PoNo,
    // isManualOrdNo: config?.ManualOrdNo && config?.ManualOrdNo === "0",
  });

  const handleDataChange = (key, value, item) => {
    if (key === "saleType") {
      setAdvanceData((prevData) => ({
        ...prevData,
        saleTypeId: item.Id,
      }));
    }
    if (key === "ordeType") {
      setAdvanceData((prevData) => ({
        ...prevData,
        OrderTypeId: item.OrderTypeId,
      }));
    }
    if (key === "designer") {
      setAdvanceData((prevData) => ({
        ...prevData,
        designerId: item.EmpId,
      }));
    }
    if (key === "master") {
      setAdvanceData((prevData) => ({
        ...prevData,
        masterId: item.WorkerId,
      }));
    }
    setAdvanceData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const updateDateField = (key, selectedDate) => {
    if (!selectedDate) return;

    setAdvanceData((prevData) => {
      const updatedData = { ...prevData };

      const existingDate = updatedData[key] || new Date();
      const newDateTime = new Date(existingDate);

      if (
        existingDate.getHours() === selectedDate.getHours() &&
        existingDate.getMinutes() === selectedDate.getMinutes()
      ) {
        
        newDateTime.setFullYear(selectedDate.getFullYear());
        newDateTime.setMonth(selectedDate.getMonth());
        newDateTime.setDate(selectedDate.getDate());
      }

      newDateTime.setHours(selectedDate.getHours());
      newDateTime.setMinutes(selectedDate.getMinutes());
      newDateTime.setSeconds(selectedDate.getSeconds());
      newDateTime.setMilliseconds(selectedDate.getMilliseconds());

      updatedData[key] = newDateTime;
      return updatedData;
    });
  };

  useEffect(() => {
    orderType?.map((val) => {
      if (val.OrderTypeId === createorddtls.OrderTypeId) {
        setAdvanceData({
          ...advanceData,
          ordeType: val.OrderType,
          OrderTypeId: val.OrderTypeId,
        });
      }
    });
  }, [orderType]);

  useEffect(() => {
    onDataChange(advanceData);
  }, [advanceData]);

  const dispatch = useDispatch();

  const BU_Id = localStorage.getItem("BU_Id");

  useEffect(() => {
    if (BU_Id) {
      dispatch(getConfig(BU_Id));
      dispatch(getSaleType(BU_Id));
      dispatch(getMasterList(BU_Id));
      dispatch(getOrderType(BU_Id));
      dispatch(getDesignerList(BU_Id));
    }
  }, []);

  return (
    <div className="px-2">
      <div className="row justify-content-between">
        <div className="d-flex justify-content-between col-lg-3 col-md-6 col-12 p-0">
          <UncontrolledDropdown
            className="user-dropdown w-100 position-relative nk-header-searchbox form-control-lg form-control cursor-pointer"
            id="saleType"
            isOpen={isDropdownOpen}
            toggle={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <DropdownToggle
              tag="a"
              className="w-100"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="">
                <div className="d-flex text-dark align-items-center">
                  <img src={saleTypeIcon} alt="" width="20" className="me-2" />
                  <div className="">
                    <span className="text-uppercase ">
                      {/* {selectedSaleType
                        ? selectedSaleType.Name
                        : saleTypeDefault?.Name} */}

                      {advanceData.saleType === "" ? (
                        <Spinner size="sm" color="secondary" className="" />
                      ) : (
                        advanceData.saleType
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </DropdownToggle>
            <DropdownMenu
              className="dropdown-menu-s1 mt-1"
              style={{ width: "190px" }}
            >
              <div className="dropdown-body">
                <div className="p-2">
                  <ul>
                    {saleType?.map((item, ind) => {
                      return (
                        <React.Fragment key={ind}>
                          <DropdownItem
                            id={`saleType${ind}`}
                            className="fw-medium fs-14 d-flex align-items-center"
                            onClick={() =>
                              handleDataChange("saleType", item.Name, item)
                            }
                          >
                            {item.Name?.length > 13
                              ? item.Name.slice(0, 13) + "..."
                              : item.Name}
                          </DropdownItem>

                          {item.Name?.length > 13 ? (
                            <>
                              <Tooltip
                                id={`saleType${ind}`}
                                direction="right"
                                text={item.Name}
                              />
                            </>
                          ) : (
                            ""
                          )}
                        </React.Fragment>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </DropdownMenu>
          </UncontrolledDropdown>

          {!isDropdownOpen && (
            <Tooltip
              id={`saleType`}
              direction="top"
              text={ToolTipContent.saleType}
            />
          )}
        </div>

        <div className="d-flex justify-content-between col-lg-3 col-md-6 col-12 p-0">
          <UncontrolledDropdown
            className="user-dropdown position-relative nk-header-searchbox w-100 form-control-lg form-control cursor-pointer"
            id="ordeType"
            isOpen={isDropdownOpenOrderType}
            toggle={() => setIsDropdownOpenOrderType(!isDropdownOpenOrderType)}
          >
            <DropdownToggle
              tag="a"
              className="w-100"
              onClick={() =>
                setIsDropdownOpenOrderType(!isDropdownOpenOrderType)
              }
            >
              <div className="">
                <div className="d-flex text-dark align-items-center">
                  <img src={orderTypeIcon} alt="" className="mr-2" width="18" />
                  <div className="">
                    <span className="text-uppercase">
                      {/* {selectedOrderType
                        ? selectedOrderType.OrderType
                        : orderTypeDefault?.OrderType} */}
                      {advanceData.ordeType === "" ? (
                        <Spinner size="sm" color="secondary" className="" />
                      ) : (
                        advanceData.ordeType
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </DropdownToggle>

            <DropdownMenu
              className="dropdown-menu-s1 mt-1"
              style={{ width: "190px" }}
            >
              <div className="dropdown-body">
                <div className="p-2">
                  <ul>
                    {orderType?.map((item, ind) => {
                      return (
                        <React.Fragment key={ind}>
                          <DropdownItem
                            id={`ordeType${ind}`}
                            className="fw-medium fs-14 d-flex align-items-center"
                            onClick={() =>
                              handleDataChange("ordeType", item.OrderType, item)
                            }
                            // onClick={() => handleOrderType(item.OrderTypeId)}
                          >
                            {/* {item.OrderType} */}
                            {item.OrderType?.length > 13
                              ? item.OrderType.slice(0, 13) + "..."
                              : item.OrderType}
                          </DropdownItem>

                          {item.OrderType?.length > 13 ? (
                            <>
                              <Tooltip
                                id={`ordeType${ind}`}
                                direction="left"
                                text={item.OrderType}
                              />
                            </>
                          ) : (
                            ""
                          )}
                        </React.Fragment>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </DropdownMenu>
          </UncontrolledDropdown>
          {!isDropdownOpenOrderType && (
            <Tooltip
              id={`ordeType`}
              direction="top"
              text={ToolTipContent.orderType}
            />
          )}
        </div>

        <div className="d-flex justify-content-between col-lg-6 col-12 p-0">
          <UncontrolledDropdown
            className=" user-dropdown position-relative nk-header-searchbox w-100 form-control-lg form-control cursor-pointer"
            id="priority"
            isOpen={isDropdownOpenPriority}
            toggle={() => setIsDropdownOpenPriority(!isDropdownOpenPriority)}
          >
            <DropdownToggle
              tag="a"
              className="w-100"
              onClick={() => setIsDropdownOpenPriority(!isDropdownOpenPriority)}
            >
              {advanceData.priority === "Urgent" && (
                <img
                  src={SpecialIcon}
                  alt=""
                  width="12"
                  className="me-2 position-absolute"
                  style={{ right: "0%" }}
                />
              )}

              <div className="d-flex text-dark align-items-center">
                <img src={PriorityIcon} alt="" className="mr-2" width="18" />
                <div className="">
                  <span
                    className={`text-uppercase fs-14 fw-medium ${
                      advanceData.priority === "Urgent"
                        ? "text-danger"
                        : "text-dark"
                    }`}
                  >
                    <span>Priority </span> :{" "}
                    <span> {advanceData.priority}</span>
                  </span>
                </div>
              </div>
            </DropdownToggle>

            <DropdownMenu
              className="dropdown-menu-s1 mt-1"
              style={{ width: "190px" }}
            >
              <div className="dropdown-body">
                <div className="p-2">
                  <ul>
                    {/* {orderType?.map((item, ind) => {
                        return ( */}
                    <DropdownItem
                      className="fw-medium fs-14 d-flex align-items-center"
                      // onClick={() => handlePriority("regular")}
                      onClick={() => handleDataChange("priority", "regular")}
                    >
                      <img
                        src={SpecialIcon}
                        alt=""
                        className="opacity-0 mr-2"
                      />
                      Regular
                    </DropdownItem>
                    <DropdownItem
                      className="fw-medium fs-14 text-danger cursor-pointer"
                      // onClick={() => handlePriority("Urgent")}
                      onClick={() => handleDataChange("priority", "Urgent")}
                    >
                      <img src={SpecialIcon} alt="" className="mr-2" />
                      Urgent
                    </DropdownItem>

                    {/* );
                      })} */}
                  </ul>
                </div>
              </div>
            </DropdownMenu>
          </UncontrolledDropdown>
          {!isDropdownOpenPriority && (
            <Tooltip
              id={`priority`}
              direction="top"
              text={ToolTipContent.priority}
            />
          )}
        </div>
      </div>

      <div className="row justify-content-between ">
        <div className=" justify-content-between d-flex col-xl-3 col-md-6 col-12  p-0">
          <div
            className="position-relative nk-header-searchbox w-100 form-control-lg form-control"
            id="trialDate"
          >
            <div className="d-flex align-items-center">
              <img src={tridateImg} alt="" className="me-1" width="25px" />
              <DatePicker
                className="border-0 fw-medium fs-14 "
                name="trialDate"
                selected={advanceData?.trialDate}
                dateFormat={dateFormat}
                showTimeInput={config?.DateAndTime?.includes("true")}
                timeFormat="HH:mm"
                // timeIntervals={15}
                // timeCaption="Time"
                minDate={new Date()}
                onChange={(date) => updateDateField("trialDate", date)}
                maxDate={advanceData?.deliveryDate}
                filterDate={disableMondays}
                placeholderText="Trial Date"
                isClearable
                autoComplete="off"
                shouldCloseOnSelect={false}
              />
            </div>
          </div>
        </div>

        <div className=" justify-content-between d-flex col-xl-3 col-md-6 col-12  p-0">
          <div
            className="position-relative nk-header-searchbox w-100 form-control-lg form-control"
            id="deliveryDate"
          >
            <div className="d-flex align-items-center">
              <img src={deldateImg} alt="" className="me-1" width="25px" />
              <DatePicker
                className="border-0 fw-medium fs-14 "
                name="deliveryDate"
                placeholderText="Delivery Date"
                selected={advanceData?.deliveryDate}
                dateFormat={dateFormat}
                showTimeInput={config?.DateAndTime?.includes("true")}
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                onChange={(date) => updateDateField("deliveryDate", date)}
                minDate={
                  advanceData?.trialDate === null
                    ? new Date()
                    : advanceData?.trialDate
                }
                filterDate={disableMondays}
                autoComplete="off"
                shouldCloseOnSelect={false}
              ></DatePicker>
              <Tooltip
                id={`deliveryDate`}
                direction="top"
                text={ToolTipContent.deliveryDate}
              />
            </div>
          </div>
        </div>

        <div className=" justify-content-between d-flex col-xl-3 col-md-6 col-12  p-0">
          <UncontrolledDropdown
            className="user-dropdown position-relative nk-header-searchbox w-100 form-control-lg form-control cursor-pointer"
            id="designer"
            isOpen={isDropdownOpenDesigner}
            toggle={() => setIsDropdownOpenDesigner(!isDropdownOpenDesigner)}
          >
            <DropdownToggle tag="a" className="w-100">
              <div className="d-flex text-dark">
                <div className="  cursor-pointer">
                  <img
                    src={CategoryIcon}
                    alt=""
                    width="20px"
                    className="me-1"
                  />
                  <span className="text-uppercase fs-14 fw-medium">
                    {/* {selectedDesigner
                      ? selectedDesigner.EmpName.slice(0, 13)
                      : "Designer"} */}

                    {advanceData.designer}
                  </span>
                </div>
              </div>
            </DropdownToggle>

            <DropdownMenu
              bottom
              className="dropdown-menu-s1 "
              style={{ width: "180px" }}
              onClick={() => setIsDropdownOpenDesigner(!isDropdownOpenDesigner)}
            >
              <div className="dropdown-body">
                <div className="p-1">
                  <ul className="text-capitalize">
                    {designer?.map((designer, ind) => {
                      return (
                        <>
                          <DropdownItem
                            className="fw-medium fs-14 cursor-pointer"
                            id={`designer${ind}`}
                            key={ind}
                            onClick={() =>
                              handleDataChange(
                                "designer",
                                designer.EmpName,
                                designer
                              )
                            }
                          >
                            {designer.EmpName.length > 13
                              ? designer.EmpName.slice(0, 13) + "..."
                              : designer.EmpName}
                          </DropdownItem>
                          {designer.EmpName.length > 13 ? (
                            <>
                              <Tooltip
                                id={`designer${ind}`}
                                direction="right"
                                text={designer.EmpName}
                              />
                            </>
                          ) : (
                            ""
                          )}
                        </>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </DropdownMenu>
          </UncontrolledDropdown>
          {!isDropdownOpenDesigner && (
            <Tooltip
              id={`designer`}
              direction="top"
              text={ToolTipContent.designer}
            />
          )}
        </div>

        <div className=" justify-content-between d-flex col-xl-3 col-md-6 col-12  p-0">
          <UncontrolledDropdown
            className="user-dropdown position-relative nk-header-searchbox w-100 form-control-lg form-control cursor-pointer"
            id="master"
            isOpen={isDropdownOpenMaster}
            toggle={() => setIsDropdownOpenMaster(!isDropdownOpenMaster)}
          >
            <DropdownToggle
              tag="a"
              className="w-100"
              onClick={() => setIsDropdownOpenMaster(!isDropdownOpenMaster)}
            >
              <div className="d-flex text-dark">
                <div className="  cursor-pointer">
                  <img
                    src={CategoryIcon}
                    alt=""
                    width="20px"
                    className="me-1"
                  />
                  <span className="text-uppercase fs-14 fw-medium">
                    {/* {selectedMasters ? selectedMasters.WorkerName : "Master"} */}
                    {advanceData.master}
                  </span>
                </div>
              </div>
            </DropdownToggle>

            <DropdownMenu
              bottom
              className="dropdown-menu-s1 "
              style={{ width: "160px" }}
            >
              <div className="dropdown-body">
                <div className="p-1">
                  <ul className="text-capitalize">
                    {master?.map((master, ind) => {
                      return (
                        <>
                          <DropdownItem
                            className="fw-medium fs-14 cursor-pointer"
                            key={ind}
                            id={`master${ind}`}
                            // onClick={() => handleMaster(master.WorkerId)}
                            onClick={() =>
                              handleDataChange(
                                "master",
                                master.WorkerName,
                                master
                              )
                            }
                          >
                            {master.WorkerName.length > 13
                              ? master.WorkerName.slice(0, 13) + "..."
                              : master.WorkerName}
                          </DropdownItem>

                          {master.WorkerName.length > 13 ? (
                            <>
                              <Tooltip
                                id={`master${ind}`}
                                direction="left"
                                text={master.WorkerName}
                              />
                            </>
                          ) : (
                            ""
                          )}
                        </>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </DropdownMenu>
          </UncontrolledDropdown>
          {!isDropdownOpenMaster && (
            <Tooltip
              id={`master`}
              direction="top"
              text={ToolTipContent.master}
            />
          )}
        </div>
      </div>

      {config?.ManualOrdNo && config?.ManualOrdNo === "0" && (
        <div className="bg-gray10 py-3 mt-5 rounded-2">
          <div className="row px-2 px-md-5 justify-content-between w-100 align-items-center">
            <div className="position-relative  col-lg-6 col-12 row  align-items-center">
              <div className="col-md-5 col-12">
                <div
                  className="d-flex align-items-center ms-1 ms-md-0"
                  id="orderDate"
                >
                  <img
                    src={CategoryIcon}
                    alt=""
                    className="me-1"
                    width="25px"
                  />
                  <DatePicker
                    placeholderText="Order Date"
                    className="border-0 fw-medium fs-14 bg-gray10"
                    name="orderDate"
                    selected={advanceData.orderDate}
                    dateFormat="dd/MM/yyyy"
                    // onChange={handleOrderDate}
                    onChange={(date) => handleDataChange("orderDate", date)}
                    // minDate={advanceData.trialDate}
                    isClearable
                  />

                  <Tooltip
                    id={`orderDate`}
                    direction="top"
                    text={ToolTipContent.orderDate}
                  />
                </div>
              </div>

              <div className="col-md-7 col-12 mt-2 mt-md-0">
                <div
                  className="position-relative nk-header-searchbox m-0"
                  id="orderNo"
                >
                  <input
                    type="text"
                    id="default-01"
                    name="orderNo"
                    value={advanceData.orderNo}
                    // onChange={handleDataChange}
                    onChange={(e) =>
                      handleDataChange("orderNo", e.target.value)
                    }
                    placeholder="Order #"
                    className="bg-gray10 form-control-lg form-control plaseholder-text-b "
                  />
                </div>
                <Tooltip
                  id={`orderNo`}
                  direction="top"
                  text={ToolTipContent.orderNo}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedCustomer?.CustType != "1" && (
        <div className="bg-gray10 py-3 mt-5 rounded-2">
          <div className="row px-2 px-md-5 justify-content-between w-100 align-items-center">
            <div className="position-relative  col-lg-6 col-12 row align-items-center mt-2 mt-md-0">
              <div className="col-md-6 col-12">
                <div
                  className="d-flex align-items-center ms-2 ms-md-auto"
                  id="poDate"
                >
                  <img
                    src={saleTypeIcon}
                    alt=""
                    className="me-1"
                    width="25px"
                  />
                  <DatePicker
                    className="border-0 fw-medium fs-14 bg-gray10"
                    name="poDate"
                    selected={advanceData.poDate}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => handleDataChange("poDate", date)}
                    placeholderText="PO Date"
                    isClearable
                    maxDate={new Date()}
                    // onChange={handlePODate}
                    // minDate={advanceData.trialDate}
                  />
                  <Tooltip
                    id={`poDate`}
                    direction="top"
                    text={ToolTipContent.poDate}
                  />
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div
                  className="position-relative nk-header-searchbox m-0"
                  id="poNo"
                >
                  <input
                    type="text"
                    id="default-01"
                    name="poNo"
                    value={advanceData.poNo}
                    // value={data.vatTno}
                    // onChange={handleDataChange}
                    onChange={(e) => handleDataChange("poNo", e.target.value)}
                    placeholder="Purchase Order#"
                    className="bg-gray10 border-0  form-control-lg form-control plaseholder-text-b "
                  />
                </div>
                <Tooltip
                  id={`poNo`}
                  direction="top"
                  text={ToolTipContent.poNo}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAdvanceDetailForm;

import React from "react";
import Barcode from "react-barcode";
import { useSelector } from "react-redux";
import { formatDate } from "../../../../redux/dateFormateFunction";
import SpecialIcon from "../../../../images/icons/special-icon.svg";
import urgentIcon from "../../../../images/icons/Customer-Urgent.svg";
import { UncontrolledTooltip } from "reactstrap";
import Tooltip from "../../../../Components/Tooltip/Tooltip";
import ToolTipContent from "../../../../Components/Tooltip/ToolTipContent";
const CustomOrderCell = ({
  orderData,
  isLoading,
  isSelected,
  onSelectionChange,
  onSelectAllChange,
}) => {
  const getConfig = useSelector((state) => state?.config?.orderType);

  let formattedTrialDate = formatDate(
    new Date(orderData.date),
    getConfig?.DateAndTime,
    true
    // "dd-MMM-yyyy 12"
  );
  // const handleCheckboxClick = (e) => {
  //   e.stopPropagation();
 
  
  // };

  const handleCheckboxClick = (e) => {
  
    e.stopPropagation();

    onSelectionChange(e, orderData.mainId);
  };


  return (
    <div className="table-order-col ms-3">
      <div className="d-flex table-checkbox-order-details td-padding ">
        <div className="icons">
          <div className="g">
            <div
              className="custom-control custom-control-sm custom-checkbox "
              style={{ paddingTop: "20px", paddingLeft: "20px" }}
            >
              <input
                type="checkbox"
                className="custom-control-input"
                id={orderData.mainId}
                checked={isSelected}
                onChange={handleCheckboxClick}
                onClick={(e) => e.stopPropagation()}
                // onChange={() => onSelectionChange(orderData.mainId)}
                // onClick={(e)=>handleCheckboxClick(e)}
              />
              <label
                className="custom-control-label"
                htmlFor={orderData.mainId}
              />
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div className="order-details ">
            <div
              className="order-id"
              id={`orderName${orderData.index}`}
            >
              {orderData.id.length >= 11
                ? "..." + orderData.id.slice(-9)
                : orderData.id}
            </div>
            <Tooltip
              id={`orderName${orderData.index}`}
              direction="top"
              text={orderData.id}
            />

            {/* <img
              src={duplicateIcon}
              alt=""
              width="18px"
              onClick={() => handleDublicateItem(order)}
              className="me-"
              id={`oederDublicateItem${ind}`}
            /> */}

            <div
              className="order-date-tim"
              id={`orderDate${orderData.index}`}
            >
              {formattedTrialDate}
            </div>
            <Tooltip
              id={`orderDate${orderData.index}`}
              direction="right"
              text={ToolTipContent.orderDate}
            />

            <div className="order-barcode-icon-text">
              <div className="oder-bar-code-icon d-inline-block">
                <img src={orderData.barcodeIcon} />
                {/* <Barcode value={`*${orderData.barcodeText}*`} height="50px" /> */}
              </div>
              <div className="oder-bar-code-text d-inline-block ms-1">
                {orderData.barcodeText}
              </div>
            </div>
          </div>
          

          {orderData.urgentData.OrderPriority != null && (
            <div>
              <div
                className="urgent-icon ms-3"
                id={`prority${orderData.index}`}
              >
                {orderData.urgentData.OrderPriority == "regular" ? (
                  <></>
                ) : orderData.urgentData.OrderPriority == "urgent" ? (
                  <img
                    src={SpecialIcon}
                    alt="urgent-icon"
                    style={{ width: "24px" }}
                  />
                ) : (
                  <img
                    src={urgentIcon}
                    alt="urgent-icon"
                    style={{ width: "24px" }}
                  />
                )}
              </div>
              <Tooltip
                id={`prority${orderData.index}`}
                direction="right"
                text={`${orderData.urgentData.Total_Urgent_Items}/${orderData.urgentData.totalItems}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomOrderCell;

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { formatDate } from "../../../../redux/dateFormateFunction";
import useHandleCellClick from "./useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomLastActivityCell = ({ lastActivityData }) => {
  const getConfig = useSelector((state) => state?.config?.orderType);
  let formatedModifyDate = formatDate(
    new Date(lastActivityData.modifyDate),
    getConfig?.DateAndTime,
    true
    // "dd-MMM-yyyy 12"
  );
  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();
  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = () => {
    setClickedRow(lastActivityData.index);
    handleAction("BtnItemTrckrView", "action", handleCellClick, lastActivityData,setClickedRow);
  };
  return (
    <div>
      <div
        className={`table-Customer-col px-1 ${
          clickedRow === lastActivityData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        } `}
        id="BtnItemTrckrView"
        onClick={handleRowClick}
      >
        <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-start">
          <div className="customer-details">
            <div className="customer-desc">{lastActivityData.modifyDesc}</div>
            <div className="customer-phone-n">{formatedModifyDate}</div>
            <div className="customer-mail">{lastActivityData.modifierName}</div>
          </div>
        </div>
      </div>
      {clickedRow === lastActivityData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomLastActivityCell;

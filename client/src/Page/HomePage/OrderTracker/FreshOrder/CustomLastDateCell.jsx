import React, { useState } from "react";
import SpecialIcon from "../../../../images/icons/special-icon.svg";
import urgentIcon from "../../../../images/icons/Customer-Urgent.svg";
import TrakerSkeleton from "../../CommonTracker/TrakerSkeleton";
import { useSelector } from "react-redux";
import { formatDate } from "../../../../redux/dateFormateFunction";
import useHandleCellClick from "../OrderCustomTableCells/useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomLastDateCell = ({ LastDateData }) => {
  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();
  const [clickedRow, setClickedRow] = useState(null);

  const getConfig = useSelector((state) => state?.config?.orderType);

  let formattedTrialDate = formatDate(
    new Date(LastDateData.lastDate),
    getConfig?.DateAndTime,
    true
  );

  const handleRowClick = () => {
    setClickedRow(LastDateData.index);
    handleAction(
      "BtnOrdTrckrViewOrder",
      "action",
      handleCellClick,
      LastDateData,
      setClickedRow
    );
  };

  return (
    <div>
      <div
        className={`table-Customer-col px-1 ${
          clickedRow === LastDateData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        }`}
        id="BtnOrdTrckrViewOrder"
        onClick={handleRowClick}
        // onClick={() => handleCellClick(LastDateData)}
      >
        <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-center">
          <div className="customer-details">
            {/* <div className="customer-name">{LastDateData.lastDate}</div> */}
            <div className="customer-name">{formattedTrialDate}</div>
          </div>
        </div>
      </div>
      {clickedRow === LastDateData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomLastDateCell;

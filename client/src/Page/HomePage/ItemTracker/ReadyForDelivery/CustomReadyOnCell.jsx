import React, { useState } from "react";
import useHandleCellClick from "../ItemCustomTableCells/useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomReadyOnCell = ({ readyonDate }) => {
  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();
  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = () => {
    setClickedRow(readyonDate.index);
    handleAction(
      "BtnItemTrckrView",
      "action",
      handleCellClick,
      readyonDate,setClickedRow
    );
  };
  return (
    <div>
      <div
        className={`table-Customer-col ${
          clickedRow === readyonDate.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        } `}
        id="BtnItemTrckrView"
        onClick={handleRowClick}
      >
        <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-center">
          <div className="customer-details">
            <div className="customer-name">{readyonDate.date}</div>
          </div>
        </div>
      </div>
      {clickedRow === readyonDate.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomReadyOnCell;

import React, { useState } from "react";
import useHandleCellClick from "./useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomItemLocationCell = ({ itemLocationData, data }) => {

 
  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();
  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = () => {
    setClickedRow(itemLocationData.index);
    handleAction(
      "BtnItemTrckrView",
      "action",
      handleCellClick,
      itemLocationData,
      setClickedRow
    );
  };
  return (
    <div>
      <div
        className={`table-Customer-col px-1 ${
          clickedRow === itemLocationData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        }`}
        id="BtnItemTrckrView"
        onClick={handleRowClick}
      >
        <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-center">
          <div className="customer-details">
            <div className="customer-name text-wrap">
              {itemLocationData.desc}
            </div>
          </div>
        </div>
      </div>
      {clickedRow === itemLocationData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomItemLocationCell;

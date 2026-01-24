import React, { useState } from "react";
import useHandleCellClick from "../ItemCustomTableCells/useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomRatingCell = ({ ratingData }) => {
  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();

  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = () => {
    setClickedRow(ratingData.index);
    handleAction("BtnItemTrckrView", "action", handleCellClick, ratingData,setClickedRow);
  };
  return (
    <div>
      <div
        className={`table-Customer-col px-1 ${
          clickedRow === ratingData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        } `}
        id="BtnItemTrckrView"
        onClick={handleRowClick}
      >
        <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-center">
          <div className="customer-details">
            <div className="customer-name">{ratingData.data}</div>
          </div>
        </div>
      </div>
      {clickedRow === ratingData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomRatingCell;

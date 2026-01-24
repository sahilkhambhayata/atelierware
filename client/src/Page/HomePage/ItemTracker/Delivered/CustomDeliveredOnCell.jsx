import React, { useState } from "react";
import useHandleCellClick from "../ItemCustomTableCells/useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomDeliveredOnCell = ({ deliveredOnDate }) => {
  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();

  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = () => {
    setClickedRow(deliveredOnDate.index);
    handleAction(
      "BtnItemTrckrView",
      "action",
      handleCellClick,
      deliveredOnDate,
      setClickedRow
    );
  };
  return (
    <div>
      <div
        className={`table-Customer-col px-1 ${
          clickedRow === deliveredOnDate.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        } `}
        id="BtnItemTrckrView"
        onClick={handleRowClick}
      >
        <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-center">
          <div className="customer-details">
            <div className="customer-name">{deliveredOnDate.name}</div>
            <div className="customer-name">{deliveredOnDate.date}</div>
          </div>
        </div>
      </div>
      {clickedRow === deliveredOnDate.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomDeliveredOnCell;

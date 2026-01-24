import React, { useState } from "react";
import useHandleCellClick from "../ItemCustomTableCells/useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomWorkerCell = ({ workerData }) => {
  const handleCellClick = useHandleCellClick();

  const { handleAction } = usePermissions();
  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = () => {
    setClickedRow(workerData.index);
    handleAction(
      "BtnItemTrckrView",
      "action",
      handleCellClick,
      workerData,
      setClickedRow
    );
  };
  return (
    <div>
      <div
        className={`table-Customer-col px-1 ${
          clickedRow === workerData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        } `}
        id="BtnItemTrckrView"
        onClick={handleRowClick}
      >
        <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-center">
          <div className="customer-details">
            <div className="customer-name">{workerData.name}</div>
            <div className="customer-phone-n">{workerData.code}</div>
          </div>
        </div>
      </div>
      {clickedRow === workerData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomWorkerCell;

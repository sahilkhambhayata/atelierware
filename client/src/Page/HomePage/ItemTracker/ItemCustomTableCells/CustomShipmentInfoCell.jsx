import React, { useState } from "react";
import useHandleCellClick from "./useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomShipmentInfoCell = ({ shipmentData }) => {
  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();
  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = () => {
    setClickedRow(shipmentData.index);
    handleAction(
      "BtnOrdTrckrViewOrder",
      "action",
      handleCellClick,
      shipmentData,setClickedRow
    );
  };
  return (
    <div>
      <div
        className={`table-Customer-col px-1 ${
          clickedRow === shipmentData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        }`}
        id="BtnItemTrckrView"
        onClick={handleRowClick}
      >
        <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-center">
          <div className="customer-details">
            <div className="customer-name">Runner: {shipmentData.runner}</div>
            <div className="customer-phone-n">{shipmentData.messerment}</div>
            <div className="customer-mail">{shipmentData.time}</div>
            <div>
              <a href="#" className="underline">
                {shipmentData.code}
              </a>
            </div>
          </div>
        </div>
      </div>
      {clickedRow === shipmentData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomShipmentInfoCell;

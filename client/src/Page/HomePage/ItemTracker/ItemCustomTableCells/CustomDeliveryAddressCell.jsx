import React, { useState } from "react";
import useHandleCellClick from "./useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomDeliveryAddressCell = ({ deliveryAddressData }) => {
  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();
  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = () => {
    setClickedRow(deliveryAddressData.index);
    handleAction(
      "BtnItemTrckrView",
      "action",
      handleCellClick,
      deliveryAddressData,setClickedRow
    );
  };
  return (
    <div>
      <div
        className={`table-Customer-col px-1 ${
          clickedRow === deliveryAddressData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        }`}
        id="BtnItemTrckrView"
        onClick={handleRowClick}
        // onClick={() => handleCellClick(deliveryAddressData)}
      >
        <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-center">
          <div className="customer-details">
            <div className="customer-name ">{deliveryAddressData.desc}</div>
          </div>
        </div>
      </div>
      {clickedRow === deliveryAddressData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomDeliveryAddressCell;

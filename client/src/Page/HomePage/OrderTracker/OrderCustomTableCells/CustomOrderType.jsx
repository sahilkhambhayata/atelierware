import React, { useState } from "react";
import useHandleCellClick from "./useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomOrderType = ({ orderTypeData }) => {
  const [clickedRow, setClickedRow] = useState(null);

  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();
  const handleRowClick = () => {
    setClickedRow(orderTypeData.index);
    handleAction(
      "BtnOrdTrckrViewOrder",
      "action",
      handleCellClick,
      orderTypeData,
      setClickedRow
    );
  };

  return (
    <div>
      <div
        className={`value td-padding d-flex justify-content-center align-items-center ${
          clickedRow === orderTypeData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        }`}
        id="BtnOrdTrckrViewOrder"
        onClick={handleRowClick}
      >
        <div className="tri-text-date d-flex  align-items-center text-center paid-val">
          <span>{orderTypeData.orderType}</span>
        </div>
      </div>
      {clickedRow === orderTypeData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomOrderType;

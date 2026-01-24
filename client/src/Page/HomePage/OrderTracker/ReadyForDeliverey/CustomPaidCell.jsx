import React, { useState } from "react";
import useHandleCellClick from "../OrderCustomTableCells/useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomPaidCell = ({ paidData }) => {
  const symbol = localStorage.getItem("countrySymbol");
  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();
  const [clickedRow, setClickedRow] = useState(null);
  const handleRowClick = () => {
    setClickedRow(paidData.index);
    handleAction(
      "BtnOrdTrckrViewOrder",
      "action",
      handleCellClick,
      paidData,
      setClickedRow
    );
  };

  return (
    <div>
      <div
        className={`paid td-padding ${
          clickedRow === paidData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        }`}
        id="BtnOrdTrckrViewOrder"
        onClick={handleRowClick}
        // onClick={() => handleCellClick(paidData)}
      >
        <div className="text-center paid-val">
          {symbol} {Math.floor(paidData.paidVal)}.
          <span className="fontvariant">
            {(paidData.paidVal % 1)?.toFixed(2).slice(2)}
          </span>
          {/* {symbol} {paidData.paidVal} <span className="fontvariant">00</span> */}
        </div>
      </div>
      {clickedRow === paidData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomPaidCell;

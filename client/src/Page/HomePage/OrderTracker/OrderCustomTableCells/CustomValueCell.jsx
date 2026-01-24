import React, { useState } from "react";
import useHandleCellClick from "./useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomValueCell = ({ ValueData }) => {
  const [clickedRow, setClickedRow] = useState(null);

  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();
  const handleRowClick = () => {
    setClickedRow(ValueData.index);
    handleAction(
      "BtnOrdTrckrViewOrder",
      "action",
      handleCellClick,
      ValueData,
      setClickedRow
    );
  };

  const symbol = localStorage.getItem("countrySymbol");
  return (
    <div>
      <div
        className={`value td-padding d-flex align-items-center ${
          clickedRow === ValueData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        }`}
        id="BtnOrdTrckrViewOrder"
        // onClick={() => handleCellClick(ValueData)}
        onClick={handleRowClick}
      >
        {/* <div className="img-sec ml-4">
        <img src={ValueData.triImg} alt="" />
      </div> */}
        <div className="tri-text-date d-flex align-items-center">
          <div className="text-center paid-val">
            {symbol} {Math.floor(ValueData.amount)}.
            <span className="fontvariant">
              {(ValueData.amount % 1)?.toFixed(2).slice(2)}
            </span>
          </div>
        </div>
      </div>
      {clickedRow === ValueData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomValueCell;

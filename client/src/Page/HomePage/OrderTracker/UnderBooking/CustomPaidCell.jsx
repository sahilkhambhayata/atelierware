import React from "react";

const CustomPaidCell = ({ paidData }) => {
  const symbol = localStorage.getItem("countrySymbol");
  return (
    <div>
      <div className="paid td-padding">
        <div className="text-center paid-val">
          {symbol} {Math.floor(paidData.paidVal)}.
          <span className="fontvariant">
            {(paidData.paidVal % 1)?.toFixed(2).slice(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomPaidCell;

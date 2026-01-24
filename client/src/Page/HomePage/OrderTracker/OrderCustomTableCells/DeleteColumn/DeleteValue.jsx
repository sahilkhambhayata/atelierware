import React from "react";

const DeleteValue = ({ customer }) => {
  const symbol = localStorage.getItem("countrySymbol");

  return (
    <div className="table-order-col ms-4">
      <div className="d-flex table-checkbox-order-details td-padding ">
        <div className="order-details">
          <div className="order-name text-right">
            {symbol} {Math.floor(customer.name)}.
            {(customer.name % 1)?.toFixed(2).slice(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteValue;

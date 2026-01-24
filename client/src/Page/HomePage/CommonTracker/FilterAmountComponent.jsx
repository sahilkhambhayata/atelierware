import React, { useState } from "react";

const FilterAmountComponent = ({minAmount, maxAmount, onMinAmountChange, onMaxAmountChange}) => {

  return (
    <div>
      <ul className="mt-2">
        <li className="">
          <span>Min amount</span>
          <input
            type="number"
            name=""
            id=""
            onChange={(e) => onMinAmountChange(e.target.value)}
            value={minAmount}
          />
        </li>
        <li>
          <span>Max amount</span>
          <input
            type="number"
            name=""
            id=""
            onChange={(e) => onMaxAmountChange(e.target.value)}
            value={maxAmount}
          />
        </li>
      </ul>
    </div>
  );
};

export default FilterAmountComponent;

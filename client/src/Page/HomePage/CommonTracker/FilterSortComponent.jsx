import React, { useState } from "react";
import DownArrowIcon from "../../../images/icons/down-arrow.svg";
import UpArrowIcon from "../../../images/icons/up-arrow.svg";

const FilterSortComponent = ({
  filterList,
  onFilterSelect,
  selectedSortFilter,
  // toggle,
  sortByOrderNo,
  sortByOrderDate,
  sortByTrialDate,
  sortByDeliveredDate,
}) => {
  const sortOrderArray = [
    sortByOrderNo,
    sortByOrderDate,
    sortByTrialDate,
    sortByDeliveredDate,
  ];
  return (
    <div>
      <ul className="mt-2">
        {filterList?.map((filter, ind) => {
          return (
            <li
              key={filter}
              className={`mb-1 ms-2 me-2 ps-1 subfilter ${
                selectedSortFilter === filter ? "bg-light" : "bg-white"
              }`}
              onClick={() => {
                onFilterSelect(ind);
              }}
              style={{ cursor: "pointer" }}
            >
              <span style={{ opacity: "0.8", fontSize: "14px" }}>{filter}</span>
              <img
                src={sortOrderArray[ind] === true ? UpArrowIcon : DownArrowIcon}
                className="ms-1"
                style={{ width: "15px", height: "15px" }}
                alt=""
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FilterSortComponent;

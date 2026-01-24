import React, { useState } from "react";

const FilterDateComponent = ({ filterList, onFilterSelect,selectedFilter  }) => {
  
  return (
    <div>
      <ul className="mt-2">
        {filterList?.map((filter,ind) => {
         
          return (
            <li
              key={filter}
              className={`mb-1 ms-2 me-2 ps-1 subfilter ${
                selectedFilter === ind ? "bg-light-pink" : "bg-white"
              }`}

              onClick={() => {
                onFilterSelect(ind);
            }}
            style={{ cursor: "pointer"}}
            >
              <span style={{opacity:"0.8",fontSize:"14px"}} >{filter}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FilterDateComponent;

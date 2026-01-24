import React from "react";


const CustomReadyCell = ({ readyData }) => {
  return (
    <div className="table-Customer-col px-1">
      <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-center">
        <div className="customer-details">
          <div className="customer-name">{readyData.data}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomReadyCell;

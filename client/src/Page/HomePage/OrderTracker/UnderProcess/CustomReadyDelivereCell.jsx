import React from "react";


const CustomReadyDelivereCell = ({ delivereData }) => {
  return (
    <div className="table-Customer-col px-1">
      <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-center">
        <div className="customer-details">
          <div className="customer-name">{delivereData.data}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomReadyDelivereCell;

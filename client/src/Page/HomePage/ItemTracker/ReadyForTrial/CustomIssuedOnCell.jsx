import React from "react";

const CustomIssuedOnCell = ({ issuedDate }) => {
  return (
    <div className="table-Customer-col px-1">
      <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-center">
        <div className="customer-details">
          <div className="customer-name">{issuedDate.date}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomIssuedOnCell;

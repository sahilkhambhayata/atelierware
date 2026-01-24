import React from "react";

const DeleteSrNo = ({service}) => {
  return (
    <div className="table-order-col mx-5">
      <div className="d-flex table-checkbox-order-details td-padding ">
        <div className="order-details">
          <div className="order-name">{service.name}</div>
        </div>
      </div>
    </div>
  );
};

export default DeleteSrNo;

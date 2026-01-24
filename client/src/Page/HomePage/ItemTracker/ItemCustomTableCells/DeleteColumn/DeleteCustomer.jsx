import React from "react";

const DeleteCustomer = ({service}) => {
  return (
    <div className="table-order-col ms-4">
      <div className="d-flex table-checkbox-order-details td-padding ">
        <div className="order-details">
          <div className="order-name">{service.name}</div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCustomer;

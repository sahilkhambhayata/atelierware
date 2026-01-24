import React from "react";

const DeleteValue = ({service}) => {
  return (
    <div className="table-order-col">
      <div className="d-flex table-checkbox-order-details td-padding ">
        <div className="order-details">
          <div className="order-name">{service.name}</div>
        </div>
      </div>
    </div>
  );
};

export default DeleteValue;

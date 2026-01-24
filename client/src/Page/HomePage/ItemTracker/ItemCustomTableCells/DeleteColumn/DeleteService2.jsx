import React from "react";

const DeleteService2 = ({ service }) => {
  return (
    <div className="table-order-col">
      <div className="d-flex table-checkbox-order-details td-padding d-flex">
        <img src={service.img} alt="" className="me-2"/>

        <div className="order-details">
          <div className="order-name">{service.name}</div>
        </div>
      </div>
    </div>
  );
};

export default DeleteService2;

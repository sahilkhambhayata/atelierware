import React from "react";

const DeleteService1 = ({ service, isSelected, onSelectionChange }) => {
  return (
    <div className="table-order-col">
      <div className="d-flex align-items-center table-checkbox-order-details td-padding ">
        <div className="icons">
          <div className="g">
            <div
              className="custom-control custom-control-sm custom-checkbox "
              style={{ paddingTop: "", paddingLeft: "40px" }}
            >
              <input
                type="checkbox"
                className="custom-control-input"
                id={service.id}
                checked={isSelected}
                onChange={() => onSelectionChange(service.id)}
              />
              <label className="custom-control-label" htmlFor={service.id}>
                {service.disId}
              </label>
            </div>
          </div>
        </div>
        {/* <div className="order-details">
          <div className="order-name">
            {service.id.length >= 11
              ? "..." + service.id.slice(-9)
              : service.id}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DeleteService1;

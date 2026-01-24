import React from "react";

const DeleteOrderSingle = ({ service }) => {
  return (
    <div className="table-order-col">
      <div className="d-flex align-items-center table-checkbox-order-details td-padding ">
        {/* <div className="icons">
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
              <label
                className="custom-control-label text-center"
                htmlFor={service.id}
              >
                {service.disId}
              </label>
            </div>
          </div>
        </div> */}
        <span className="text-center ms-3"> {service.disId}</span>
        {/* <div className="order-details">
          <div className="order-id">
            {service.id.length >= 11
              ? "..." + service.id.slice(-9)
              : service.id}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DeleteOrderSingle;

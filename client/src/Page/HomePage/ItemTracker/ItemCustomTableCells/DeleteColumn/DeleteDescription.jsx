import React from "react";

const DeleteDescription = ({ desc }) => {
  return (
    <div className="table-order-col">
      <div className="d-flex table-checkbox-order-details td-padding ">
        
        <div className="order-details">
          <div className="order-name">
            {desc.desc}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteDescription;

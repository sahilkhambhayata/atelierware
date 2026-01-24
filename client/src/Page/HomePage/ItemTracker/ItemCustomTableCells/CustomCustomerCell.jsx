import React, { useState } from "react";
import useHandleCellClick from "./useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomCustomerCell = ({ customerData }) => {
  const { handleAction } = usePermissions();

  const handleCellClick = useHandleCellClick();
  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = () => {
    setClickedRow(customerData.index);
    handleAction(
      "BtnItemTrckrView",
      "action",
      handleCellClick,
      customerData,setClickedRow
    );
  };
  return (
    <div className="">
      <div
        className={`table-Customer-col px-1 ${
          clickedRow === customerData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        } `}
        // onClick={() => handleCellClick(customerData)}
        id="BtnItemTrckrView"
        onClick={handleRowClick}
      >
        <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-left text-wrap">
          <div className="customer-details">
            {customerData.name && (
              <div className="customer-name">{customerData.name}</div>
            )}
            {customerData.mobNo && (
              <div className="customer-phone-n">{customerData.mobNo}</div>
            )}
            {customerData.email && (
              <div className="customer-mail">{customerData.email}</div>
            )}
          </div>
        </div>
      </div>
      {clickedRow === customerData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomCustomerCell;

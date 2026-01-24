import React, { useEffect, useState } from "react";

import useHandleCellClick from "./useHandleCellClick";
// import { useHistory } from "react-router-dom";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomCustomerCell = ({ customerData }) => {
  // const history = useHistory();
  const [clickedRow, setClickedRow] = useState(null);
  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();

  const handleRowClick = () => {
    setClickedRow(customerData.index);
    handleAction(
      "BtnOrdTrckrViewOrder",
      "action",
      handleCellClick,
      customerData,
      setClickedRow
    );
  };

  return (
    <div>
      <div
        className={`table-Customer-col pl-2  ${
          clickedRow === customerData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        }`}
        id="BtnOrdTrckrViewOrder"
        onClick={handleRowClick}
      >
        <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-start">
          <div className="customer-details">
            <div className="customer-name">{customerData.customerName}</div>
            <div className="customer-phone-n">
              {customerData.customerPhoneNumber}
            </div>
            <div className="customer-mail">{customerData.customerMail}</div>
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

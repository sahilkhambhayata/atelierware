import React, { useState } from "react";
import { useSelector } from "react-redux";
import { formatDate } from "../../../../redux/dateFormateFunction";
import useHandleCellClick from "./useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomService1Cell = ({
  service1Data,
  isLoading,
  isSelected,
  onSelectionChange,
  onSelectAllChange,
}) => {
  // const [clickedRow, setClickedRow] = useState(null);

  return (
    <div className="position-relative">
      <div
        className={`table-order-col ps-3 `}
        id="BtnItemTrckrView"
        style={{ position: "sticky", left: 0, zIndex: 999 }}
        // onClick={handleRowClick}
      >
        <div className="d-flex table-checkbox-order-details td-padding ">
          <div className="order-details">
            <div className="order-id">
              {service1Data.id.length >= 11
                ? "..." + service1Data.id.slice(-9)
                : service1Data.id}
            </div>

            <div className="order-barcode-icon-text ">
              <div className="oder-bar-code-icon d-inline-block">
                <img src={service1Data.barcodeIcon} alt="barcode icon" />
              </div>
              <div className="oder-bar-code-text d-inline-block ms-1">
                {service1Data.barcodeText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomService1Cell;

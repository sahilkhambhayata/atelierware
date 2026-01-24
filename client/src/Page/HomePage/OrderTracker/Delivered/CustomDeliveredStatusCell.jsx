import React, { useState } from "react";
import deliveryDone from "../../../../images/avatar/deliveryemojidone.svg";
import deliveryWrong from "../../../../images/avatar/deliveryemojiwrong.svg";
import deliveryNo from "../../../../images/avatar/deliveryemojino.svg";
import useHandleCellClick from "../OrderCustomTableCells/useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomDeliveredStatusCell = ({ delivereStatusData }) => {
  const handleCellClick = useHandleCellClick();
  const [clickedRow, setClickedRow] = useState(null);

  const { handleAction } = usePermissions();
  const handleRowClick = () => {
    setClickedRow(delivereStatusData.index);
    handleAction(
      "BtnOrdTrckrViewOrder",
      "action",
      handleCellClick,
      delivereStatusData,
      setClickedRow
    );
  };
  return (
    <div>
      <div
        className={`table-Customer-col  ${
          clickedRow === delivereStatusData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        }`}
        id="BtnOrdTrckrViewOrder"
        onClick={handleRowClick}
        // onClick={() => handleCellClick(delivereStatusData)}
      >
        <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-center">
          <div className="customer-details">
            <div className="customer-name">
              <img
                src={
                  delivereStatusData.val === "bed"
                    ? deliveryWrong
                    : delivereStatusData.val === "no"
                    ? deliveryNo
                    : deliveryDone
                }
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      {clickedRow === delivereStatusData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomDeliveredStatusCell;

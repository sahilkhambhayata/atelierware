import React, { useState } from "react";
import useHandleCellClick from "./useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";
import Tooltip from "../../../../Components/Tooltip/Tooltip";

const CustomDescriptionCell = ({ descriptionData }) => {
  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();
  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = () => {
    setClickedRow(descriptionData.index);
    handleAction(
      "BtnItemTrckrView",
      "action",
      handleCellClick,
      descriptionData,
      setClickedRow
    );
  };
  return (
    <div>
      <div
        className={`table-Customer-col px-1 text-wrap ${
          clickedRow === descriptionData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        }`}
        id="BtnItemTrckrView"
        // onClick={() => handleCellClick(descriptionData)}
        onClick={handleRowClick}
      >
        <div className="d-flex customer-details-urgent-icon td-padding justify-content-center">
          <div
            className="customer-name align-text-top"
            id={`ItemDesc${descriptionData.data.TOrdDtId}`}
          >
            {descriptionData.desc?.length > 70
              ? descriptionData.desc?.slice(0, 70) + "..."
              : descriptionData.desc}
          </div>
          <Tooltip
            id={`ItemDesc${descriptionData.data.TOrdDtId}`}
            direction="right"
            text={descriptionData.desc}
          />
        </div>
      </div>
      {clickedRow === descriptionData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomDescriptionCell;

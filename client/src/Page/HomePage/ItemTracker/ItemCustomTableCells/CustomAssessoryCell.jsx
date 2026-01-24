import React, { useState } from "react";
import useHandleCellClick from "./useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomAssessoryCell = ({ accessoryData }) => {
  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();
  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = () => {
    setClickedRow(accessoryData.index);
    handleAction(
      "BtnItemTrckrView",
      "action",
      handleCellClick,
      accessoryData,
      setClickedRow
    );
  };
  return (
    <div>
      <div
        className={`table-Customer-col px-1 ${
          clickedRow === accessoryData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        }`}
        id="BtnItemTrckrView"
        onClick={handleRowClick}
      >
        <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-center">
          <div className="customer-details">
            {accessoryData?.val?.length > 0 &&
              accessoryData?.val?.map((item, index) => {
                return (
                  <div key={index} className="customer-name d-flex text-wrap">
                    <div style={{ minWidth: "50px" }}>
                      <span>
                        {item.articleDetails.ArticleName.length > 7
                          ? item.articleDetails.ArticleName.slice(0, 7) + "..."
                          : item.articleDetails.ArticleName}
                      </span>
                    </div>
                    <div className="ms-2 me-2">X</div>
                    {item.Quantity} {item.Unit}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      {clickedRow === accessoryData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomAssessoryCell;

import React, { useState } from "react";
import useHandleCellClick from "./useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomFebricCell = ({ febricData }) => {
  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();
  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = () => {
    setClickedRow(febricData.index);
    handleAction(
      "BtnItemTrckrView",
      "action",
      handleCellClick,
      febricData,
      setClickedRow
    );
  };
  return (
    <div>
      <div
        className={`table-Customer-col px-1 ${
          clickedRow === febricData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        }`}
        id="BtnItemTrckrView"
        onClick={handleRowClick}
      >
        <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-center ">
          <div className="customer-details">
            {febricData?.val?.length > 0 &&
              febricData?.val?.map((item, index) => {
                return (
                  <div key={index} className="customer-name d-flex text-wrap">
                    <div className="me-1">
                      <img src={item.icon} width="20px"></img>
                    </div>
                    <div>
                      <span>
                        {item.articleDetails.ArticleName.length > 7
                          ? item.articleDetails.ArticleName.slice(0, 7) + "..."
                          : item.articleDetails.ArticleName}
                      </span>
                    </div>
                    <div className="ms-2 me-2">X</div>
                    {item.Quantity}
                    {item.Unit}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      {clickedRow === febricData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomFebricCell;

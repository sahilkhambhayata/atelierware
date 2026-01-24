import React from "react";
import useHandleCellClick from "../ItemCustomTableCells/useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomTrialCountCell = ({ trialCount }) => {
  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();
  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = () => {
    setClickedRow(trialCount.index);
    handleAction(
      "BtnItemTrckrView",
      "action",
      handleCellClick,
      trialCount,setClickedRow
    );
  };
  return (
   <div>
     <div
        className={`table-Customer-col ${
          clickedRow === trialCount.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        } `}
        id="BtnItemTrckrView"
        onClick={handleRowClick}
      >
      <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-center">
        <div className="customer-details">
          <div className="customer-name">{trialCount.count}</div>
        </div>
      </div>
    </div>
    {clickedRow === trialCount.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
   </div>
  );
};

export default CustomTrialCountCell;

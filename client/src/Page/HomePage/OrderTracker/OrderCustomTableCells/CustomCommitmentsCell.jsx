import React, { useState } from "react";
import tridateImg from "../../../../images/icons/tridateImg.svg";
import deldateImg from "../../../../images/icons/deldateImg.svg";
import { formatDate } from "../../../../redux/dateFormateFunction";
import { useSelector } from "react-redux";
import tooTipContent from "../../../../Components/Tooltip/ToolTipContent";
import Tooltip from "../../../../Components/Tooltip/Tooltip";
import useHandleCellClick from "./useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

// import TooltipComponent from "../../../../Components/Tooltip/Tooltip";
const CustomCommitmentsCell = ({ commitmentsData }) => {
  const getConfig = useSelector((state) => state?.config?.orderType);
  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();
  const [clickedRow, setClickedRow] = useState(null);

  let formattedTrialDate = formatDate(
    new Date(commitmentsData.ctriDate),
    getConfig?.DateAndTime,
    true
    // "dd-MMM-yyyy 12"
  );
  let formattedDelDate = formatDate(
    new Date(commitmentsData.cdelDate),
    getConfig?.DateAndTime,
    true
    // "dd-MMM-yyyy 12"
  );

  const handleRowClick = () => {
    setClickedRow(commitmentsData.index);
    handleAction(
      "BtnOrdTrckrViewOrder",
      "action",
      handleCellClick,
      commitmentsData,
      setClickedRow
    );
  };

  return (
    <div>
      <div
        className={`commitments td-padding ${
          clickedRow === commitmentsData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        }`}
        id="BtnOrdTrckrViewOrder"
        onClick={handleRowClick}
        // onClick={() => handleCellClick(commitmentsData)}
      >
        <div
          className="tri-text-date d-flex align-items-center ml-4 justify-content-start"
          id={`trialDate${commitmentsData.index}`}
        >
          <div className="img-sec ">
            <img src={tridateImg} alt="" className="comitments-images" />
          </div>
          <div className="tri-date ml-1"> {formattedTrialDate} </div>
        </div>
        <Tooltip
          id={`trialDate${commitmentsData.index}`}
          direction="top"
          text={tooTipContent.trialDate}
        />

        <div
          className="del-text-date d-flex align-items-center ml-4 mt-1 justify-content-start"
          id={`delDate${commitmentsData.index}`}
        >
          <div className="img-sec ">
            <img src={deldateImg} alt="" className="comitments-images" />
          </div>
          <div className="del-date ml-1">{formattedDelDate}</div>
        </div>
        <Tooltip
          id={`delDate${commitmentsData.index}`}
          direction="top"
          text={tooTipContent.deliveryDate}
        />
      </div>
      {clickedRow === commitmentsData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomCommitmentsCell;

import React, { useState } from "react";
import images from "./../../Images/CommonImageFile";
import icon from "./../../Images/CommonIconFile";
import { useSelector } from "react-redux";
import { formatDate } from "../../../../redux/dateFormateFunction";
import useHandleCellClick from "./useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomCommitmentCell = ({ commitmentsData }) => {
  const getConfig = useSelector((state) => state?.config?.orderType);
  const { handleAction } = usePermissions();

  const handleCellClick = useHandleCellClick();

  let formattedTrialDate =
    commitmentsData.ctriDate !== null
      ? formatDate(
          new Date(commitmentsData.ctriDate),
          getConfig?.DateAndTime,
          true
          // "dd-MMM-yyyy 12"
        )
      : "";
  let formattedDelDate = formatDate(
    new Date(commitmentsData.cdelDate),
    getConfig?.DateAndTime,
    true
    // "dd-MMM-yyyy 12"
  );
  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = () => {
    setClickedRow(commitmentsData.index);
    handleAction(
      "BtnItemTrckrView",
      "action",
      handleCellClick,
      commitmentsData,setClickedRow
    );
  };

  return (
    <div>
      <div
        className={`px-1 ${
          clickedRow === commitmentsData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        }`}
        id="BtnItemTrckrView"
        onClick={handleRowClick}
        // onClick={() => handleCellClick(commitmentsData)}
      >
        <div className="commitments td-padding">
          {formattedTrialDate && (
            <div className="tri-text-date d-flex align-items-center ">
              <div className="img-sec ">
                <img
                  src={icon.tridateImg}
                  alt=""
                  className="comitments-images"
                />
              </div>
              <div className="tri-date ml-1 customer-mail">
                {" "}
                {formattedTrialDate}{" "}
              </div>
            </div>
          )}
          <div className="del-text-date d-flex align-items-center  ">
            <div className="img-sec ">
              <img src={icon.deldateImg} alt="" className="comitments-images" />
            </div>
            <div className="del-date ml-1 customer-mail">
              {formattedDelDate}
            </div>
          </div>
        </div>
      </div>
      {clickedRow === commitmentsData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomCommitmentCell;

import React, { useState } from "react";
import RatingIcon from "../../../../images/icons/rating-icon.svg";
import fullStarIcon from "../../../../images/icons/fullStarIcon.svg";
import halfStarIcon from "../../../../images/icons/halfStarIcon.svg";
import useHandleCellClick from "../OrderCustomTableCells/useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";
const CustomRatingCell = ({ ratingData }) => {
  const fullStars = Math.floor(ratingData.val);
  const halfStar = ratingData.val - fullStars >= 0.5 ? 1 : 0;
  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();
  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = () => {
    setClickedRow(ratingData.index);
    handleAction(
      "BtnOrdTrckrViewOrder",
      "action",
      handleCellClick,
      ratingData,
      setClickedRow
    );
  };

  // Create an array to hold star elements
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <img key={i} src={fullStarIcon} alt="rating" className="star-icon" />
    );
  }
  if (halfStar === 1) {
    stars.push(
      <img
        key={fullStars}
        src={halfStarIcon}
        alt="rating"
        className="star-icon half-star"
      />
    );
  }

  return (
    <div>
      <div
        className={`table-Customer-col px-1  ${
          clickedRow === ratingData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        }`}
        // onClick={() => handleCellClick(ratingData)}
        id="BtnOrdTrckrViewOrder"
        onClick={handleRowClick}
      >
        <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-center">
          <div className="customer-details">
            <div className="customer-name d-flex">{stars}</div>
          </div>
        </div>
      </div>
      {clickedRow === ratingData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomRatingCell;

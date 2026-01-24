import React from "react";

const ActionCard = ({ actionIcon, actionTitle, actionSubTitle, bgColor }) => {
  return (
    <div className="actionCard" style={{ backgroundColor: bgColor }}>
      <div className="d-flex align-items-center custome-flex">
        <div className="action-icon">
          <img src={actionIcon} alt="OrederPartial" />
        </div>
        <div className="action-name">
          <div className=" avtion-title">{actionTitle}</div>
          <p className="action-subtitle">{actionSubTitle}</p>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;

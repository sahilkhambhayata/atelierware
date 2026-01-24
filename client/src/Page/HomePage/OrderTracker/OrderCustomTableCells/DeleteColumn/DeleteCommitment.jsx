import React from "react";
import { useSelector } from "react-redux";
import { formatDate } from "../../../../../redux/dateFormateFunction";

const DeleteCommitment = ({ date }) => {
  const getConfig = useSelector((state) => state?.config?.orderType);

  let formattedTrialDate = formatDate(
    new Date(date.tDate),
    getConfig?.DateAndTime,
    true
    // "dd-MMM-yyyy 12"
  );

  let formattedDelDate = formatDate(
    new Date(date.dDate),
    getConfig?.DateAndTime,
    true
    // "dd-MMM-yyyy 12"
  );

  return (
    <div className="table-order-col ms-3">
      <div className="d-flex table-checkbox-order-details td-padding ">
        <div className="order-details">
          <div className="order-name">{formattedTrialDate}</div>
          <div className="order-name">{formattedDelDate}</div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCommitment;

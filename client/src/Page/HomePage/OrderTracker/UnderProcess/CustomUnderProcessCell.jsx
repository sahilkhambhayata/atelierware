import React from "react";
import { useSelector } from "react-redux";
import { formatDate } from "../../../../redux/dateFormateFunction";


const CustomUnderProcessCell = ({ underprocessData }) => {
  const getConfig = useSelector((state) => state?.config?.orderType);

  let formattedTrialDate = formatDate(
    new Date(underprocessData.processDate),
    getConfig?.DateAndTime,
    true
    // "dd-MMM-yyyy 12"
  );
  return (
    <div className="table-Customer-col px-1">
      <div className="d-flex customer-details-urgent-icon td-padding align-items-center justify-content-center">
        <div className="customer-details">

          {/* <div className="customer-name">{underprocessData.processDate}</div> */}
          <div className="customer-name">{formattedTrialDate}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomUnderProcessCell;

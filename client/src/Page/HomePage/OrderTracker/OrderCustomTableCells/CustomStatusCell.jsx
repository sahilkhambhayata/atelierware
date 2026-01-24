import React, { useEffect, useState } from "react";
import { DropdownToggle, DropdownMenu, UncontrolledDropdown } from "reactstrap";
import Button from "../../../../Components/button/Button";
import Icon from "../../../../Components/icon/Icon";
import useHandleCellClick from "./useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomStatusCell = ({ statusData }) => {
  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();

  // let dataLemgth = [statusData.val].length;
  // const [modelStatus, setModelStatus] = useState(false);
  // const [selectedStatus, setSelectedStatus] = useState("New");
  // const statusList = {
  //   New: { label: "New", color: "primary", subStatuses: ["New", "Estimate"] },
  //   InProgress: {
  //     label: "In Progress",
  //     color: "success",
  //     subStatuses: ["Diagnostic", "In Progress"],
  //   },
  //   Pending: {
  //     label: "Pending",
  //     color: "warning",
  //     subStatuses: ["Approval", "Invoice"],
  //   },
  //   Done: {
  //     label: "Done",
  //     color: "danger",
  //     subStatuses: ["Done", "Waiting For Collection"],
  //   },
  // };

  // const toggleDropdownStatus = () => {
  //   setModelStatus(!modelStatus);
  // };

  // const handleStatusChanger = (subStatus) => {
  //   setSelectedStatus(subStatus);
  //   setModelStatus(!modelStatus);
  // };

  // const getStatusForSubStatus = (subStatus) => {
  //   for (const statusKey in statusList) {
  //     if (statusList[statusKey].subStatuses.includes(subStatus)) {
  //       return statusKey;
  //     }
  //   }
  //   return null;
  // };
  // const associatedStatus = getStatusForSubStatus(selectedStatus);

  // useEffect(() => {
  //   const childElement = document.querySelector(".custom-open-dropdown");

  //   if (modelStatus) {
  //     if (childElement !== null) {
  //       childElement.parentElement.classList.add("overflow-unset");
  //     }
  //   } else {
  //     if (childElement !== null) {
  //       childElement.parentElement.classList.remove("overflow-unset");
  //     }
  //   }
  // }, [modelStatus]);
  const [color, setColor] = useState("");

  useEffect(() => {
    if (statusData.val == 0) {
      setColor("under-booking");
    } else if (statusData.val == 2) {
      setColor("fresh-order");
    } else if (statusData.val == 3) {
      setColor("under-process");
    } else if (statusData.val == 4) {
      setColor("ready-delivery");
    } else if (statusData.val == 5) {
      setColor("delivered");
    }
  }, []);

  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = () => {
    setClickedRow(statusData.index);
    handleAction(
      "BtnOrdTrckrViewOrder",
      "action",
      handleCellClick,
      statusData,
      setClickedRow
    );
  };

  return (
    <>
      <div
        className={`d-flex justify-content-center ${
          clickedRow === statusData.index
            ? "clicked cursor-sppiner"
            : "cursor-pointer"
        }`}
        id="BtnOrdTrckrViewOrder"
        // onClick={handleRowClick}
        // onClick={() => handleCellClick(statusData)}
      >
        <div>
          {statusData.val == 0 ? (
            <Button className={` border-${color}`}>
              <span className={`text-${color}`}>Under Booking</span>
            </Button>
          ) : statusData.val == 2 ? (
            <Button className={` border-${color}`}>
              <span className={`text-${color}`}>Fresh Order</span>
            </Button>
          ) : statusData.val == 3 ? (
            <Button className={` border-${color}`}>
              <span className={`text-${color}`}>Under Process</span>
            </Button>
          ) : statusData.val == 4 ? (
            <Button className={` border-${color}`}>
              <span className={`text-${color}`}>Ready for Delivery</span>
            </Button>
          ) : statusData.val == 5 ? (
            <Button className={` border-${color}`}>
              <span className={`text-${color}`}>Delivered</span>
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>
      {clickedRow === statusData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </>
  );
};

export default CustomStatusCell;

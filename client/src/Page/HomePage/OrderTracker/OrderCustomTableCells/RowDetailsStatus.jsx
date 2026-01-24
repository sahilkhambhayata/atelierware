import React, { useEffect, useState } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  Button,
} from "reactstrap";
import Icon from "../../../../Components/icon/Icon";

const RowDetailsStatus = () => {
  const [modelStatus, setModelStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("New");
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

  const toggleDropdownStatus = () => {
    setModelStatus(!modelStatus);
  };

  // const handleStatusChanger = (subStatus) => {
  //   setSelectedStatus(subStatus);
  //   setModelStatus(!modelStatus);
  // };

  const getStatusForSubStatus = (subStatus) => {
    // for (const statusKey in statusList) {
    //   if (statusList[statusKey].subStatuses.includes(subStatus)) {
    //     return statusKey;
    //   }
    // }
    return null;
  };
  const associatedStatus = getStatusForSubStatus(selectedStatus);

  useEffect(() => {
    const childElement = document.querySelector(".custom-open-dropdown");

    if (modelStatus) {
      if (childElement !== null) {
        childElement.parentElement.classList.add("overflow-unset");
      }
    } else {
      if (childElement !== null) {
        childElement.parentElement.classList.remove("overflow-unset");
      }
    }
  }, [modelStatus]);

  return (
    <div
      className={`d-flex justify-content-center ${
        modelStatus ? "custom-open-dropdown" : ""
      }`}
    >
      <div>
        <UncontrolledDropdown
          isOpen={modelStatus}
          toggle={toggleDropdownStatus}
          className="user-dropdown"
        >
          <DropdownToggle tag="a" className="dropdown-toggle ">
            <Button
              color="light"
              // className="border border-2 border-dark"
              // className={`border bg-white border-2 border-${statusList[associatedStatus]?.color}`}
            >
              <span
              //  className={`text-${statusList[associatedStatus]?.color}`}
               >
                {selectedStatus}
              </span>
              {/* <Icon
                name="downward-ios"
                className={`fs-6  ms-1 text-${statusList[associatedStatus]?.color}`}
              ></Icon> */}
            </Button>
          </DropdownToggle>
          {/* <DropdownMenu
            container="body"
            end
            className=" dropdown-menu-s1 dropdown-menu-custom-width"
          >
            <div className="dropdown-body">
              <div className="nk-notification">
                {Object.keys(statusList).map((statusKey) => (
                  <div key={statusKey}>
                    <div className="mt-1">
                      <strong className="fs-bolder ms-2">
                        {statusList[statusKey].label}
                      </strong>
                    </div>
                    {statusList[statusKey].subStatuses.map((subStatus, ind) => (
                      <div
                        key={ind}
                        className="form-check ms-2 my-2"
                        onClick={() => handleStatusChanger(subStatus)}
                      >
                        <label
                          className={`form-check-label text-uppercase p-1 rounded-3 border border-${statusList[statusKey].color} text-${statusList[statusKey].color}`}
                        >
                          {subStatus}
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </DropdownMenu> */}
        </UncontrolledDropdown>
      </div>
    </div>
  );
};

export default RowDetailsStatus;

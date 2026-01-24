import React, { useEffect, useState } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  Button,
} from "reactstrap";
import Icon from "../../../../Components/icon/Icon";

const Status = ({setisOpenDropdown}) => {
  const [modelStatus, setModelStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("New");



  const statusList = {
    New: { label: "New", color: "primary", subStatuses: ["New", "Estimate"] },
    InProgress: {
      label: "In Progress",
      color: "success",
      subStatuses: ["Diagnostic", "In Progress"],
    },
    Pending: {
      label: "Pending",
      color: "warning",
      subStatuses: ["Approval", "Invoice"],
    },
    Done: {
      label: "Done",
      color: "danger",
      subStatuses: ["Done", "Waiting For Collection"],
    },
  };

  const toggleDropdownStatus = () => {
    setModelStatus(!modelStatus);
    setisOpenDropdown(!modelStatus)
  };

  const getStatusForSubStatus = (subStatus) => {
    for (const statusKey in statusList) {
      if (statusList[statusKey].subStatuses.includes(subStatus)) {
        return statusKey;
      }
    }
    return null; // Return null if no matching status is found
  };
  const associatedStatus = getStatusForSubStatus(selectedStatus);

  const handleClick = (subStatus) => {
    setSelectedStatus(subStatus);
    setModelStatus(!modelStatus);
    setisOpenDropdown(false);
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  useEffect(() => {
    const childElement = document.querySelector(".custom-open-dropdown");

    if (dropdownOpen) {
      if (childElement !== null) {
        const grandPerent = childElement.closest(".css-1r5ka99");
        grandPerent.classList.add("remove-overLow");
        childElement.parentElement.classList.add("overflow-unset");
      }
    } else {
      if (childElement !== null) {
        const grandPerent = childElement.closest(".css-1r5ka99");
        grandPerent.classList.remove("remove-overLow");
        childElement.parentElement.classList.remove("overflow-unset");
      }
    }
  }, [dropdownOpen]);

  return (
    <div className={` ${dropdownOpen ? "custom-open-dropdown" : ""} `}>
      <div>
        <UncontrolledDropdown
          isOpen={modelStatus}
          toggle={toggleDropdownStatus}
          className="user-dropdown"
        >
          <DropdownToggle tag="a" className="dropdown-toggle border-bottom border-2 border-dark rounded">
            <Button
              color="light"
              className=""
              // className={`border border-2 bg-white border-${statusList[associatedStatus]?.color}`}
            >
              {/* <span className={`text-${statusList[associatedStatus]?.color}`}> */}
              <span className="text-dark ">
                {selectedStatus}
              </span>
              <Icon
                name="downward-ios"
                // className={`fs-6  ms-1 text-${statusList[associatedStatus]?.color}`}
                className={`fs-6  ms-1 text-dark`}
              ></Icon>
            </Button>
          </DropdownToggle>
          <DropdownMenu

            className=" dropdown-menu-s1 dropdown-menu-custom-width link-list-opt no-bdr"
          >
            <div className="dropdown-body">
              <div className="nk-notification ">
                {Object.keys(statusList).map((statusKey) => (
                  <div key={statusKey} className="py-1">
                    <div className="mt-1">
                      <strong className="fs-bolder ms-2 my-2">
                        {statusList[statusKey].label}
                      </strong>
                    </div>
                    {statusList[statusKey].subStatuses.map((subStatus, ind) => (
                      <div
                        key={ind}
                        className="form-check ms-2 my-2"
                        onClick={() => handleClick(subStatus)}
                      >
                        <label
                          className={`form-check-label text-uppercase p-1 rounded-3 border border-${statusList[statusKey].color} text-${statusList[statusKey].color}`}
                          htmlFor={`flexCheckDefault${ind}`}
                        >
                          {subStatus }
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </div>
  );
};

export default Status;

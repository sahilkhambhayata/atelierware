import React, { useEffect, useState } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  Spinner,
} from "reactstrap";
import Button from "../../../../Components/button/Button";
import Icon from "../../../../Components/icon/Icon";
import { useDispatch } from "react-redux";
import { statusUpdate } from "../../../../redux/actions/statusUpdate";
import useHandleCellClick from "./useHandleCellClick";

const CustomStatusCell = ({ statusData }) => {
  const [dropdownData, setDropdownData] = useState([]);
  const [currentStatus, setCurrentStatus] = useState();
  const [modelStatus, setModelStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState();
  // let dataLemgth = dropdownData.length;
  // const handleCellClick = useHandleCellClick();

  console.log(statusData,"currentStatus")
  useEffect(() => {
    setDropdownData(statusData?.val?.newstatus);
    setCurrentStatus(statusData?.currentStatus);
  }, []);

  // useEffect(() => {
  //   setSelectedStatus(dropdownData.find((item) => item.SId == currentStatus));
  // }, [currentStatus]);

  const toggleDropdownStatus = () => {
    setModelStatus(!modelStatus);
  };

  // const dispatch = useDispatch();

  // const UserId = localStorage.getItem("userId");

  // const [loader, setLoader] = useState(false);

  // const handleStatusChanger = (subStatus) => {
  //   setLoader(true);
  //   const nextId = dropdownData?.length == 1 ? 0 : subStatus.SId;
  //   dispatch(
  //     statusUpdate(currentStatus, nextId, statusData.TOrdDtId, UserId)
  //   ).then((res) => {
  //     if (res.success) {
  //       // Update dropdownData with new data from the API response
  //       setLoader(false);
  //       setDropdownData(res.statusdata.newstatus);
  //       currentStatus(subStatus.SId);
  //       // setSelectedStatus(subStatus);
  //     }
  //   });
  //   setModelStatus(!modelStatus);
  // };

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
    <>
    {console.log(currentStatus)}
      <div
        className={`d-flex justify-content-center cursor-pointer ${
          modelStatus ? "custom-open-dropdown" : ""
        }`}
        // onClick={() => handleCellClick(statusData)}
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
                className={` bg-white `}
                style={{ border: "2px solid #559bfb" }}
              >
                <span className="text-uppercase" style={{ color: "#559bfb" }}>
                  {statusData.currentStatus}
                </span>
              </Button>
            </DropdownToggle>
          </UncontrolledDropdown>
        </div>
      </div>
    </>
  );
};

export default CustomStatusCell;

import React, { useEffect, useRef, useState } from "react";
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
import { ToastContainer, toast } from "react-toastify";
import { getItemDetailsAsyncData } from "../../../../redux/actions/itemDetailAction";
import { getItemCount } from "../../../../redux/actions/orderCount";
import useHandleCellClick from "./useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomStatus1Cell = ({ statusData }) => {
  const [currentStatus, setCurrentStatus] = useState();
  const [dropdownData, setDropdownData] = useState([]);
  const [currentStatusId, setCurrentStatusId] = useState();
  const [modelStatus, setModelStatus] = useState(false);
  const [loader, setLoader] = useState(false);
  const containerRef = useRef(null);
  // const handleCellClick = useHandleCellClick();
  const UserId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const { handleAction } = usePermissions();

  useEffect(() => {
    setDropdownData(statusData.val.NextStatus);
    setCurrentStatus(statusData.currentStatus);
    setCurrentStatusId(statusData.currentId);
  }, [statusData]);

  //   useEffect(() => {
  //     setSelectedStatus(dropdownData.find((item) => item.SId == currentStatus));
  //   }, [currentStatus]);

  const toggleDropdownStatus = () => {
    setModelStatus(!modelStatus);
  };

  const fetchData = async () => {
    let currentPage = 0;
    let pageSize = 50;
    const BU_Id = localStorage.getItem("BU_Id");
    const BranchId = localStorage.getItem("BranchId");

    let isClosed = 0;

    try {
      if (BranchId && BU_Id) {
        await dispatch(getItemCount());
        await dispatch(
          getItemDetailsAsyncData(
            currentPage,
            pageSize,
            BU_Id,
            isClosed
            // activeTab,
            // selectedFilter,
            // startDate,
            // endDate,
            // minAmount,
            // maxAmount
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChanger = (item) => {
    // e.stopPropagation();
    setLoader(true);
    console.log(item);
    

    if (item.NextSId == "113") {
      fetchData();
      // window.location.reload();
    }

    setModelStatus(false);
    dispatch(
      statusUpdate(currentStatusId, item.NextSId, statusData.TOrdDtId, UserId)
    ).then((res) => {
      if (res?.success) {
        setLoader(false);
        setCurrentStatus(res?.statusdata.CurrentStatus);
        setDropdownData(res?.statusdata.NextStatus);
        setCurrentStatusId(res?.statusdata.ItemStatus);
        toast.success(`${statusData.val.OrdSrNo} ${res?.message} `);
        if (res?.statusdata?.ItemStatus == "106") {
          fetchData();
          // window.location.reload();
        }
      } else {
        setLoader(false);

        setModelStatus(!modelStatus);
        toast.error(res.message);
      }
    });
  };

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

  // useEffect(() => {
  //   const handleMouseLeave = () => {
  //     setModelStatus(false);
  //   };

  //   const containerNode = containerRef.current;
  //   if (containerNode) {
  //     containerNode.addEventListener("mouseleave", handleMouseLeave);
  //   }

  //   return () => {
  //     if (containerNode) {
  //       containerNode.removeEventListener("mouseleave", handleMouseLeave);
  //     }
  //   };
  // }, []);

  // const [isScrolled, setIsScrolled] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 100) { // Set your scroll threshold
  //       setIsScrolled(true);
  //     } else {
  //       setIsScrolled(false);
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);
  useEffect(() => {
    const handleScroll = () => {
      setModelStatus(false);
    };

    const gridContainer = document.querySelector(".grid-container");
    if (gridContainer) {
      gridContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (gridContainer) {
        gridContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`d-flex justify-content-center ${
        modelStatus ? "custom-open-dropdown" : ""
      } cursor-pointer`}
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
              {loader ? (
                <Spinner size="sm" color="light" />
              ) : (
                <span className="text-uppercase" style={{ color: "#559bfb" }}>
                  {currentStatus}
                </span>
              )}
              <Icon
                name="downward-ios"
                className={`fs-6  ms-1 `}
                style={{ color: "#559bfb" }}
              ></Icon>
            </Button>
          </DropdownToggle>
          <DropdownMenu
            // container={dataLemgth === 1 ? "body" : ""}
            end
            className={`dropdown-menu-s1 status-dropdown `}
            style={{ zIndex: 1 }}
          >
            <div className="dropdown-body">
              <div className="nk-notification p-2">
                {dropdownData
                  //   ?.filter((statusKey) => statusKey.SId != currentStatus) // Filter out the current status
                  ?.map((item, ind) => {
                    return (
                      <div key={ind}>
                        <div
                          id="BtnItemTrckrChangeStatus"
                          className="mt-1  p-1 cursor-pointer  form-check ms-2 my-2 "
                          onClick={() =>
                            handleAction(
                              "BtnItemTrckrChangeStatus",
                              "action",
                              handleStatusChanger,
                              item
                              // balanceData.balanceData
                            )
                          }
                          // onClick={(e) => handleStatusChanger(e, item)}
                          style={{
                            border: "1px solid #559bfb",
                            borderRadius: "5px",
                            overflowWrap: "break-word",
                          }}
                        >
                          <label
                            className="fs-bolder ms-2 form-check-label text-uppercase"
                            style={{ color: "#559bfb" }}
                          >
                            {item.statusname}
                          </label>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </div>
  );
};

export default CustomStatus1Cell;
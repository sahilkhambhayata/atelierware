import React, { useEffect, useState } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  Dropdown,
  Spinner,
  UncontrolledTooltip,
  UncontrolledDropdown,
} from "reactstrap";
import { LinkItem, LinkList } from "../../../../Components/Links/Links";
import UserAvatar from "../../../../Components/User/UserAvatar";
import Icon from "../../../../Components/icon/Icon";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import DownArrowIcon from "../../../../images/icons/down-arrow.svg";
import UpArrowIcon from "../../../../images/icons/up-arrow.svg";

import UserEmailIcon from "../../../../images/icons/user-email-icon.svg";
import ChangePasswordIcon from "../../../../images/icons/change-password-icon.svg";
import UserCallIcon from "../../../../images/icons/user-call-icon.svg";
import UserLocationIcon from "../../../../images/icons/user-location-icon.svg";
import {
  changeBranch,
  logoutAdmin,
} from "../../../../redux/actions/loginAction";
import ToolTipContent from "../../../../Components/Tooltip/ToolTipContent";
import Tooltip from "../../../../Components/Tooltip/Tooltip";
import Button from "../../../../Components/button/Button";
import { usePermissions } from "../../../Provider/PermissionsContext";

// import { logoutAdmin } from "../../../../redux/actions/loginAction";

const User = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleAction } = usePermissions();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);

  const data = useSelector((state) => state.loginUser);

  const branch = useSelector((state) => state.branch?.branch);

  const [selectedBranch, setSelectedBranch] = useState();

  useEffect(() => {
    if (data && data?.user?.user && data?.user?.branch_list) {
      const defaultBranch = data?.user?.branch_list?.find(
        (branch) =>
          branch.BranchId == data?.user?.user?.BranchId &&
          branch.Companyid == data?.user?.user?.CompanyId
      );

      setSelectedBranch(defaultBranch);
    }
  }, [data]);

  const count = useSelector((state) => state.loginUser.userOrderCount);

  const handleSignout = () => {
    setIsLoading(true);
    const userId = localStorage.getItem("userId");
    // localStorage.removeItem("userId");
    // localStorage.removeItem("token");
    localStorage.removeItem("CompanyId");
    localStorage.removeItem("customerId");
    localStorage.removeItem("BranchId");
    localStorage.removeItem("BU_Id");
    localStorage.removeItem("serviceId");

    dispatch(logoutAdmin(userId)).then((data) => {
      if (data.success === true) {
        navigate("/");
        setIsLoading(false);
      } else {
        setTimeout(() => {
          alert("logout failed");
        }, 1000);
        setIsLoading(false);
      }
    });

    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };

  const handleChangePassword = () => {
    // localStorage.setItem("email", data?.RecoveryEmail);
    navigate("/change-password");
  };

  const [branchUpdateLoader, setBranchUpdateLoader] = useState(false);

  const handleBranchChange = (selectedBranch) => {
    setBranchUpdateLoader(true);
    // Extract necessary data from the selected branch
    const branchId = selectedBranch.BranchId;

    // Set the selected branch in the state
    setSelectedBranch(selectedBranch);

    // Set localStorage values
    localStorage.setItem("BU_Id", selectedBranch.BU_Id);
    localStorage.setItem("CompanyId", selectedBranch.Companyid);
    localStorage.setItem("BranchId", selectedBranch.BranchId);

    // Dispatch the action to change the branch
    dispatch(changeBranch()).then((res) => {
      if (res.success) {
        setBranchUpdateLoader(false);
      }
    });
  };
  const [modelStatus, setModelStatus] = useState(false);
  const toggleDropdownStatus = () => {
    setModelStatus(!modelStatus);
  };

  return (
    <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
      <DropdownToggle
        tag="a"
        href="#toggle"
        className="dropdown-toggle d-flex"
        onClick={(ev) => {
          ev.preventDefault();
        }}
      >
        <UserAvatar icon="user-alt" className="sm" />
        <div className="ms-2 d-xl-block d-none">
          <span className="lead-text text-uppercase">
            {data?.user?.user?.UserRole}
          </span>
          <span className="text-dark opacity-2">
            {data?.user?.user?.UserName}
            <img
              src={open ? UpArrowIcon : DownArrowIcon} // Use the up or down arrow icon based on the open state.
              alt=""
              style={{ width: "10px", marginLeft: "10px" }}
            />
          </span>
        </div>
      </DropdownToggle>
      <DropdownMenu end className="dropdown-menu-xl dropdown-menu-s1">
        {/* for big size======================================= */}
        <div className="d-none d-md-block">
          <div className=" user-card-wrap bg-lighter  text-center mb-5 ">
            <div className="d-flex justify-content-between">
              <div className="dropdown-inner pr-2">
                <div className="d-flex justify-content-end">
                  <img
                    id="change-password"
                    name="change-password"
                    src={ChangePasswordIcon}
                    onClick={handleChangePassword}
                    className="text-danger fw-bolder fs-5"
                    style={{ cursor: "pointer" }}
                  ></img>
                </div>

                <Tooltip
                  id={`change-password`}
                  direction="top"
                  text={ToolTipContent.changePassword}
                />
              </div>
              <div className="dropdown-inner pr-2 border-0">
                <div className="d-flex justify-content-end " id="logout">
                  {isLoading ? (
                    <Spinner size="sm" className="mx-1 text-danger" />
                  ) : (
                    <Icon
                      name="signout"
                      onClick={handleSignout}
                      className="text-danger fw-bolder fs-5"
                      style={{ cursor: "pointer" }}
                    ></Icon>
                  )}
                </div>
                <Tooltip
                  id={`logout`}
                  direction="top"
                  text={ToolTipContent.logout}
                />
              </div>
            </div>

            <div className="">
              <div className="d-flex justify-content-center m-2 mt-0">
                <div className="user-avatar bg-custome ">
                  <span>
                    {(data?.user?.user?.UserName || "")
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <span className="fs-5 fw-bold">
                  {data?.user?.user?.UserName}
                </span>
                <p className="text-medium text-uppercase">
                  {data?.user?.user?.UserRole}
                </p>
              </div>
            </div>
            <div className="d-flex gap-3 justify-content-between mt-5 ms-5 me-5">
              <div className="text-center">
                <span className="fs-5 fw-bold">{count?.Totalorder}</span>
                <p className="text-medium" style={{ opacity: "0.7" }}>
                  Total Order
                </p>
              </div>
              <div className="text-center">
                <span className="fs-5 fw-bold">{count?.Complete}</span>
                <p className="text-medium" style={{ opacity: "0.7" }}>
                  Complete
                </p>
              </div>
              <div className="text-center">
                <span className="fs-5 fw-bold">{count?.Progreess}</span>
                <p className="text-medium" style={{ opacity: "0.7" }}>
                  Progress
                </p>
              </div>
            </div>
          </div>
          <div className="ms-5 pt-3">
            <p className="fw-bold " style={{ letterSpacing: "2px" }}>
              USER INFORMATION
            </p>
            <div className="w-75">
              <div className="mb-2">
                <div className="d-flex align-items-center">
                  {/* <em className="fs-4 ni ni-mail me-2" style={{opacity:"0.5"}}/> */}
                  <img src={UserEmailIcon} className="me-2 " width="20"></img>
                  <span className="text-dark">
                    {data?.user?.user?.RecoveryEmail}
                  </span>
                </div>
              </div>
              <div className="mb-2">
                <div className="d-flex align-items-center">
                  {/* <em className="fs-4 ni ni-call me-2" style={{opacity:"0.5"}}/> */}
                  <img src={UserCallIcon} className="me-2 " width="20"></img>
                  <span className="text-dark">{branch?.Phone}</span>
                </div>
              </div>
              <div className="mb-2">
                <div className="d-flex align-items-start">
                  {/* <em className="fs-4 ni ni-location me-2" style={{opacity:"0.5"}}/> */}
                  <img src={UserLocationIcon} className="me-2" width="25"></img>
                  <span className="text-dark">{branch?.Address1}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="ms-5 mt-5">
            <p className="fw-bold" style={{ letterSpacing: "2px" }}>
              BRANCH
            </p>
            <div className="mb-2 w-100">
              <div className="d-flex align-items-center ">
                <UncontrolledDropdown
                  isOpen={modelStatus}
                  toggle={toggleDropdownStatus}
                  className="user-dropdown"
                >
                  <DropdownToggle tag="a" className="dropdown-toggle ">
                    <Button
                      color="light"
                      className="bg-white d-flex justify-content-between"
                      style={{ border: "2px solid #559bfb", width: "280px" }}
                    >
                      {branchUpdateLoader ? (
                        <div>
                          <Spinner size="sm" color="light" />
                        </div>
                      ) : (
                        <span
                          className="text-uppercase"
                          style={{ color: "#559bfb" }}
                        >
                          {selectedBranch?.BranchName}
                        </span>
                      )}
                      <Icon
                        name="downward-ios"
                        className={`fs-6  `}
                        style={{ color: "#559bfb" }}
                      ></Icon>
                    </Button>
                  </DropdownToggle>
                  <DropdownMenu end className=" dropdown-menu-s1 ">
                    <div className="dropdown-body">
                      <div className=" px-2 " style={{ minWidth: "280px" }}>
                        {data?.user?.branch_list?.map((branch) => (
                          <div key={branch.BranchId}>
                            <div
                              id="BtnChangeBranch"
                              className="p-1 cursor-pointer form-check my-1 "
                              // onClick={() =>
                              //   handleAction(
                              //     "BtnChangeBranch",
                              //     "action",
                              //     handleBranchChange,
                              //     branch
                              //     // balanceData.balanceData
                              //   )
                              // }
                              onClick={() => handleBranchChange(branch)}
                              style={{
                                border: "1px solid #559bfb",
                                borderRadius: "5px",
                                overflowWrap: "break-word",
                              }}
                            >
                              <label
                                className="fs-bolder  form-check-label text-uppercase"
                                style={{ color: "#559bfb" }}
                              >
                                {branch.BranchName}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>

        {/* for small size====================================================== */}
        <div className="d-md-none d-block">
          <div className=" user-card-wrap bg-lighter  text-center mb-1 ">
            <div className="d-flex justify-content-between">
              <div className="dropdown-inner pr-0">
                <div className="d-flex justify-content-end">
                  <img
                    id="change-password"
                    name="change-password"
                    src={ChangePasswordIcon}
                    onClick={handleChangePassword}
                    className="text-danger fw-bolder fs-10"
                    style={{ cursor: "pointer" }}
                  ></img>
                </div>

                <Tooltip
                  id={`change-password`}
                  direction="top"
                  text={ToolTipContent.changePassword}
                />
              </div>
              <div className="dropdown-inner pr-2">
                <div className="d-flex justify-content-end " id="logout">
                  {isLoading ? (
                    <Spinner size="sm" className="mx-1 text-danger" />
                  ) : (
                    <Icon
                      name="signout"
                      onClick={handleSignout}
                      className="text-danger fw-bolder fs-5"
                      style={{ cursor: "pointer" }}
                    ></Icon>
                  )}
                </div>
                <Tooltip
                  id={`logout`}
                  direction="top"
                  text={ToolTipContent.logout}
                />
              </div>
            </div>

            <div className="">
              <div className="d-flex justify-content-center m-2 mt-0">
                <div className="bg-custome text-white p-2 rounded-full">
                  <span>
                    {(data?.user?.user?.UserName || "")
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </span>
                </div>
                {/* <div className="user-avatar bg-custome "> */}

                {/* </div> */}
              </div>
              <div className="text-center">
                <span className="fs-5 fw-bold">
                  {data?.user?.user?.UserName}
                </span>
                <p className="text-medium text-uppercase">
                  {data?.user?.user?.UserRole}
                </p>
              </div>
            </div>
            <div className="d-flex gap-3 justify-content-between my-2 mx-3 ">
              <div className="text-center">
                <span className="fs-14 fw-bold">{count?.Totalorder}</span>
                <p className="text-medium fs-12" style={{ opacity: "0.7" }}>
                  Total Order
                </p>
              </div>
              <div className="text-center">
                <span className="fs-14 fw-bold">{count?.Complete}</span>
                <p className="text-medium fs-12" style={{ opacity: "0.7" }}>
                  Complete
                </p>
              </div>
              <div className="text-center">
                <span className="fs-14 fw-bold">{count?.Progreess}</span>
                <p className="text-medium fs-12" style={{ opacity: "0.7" }}>
                  Progress
                </p>
              </div>
            </div>
          </div>
          <div className="ms-3 pt-3">
            <p className="fw-bold mb-1" style={{ letterSpacing: "2px" }}>
              USER INFORMATION
            </p>
            <div className="w-75">
              <div className="mb-1">
                <div className="d-flex align-items-center">
                  {/* <em className="fs-4 ni ni-mail me-2" style={{opacity:"0.5"}}/> */}
                  <img src={UserEmailIcon} className="me-2 " width="16"></img>
                  <span className="text-dark">
                    {data?.user?.user?.RecoveryEmail}
                  </span>
                </div>
              </div>
              <div className="mb-1">
                <div className="d-flex align-items-center">
                  {/* <em className="fs-4 ni ni-call me-2" style={{opacity:"0.5"}}/> */}
                  <img src={UserCallIcon} className="me-2 " width="18"></img>
                  <span className="text-dark">{branch?.Phone}</span>
                </div>
              </div>
              <div className="mb-1">
                <div className="d-flex align-items-start">
                  {/* <em className="fs-4 ni ni-location me-2" style={{opacity:"0.5"}}/> */}
                  <img src={UserLocationIcon} className="me-2" width="16"></img>
                  <span className="text-dark">{branch?.Address1}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="ms-3 mt-3">
            <p className="fw-bold mb-1" style={{ letterSpacing: "2px" }}>
              BRANCH
            </p>
            <div className="mb-2">
              <div className="d-flex align-items-center">
                <UncontrolledDropdown
                  isOpen={modelStatus}
                  toggle={toggleDropdownStatus}
                  className="user-dropdown"
                >
                  <DropdownToggle tag="a" className="dropdown-toggle ">
                    <Button
                      color="light"
                      className=" bg-white"
                      style={{ border: "2px solid #559bfb", minWidth: "200px" }}
                    >
                      {branchUpdateLoader ? (
                        <div>
                          <Spinner size="sm" color="light" />
                        </div>
                      ) : (
                        <span
                          className="text-uppercase"
                          style={{ color: "#559bfb" }}
                        >
                          {selectedBranch?.BranchName}
                        </span>
                      )}
                      <Icon
                        name="downward-ios"
                        className={`fs-6 ms-1 `}
                        style={{ color: "#559bfb" }}
                      ></Icon>
                    </Button>
                  </DropdownToggle>
                  <DropdownMenu end className=" dropdown-menu-s1 ">
                    <div className="dropdown-body">
                      <div className="nk-notification p-2">
                        {data?.user?.branch_list?.map((branch) => (
                          <div key={branch.BranchId}>
                            <div
                              id="BtnChangeBranch"
                              className="p-1 cursor-pointer form-check my-1 "
                              // onClick={() =>
                              //   handleAction(
                              //     "BtnChangeBranch",
                              //     "action",
                              //     handleBranchChange,
                              //     branch
                              //     // balanceData.balanceData
                              //   )
                              // }
                              onClick={() => handleBranchChange(branch)}
                              style={{
                                border: "1px solid #559bfb",
                                borderRadius: "5px",
                                overflowWrap: "break-word",
                              }}
                            >
                              <label
                                className="fs-bolder  form-check-label text-uppercase"
                                style={{ color: "#559bfb" }}
                              >
                                {branch.BranchName}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default User;

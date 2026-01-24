import React, { useEffect, useState } from "react";
import Head from "../../../Layout/head/Head";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewRole,
  deleteRole,
  editOldRole,
  getRoleDetailsAsyncData,
} from "../../../redux/actions/Role/roleAction";
import { Block } from "../../../Components/Block/Block";
import {
  Button,
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import Content from "../../../Layout/Content/Content";
import { AgGridReact } from "ag-grid-react";
import Icon from "../../../Components/icon/Icon";
import ToolTipContent from "../../../Components/Tooltip/ToolTipContent";
import Tooltip from "../../../Components/Tooltip/Tooltip";
import CategoryIcon from "./../../../images/icons/add-order-caterory-icon.svg";
import { toast } from "react-toastify";
import infoIcon from "../../../images/icons/info-icon.svg";

import CustomPagination from "../../HomePage/CommonTracker/CustomPagination";
import { Fade, Menu, Skeleton, Switch } from "@mui/material";
import {
  createNewUser,
  editOldUser,
  getUserDetailsAsyncData,
  updateActivationUser,
} from "../../../redux/actions/Role/userAction";
import { getEmployDetailsAsyncData } from "../../../redux/actions/Role/employAction";
import RoleSkelaton from "../TableSkeletonDesign";
import deleteWaringIcon from "./../../../images/icons/delete-waring-icon.svg";
import { usePermissions } from "../../../Layout/Provider/PermissionsContext";
import { useNavigate } from "react-router";
import { getDesignerList } from "../../../redux/actions/designerAction";

const AddUser = () => {
  const [data, setData] = useState({
    RoleId: "",
    RoleName: "",
    EmpId: "",
    EmpName: "",
    EmpCode: "",
    PasswordHash: "",
    Password: "",
  });

  const [designerData, setDesignerData] = useState([]);

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userReducer);
  const { employData } = useSelector((state) => state?.employReducer);
  const { roleData } = useSelector((state) => state?.roleReducer);
  const [employDropdown, setEmployDropdown] = useState(false);
  const [roleDropdown, setRoleDropdown] = useState(false);
  const [designerDropdown, setDesignerDropdown] = useState(false);
  const [createModel, setCreateModel] = useState(false);
  const [editModel, setEditModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [passState, setPassState] = useState(false);
  const [passError, setPassError] = useState(false);
  const [switchUpdateModel, setSwitchUpdateModel] = useState(false);
  const [switchId, setSwitchId] = useState({});
  const [checkedStates, setCheckedStates] = useState({});
  const [switchLoader, setSwitchLoader] = useState(false);
  const { handleAction } = usePermissions();
  const designer = useSelector((state) => state.designer);
  const navigate = useNavigate();

  const [modelTrue, setModelTrue] = useState(false);

  //role management logic start=====================================================================

  const rolePermission = useSelector(
    (state) => state.permissionByRoleReducer.rolePermission.Data
  );
  const allowedPageCodes = rolePermission?.flatMap((module) =>
    module.PAGE.map((page) => page.PageCode)
  );
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    if (!toastShown && rolePermission) {
      if (allowedPageCodes?.some((code) => code?.includes("PgUsers"))) {
        // User is authorized, no action needed
      } else {
        toast.error(
          "You are not authorised to perform this page, for more details contact your account admin."
        );
        navigate("/dashboard");
        setToastShown(true); // Set the flag to indicate that the toast has been shown
      }
    }
  }, [toastShown, rolePermission]);

  //role management logic end=================================================================================

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreate = () => {
    setCreateModel(true);
    dispatch(getEmployDetailsAsyncData());
    dispatch(getRoleDetailsAsyncData("", 0, 10));
  };

  const handleCloseCreateModel = () => {
    setCreateModel(false);
    setData({
      RoleId: "",
      RoleName: "",
      EmpId: "",
      EmpName: "",
      EmpCode: "",
      PasswordHash: "",
      Password: "",
    });
    setDesignerData([]);
    setPassError(false);
  };

  const submitUser = () => {
    setLoading(true);
    if (data.Password == data.PasswordHash) {
      {
        dispatch(
          createNewUser(data, designerData, "", currentPage, pageSize)
        ).then((res) => {
          if (res.success) {
            setLoading(false);
            toast.success(res.message);
            setPassError(false);
            handleCloseCreateModel();
          } else {
            toast.error(res.message);
          }
        });
      }
    } else {
      setPassError(true);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setCurrentPage(0);
    setPageSize(
      newRowsPerPage === 0
        ? userData?.userData?.Data.totalCount
        : newRowsPerPage
    );
  };

  const handleClick = (event) => {
    if (window.innerWidth < 992) {
      setAnchorEl(
        event.currentTarget
        // document.querySelector(
        //   ".nk-header-searchbox .position-absolute.nk-img-position-set"
        // )
      );
      setOpen(true);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992 && open) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  useEffect(() => {
    dispatch(getUserDetailsAsyncData(search, currentPage, pageSize));
  }, [dispatch, search, pageSize, currentPage]);

  // useEffect(()=>{
  //   if(search.length > 0) {
  //     dispatch(getSearchUserData(search, currentPage, pageSize))
  //   }
  // },[search])
  //active state logic======================================================

  useEffect(() => {
    if (userData?.userData?.Data) {
      const initialCheckedStates = userData.userData.Data.reduce(
        (acc, user) => {
          acc[user.UserId] = !!user.ActivationStatus; // Assuming ActivationStatus is boolean
          return acc;
        },
        {}
      );
      setCheckedStates(initialCheckedStates);
    }
  }, [userData]);

  const handleChange = (user) => {
    setSwitchUpdateModel(true);
    setSwitchId(user);
  };

  const isSwitchChecked = (userId) => checkedStates[userId] ?? false;

  const handleActivation = () => {
    setSwitchLoader(true);
    dispatch(updateActivationUser(switchId, "", currentPage, pageSize)).then(
      (res) => {
        if (res.success) {
          setSwitchLoader(false);
          setCheckedStates((prevStates) => ({
            ...prevStates,
            [switchId.UserId]: res.data.ActivationStatus == 1, // Toggle the state locally
          }));

          dispatch(getUserDetailsAsyncData(search, currentPage, pageSize));

          toast.success(res.message);
          setSwitchUpdateModel(false);
          setSwitchId({});
        }
      }
    );
  };

  const BU_Id = localStorage.getItem("BU_Id");
  //edit user logic=================================================================
  const [editId, setEditId] = useState("");
  useEffect(() => {
    if (BU_Id) {
      dispatch(getDesignerList(BU_Id));
    }
  }, []);

  const handleEdit = (user) => {
    setEditModel(true);

    dispatch(getEmployDetailsAsyncData());
    dispatch(getRoleDetailsAsyncData("", 0, 10));
    setEditId(user.UserId);
    setData({
      RoleId: user.RoleId,
      RoleName: user.UserRole,
      EmpName: user.UserName,
      EmpCode: user.EmployeeCode,
      PasswordHash: user.Password,
      Password: user.Password,
    });
    if (user && user.DesignerId) {
      const designerIds = user.DesignerId.split(",");

      const updatedDesignerData = designerIds.map((id) => {
        const matchedDesigner = designer.orderDetails.find(
          (d) => d.EmpId === id
        );
        return {
          DesignerId: id,
          DesignerName: matchedDesigner ? matchedDesigner.EmpName : "",
        };
      });

      setDesignerData(updatedDesignerData);
    } else {
    }
  };
  const handleCloseEditModel = () => {
    setEditModel(false);
    setLoading(false);
    setData({
      RoleId: "",
      RoleName: "",
      EmpId: "",
      EmpName: "",
      EmpCode: "",
      PasswordHash: "",
      Password: "",
    });
    setDesignerData([]);
  };

  const editUser = () => {
    setLoading(true);
    dispatch(
      editOldUser(editId, data, designerData, "", currentPage, pageSize)
    ).then((res) => {
      if (res.success) {
        setEditId("");
        setLoading(false);
        toast.success(res.message);
        setPassError(false);
        handleCloseEditModel();
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleSelect = (item) => {
    const isSelected = designerData.some(
      (designer) => designer.DesignerId === item.EmpId
    );

    if (isSelected) {
      // Remove item from the list
      const updatedList = designerData.filter(
        (designer) => designer.DesignerId !== item.EmpId
      );
      setDesignerData(updatedList);
    } else {
      // Add item to the list
      const updatedList = [
        ...designerData,
        { DesignerId: item.EmpId, DesignerName: item.EmpName },
      ];
      setDesignerData(updatedList);
    }
  };

  const handleRemove = (item) => {
    const updatedList = designerData.filter(
      (designer) => designer.DesignerId !== item.DesignerId
    );
    setDesignerData(updatedList);
  };
  return (
    <>
      <Head title="User" />
      <Content>
        <Block className="px-1 px-sm-0 ">
          <div className="d-flex  justify-content-end justify-content-lg-between align-items-center mb-3 ">
            <div className="nk-header-tools nk-header col-6  border-bottom-0">
              <div className="position-relative nk-header-searchbox px-lg-0  d-none d-xl-block">
                <input
                  type="text"
                  id="default-01"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="form-control-lg form-control search-input d-lg-block d-none "
                />
                <Icon
                  name="search"
                  className="position-absolute nk-img-position-set "
                ></Icon>
              </div>
              <div className="d-block d-xl-none mx-3">
                <div>
                  <div
                    id="search-button"
                    aria-controls={open ? "search-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    name="search"
                    onClick={handleClick}
                  >
                    <Icon
                      name="search"
                      className="fs-5"
                      // className="position-absolute nk-img-position-set "
                    ></Icon>
                  </div>

                  <Menu
                    id="search-menu"
                    // MenuListProps={{
                    //   "aria-labelledby": "search-button",
                    // }}
                    className=""
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                  >
                    <div className="position-relative ">
                      <input
                        type="text"
                        id="default-01"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search"
                        className=" form-control w-100 "
                      />
                    </div>
                  </Menu>
                </div>
              </div>
            </div>

            <div className="d-felx  align-items-center ml-lg-3 ml-0 custom-ml-0 me-lg-3 me-0">
              <div className="pagination bg-white rounded-10">
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={userData?.userData?.totalPages}
                  // isClosed={isClosed}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={[0, 1, 2, 3, 5]}
                  rowsPerPage={pageSize}
                  labelRowsPerPage="Rows/page"
                />
              </div>
            </div>

            <div className="d-flex ms-2 ms-lg-0 ">
              <Button
                id="BtnAddUser"
                onClick={() =>
                  handleAction(
                    "BtnAddUser",
                    "action",
                    handleCreate
                    // balanceData.balanceData
                  )
                }
                disabled={
                  userData.userData.ActiveCount >= userData.userData.UserLimit
                }
              >
                {userData.userLoader
                  ? `Create (0/0)`
                  : `Create (${userData.userData.ActiveCount}/${userData.userData.UserLimit})`}
              </Button>
            </div>
          </div>
          <Card className="card-bordered card-stretch ">
            <div className="card-inner-group">
              <div className="card-inner p-0 order-table">
                {userData.userLoader ? (
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead className="">
                        <tr>
                          <th className="py-3 bg-gray2">User ID</th>
                          <th className="py-3 bg-gray2">User</th>
                          <th className="py-3 bg-gray2">Employe Code</th>
                          <th className="py-3 bg-gray2">Email</th>
                          <th className="py-3 bg-gray2">Role</th>
                          <th className="py-3 bg-gray2">Login Status</th>
                          <th className="py-3 bg-gray2">Active Status</th>
                          <th className="py-3 bg-gray2">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {Array.from({ length: 5 }, (_, ind) => {
                          return (
                            <tr key={ind}>
                              <td>
                                <Skeleton
                                  variant="text"
                                  sx={{ fontSize: "1rem" }}
                                  width={100}
                                />
                              </td>
                              <td>
                                <Skeleton
                                  variant="text"
                                  sx={{ fontSize: "1rem" }}
                                  width={120}
                                />
                              </td>
                              <td>
                                <Skeleton
                                  variant="text"
                                  sx={{ fontSize: "1rem" }}
                                  width={100}
                                />
                              </td>
                              <td>
                                <Skeleton
                                  variant="text"
                                  sx={{ fontSize: "1rem" }}
                                  width={200}
                                />
                              </td>
                              <td>
                                <Skeleton
                                  variant="text"
                                  sx={{ fontSize: "1rem" }}
                                  width={100}
                                />
                              </td>
                              <td>
                                <Skeleton
                                  variant="text"
                                  sx={{ fontSize: "1.5rem" }}
                                  width={70}
                                />
                              </td>

                              <td>
                                <Skeleton
                                  variant="text"
                                  sx={{ fontSize: "1.5rem" }}
                                  width={50}
                                />
                              </td>

                              <td className="">
                                <Skeleton
                                  variant="rounded"
                                  width={60}
                                  height={30}
                                  className="m-1"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead className="">
                        <tr>
                          <th className="py-3 bg-gray2">User ID</th>
                          <th className="py-3 bg-gray2">User</th>
                          <th className="py-3 bg-gray2">Employe Code</th>
                          <th className="py-3 bg-gray2">Email</th>
                          <th className="py-3 bg-gray2">Role</th>
                          <th className="py-3 bg-gray2">Login Status</th>
                          <th className="py-3 bg-gray2">Active Status</th>
                          <th className="py-3 bg-gray2">Action</th>
                        </tr>
                      </thead>
                      {userData?.userData?.Data?.length > 0 ? (
                        <tbody>
                          {userData?.userData?.Data?.map((user, ind) => {
                            return (
                              <tr key={user.UserId}>
                                <td>{ind + 1}</td>
                                <td>{user.UserName}</td>
                                <td>{user.EmployeeCode}</td>
                                <td>{user.RecoveryEmail}</td>
                                <td>{user.UserRole}</td>
                                <td>
                                  {user.logged == 1 ? (
                                    <span className="bg-success p-1 rounded-pill">
                                      Login
                                    </span>
                                  ) : (
                                    <span className="bg-danger p-1 rounded-pill text-light">
                                      Logout
                                    </span>
                                  )}
                                </td>

                                <td>
                                  <Switch
                                    checked={
                                      checkedStates[user.UserId] ?? false
                                    }
                                    // onChange={() => handleChange(user)}
                                    id="BtnUpdateUserStatus"
                                    onChange={() =>
                                      handleAction(
                                        "BtnUpdateUserStatus",
                                        "action",
                                        handleChange,
                                        user
                                        // balanceData.balanceData
                                      )
                                    }
                                    inputProps={{ "aria-label": "controlled" }}
                                  />
                                </td>

                                <td className="d-flex">
                                  <Button
                                    id="BtnEditUser"
                                    className="mx-1"
                                    onClick={() =>
                                      handleAction(
                                        "BtnEditUser",
                                        "action",
                                        handleEdit,
                                        user
                                        // balanceData.balanceData
                                      )
                                    }
                                    // onClick={() => handleEdit(user)}
                                  >
                                    Edit
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      ) : (
                        <tr className="text-center">
                          <td colSpan="7">No Data Found</td>
                        </tr>
                      )}
                    </table>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Block>

        {/* create user ............................*/}
        <Modal isOpen={createModel} size="xl" className="rounded-top-4 ">
          <div className="bg-1c2b4c text-white py-2 px-4 rounded-top-4">
            <div className="d-flex justify-content-between align-items-center w-100">
              <div>
                <span>Add User Detail</span>
              </div>
              <Icon
                name="cross"
                onClick={handleCloseCreateModel}
                className="cursor-pointer"
              ></Icon>
            </div>
          </div>
          <ModalBody className="">
            <Form>
              <div className="row justify-content-center px-md-0 px-lg-1 ">
                <div className="col-lg-5 col-12 pb-1">
                  <UncontrolledDropdown
                    className=" position-relative cursor-pointer form-control-lg form-control "
                    id="saleType"
                    isOpen={employDropdown}
                    toggle={() => setEmployDropdown(!employDropdown)}
                  >
                    <DropdownToggle
                      tag="a"
                      // className="w-100"
                      onClick={() => setEmployDropdown(!employDropdown)}
                    >
                      <div className="p-0">
                        <div className="d-flex text-dark align-items-center">
                          <img
                            src={CategoryIcon}
                            alt=""
                            width="20"
                            className="me-1"
                          />
                          <div className="">
                            <span className="text-uppercase ">
                              {data.EmpId
                                ? `${data.EmpName} (${data.EmpCode})`
                                : "Select Employee"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </DropdownToggle>
                    <DropdownMenu
                      className="dropdown-menu-s1 mt-1"
                      style={{ width: "90%" }}
                    >
                      <div className="dropdown-body">
                        <div className="p-2">
                          <ul>
                            {employData?.Data?.map((item, ind) => {
                              return (
                                <React.Fragment key={ind}>
                                  <DropdownItem
                                    id={`employ${ind}`}
                                    className="fw-medium fs-14 d-flex align-items-center"
                                    onClick={() =>
                                      setData({
                                        ...data,
                                        EmpId: item.EmpId,
                                        EmpName: item.EmpName,
                                        EmpCode: item.EmpCode,
                                      })
                                    }
                                  >
                                    {item.EmpName + "(" + item.EmpCode + ")"}
                                    {/* {item.EmpName?.length > 13
                                        ? item.EmpName.slice(0, 13) + "..."
                                        : item.EmpName} */}
                                  </DropdownItem>

                                  {item.EmpName?.length > 13 ? (
                                    <>
                                      <Tooltip
                                        id={`employ${ind}`}
                                        direction="right"
                                        text={item.EmpName}
                                      />
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  {!employDropdown && (
                    <Tooltip
                      id={`saleType`}
                      direction="top"
                      text={ToolTipContent.saleType}
                    />
                  )}
                </div>
                <div className="col-lg-5 col-12 ">
                  <UncontrolledDropdown
                    className="user-dropdown position-relative cursor-pointer form-control-lg form-control search-input"
                    id="saleType"
                    isOpen={roleDropdown}
                    toggle={() => setRoleDropdown(!roleDropdown)}
                  >
                    <DropdownToggle
                      tag="a"
                      className=""
                      onClick={() => setRoleDropdown(!roleDropdown)}
                    >
                      <div className="p-0">
                        <div className="d-flex text-dark align-items-center">
                          <img
                            src={CategoryIcon}
                            alt=""
                            width="20"
                            className="me-1"
                          />
                          <div className="">
                            <span className="text-uppercase ">
                              {data.RoleName || "Select Role"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </DropdownToggle>
                    <DropdownMenu
                      className="dropdown-menu-s1 mt-1"
                      style={{ width: "190px" }}
                    >
                      <div className="dropdown-body">
                        <div className="p-2">
                          <ul>
                            {roleData?.Data?.map((item, ind) => {
                              return (
                                <React.Fragment key={ind}>
                                  <DropdownItem
                                    id={`role${ind}`}
                                    className="fw-medium fs-14 d-flex align-items-center"
                                    onClick={() =>
                                      setData({
                                        ...data,
                                        RoleId: item.RoleId,
                                        RoleName: item.Role,
                                      })
                                    }
                                  >
                                    {item.Role}
                                    {/* {item.EmpName?.length > 13
                                        ? item.EmpName.slice(0, 13) + "..."
                                        : item.EmpName} */}
                                  </DropdownItem>

                                  {item.Role?.length > 13 ? (
                                    <>
                                      <Tooltip
                                        id={`role${ind}`}
                                        direction="right"
                                        text={item.Role}
                                      />
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  {!roleDropdown && (
                    <Tooltip
                      id={`saleType`}
                      direction="top"
                      text={ToolTipContent.saleType}
                    />
                  )}
                </div>
              </div>

              <div className="row justify-content-center px-md-0 px-lg-1 mt-2">
                <div className="col-lg-5 col-12 ">
                  <div className="pb-1 w-100" id="name-tooltip">
                    <div className="position-relative nk-header-searchbox m-0">
                      <a
                        href="#password"
                        onClick={(ev) => {
                          ev.preventDefault();
                          setPassState(!passState);
                        }}
                        className={`form-icon lg form-icon-right passcode-switch ${
                          passState ? "is-hidden" : "is-shown"
                        }`}
                      >
                        <Icon
                          name="eye"
                          className="passcode-icon icon-show"
                        ></Icon>

                        <Icon
                          name="eye-off"
                          className="passcode-icon icon-hide"
                        ></Icon>
                      </a>

                      <input
                        type={passState ? "text" : "password"}
                        id="Password"
                        name="Password"
                        value={data.Password}
                        onChange={handleDataChange}
                        placeholder="Password"
                        className="form-control-lg form-control search-input"
                      />

                      <img
                        src={CategoryIcon}
                        alt=""
                        width="20"
                        className="position-absolute input-field-icon"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-12 ">
                  <div className="pb-1" id="name-tooltip">
                    <div className="position-relative nk-header-searchbox m-0">
                      <input
                        type="password"
                        id="PasswordHash"
                        name="PasswordHash"
                        value={data.PasswordHash}
                        onChange={handleDataChange}
                        placeholder="Conform Password"
                        className="form-control-lg form-control search-input"
                      />
                      <img
                        src={CategoryIcon}
                        alt=""
                        width="20"
                        className="position-absolute input-field-icon"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-md-0 px-lg-1 ">
                {passError && (
                  <>
                    <div className="d-flex align-items-center">
                      <img src={infoIcon} alt="info icon" className="me-1" />
                      <p style={{ color: "red" }}>
                        Password and Conform Password Not Matched
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="row justify-content-center mx-5 px-4 my-1 pb-1 mt-2">
                <div className="col-12">
                  <UncontrolledDropdown
                    className="user-dropdown position-relative cursor-pointer form-control-lg form-control "
                    // id="saleType"
                    isOpen={designerDropdown}
                    toggle={() => setDesignerDropdown(!designerDropdown)}
                  >
                    <DropdownToggle
                      tag="a"
                      className=""
                      onClick={() => setDesignerDropdown(!designerDropdown)}
                    >
                      <div className="p-0">
                        <div className="d-flex text-dark align-items-center">
                          <img
                            src={CategoryIcon}
                            alt=""
                            width="20"
                            className="me-1"
                          />
                          <div>
                            <span className="text-uppercase">
                              {designerData.length > 0
                                ? designerData
                                    ?.map((d) => d.DesignerName)
                                    .join(", ")
                                : "Select Designer"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </DropdownToggle>
                    <DropdownMenu
                      className="dropdown-menu-s1 mt-1"
                      style={{ width: "280px" }}
                    >
                      <div className="dropdown-body">
                        <div className="p-2">
                          <ul>
                            {designer?.orderDetails?.map((item, ind) => (
                              <React.Fragment key={ind}>
                                <DropdownItem
                                  id={`role${ind}`}
                                  className="fw-medium fs-14 d-flex align-items-center"
                                  onClick={() => handleSelect(item)}
                                >
                                  {item.EmpName}
                                </DropdownItem>
                              </React.Fragment>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  <div className="selected-tags mt-2 d-flex  gap-3  ">
                    {designerData?.map((item) => (
                      <div
                        key={item.DesignerId}
                        className="position-relative tag bg-light px-2 py-3  rounded d-flex align-items-center"
                      >
                        {item.DesignerName}

                        <Icon
                          name="cross"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleRemove(item)}
                          className=" fs-6 m-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Form>
          </ModalBody>
          <ModalFooter className=" border-bottom-red">
            <div className="d-flex justify-content-end ">
              <Button
                outline
                color="light"
                className="mr-4"
                onClick={handleCloseCreateModel}
              >
                Cancel
              </Button>

              <Button className="bg-1c2b4c" onClick={submitUser}>
                {loading ? (
                  <Spinner size="sm" color="light" className="mx-1" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </ModalFooter>
        </Modal>

        {/* edit role ................................*/}
        <Modal isOpen={editModel} size="xl" className="rounded-top-4 ">
          <div className="bg-1c2b4c text-white py-2 px-4 rounded-top-4">
            <div className="d-flex justify-content-between align-items-center w-100">
              <div>
                <span>Edit User Detail</span>
              </div>
              <Icon
                name="cross"
                onClick={handleCloseEditModel}
                className="cursor-pointer"
              ></Icon>
            </div>
          </div>
          <ModalBody className="">
            <Form>
              <div className="mx-5">
                <div className="mx-5 my-1 pb-1">
                  <UncontrolledDropdown
                    className="user-dropdown position-relative cursor-pointer form-control-lg form-control search-input"
                    id="saleType"
                    isOpen={roleDropdown}
                    toggle={() => setRoleDropdown(!roleDropdown)}
                  >
                    <DropdownToggle
                      tag="a"
                      className=""
                      onClick={() => setRoleDropdown(!roleDropdown)}
                    >
                      <div className="p-0">
                        <div className="d-flex text-dark align-items-center">
                          <img
                            src={CategoryIcon}
                            alt=""
                            width="20"
                            className="me-1"
                          />
                          <div className="">
                            <span className="text-uppercase ">
                              <span className="text-uppercase ">
                                {data.RoleName || "Select Role"}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </DropdownToggle>
                    <DropdownMenu
                      className="dropdown-menu-s1 mt-1"
                      style={{ width: "190px" }}
                    >
                      <div className="dropdown-body">
                        <div className="p-2">
                          <ul>
                            {roleData?.Data?.map((item, ind) => {
                              return (
                                <React.Fragment key={ind}>
                                  <DropdownItem
                                    id={`role${ind}`}
                                    className="fw-medium fs-14 d-flex align-items-center"
                                    onClick={() =>
                                      setData({
                                        ...data,
                                        RoleId: item.RoleId,
                                        RoleName: item.Role,
                                      })
                                    }
                                  >
                                    {item.Role}
                                    {/* {item.EmpName?.length > 13
                                        ? item.EmpName.slice(0, 13) + "..."
                                        : item.EmpName} */}
                                  </DropdownItem>

                                  {item.Role?.length > 13 ? (
                                    <>
                                      <Tooltip
                                        id={`role${ind}`}
                                        direction="right"
                                        text={item.Role}
                                      />
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  {!roleDropdown && (
                    <Tooltip
                      id={`saleType`}
                      direction="top"
                      text={ToolTipContent.saleType}
                    />
                  )}
                </div>

                <div className="mx-5 my-1">
                  <div className="pb-1 w-100" id="name-tooltip">
                    <div className="position-relative nk-header-searchbox m-0">
                      <a
                        href="#password"
                        onClick={(ev) => {
                          ev.preventDefault();
                          setPassState(!passState);
                        }}
                        className={`form-icon lg form-icon-right passcode-switch ${
                          passState ? "is-hidden" : "is-shown"
                        }`}
                      >
                        <Icon
                          name="eye"
                          className="passcode-icon icon-show"
                        ></Icon>

                        <Icon
                          name="eye-off"
                          className="passcode-icon icon-hide"
                        ></Icon>
                      </a>

                      <input
                        type={passState ? "text" : "password"}
                        id="Password"
                        name="Password"
                        value={data.Password}
                        onChange={handleDataChange}
                        placeholder="Password"
                        className="form-control-lg form-control search-input"
                      />

                      <img
                        src={CategoryIcon}
                        alt=""
                        width="20"
                        className="position-absolute input-field-icon"
                      />
                    </div>
                  </div>
                </div>
                <div className="mx-5 my-1">
                  <div className="" id="name-tooltip">
                    <div className="position-relative nk-header-searchbox m-0">
                      <input
                        type="password"
                        id="PasswordHash"
                        name="PasswordHash"
                        value={data.PasswordHash}
                        onChange={handleDataChange}
                        placeholder="Conform Password"
                        className="form-control-lg form-control search-input"
                      />
                      <img
                        src={CategoryIcon}
                        alt=""
                        width="20"
                        className="position-absolute input-field-icon"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-md-0 px-lg-1 ">
                  {passError && (
                    <>
                      <div className="d-flex align-items-center">
                        <img src={infoIcon} alt="info icon" className="me-1" />
                        <p style={{ color: "red" }}>
                          Password and Conform Password Not Matched
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="mx-5 my-1 pb-1">
                  <UncontrolledDropdown
                    className="user-dropdown position-relative cursor-pointer form-control-lg form-control search-input"
                    // id="saleType"
                    isOpen={designerDropdown}
                    toggle={() => setDesignerDropdown(!designerDropdown)}
                  >
                    <DropdownToggle
                      tag="a"
                      className=""
                      onClick={() => setDesignerDropdown(!designerDropdown)}
                    >
                      <div className="p-0">
                        <div className="d-flex text-dark align-items-center">
                          <img
                            src={CategoryIcon}
                            alt=""
                            width="20"
                            className="me-1"
                          />
                          <div>
                            <span className="text-uppercase">
                              {designerData.length > 0
                                ? designerData
                                    ?.map((d) => d.DesignerName)
                                    .join(", ")
                                : "Select Designer"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </DropdownToggle>
                    <DropdownMenu
                      className="dropdown-menu-s1 mt-1"
                      style={{ width: "280px" }}
                    >
                      <div className="dropdown-body">
                        <div className="p-2">
                          <ul>
                            {designer?.orderDetails?.map((item, ind) => (
                              <React.Fragment key={ind}>
                                <DropdownItem
                                  id={`role${ind}`}
                                  className="fw-medium fs-14 d-flex align-items-center"
                                  onClick={() => handleSelect(item)}
                                >
                                  {item.EmpName}
                                </DropdownItem>
                              </React.Fragment>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  <div className="selected-tags mt-2 d-flex  gap-3  ">
                    {designerData?.map((item) => (
                      <div
                        key={item.DesignerId}
                        className="position-relative tag bg-light px-2 py-3  rounded d-flex align-items-center"
                      >
                        {item.DesignerName}

                        <Icon
                          name="cross"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleRemove(item)}
                          className=" fs-6 m-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Form>
          </ModalBody>
          <ModalFooter className=" border-bottom-red">
            <div className="d-flex justify-content-end ">
              <Button
                outline
                color="light"
                className="mr-4"
                onClick={handleCloseEditModel}
              >
                Cancel
              </Button>

              <Button className="bg-1c2b4c" onClick={editUser}>
                {loading ? (
                  <Spinner size="sm" color="light" className="mx-1" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </ModalFooter>
        </Modal>

        {/* toggle switch button conform model............................................... */}
        <Modal
          isOpen={switchUpdateModel}
          toggle={() => setSwitchUpdateModel(false)}
          size="lg"
          className="rounded-top-4 add-order-singe-image-slider"
        >
          {/* <div className="p-4 rounded-top-4"> */}
          <div className="bg-1c2b4c text-white p-3 rounded-top-4">
            <div className="d-flex justify-content-between align-items-center w-100">
              <div>Active - Inactive User</div>
            </div>
          </div>

          <ModalBody>
            <div className="border rounded-2">
              <div className="d-flex my-3 mx-2 pb-5">
                <div>
                  <div className="d-flex mt-2 ">
                    <img
                      src={deleteWaringIcon}
                      alt=""
                      className="mr-2"
                      width="50px"
                    />
                    <div>
                      <span className="fw-bold text-warning fs-3">
                        {isSwitchChecked(switchId?.UserId)
                          ? "Deactivate User"
                          : "Activate User"}
                      </span>
                      <br />
                      <span className="custom-light-text custom-text-transform">
                        {isSwitchChecked(switchId?.UserId)
                          ? "Are you sure you want to inactivate this user? If you inactive this user then They won't be able to log in to their account."
                          : "Are you sure you want to activate this user? If you Active then They will be able to log in to their account."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex p-2 border-top justify-content-end">
                <Button
                  outline
                  color="dark"
                  className="mr-2"
                  onClick={() => handleActivation()}
                >
                  {switchLoader ? (
                    <Spinner size="sm" color="light" className="mx-0" />
                  ) : (
                    "Yes"
                  )}
                </Button>
                <Button onClick={() => setSwitchUpdateModel(false)}>No</Button>
              </div>
            </div>
          </ModalBody>

          {/* </div> */}
        </Modal>
      </Content>
    </>
  );
};

export default AddUser;

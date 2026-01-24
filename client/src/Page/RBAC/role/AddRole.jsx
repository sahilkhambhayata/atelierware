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
import CustomPagination from "../../HomePage/CommonTracker/CustomPagination";
import { Fade, Menu, Skeleton } from "@mui/material";
import {
  createPermission,
  getPermissionDetailsAsyncData,
  selectedPermissionsDetail,
} from "../../../redux/actions/Role/modelAction";
import { usePermissions } from "../../../Layout/Provider/PermissionsContext";
import { useNavigate } from "react-router";

const AddRole = () => {
  const [data, setData] = useState({
    role: "",
    desc: "",
  });
  const { handleAction } = usePermissions();

  const dispatch = useDispatch();
  const roleData = useSelector((state) => state?.roleReducer);
  const { permissionData } = useSelector((state) => state?.permissionReducer);
  const { oldPermissionData } = useSelector(
    (state) => state?.permissionReducer
  );
  const [createModel, setCreateModel] = useState(false);
  const [editModel, setEditModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState("");
  const [checkedModules, setCheckedModules] = useState({});
  const [checkedPages, setCheckedPages] = useState({});
  const [checkedActions, setCheckedActions] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [permissionLoader, setPermissionLoader] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [permissionModel, setPermissionModel] = useState(false);

  const navigate = useNavigate();
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
      if (allowedPageCodes?.some((code) => code?.includes("PgUserRoles"))) {
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

  useEffect(() => {
    dispatch(getRoleDetailsAsyncData(search, currentPage, pageSize));
  }, [dispatch, pageSize, currentPage, search]);

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreate = () => {
    setCreateModel(true);
  };
  const handleCloseCreateModel = () => {
    setCreateModel(false);
    setData({
      role: "",
      desc: "",
    });
  };

  const submitRole = () => {
    setLoading(true);
    dispatch(createNewRole(data, "", currentPage, pageSize)).then((res) => {
      if (res.success) {
        setLoading(false);
        toast.success(res.message);
        handleCloseCreateModel();
      } else {
        toast.error(res.message);
      }
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleRowsPerPageChange = (newRowsPerPage) => {
    setCurrentPage(0);

    if (newRowsPerPage == 0) {
      setPageSize(roleData?.roleData?.Data.totalCount);
    } else {
      setPageSize(newRowsPerPage);
    }
  };
  const handleDelete = (id) => {
    dispatch(deleteRole(id, "", currentPage, pageSize)).then((res) => {
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
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

  //edit role logic-------------------------------------------------------------------

  const handleEdit = (role) => {
    setEditModel(true);

    setEditId(role.RoleId);
    setData({
      role: role.Role,
      desc: role.Description,
    });
  };
  const handleCloseEditModel = () => {
    setEditModel(false);
    setData({
      role: "",
      desc: "",
    });
  };
  const editRole = () => {
    setLoading(true);
    dispatch(editOldRole(editId, data, "", currentPage, pageSize)).then(
      (res) => {
        if (res.success) {
          setEditId("");
          setLoading(false);
          toast.success(res.message);
          handleCloseEditModel();
        } else {
          toast.error(res.message);
        }
      }
    );
  };

  //set permission logic------------------------------------------------------------------------------

  const handlePermission = (role) => {
    setPermissionModel(true);
    setEditId(role.RoleId);
    dispatch(getPermissionDetailsAsyncData());
    dispatch(selectedPermissionsDetail(role.RoleId));
  };

  const handleClosePermissionModel = () => {
    setPermissionModel(false);
    setCheckedModules({});
    setCheckedPages({});
    setCheckedActions({});
    setSelectedItems([]);
  };

  //select model=====

  useEffect(() => {
    if (oldPermissionData?.success && oldPermissionData?.Data) {
      const initialCheckedModules = {};
      const initialCheckedPages = {};
      const initialCheckedActions = {};
      const initialSelectedItems = [];

      oldPermissionData.Data.forEach((module) => {
        initialCheckedModules[module.ModuleId] = true;
        module?.AuthPages?.forEach((page) => {
          initialCheckedPages[page.PageId] = true;
          page?.AuthActions?.forEach((action) => {
            initialCheckedActions[action.ActionId] = true;
            initialSelectedItems.push({
              ActionId: action?.ActionId,
              PageId: page?.PageId,
              ModuleId: module?.ModuleId,
            });
          });
        });
      });

      setCheckedModules(initialCheckedModules);
      setCheckedPages(initialCheckedPages);
      setCheckedActions(initialCheckedActions);
      setSelectedItems(initialSelectedItems);
    }
  }, [oldPermissionData]);

  const sendPermission = () => {
    setPermissionLoader(true);
    dispatch(createPermission(editId, selectedItems)).then((res) => {
      if (res.success) {
        setPermissionLoader(false);
        setPermissionModel(false);
        setCheckedModules({});
        setCheckedPages({});
        setCheckedActions({});
        setSelectedItems([]);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleModuleChange = (moduleId, pages) => {
    const isModuleChecked = !checkedModules[moduleId];
    setCheckedModules((prevCheckedModules) => ({
      ...prevCheckedModules,
      [moduleId]: isModuleChecked,
    }));

    if (isModuleChecked) {
      // Add to selectedItems
      setSelectedItems((prevSelectedItems) => [
        ...prevSelectedItems,
        { ActionId: null, ModuleId: moduleId, PageId: null },
      ]);
    } else {
      // Uncheck all pages and actions if module is unchecked
      const updatedPages = { ...checkedPages };
      const updatedActions = { ...checkedActions };
      pages.forEach((page) => {
        delete updatedPages[page.PageId];
        page.AuthActions.forEach((action) => {
          delete updatedActions[action.ActionId];
        });
      });

      setCheckedPages(updatedPages);
      setCheckedActions(updatedActions);

      // Remove related items from selectedItems
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((item) => item.ModuleId !== moduleId)
      );
    }
  };

  const handlePagesChange = (pageId, actions, moduleId) => {
    const isPageChecked = !checkedPages[pageId];
    setCheckedPages((prevCheckedPages) => ({
      ...prevCheckedPages,
      [pageId]: isPageChecked,
    }));

    if (isPageChecked) {
      // Add to selectedItems
      setSelectedItems((prevSelectedItems) => [
        ...prevSelectedItems,
        { ActionId: null, ModuleId: moduleId, PageId: pageId },
      ]);
    } else {
      // Uncheck all actions if page is unchecked
      const updatedActions = { ...checkedActions };
      actions.forEach((action) => {
        delete updatedActions[action.ActionId];
      });

      setCheckedActions(updatedActions);

      // Remove related items from selectedItems
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((item) => item.PageId !== pageId)
      );
    }
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

  const handleActionChange = (actionId, pageId, moduleId) => {
    const isActionChecked = !checkedActions[actionId];
    setCheckedActions((prevCheckedActions) => ({
      ...prevCheckedActions,
      [actionId]: isActionChecked,
    }));

    if (isActionChecked) {
      // Add to selectedItems
      setSelectedItems((prevSelectedItems) => [
        ...prevSelectedItems,
        { ActionId: actionId, PageId: pageId, ModuleId: moduleId },
      ]);
    } else {
      // Remove from selectedItems
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((item) => item.ActionId !== actionId)
      );
    }
  };
  return (
    <>
      <Head title="Role" />
      <Content>
        <Block className="px-1 px-sm-0 ">
          <div className="d-flex  justify-content-end align-items-center mb-3">
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
                  totalPages={roleData?.roleData?.totalPages}
                  // isClosed={isClosed}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={[0, 1, 2, 3, 5]}
                  rowsPerPage={pageSize}
                  labelRowsPerPage="Rows/page"
                />
              </div>
            </div>
            <div className="d-flex ms-2 ms-lg-0 mt-2 mt-lg-0">
              <Button
                id="BtnUserRoleAddRole"
                onClick={() =>
                  handleAction(
                    "BtnUserRoleAddRole",
                    "action",
                    handleCreate,
                    null
                    // balanceData.balanceData
                  )
                }
              >
                Create
              </Button>
            </div>
          </div>
          <Card className="card-bordered card-stretch ">
            <div className="card-inner-group">
              <div className="card-inner p-0 order-table">
                {roleData.roleLoader ? (
                  <table className="table table-striped">
                    <thead className="">
                      <tr>
                        <th className="py-3 bg-gray2">Role ID</th>
                        <th className="py-3 bg-gray2">Role</th>
                        <th className="py-3 bg-gray2">Description</th>
                        <th className="py-3 bg-gray2">Created On</th>
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
                                width={200}
                              />
                            </td>
                            <td className="d-flex">
                              <Skeleton
                                variant="rounded"
                                width={60}
                                height={30}
                                className="m-1"
                              />
                              <Skeleton
                                variant="rounded"
                                width={60}
                                height={30}
                                className="m-1"
                              />
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
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead className="">
                        <tr>
                          <th className="py-3 bg-gray2">Role ID</th>
                          <th className="py-3 bg-gray2">Role</th>
                          <th className="py-3 bg-gray2">Description</th>
                          <th className="py-3 bg-gray2">Created On</th>
                          <th className="py-3 bg-gray2">Action</th>
                        </tr>
                      </thead>
                      {roleData?.roleData?.Data?.length > 0 ? (
                        <tbody>
                          {roleData?.roleData?.Data?.map((role, ind) => (
                            <tr key={role.RoleId}>
                              <td>{ind + 1}</td>
                              <td>{role.Role}</td>
                              <td>{role.Description}</td>
                              <td>
                                {new Date(role.CreatedOn).toLocaleString()}
                              </td>
                              <td className="d-flex">
                                <Button
                                  className="mx-1"
                                  id="BtnUserRoleEditRole"
                                  onClick={() =>
                                    handleAction(
                                      "BtnUserRoleEditRole",
                                      "action",
                                      handleEdit,
                                      role
                                      // balanceData.balanceData
                                    )
                                  }
                                >
                                  Edit
                                </Button>
                                <Button
                                  className="mx-1"
                                  id="BtnUserRoleDelRole"
                                  onClick={() =>
                                    handleAction(
                                      "BtnUserRoleDelRole",
                                      "action",
                                      handleDelete,
                                      role.RoleId
                                      // balanceData.balanceData
                                    )
                                  }
                                >
                                  Delete
                                </Button>
                                <Button
                                  className="mx-1"
                                  id="BtnUserRoleViewPermission"
                                  onClick={() =>
                                    handleAction(
                                      "BtnUserRoleViewPermission",
                                      "action",
                                      handlePermission,
                                      role
                                      // balanceData.balanceData
                                    )
                                  }
                                >
                                  Permission
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      ) : (
                        <tr className="text-center">
                          <td colSpan="5">No Data Found</td>
                        </tr>
                      )}
                    </table>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Block>

        {/* create role ............................*/}
        <Modal isOpen={createModel} size="xl" className="rounded-top-4 ">
          <div className="bg-1c2b4c text-white py-2 px-4 rounded-top-4">
            <div className="d-flex justify-content-between align-items-center w-100">
              <div>
                <span>Add Role Detail</span>
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
              <div className=" px-md-0 px-lg-1 ">
                <div className="pb-1" id="name-tooltip">
                  <div className="position-relative nk-header-searchbox">
                    <input
                      type="text"
                      id="username"
                      name="role"
                      value={data.role}
                      onChange={handleDataChange}
                      placeholder="Role Name"
                      className="form-control-lg form-control search-input"
                    />
                    <img
                      src={CategoryIcon}
                      alt=""
                      className="position-absolute input-field-icon"
                    />
                  </div>
                </div>
              </div>
              <div className=" px-md-0 px-lg-1 ">
                <div className="pb-1" id="name-tooltip">
                  <div className="position-relative nk-header-searchbox">
                    <input
                      type="text"
                      id="username"
                      name="desc"
                      value={data.desc}
                      onChange={handleDataChange}
                      placeholder="Role Description"
                      className="form-control-lg form-control search-input"
                    />
                    <img
                      src={CategoryIcon}
                      alt=""
                      className="position-absolute input-field-icon"
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-start  ">
                <input type="checkbox" name="" id="" className="mt-1 " />
                <label
                  htmlFor="Training Mode"
                  className=" ms-1 mb-0 fs-6"
                  // style={{ fontSize: "13px", lineHeight: "16px" }}
                >
                  <p >
                    <b>
                      This is a Salesman/Designer role, it needs user wise
                      Dashboard
                    </b>{" "}
                    (i.e. User (Samesman/Designer) can only manage those orders
                    which are assigned to him as "Designer") Call ended 12:51 |
                    57m 31s
                  </p>
                </label>
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

              <Button className="bg-1c2b4c" onClick={submitRole}>
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
                <span>Edit Role Detail</span>
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
              <div className=" px-md-0 px-lg-1 ">
                <div className="pb-1" id="name-tooltip">
                  <div className="position-relative nk-header-searchbox">
                    <input
                      type="text"
                      id="username"
                      name="role"
                      value={data.role}
                      onChange={handleDataChange}
                      placeholder="Role Name"
                      className="form-control-lg form-control search-input"
                    />
                    <img
                      src={CategoryIcon}
                      alt=""
                      className="position-absolute input-field-icon"
                    />
                  </div>
                </div>
              </div>
              <div className=" px-md-0 px-lg-1 ">
                <div className="pb-1" id="name-tooltip">
                  <div className="position-relative nk-header-searchbox">
                    <input
                      type="text"
                      id="username"
                      name="desc"
                      value={data.desc}
                      onChange={handleDataChange}
                      placeholder="Role Description"
                      className="form-control-lg form-control search-input"
                    />
                    <img
                      src={CategoryIcon}
                      alt=""
                      className="position-absolute input-field-icon"
                    />
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

              <Button className="bg-1c2b4c" onClick={editRole}>
                {loading ? (
                  <Spinner size="sm" color="light" className="mx-1" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </ModalFooter>
        </Modal>

        {/* permission model-------------------------------------- */}
        <Modal isOpen={permissionModel} size="xl" className="rounded-top-4 ">
          <div className="bg-1c2b4c text-white py-2 px-4 rounded-top-4">
            <div className="d-flex justify-content-between align-items-center w-100">
              <div>
                <span>Assign Permission</span>
              </div>
              <Icon
                name="cross"
                onClick={handleClosePermissionModel}
                className="cursor-pointer"
              ></Icon>
            </div>
          </div>
          <ModalBody className="">
            <Form>
              <div className=" px-md-0 px-lg-1 ">
                <div className="pb-1" id="name-tooltip">
                  <div className="position-relative nk-header-searchbox">
                    {permissionData?.data?.map((item, ind) => {
                      const isModuleChecked = checkedModules[item.ModuleId];
                      return (
                        <div
                          key={ind}
                          className="custom-control custom-checkbox d-flex flex-column my-1  "
                        >
                          <input
                            className="custom-control-input"
                            type="checkbox"
                            id={`checkbox-module-${item.ModuleId}`}
                            value={item.ModuleId}
                            checked={isModuleChecked || false}
                            onChange={() =>
                              handleModuleChange(item.ModuleId, item.AuthPages)
                            }
                          />
                          <label
                            className="custom-control-label text-uppercase fs-16"
                            htmlFor={`checkbox-module-${item.ModuleId}`}
                          >
                            {item.Module}
                          </label>
                          {isModuleChecked &&
                            item.AuthPages.map((page, indP) => {
                              const isPageChecked = checkedPages[page.PageId];
                              return (
                                <div
                                  key={indP}
                                  className="custom-control custom-checkbox d-flex flex-column my-1 "
                                >
                                  <input
                                    className="custom-control-input"
                                    type="checkbox"
                                    id={`checkbox-page-${page.PageId}`}
                                    value={page.PageId}
                                    checked={isPageChecked || false}
                                    onChange={() =>
                                      handlePagesChange(
                                        page.PageId,
                                        page.AuthActions,
                                        item.ModuleId
                                      )
                                    }
                                  />
                                  <label
                                    className="custom-control-label text-uppercase fs-14"
                                    htmlFor={`checkbox-page-${page.PageId}`}
                                  >
                                    {page.Page}
                                  </label>
                                  {isPageChecked &&
                                    page.AuthActions.map((action, indA) => {
                                      const isActionChecked =
                                        checkedActions[action.ActionId];
                                      return (
                                        <div
                                          key={indA}
                                          className="custom-control custom-checkbox d-flex flex-column my-1 "
                                        >
                                          <input
                                            className="custom-control-input"
                                            type="checkbox"
                                            id={`checkbox-action-${action.ActionId}`}
                                            value={action.ActionId}
                                            checked={isActionChecked || false}
                                            onChange={() =>
                                              handleActionChange(
                                                action.ActionId,
                                                page.PageId,
                                                item.ModuleId
                                              )
                                            }
                                          />
                                          <label
                                            className="custom-control-label text-uppercase fs-12"
                                            htmlFor={`checkbox-action-${action.ActionId}`}
                                          >
                                            {action.Action}
                                          </label>
                                        </div>
                                      );
                                    })}
                                </div>
                              );
                            })}
                        </div>
                      );
                    })}
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
                onClick={handleClosePermissionModel}
              >
                Cancel
              </Button>

              <Button className="bg-1c2b4c" onClick={sendPermission}>
                {permissionLoader ? (
                  <Spinner size="sm" color="light" className="mx-1" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      </Content>
    </>
  );
};

export default AddRole;

import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import { useTheme, useThemeUpdate } from "../Layout/Provider/Themes";
import Icon from "./../Components/icon/Icon";
import Toggle from "../Layout/sidebar/Toggle";
import Notification from "../Layout/header/dropdown/notification/Notification";
import User from "../Layout/header/dropdown/user/User";
import HeaderTitle from "../Components/HeaderTitle/HeaderTitle";
import {
  Button,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import Help from "../Layout/header/dropdown/help/Help";
import Menu from "@mui/material/Menu";
import { OrderSearchListData } from "../Page/HomePage/OrderTracker/SearchListData";
import { ItemSearchListData } from "../Page/HomePage/ItemTracker/SearchListData";
import DotIcon from "../images/icons/dot-icon.svg";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  getDirectSearchOrderData,
  getDirectSerachData,
} from "../redux/actions/getDirectSerachData";
import { getBranch } from "../redux/actions/branchAction";

const Header = ({ fixed, className }) => {
  const branch = useSelector((state) => state?.branch);
  const dispatch = useDispatch();
  const location = useLocation();
  const BU_ID = branch?.branch?.BU_Id;
  const { theme } = useTheme();
  const themeUpdate = useThemeUpdate();
  const BranchId = localStorage.getItem("BranchId");
  const token = localStorage.getItem("token");
  const [search, setSearch] = useState("");
  const [isChecked, setIsChecked] = React.useState([]);
  const [searchStatus, setsearchStatus] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [smallSearch, setSmallSearch] = useState(false);
  const [smallSwitch, setSmallSwitch] = useState(false);
  const [switchAnchorEl, setSwitchAnchorEl] = useState(null);
  const [switchOpen, setSwitchOpen] = useState(false);
  const [orderSwitchStatus, setOrderSwitchStatus] = useState({
    orderNo: true,
    orderName: true,
    barcode: true,
  });

  useEffect(() => {
    if (BranchId && token) {
      dispatch(getBranch(BranchId, token));
    }
  }, [BranchId, token]);
  const [itemSwitchStatus, setItemSwitchStatus] = useState({
    all: true,
    orderid: true,
    orderBarcode: true,
    name: true,
    phone: true,
    itemBarcode: true,
    itemDes: true,
  });

  const headerClass = classNames({
    "nk-header": true,
    "nk-header-fixed": fixed,
    [`is-light`]: theme.header === "white",
    [`is-${theme.header}`]:
      theme.header !== "white" && theme.header !== "light",
    [`${className}`]: className,
  });

  const handleChange = (id) => {
    setIsChecked(!isChecked);
  };

  const handleClick = (event) => {
    if (window.innerWidth < 992) {
      setAnchorEl(event.currentTarget);
      // document.querySelector(
      //   ".nk-header-searchbox .position-absolute.nk-img-position-set"
      // )
      // );
      setOpen(true);
    }
  };

  const handleSmallSearch = (event) => {
    setSearchAnchorEl(event.currentTarget);
    setSmallSearch(true);
  };
  const handleSmallSwitch = (event) => {
    setSwitchAnchorEl(event.currentTarget);
    setSmallSwitch(true);
  };

  const handleCloseSmallSearch = () => {
    setSearchAnchorEl(null);
    setSmallSearch(false);
  };
  const handleCloseSmallSwitch = () => {
    setAnchorEl(null);
    setSmallSwitch(false);
  };
  const handleClose = () => {
    setSwitchAnchorEl(null);
    setOpen(false);
  };

  const handleSwitchClick = (event) => {
    setSwitchAnchorEl(event.currentTarget);
    setSwitchOpen(true);
  };

  const handleSwitchClose = () => {
    setSwitchAnchorEl(null);
    setSwitchOpen(false);
  };

  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearch(newValue);
    if (newValue.length > 0) {
      setsearchStatus(true);
    } else {
      setsearchStatus(false);
    }
  };

  const handleOrderSwitchChange = (switchId, checked) => {
    setOrderSwitchStatus((prevorderSwitchStatus) => ({
      ...prevorderSwitchStatus,
      [switchId]: checked,
    }));
  };

  const handleItemSwitchChange = (switchId, checked) => {
    setItemSwitchStatus((prevorderSwitchStatus) => ({
      ...prevorderSwitchStatus,
      [switchId]: checked,
    }));
  };

  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
    "&:active": {
      "& .MuiSwitch-thumb": {
        width: 12,
        height: 12,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(9px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(12px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "black",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(["width"], {
        duration: 200,
      }),
    },
    "& .MuiSwitch-track": {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,.35)"
          : "rgba(0,0,0,.25)",
      boxSizing: "border-box",
    },
  }));

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
    setSearch("");
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/dashboard" || location.pathname === "/") {
      const isAnySwitchTrue = Object.values(orderSwitchStatus).some(
        (value) => value === true
      );
      if (isAnySwitchTrue) {
        if (search !== undefined) {
          dispatch(
            getDirectSearchOrderData(orderSwitchStatus, search, searchStatus)
          );
        }
      }
    } else if (location.pathname === "/item-tracker") {
      const isAnySwitchTrue = Object.values(itemSwitchStatus).some(
        (value) => value === true
      );

      if (isAnySwitchTrue) {
        if (search !== undefined) {
          dispatch(getDirectSerachData(itemSwitchStatus, search, searchStatus));
        }
      }
    }
  }, [orderSwitchStatus, search, itemSwitchStatus]);

  return (
    <div className={headerClass}>
      <div className="container-fluid">
        <div className="nk-header-wrap">
          <div className="nk-menu-trigger me-0 d-xl-none ms-n1">
            <Toggle
              className="nk-nav-toggle nk-quick-nav-icon d-xl-none ms-n1"
              icon="menu"
              click={themeUpdate.sidebarVisibility}
            />
          </div>

          <div className="nk-header-news  ">
            <HeaderTitle
              title={`${
                location.pathname === "/item-tracker"
                  ? "Item Tracker"
                  : location.pathname === "/role"
                  ? "Roles"
                  : location.pathname === "/user"
                  ? "User"
                  : "Order Tracker"
              }`}
            />
          </div>
          <div className="nk-header-tools">
            <ul className="nk-quick-nav">
              {location.pathname !== "/role" && location.pathname !== "/user" && (
                <li className="position-relative nk-header-searchbox px-lg-0">
                  <div className="d-none d-xl-block">
                    <input
                      type="text"
                      id="default-01"
                      value={search}
                      onChange={handleSearchChange}
                      placeholder="Search"
                      className="form-control-lg form-control search-input"
                    />
                    <Icon
                      name="search"
                      className="position-absolute nk-img-position-set "
                      onClick={handleClick}
                    ></Icon>
                    <UncontrolledDropdown className="user-dropdown position-absolute nk-img-position-end  d-none d-lg-block">
                      <DropdownToggle tag="a" className="">
                        <img
                          src={DotIcon}
                          name="search"
                          style={{ cursor: "pointer" }}
                          onClick={handleClick}
                        ></img>
                      </DropdownToggle>
                      <DropdownMenu
                        end
                        className="dropdown-menu-s1 mt-0 ps-2 pt-1 p-3"
                        style={{ width: "200px" }}
                        anchorEl={switchAnchorEl}
                        open={switchOpen}
                        onClose={handleSwitchClose}
                      >
                        <div className="dropdown-body">
                          <ul>
                            {location.pathname === "/dashboard" ||
                            location.pathname === "/"
                              ? OrderSearchListData.map((item, ind) => {
                                  return (
                                    <li
                                      className="fw-bold d-flex justify-content-between align-items-center mt-1"
                                      key={ind}
                                    >
                                      <span className="">{item.name} </span>
                                      <AntSwitch
                                        defaultChecked={
                                          orderSwitchStatus[item.id]
                                        }
                                        inputProps={{
                                          "aria-label": "ant design",
                                        }}
                                        onChange={(e) => {
                                          handleOrderSwitchChange(
                                            item.id,
                                            e.target.checked
                                          ),
                                            handleChange(item.id);
                                        }}
                                      />
                                    </li>
                                  );
                                })
                              : ItemSearchListData.map((item, ind) => {
                                  return (
                                    <li
                                      className="fw-bold d-flex justify-content-between align-items-center mt-1"
                                      key={ind}
                                    >
                                      <span className="">{item.name} </span>
                                      <AntSwitch
                                        checked={itemSwitchStatus[item.id]}
                                        inputProps={{
                                          "aria-label": "ant design",
                                        }}
                                        onChange={(e) =>
                                          handleItemSwitchChange(
                                            item.id,
                                            e.target.checked
                                          )
                                        }
                                      />
                                    </li>
                                  );
                                })}
                          </ul>
                        </div>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>

                  <div className="d-block d-xl-none">
                    <div>
                      <div
                        id="search-button"
                        aria-controls={smallSearch ? "search-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={smallSearch ? "true" : undefined}
                        name="search"
                        onClick={handleSmallSearch}
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
                        anchorEl={searchAnchorEl}
                        open={smallSearch}
                        onClose={handleCloseSmallSearch}
                      >
                        <div className="position-relative ">
                          <input
                            type="text"
                            id="default-01"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Search"
                            className=" form-control w-100 "
                          />
                          <img
                            src={DotIcon}
                            name="search"
                            className="position-absolute doticon-position"
                            id="search-switch"
                            aria-controls={
                              smallSwitch ? "switch-menu" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={smallSwitch ? "true" : undefined}
                            style={{ cursor: "pointer" }}
                            onClick={handleSmallSwitch}
                          ></img>
                          <Menu
                            id="switch-menu"
                            anchorEl={switchAnchorEl}
                            open={smallSwitch}
                            onClose={handleCloseSmallSwitch}
                          >
                            <div className="dropdown-body">
                              <ul>
                                {location.pathname === "/dashboard" ||
                                location.pathname === "/"
                                  ? OrderSearchListData.map((item, ind) => {
                                      return (
                                        <li
                                          className="fw-bold d-flex justify-content-between align-items-center mt-1"
                                          key={ind}
                                        >
                                          <span className="">{item.name} </span>
                                          <AntSwitch
                                            defaultChecked={
                                              orderSwitchStatus[item.id]
                                            }
                                            inputProps={{
                                              "aria-label": "ant design",
                                            }}
                                            onChange={(e) => {
                                              handleOrderSwitchChange(
                                                item.id,
                                                e.target.checked
                                              ),
                                                handleChange(item.id);
                                            }}
                                          />
                                        </li>
                                      );
                                    })
                                  : ItemSearchListData.map((item, ind) => {
                                      return (
                                        <li
                                          className="fw-bold d-flex justify-content-between align-items-center mt-1"
                                          key={ind}
                                        >
                                          <span className="">{item.name} </span>
                                          <AntSwitch
                                            checked={itemSwitchStatus[item.id]}
                                            inputProps={{
                                              "aria-label": "ant design",
                                            }}
                                            onChange={(e) =>
                                              handleItemSwitchChange(
                                                item.id,
                                                e.target.checked
                                              )
                                            }
                                          />
                                        </li>
                                      );
                                    })}
                              </ul>
                            </div>
                          </Menu>
                        </div>
                      </Menu>
                    </div>
                  </div>
                </li>
              )}
              <li className="user-dropdown" onClick={themeUpdate.sidebarHide}>
                <User />
              </li>
              <li
                className="notification-dropdown me-n1 "
                onClick={themeUpdate.sidebarHide}
              >
                <Notification />
              </li>
              <li className="">
                <Help />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;

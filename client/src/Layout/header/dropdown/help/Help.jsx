import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import Icon from "../../../../Components/icon/Icon";
import { DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

export default function Help() {
  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const open = Boolean(anchorEl);
  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };
  const [selectHelp, setSelectHelp] = React.useState(false);

  return (
    <div>
      <UncontrolledDropdown className="user-dropdown">
        <DropdownToggle tag="a" className="">
          <div className="d-flex text-dark">
            <Icon name="help" className="fs-4"></Icon>
            <div className="d-none d-lg-block">
              <span className="lowercase ">Help</span>
            </div>
          </div>
        </DropdownToggle>

        <DropdownMenu
          end
          className="dropdown-menu-s1 mt-2"
          style={{ width: "270px" }}
        >
          <div className="dropdown-body">
            <div className=" p-2">
              <ul>
                <li className="fw-medium mb-2 fs-6" style={{ opacity: 0.6 }}>
                  Help Center
                </li>
                <li className="fw-medium mb-2 fs-6 " style={{ opacity: 0.6 }}>
                  Chat To Support
                </li>
                <li
                  className=" mb-2 p-1 "
                  style={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4%",
                    opacity: 0.6,
                  }}
                >
                  <div className="d-flex align-items-center ">
                    <input
                      type="checkbox"
                      name=""
                      id="Training-Mode"
                      style={{ width: "20px" }}
                      disabled
                    />
                    <label
                      htmlFor="Training Mode"
                      className="fw-medium ms-1 mb-0 fs-6  "
                    >
                      Training Mode
                    </label>
                  </div>
                  <p
                    className=""
                    style={{
                      lineHeight: "18px",
                      fontFamily: "Nunito",
                      fontSize: "13px ",
                      opacity: "0.8",
                    }}
                  >
                    This Mode Provides Tips and Short Training Tours On Each
                    Page, So You Can Quickly Learn How To Use All The Features
                    of Orderry
                  </p>
                </li>
                <li
                  className=" p-1"
                  style={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4%",
                    opacity: 0.6,
                  }}
                >
                  <div className="d-flex align-items-center ">
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      className=""
                      disabled
                    />
                    <label
                      htmlFor="Training Mode"
                      className="fw-medium ms-1 mb-0 fs-6 "
                    >
                      Display support chat button
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
}

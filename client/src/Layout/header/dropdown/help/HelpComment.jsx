import React from "react";
import { DropdownToggle, DropdownMenu, UncontrolledDropdown } from "reactstrap";
import Icon from "../../../../Components/icon/Icon";

const HelpComment = () => {
  return (
    <UncontrolledDropdown className="user-dropdown">
      <DropdownToggle tag="a" className="">
        <li className="custom-icon">
          <Icon name="help" className="help-icon"></Icon>
          {/* <Icon name="help-fill" className="help-icon"></Icon> */}
        </li>

      </DropdownToggle>

      <DropdownMenu
        end
        className="dropdown-menu-s1 mt-2"
        style={{ width: "270px" }}
      >
        <div className="dropdown-body">
          <div className=" p-2">
            <span
              // style={{lineHeight:"12px", fontFamily:"Nunito"}}
              className="fs-6"
              style={{ lineHeight: "8px" }}
            >
              View and Hide Columns To Customize This Table. You Can Also Move
              and Resize Columns.
            </span>
          </div>
        </div>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default HelpComment;

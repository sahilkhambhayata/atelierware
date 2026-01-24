import * as React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import Icon from "../../../../Components/icon/Icon";
import { DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import PaymentInputInfoIcon from "../../../../images/icons/payment-input-info-icon.svg";

export default function InputHelp() {
  return (
    <div className="ms-2 p-0">
      <div className="d-flex text-dark" data-tooltip-id="my-tooltip-1">
        <img src={PaymentInputInfoIcon} alt="PaymentInputInfoIcon" />
      </div>

      <ReactTooltip
        // end
        id="my-tooltip-1"
        place="right"
        variant="light"
        effect="solid"
        content=" View and Hide Columns To Customize This Table. You Can Also Move
          and Resize Columns."
        style={{
          outlineBottom: "4px solid #db2314",
          padding: "10px",
          width: "50%",
          background:" #ebeef2",
        }}
      />
    </div>
  );
}

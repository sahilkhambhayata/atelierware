import React, { useState } from "react";
import { UncontrolledTooltip } from "reactstrap";

const Tooltip = ({ id, direction, text, isOpen, ...props }) => {
  const [tooltipOpen, setTooltipOpen] = useState(isOpen ? isOpen : false);

  const toggle = () => {
    setTooltipOpen(!tooltipOpen);

    if (!tooltipOpen) {
      setTimeout(() => {
        setTooltipOpen(false);
      }, 3000); // Close the tooltip after 3 seconds
    }
  };
  return (
    <React.Fragment>
      <UncontrolledTooltip
        autohide={false}
        placement={direction}
        target={id}
        isOpen={tooltipOpen}
        toggle={toggle}
      >
        {text}
      </UncontrolledTooltip>
    </React.Fragment>
  );
};
export default Tooltip;

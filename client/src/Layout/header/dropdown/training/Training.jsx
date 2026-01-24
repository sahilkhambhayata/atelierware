import React from "react";
import data from "./TrainingData";
import { DropdownToggle, DropdownMenu, UncontrolledDropdown } from "reactstrap";
import Icon from "../../../../Components/icon/Icon";
import TrainingIcon from "../../../../images/icons/training-icon.svg";
const TrainingItem = (props) => {
  const { text, id } = props;
  return (
    <div className="nk-training-item pt-2 pb-0 " key={id} id={id}>
      <div className="nk-training-content">
        <div className="nk-training-text fw-lighter fs-6">{text}</div>
      </div>
    </div>
  );
};

const Training = () => {
  return (
    <UncontrolledDropdown className="user-dropdown">
      <DropdownToggle tag="a" className="">
        <div className="text-white d-flex align-items-center d-xl-block d-none">
          <img src={TrainingIcon} alt="Training" className="mx-2 text-white" />
          Training
          {/* <Icon name="downward-ios"></Icon> */}
        </div>
        <div className="text-white d-block d-xl-none">
          <img src={TrainingIcon} alt="Training" className="mx-2 text-white" />
        </div>
      </DropdownToggle>

      <DropdownMenu
        end
        className=" dropdown-menu-s1 mt-3"
        style={{ width: "300px" }}
      >
        <div className="dropdown-body">
          <div className="nk-training">
            {data.training.map((item) => {
              return (
                <TrainingItem key={item.id} id={item.id} text={item.text} />
              );
            })}
          </div>
        </div>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default Training;

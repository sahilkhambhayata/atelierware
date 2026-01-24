import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
// import viewIcon from "./../../../../images/icons/viewIcon.svg";
import backArrowIcon from "./../../../../images/icons/backArrowIcon.svg";
import { Button } from "reactstrap";
// import Icon from "../../../../Components/icon/Icon";

const AddOrderHeader = ({ data }) => {
  const location = useLocation();
  const from = location.state && location.state.from;
  const navigate = useNavigate();

  const handleBackToOrderList = () => {
    if (from == "order-tracker") {
      navigate("/dashboard");
    } else if (from == "item-tracker") {
      navigate("/item-tracker");
    } else if (from == null) {
      navigate("/dashboard");
    }
  };

  // const [tabIndex, setTabIndex] = useState(1);

  // const [tabs, setTabs] = useState([]);

  // const handleAddTab = () => {
  //   const newTabs = [...tabs, { ind: tabIndex + 1, id: "00000" }];
  //   setTabs(newTabs);
  //   setTabIndex(tabIndex + 1);
  // };

  // const handleRemoveTab = (index) => {
  //   const newTabs = tabs.filter((tab) => tab.ind !== index);
  //   setTabs(newTabs);
  // };

  // useEffect(() => {
  //   if (tabs.length === 0) {
  //     navigate("/");
  //   }
  // }, [tabs]);

  // const handleTabClick = (tab) => {
  //   if (tab.id === "00000") {
  //     navigate("/add-order");
  //   }
  // };

  return (
    <div className="position-relative bg-white px-2 px-md-5 py-1 py-md-0  ">
      <div className="bg-white px-md-2 mb-md-1 ">
        <Button
          outline
          color="light"
          className="mt-1"
          onClick={handleBackToOrderList}
        >
          <img src={backArrowIcon} alt="viewIcon" />
          <span className="ms-1">Back</span>
        </Button>
      </div>
      <div className=" align-items-center d-none d-md-flex">
        {/* <div className="d-flex align-items-center px-2">
          {tabs.map((tab) => (
            <div className="" key={tab.ind}>
              <div
                className="py-1 px-3 bg-white  d-flex justify-content-between align-items-center"
                style={{
                  marginBottom: -30,
                  marginLeft: "15px",
                  borderEndEndRadius: "10px",
                  borderEndStartRadius: "10px",
                }}
              >
                <span
                  className="pointer-cursor"
                  onClick={() => handleTabClick(tab)}
                >
                  #{tab.id}
                </span>
                <Icon
                  className="bg-light p-1 rounded-circle ms-2"
                  name="cross"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRemoveTab(tab.ind)}
                />
              </div>
            </div>
          ))}
        </div>
        <div
          onClick={handleAddTab}
          className="rounded-circle text-white roumded-bt bg-danger pointer-cursor"
          style={{ marginBottom: -30 }}
        >
          +
        </div> */}
      </div>
    </div>
  );
};

export default AddOrderHeader;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import viewIcon from "./../../../images/icons/viewIcon.svg";
import backArrowIcon from "./../../../images/icons/backArrowIcon.svg";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import Icon from "../../../Components/icon/Icon";
import deleteWaringIcon from "./../../../images/icons/delete-waring-icon.svg";

const AddOrderHeader = () => {
  // const SingleCustomer = useSelector((state) => state?.customerDetails.single);
  const getcreateorddtls = useSelector(
    (state) => state.createorddtls.ordDetails?.upCrtOrder
    // (state) => state.getcreateorddtls.ordDetails.upCrtOrder
  );
  const navigate = useNavigate();
  const [conformModel, setConformModel] = useState(false);

  const handleConformModel = () => {
    if (location.pathname == "/order-list") {
      navigate("/dashboard");
    } else if (location.pathname == "/add-order-home-page") {
      if (location.state && location.state.from == "single-order-list") {
        navigate("/order-list");
      } else {
        navigate("/dashboard");
      }
    } else if (location.pathname == "/group-order-home-page") {
      if (location.state && location.state.from == "group-order-list") {
        navigate("/order-list");
      } else {
        navigate("/dashboard");
      }
    }
  };
  const handleBackToOrderList = () => {
    if (
      location.pathname == "/order-list" ||
      location.pathname == "/add-order-home-page" ||
      location.pathname == "/group-order-home-page"
    ) {
      setConformModel(true);
    } else if (isFromOrderTrackerList) {
      navigate(
        // `/order-tracker-single-order/${location.state.TOrdNo}/${location.state.mood}`,
        `/order-tracker-single-order`,
        {
          state: {
            from: "order-tracker",
            TOrdNo: location.state.TOrdNo,
            mood: location.state.mood,
            // mood: "edit",
            // tab: "under-booking",
            // balanceData: balanceData?.balanceData,
          },
        }
      );
    } else {
      navigate("/add-order");
    }
  };

  const cancleBack = () => {
    setConformModel(false);
  };
  const location = useLocation();

  const isFromOrderTrackerList =
    (location.state && location.state.from === "order-tracker") ||
    (location.state && location.state.from === "item-tracker");

  return (
    <div className="position-relative bg-white px-2 px-md-5 py-1 py-md-0  ">
      <div className="bg-white px-md-2 mb-md-1 ">
        <Button
          outline
          color="light"
          className="mt-2"
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

      <Modal
        isOpen={conformModel}
        // toggle={handleImageDeleteModelClose}
        size="lg"
        className="rounded-top-4 add-order-singe-image-slider"
      >
        {/* <div className="p-4 rounded-top-4"> */}
        <div className="bg-1c2b4c text-white p-3 rounded-top-4">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>Back</div>
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
                      Back To Dashboard
                    </span>
                    <br />
                    <span className="custom-light-text ">
                      <b>Wait! Are you sure you want to go?</b>
                      <p className="mt-2"></p>
                      If you leave now, your order detail and progress will be
                      saved under Order# -
                      {
                        <b>
                          {getcreateorddtls?.TOrdNo !== undefined
                            ? getcreateorddtls?.TOrdNo
                            : ""}
                        </b>
                      }
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
                onClick={
                  () => handleConformModel()

                  // setConformModel(false);
                }
              >
                Yes
              </Button>
              <Button onClick={cancleBack}>No</Button>
            </div>
          </div>
        </ModalBody>

        {/* </div> */}
      </Modal>
    </div>
  );
};

export default AddOrderHeader;

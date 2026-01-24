import React, { useState } from "react";
import CategoryIcon from "./../../../../images/icons/add-order-caterory-icon.svg";
import saleTypeIcon from "./../../../../images/icons/add-order-saletype-icon.svg";
import SpecialIcon from "./../../../../images/icons/special-icon.svg";
import PriorityIcon from "./../../../../images/icons/add-order-priority-icon.svg";
import orderTypeIcon from "./../../../../images/icons/add-order-ordertype-icon.svg";
import tridateImg from "./../../../../images/icons/tridateImg.svg";
import deldateImg from "./../../../../images/icons/deldateImg.svg";
import ActionEditIcon from "./../../../../images/icons/edit-icon.png";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import AdvanceDetailForm from "./AdvanceDetailForm";
import Icon from "../../../../Components/icon/Icon";

const OrderDetail = () => {
  const [editOrderDetail, setEditOrderDetail] = useState(false);

  const handleEditOrderDetail = () => {
    setEditOrderDetail(true);
  };
  const [advanceData, setAdvanceData] = useState({
    saleType: "non-taxable",
    orderType: "regular",
    priority: "regular",
    trialDate: new Date(),
    deliveryDate: new Date(),
    designer: "jane cooper",
    master: "jane cooper",
    PODate: new Date(),
    orderDate: new Date(),
  });
  const submitCustomerModel = () => {
    setEditOrderDetail(false);
   
  };
  const handleAdvanceData = (data) => {
    setAdvanceData(data);
  };

  const handleCloseOrdreModel = () => {
    setEditOrderDetail(false);
  };
  return (
    <div
      className={`w-100 bg-white shadow rounded w-xl-50 ms-0 ms-xl-2 mt-xl-0 mt-4 pl-3 position-relative shadow position-relative`}
    >
      <div
        className="order-md-last position-absolute"
        style={{ top: "0%", right: "0%", width: "220px" }}
      >
        <div
          className="bg-light text-end fw-bold py-1"
          style={{ width: "auto" }}
        >
          REG/2023-24/20341
          <div className="d-flex justify-content-end">
            <img src={tridateImg} alt="" width="17px" className="me-1" />
            Oct 2,2023 - 04:30 PM
          </div>
        </div>
      </div>

      <div className="row justify-content-between ">
        <div className="col-md-0 col-12">
          <div className="opacity-0 d-md-none d-block">
            <p>dfhgdhf</p>
            <span>sdkhfdj</span>
            <p>dkjgdkf</p>
          </div>
        </div>
        <div className="text-start custom-border-right col-lg-2 col-md-6 col-12 mt-2">
          <div className="d-flex ">
            <img src={saleTypeIcon} alt="" width="20px" className="me-1 " />
            <span className="custom-light-text custom-text-transform">sale Type</span>
          </div>
          <span className="fs-14 fw-medium text-uppercase">non-taxable</span>
        </div>
        <div className="custom-border-right col-lg-2 col-md-6 col-12 mt-2">
          <div className="d-flex custom-light-text custom-text-transform text-md-start text-center">
            <img src={orderTypeIcon} alt="" width="20px" className="me-1" />
            <span className="">order Type</span>
          </div>
          <span className="fs-14 fw-medium text-uppercase">regular</span>
        </div>

        <div className="text-start custom-border-right col-lg-3 col-md-6 col-12 mt-2">
          <div className="d-flex custom-light-text custom-text-transform">
            <img src={tridateImg} alt="" width="17px" className="me-1" />
            Trial Date
          </div>
          <span className="fs-14 fw-medium">Oct 2, 2023 - 04:30 PM</span>
        </div>
        <div className="text-start col-lg-5 col-md-6 col-12 mt-2">
          <div className="d-flex custom-light-text custom-text-transform">
            <img src={PriorityIcon} alt="" width="18px" className="me-1" />
            Priority
          </div>
          <span className="fs-14 fw-medium text-danger">
            <img src={SpecialIcon} alt="" width="14px" className="me-1" />
            URGENT
          </span>
        </div>

        <div className="text-start custom-border-right col-lg-2 col-md-6 col-12 mt-2">
          <div className="d-flex custom-light-text custom-text-transform">
            <img src={CategoryIcon} alt="" width="20px" className="me-1 " />
            Designer
          </div>
          <span className="fs-14 fw-medium text-uppercase">jane cooper</span>
        </div>
        <div className="text-start custom-border-right col-lg-2 col-md-6 col-12 mt-2">
          <div className="d-flex custom-light-text custom-text-transform">
            <img src={CategoryIcon} alt="" width="20px" className="me-1 " />
            master
          </div>
          <span className="fs-14 fw-medium text-uppercase"></span>
        </div>
        <div className="text-start custom-border-right col-lg-3 col-md-6 col-12 mt-2">
          <div className="d-flex custom-light-text custom-text-transform">
            <img src={deldateImg} alt="" width="17px" className="me-1" />
            Delivery Date
          </div>
          <span className="fs-14 fw-medium">Oct 7, 2023 - 04:30 PM</span>
        </div>
        <div className="text-start col-lg-5 col-md-6 col-12 row ">
          <div className="col-12 col-sm-6 mt-2">
            <div className="d-flex custom-light-text custom-text-transform">
              <img src={tridateImg} alt="" width="17px" className="me-1" />
              P.O Date
            </div>
            <span className="fs-14 fw-medium">04 oct 2023</span>
          </div>
          <div className="col-12 col-sm-6 mt-2">
            <div className="text-start col-lg-3 col-md-12 col-6 custom-light-text custom-text-transform">
              Purchase Order#
            </div>
          </div>
        </div>

        {/* <div className="col-lg-3 col-md-4 col-12 "></div> */}
      </div>

      <Modal isOpen={editOrderDetail} size="xl" className="rounded-top-4 ">
        <div className="bg-1c2b4c text-white py-2 px-4 rounded-top-4">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>
              <span>Add Customer Detail</span>
            </div>
            <Icon name="cross" onClick={handleCloseOrdreModel}></Icon>
          </div>
        </div>
        <ModalBody className=" mb-5 " style={{ minHeight: "400px" }}>
          <AdvanceDetailForm onDataChange={handleAdvanceData} />
        </ModalBody>
        <ModalFooter className="mt-5 border-bottom-red">
          <div className="d-flex justify-content-end ">
            <Button
              outline
              color="light"
              className="mr-4"
              onClick={handleCloseOrdreModel}
            >
              Cancel
            </Button>

            <Button className="bg-1c2b4c" onClick={submitCustomerModel}>
              Save
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default OrderDetail;

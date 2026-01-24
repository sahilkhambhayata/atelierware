import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleCustomer } from "../../../../redux/actions/customerAction";
import { useLocation, useNavigate } from "react-router";

import deleteWaringIcon from "./../../../../images/icons/delete-waring-icon.svg";

import { Button, Modal, ModalBody } from "reactstrap";
import PaymentModal from "./PaymentModel";
import OrderDetail from "../OrderDetail";
import PersonalDetail from "../PersonalDetail";
import AddOrderHeader from "../AddOrderHeader";

import { getGroupOrderListAsyncData } from "../../../../redux/actions/groupOrderListAction";
import SingleAndGroupOrderList from "./SingleAndGroupOrderList";
import { useTheme } from "../../../../Layout/Provider/Themes";
import Head from "../../../../Layout/head/Head";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const OrderListPage = () => {
  // const location = useLocation();

  // const location = useLocation();
  // const id = location.state.id;
  const { tabId } = useTheme();
  const SingleCustomer = useSelector((state) => state?.customerDetails.single);
  const symbol = localStorage.getItem("countrySymbol");
  const id = localStorage.getItem(`customerId${tabId}`);
  const TOrdHdID = localStorage.getItem(`TOrdHdID${tabId}`);
  const TOrdDtID = localStorage.getItem(`TOrdDtID${tabId}`);

  const { handleAction } = usePermissions();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (TOrdHdID == null) {
      navigate("/add-order");
    }
  }, []);
  useEffect(() => {
    if (id != null) {
      dispatch(getSingleCustomer(id));
    }
  }, [id]);

  const handlePayment = () => {
    setIsPayment(true);
  };

  const handleSaveOrder = () => {
    navigate("/dashboard");
  };

  const [isPayment, setIsPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handlePaymentMethod = (value) => {
    setPaymentMethod(value);
  };
  const [paymentDelete, setPaymentDelete] = useState(false);

  const handlePaymentModal = (value) => {
    if (value === false) {
      setPaymentMethod("cod");
      setDisplayForm(true);
      setDisplaySummary(false);
    }
    setIsPayment(value);
  };

  const [deletedData, setDeleteData] = useState();
  const handlePaymentDelete = (value) => {
    setDeleteData(value);
    setPaymentDelete(value);
  };

  const [displayForm, setDisplayForm] = useState(true);
  const [displaySummary, setDisplaySummary] = useState(false);

  const handleDisplaySummary = (value) => {
    setDisplaySummary(value);
  };

  const handleDispalyForm = (value) => {
    setDisplayForm(value);
  };

  const TOrdHdId = localStorage.getItem(`TOrdHdID${tabId}`);

  const location = useLocation();
  const isFromGroupOrderList =
    location.state && location.state.from === "group-page";
  // const isGroupId = location.state && location.state.id;

  useEffect(() => {
    // if (isFromGroupOrderList) {
    //   const TOrdHdId = localStorage.getItem(`TOrdHdID${tabId}`);
    // const TOrdHdId = 22687;

    dispatch(getGroupOrderListAsyncData(TOrdHdId));
    // } else {
    //   const TOrdHdId = localStorage.getItem(`TOrdHdID${tabId}`);

    // dispatch(getOrderListAsyncData(TOrdHdId));
    // }
  }, [isFromGroupOrderList]);

  return (
    <>
      <Head title="Order List"></Head>
      <div>
        <AddOrderHeader />
        <div className="custom-container-orderListing mt-2 position-relative ">
          <div className=" d-xl-flex justify-content-between col-xxxl-2 ">
            <PersonalDetail data={("bg-white", "shadow")} />
            <OrderDetail data={("bg-white", "shadow")} />
          </div>

          <SingleAndGroupOrderList />

          <div className="mt-5 d-flex justify-content-center mb-5 ">
            <Button
              id="BtnBkAnOrderAddPayment"
              className="mx-3"
              onClick={() =>
                handleAction(
                  "BtnBkAnOrderAddPayment",
                  "action",
                  handlePayment,
                  null
                )
              }
            >
              Add to Payment
            </Button>

            <Button
              id="BtnBkAnOrderSaveOrder"
              className="mx-3"
              // onClick={() =>
              //   handleAction(
              //     "BtnBkAnOrderSaveOrder",
              //     "action",
              //     handlePayment,
              //     null
              //   )
              // }
              onClick={() => handleSaveOrder()}
            >
              Save Order
            </Button>
          </div>
          <Modal
            isOpen={isPayment}
            size={
              // customModalSize
              // paymentMethod === "cash" ||
              // paymentMethod === "wallet" || paymentMethod === "bank" ? "xl" : "lg"
              (paymentMethod === "cash" ||
                paymentMethod === "wallet" ||
                paymentMethod === "bank") &&
              displaySummary &&
              displayForm
                ? "xl"
                : "lg"
            }
            className="py-0"
          >
            {/* <PaymentModal
            onPaymentMethod={handlePaymentMethod}
            onPaymentModal={handlePaymentModal}
            onPaymentDelete={handlePaymentDelete}
            onForm={handleDispalyForm}
            onSummary={handleDisplaySummary}
          /> */}

            <PaymentModal
              onPaymentMethod={handlePaymentMethod}
              onPaymentModal={handlePaymentModal}
              onPaymentDelete={handlePaymentDelete}
              onForm={handleDispalyForm}
              onSummary={handleDisplaySummary}
            />
          </Modal>

          <Modal isOpen={paymentDelete} size="lg">
            <div className="bg-dark text-white p-3 rounded-top-4">
              <div className="d-flex justify-content-between align-items-center w-100">
                <div>Delete</div>
              </div>
            </div>
            <ModalBody>
              <div className="border rounded-2">
                <div className="d-flex my-3 mx-2 pb-5">
                  <div className="w-100 ">
                    <div className="border rounded-2  d-flex w-100 bg-light justify-content-between">
                      <div>
                        <span className="fw-medium">Cash Discount</span>
                        <p className="fs-12 custom-light-text custom-text-transform">
                          Lorem ipsum dolor sit amet.
                        </p>
                      </div>
                      <div className="custom-light-text custom-text-transform">
                        26/9/2023
                      </div>
                      <div>
                        <span className="fw-medium">{symbol} 50,000</span>
                      </div>
                    </div>
                    <div className="d-flex mt-2 ">
                      <img
                        src={deleteWaringIcon}
                        alt=""
                        className="mr-2"
                        width="50px"
                      />
                      <div>
                        <span className="fw-bold text-warning fs-3">
                          Delete
                        </span>
                        <br />
                        <span className="custom-light-text custom-text-transform">
                          Do You really want to Remove This?
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex px-lg-2 px-0 border-top justify-content-end">
                  <Button
                    outline
                    color="dark"
                    className="mr-2"
                    onClick={() => setPaymentDelete(false)}
                    // onClick={() => handleImageDelete(deleteImage, deleteImageIndex)}
                  >
                    Delete
                  </Button>
                  <Button onClick={() => setPaymentDelete(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default OrderListPage;

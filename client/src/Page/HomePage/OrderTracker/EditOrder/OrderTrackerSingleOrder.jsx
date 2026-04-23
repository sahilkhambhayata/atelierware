import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleCustomer } from "../../../../redux/actions/customerAction";
import { useLocation, useNavigate } from "react-router";
// import OrderList from "./OrderList";

import deleteWaringIcon from "./../../../../images/icons/delete-waring-icon.svg";

import { Button, Modal, ModalBody } from "reactstrap";
// import PaymentModal from "./PaymentModel";
import OrderDetail from "../../AddOrder/OrderDetail";
import PersonalDetail from "../../AddOrder/PersonalDetail";
import Header from "./AddOrderHeader";
// import { getOrderListAsyncData } from "../../../../redux/actions/orderListAction";
// import Payment from "./Payment";
import PayNowModal from "./PayNowModel";
import OrderList from "./OrderList";

import {
  getGroupOrderListAsyncData,
  getSingleGroupOrderList,
} from "../../../../redux/actions/groupOrderListAction";
import { useTheme } from "../../../../Layout/Provider/Themes";
import Head from "../../../../Layout/head/Head";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";
import { getSingleOrderList } from "../../../../redux/actions/orderListAction";
// import SingleAndGroupOrderList from "./SingleAndGroupOrderList";

const OrderTrackerSingleOrder = () => {
  const location = useLocation();
  const { tabId } = useTheme();
  // const balanceData = location?.state?.balanceData;
  const { handleAction } = usePermissions();

  const symbol = localStorage.getItem("countrySymbol");
  // const id = localStorage.getItem(`customerId${tabId}`);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [balanceData, setBalanceData] = useState({});
  const [tab, setTab] = useState();
  const [from, setFrom] = useState();
  const [id, setId] = useState();
  const [TOrdHdId, setTOrdHdId] = useState();
  const [TOrdNo, setTOrdNo] = useState();

  const [mood, setMood] = useState();

  useEffect(() => {
    // if (location?.state == null) {
    //   navigate("/dashboard");
    // }

    if (tabId) {
      const blncData = localStorage.getItem(`TOrdHdID${tabId}`);
      if (location.state !== null) {
        setId(localStorage.getItem(`customerId${tabId}`));
        setTOrdHdId(localStorage.getItem(`TOrdHdID${tabId}`));
        setMood(localStorage.getItem(`mood${tabId}`));
        // setBalanceData(localStorage.getItem(`balanceData${tabId}`));
        setTOrdNo(location.state.TOrdNo);
        setTab(location?.state?.tab);
        setFrom(location?.state?.from);
      } else if (blncData !== null) {
        const data = JSON.parse(localStorage.getItem("orderEditData"));

        setId(localStorage.getItem(`customerId${tabId}`));
        setMood(localStorage.getItem(`mood${tabId}`));
        setTOrdNo(data.TOrdNo);
        // setBalanceData(JSON.parse(blncData));
        setTOrdHdId(localStorage.getItem(`TOrdHdID${tabId}`));
        setTab(data?.tab);
        setFrom(data?.from);
      } else {
        const data = JSON.parse(localStorage.getItem("orderEditData"));

        setId(data.AccountId);
        // setBalanceData(data?.balanceData);
        setTab(data?.tab);
        setFrom(data?.from);
        setTOrdHdId(data.TOrdHdID);
        setMood(data?.mood);
        setTOrdNo(data.TOrdNo);

        localStorage.setItem(`customerId${tabId}`, data.AccountId);
        localStorage.setItem(`TOrdHdID${tabId}`, data.TOrdHdID);
        localStorage.setItem(`mood${tabId}`, data.mood);

        // localStorage.setItem(
        //   `balanceData${tabId}`,
        //   JSON.stringify(data?.balanceData)
        // );
        // navigate(".", { state: data });
      }
    }
  }, [tabId]);

  // Removed duplicate getSingleCustomer call
  // PersonalDetail component (rendered below) already calls this API
  // This was causing duplicate getCustomers API calls (2x)
  // useEffect(() => {
  //   if (id) {
  //     dispatch(getSingleCustomer(id));
  //   }
  // }, [id]);

  const handlePayment = () => {
    setIsPayment(true);
  };

  const [isPayment, setIsPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const handlePaymentMethod = (value) => {
    setPaymentMethod(value);
  };
  const [paymentDelete, setPaymentDelete] = useState(false);

  const handlePaymentModal = (value) => {
    if (value === false) {
      setPaymentMethod("cash");
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

  // const mood = localStorage.getItem(`mood${tabId}`);

  // const TOrdHdId = localStorage.getItem(`TOrdHdID${tabId}`);

  useEffect(() => {
    if (TOrdHdId) {
      dispatch(getGroupOrderListAsyncData(TOrdHdId));
    }
  }, [TOrdHdId]);

  return (
    <>
      <Head title={`${location.state ? TOrdNo : TOrdNo}`} />
      <div>
        <Header data={from} />
        <div className="custom-container-orderListing mt-2 position-relative ">
          <div className=" d-xl-flex justify-content-between col-xxxl-2 ">
            <PersonalDetail data={("bg-white", "shadow")} />
            <OrderDetail data={("bg-white", "shadow")} />
          </div>

          <OrderList tab={tab} from={from} />

          {(mood == "edit" || mood == "view") && (
            <div className="mt-5 d-flex justify-content-center mb-5">
              <Button
                id="BtnEditOrderAddPayment"
                className="w-25 d-flex justify-content-center"
                onClick={() =>
                  handleAction(
                    "BtnEditOrderAddPayment",
                    "action",
                    handlePayment,
                    null
                  )
                }
              >
                Add to Payment
              </Button>
            </div>
          )}



          <Modal
            isOpen={isPayment}
            size={
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
            <PayNowModal
              from={from}
              tab={tab}
              TORDHdID={TOrdHdId}
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

export default OrderTrackerSingleOrder;

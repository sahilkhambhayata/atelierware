import React, { useEffect, useState } from "react";
import { getSingleCustomer } from "../../../../../redux/actions/customerAction";
import { useDispatch, useSelector } from "react-redux";
import SingleOrderBook from "./SingleOrderBook";
import PersonalDetail from "./../../../AddOrder/PersonalDetail";
import OrderDetail from "../../OrderDetail";
import AddOrderHeader from "../../AddOrderHeader";
import { useLocation, useNavigate } from "react-router";
import { useTheme } from "../../../../../Layout/Provider/Themes";
import Head from "../../../../../Layout/head/Head";
import { getConfig } from "../../../../../redux/actions/configAction";

const AddOrderHomePage = () => {
  const { tabId } = useTheme();
  const service = useSelector((state) => state.service.service.orderDetails);
  // const serviceId = localStorage.getItem(`serviceId${tabId}`);

  const dispatch = useDispatch();
  // const id = localStorage.getItem(`customerId${tabId}`);
  const location = useLocation();

  const [id, setId] = useState();
  const [TOrdNo, setTOrdNo] = useState();

  useEffect(() => {
    // if (isFromOrderTrackerList || isFromItemTrackerList) {
    if (location.state !== null) {
      setTOrdNo(location.state.TOrdNo);
      // setMood(location.state.mood);
    } else {
      const data = JSON.parse(localStorage.getItem("orderEditData"));

      setTOrdNo(data.TOrdNo);
      // setMood(data.mood);
    }
    // }
  }, [tabId, location.state]);

  

  useEffect(() => {
    if (id !== null) {
      dispatch(getSingleCustomer(id));
    }
  }, [id, tabId, dispatch]);

  const navigate = useNavigate();

  return (
    <>
      <Head title={TOrdNo ? TOrdNo : "Single Item Order"}></Head>
      <div className="bg-light pr-0">
        <AddOrderHeader id={id} />

        <div className="custom-container my-4">
          <div className=" d-xl-flex justify-content-between col-xxxl-2 ">
            <PersonalDetail data={("bg-white", "shadow")} />
            <OrderDetail data={("bg-white", "shadow")} />
          </div>
          <SingleOrderBook />
        </div>
      </div>
    </>
  );
};

export default AddOrderHomePage;

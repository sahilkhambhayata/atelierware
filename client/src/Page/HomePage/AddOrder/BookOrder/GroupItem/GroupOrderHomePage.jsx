import React, { useEffect, useState } from "react";

import { getSingleCustomer } from "../../../../../redux/actions/customerAction";

import { useDispatch, useSelector } from "react-redux";

import PersonalDetail from "./../../../AddOrder/PersonalDetail";
import OrderDetail from "../../OrderDetail";
import AddOrderHeader from "../../AddOrderHeader";
import GroupOrderBook from "./GroupOrderBook";
import { useTheme } from "../../../../../Layout/Provider/Themes";
import Head from "../../../../../Layout/head/Head";
import { useLocation, useNavigate } from "react-router";

const AddOrderHomePage = () => {
  const service = useSelector((state) => state.service.service.orderDetails);
  const { tabId } = useTheme();
  const serviceId = localStorage.getItem(`serviceId${tabId}`);

  const selectedService = service?.find((item) => item.ItemId === serviceId);

  const dispatch = useDispatch();
  const [TOrdNo, setTOrdNo] = useState();
  const location = useLocation();

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

  

  const id = localStorage.getItem(`customerId${tabId}`);
  useEffect(() => {
    if (id !== null) {
      dispatch(getSingleCustomer(id));
    }
  }, [id]);

  const navigate = useNavigate();
  // useEffect(() => {
  //   if (id == "null") {
  //     navigate("/add-order");
  //   }
  // }, []);

  return (
    <>
      <Head title={TOrdNo ? TOrdNo : "Group Item Order"}></Head>
      <div className="bg-light pr-0">
        <AddOrderHeader id={id} />

        <div className="custom-container my-4">
          <div className=" d-xl-flex justify-content-between col-xxxl-2 ">
            <PersonalDetail data={("bg-white", "shadow")} />
            <OrderDetail data={("bg-white", "shadow")} />
          </div>

          <GroupOrderBook />
        </div>
      </div>
    </>
  );
};

export default AddOrderHomePage;

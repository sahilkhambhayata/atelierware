import React, { useEffect, useState } from "react";
import Sidebar from "../../Partials/Sidebar";
import Header from "../../Partials/Header";
import AppSidebar from "../../Partials/AppSidebar";
import AppRoot from "../../Layout/Global/AppRoot";
import AppMain from "../../Layout/global/AppMain";
import AppWrap from "../../Layout/Global/AppWrap";
import { Outlet, useLocation, useNavigate } from "react-router";
import Footer from "../../Partials/Footer";
import Head from "../../Layout/head/Head";
import { useDispatch, useSelector } from "react-redux";
import { getBranch } from "../../redux/actions/branchAction";
// import { usePageId } from "./../../../src/PageIdContext";

const Dashboard = () => {
  // const { pageId } = usePageId();

  
  const navigate = useNavigate();
  const user = useSelector((state) => state.loginUser);
  const id = localStorage.getItem("userId");
  const BranchId = localStorage.getItem("BranchId");
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const idData = localStorage.getItem("userId");

    // if (user.user === null) {
    if (!idData || !user) {
      navigate("/");
    }
  }, [user]);

  // useEffect(() => {
  //   if (BranchId) {
  //     dispatch(getBranch(BranchId));
  //   }
  // }, [BranchId]);

  return (
    <>
      <Head title="sidebar" />
      <AppRoot>
        <AppMain>
          <Sidebar fixed />
          <AppWrap>
            {(location.pathname == "/dashboard" ||
              location.pathname == "/item-tracker" ||
              location.pathname == "/role" ||
              location.pathname == "/user") && <Header fixed />}

            <Outlet />
            <Footer />
          </AppWrap>
        </AppMain>
      </AppRoot>
    </>
  );
};

export default Dashboard;

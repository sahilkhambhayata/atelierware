import React, { useEffect, useState } from "react";
import Head from "../../../../../Layout/head/Head";
import "@react-pdf-viewer/core/lib/styles/index.css";

import { Spinner } from "reactstrap";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
import { useLocation } from "react-router";
import { useTheme } from "../../../../../Layout/Provider/Themes";
import { useDispatch, useSelector } from "react-redux";
import { getGroupOrderListAsyncData } from "../../../../../redux/actions/groupOrderListAction";

const OrderBOM = () => {
  const { isLoader } = useSelector((state) => state?.groupOrderList);

  // const [isLoader, setIsLoader] = useState(false);
  let orderList = useSelector((state) => state.groupOrderList);

  const handleExportToPDF = () => {
    const element = document.getElementById("pdfConvert");
    if (element) {
      const options = {
        // margin: [10, 10, 10, 10], // Adjust margins if needed
        filename: "OrderBOM.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait", // 'landscape' for horizontal A4
        },
      };

      html2pdf()
        .from(element)
        .set(options)
        .save();
    } else {
      console.error("Element not found");
    }
  };

  // const handleExportToPDF = () => {
  //   const element = document.getElementById("pdfConvert");
  //   if (element) {
  //     const pdf = new jsPDF();
  //     html2pdf()
  //       .from(element)
  //       .save();
  //   } else {
  //     console.error("Element not found");
  //   }
  // };

  const convertDateFormat = (inputDate) =>
    new Date(inputDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const dispatch = useDispatch();
  const { tabId } = useTheme();
  const [TOrdHdID, setTOrdHdID] = useState();
  const location = useLocation();

  useEffect(() => {
    if (tabId) {
      const blncData = localStorage.getItem(`TOrdHdID${tabId}`);
      if (location.state !== null) {
        setTOrdHdID(localStorage.getItem(`TOrdHdID${tabId}`));
      } else if (blncData !== null) {
        const data = JSON.parse(localStorage.getItem("orderEditData"));
        setTOrdHdID(data.TOrdHdID);

        setTOrdHdID(localStorage.getItem(`TOrdHdID${tabId}`));
      } else {
        const data = JSON.parse(localStorage.getItem("orderEditData"));
        setTOrdHdID(data.TOrdHdID);
        localStorage.setItem(`TOrdHdID${tabId}`, data.TOrdHdID);
      }
    }
  }, [tabId]);

  const getBOMData = async () => {
    dispatch(getGroupOrderListAsyncData(TOrdHdID));
  };

  useEffect(() => {
    if (TOrdHdID == null || TOrdHdID == "null" || TOrdHdID == undefined) {
      // navigate(-1);
    } else {
      getBOMData();
    }
  }, [TOrdHdID]);

  return (
    <div>
      <Head title="Order BOM"></Head>
      <div
        className={`f_invoice ${orderList?.isLoader ? "isLoading" : ""}`}
        id="pdfConvert"
        style={{ minHeight: "90vh" }}
      >
        {orderList?.isLoader ? (
          <div className="isLoading_div">
            <div className="d-flex justify-content-center align-items-center w-100 h-50">
              <Spinner className="" />
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="invoice_header ">
          <div className="image-heading">
            <div className="image-text-flex d-flex align-items-center justify-content-center">
              <div className="invoice_heading_text my-2 text-decoration-underline">
                {orderList.orderData?.Order && (
                  <span>{orderList?.orderData?.Order?.MstBranch?.BranchName}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bom_order_no w-full">
          <div className="ph_mail_loc-flex">
            <div>
              <div className="icon_text">
                <div className="label">
                  <span>Orde No:</span>
                </div>
                <div className="text">
                  {orderList?.orderData?.Order?.TOrdNo}
                </div>
              </div>
              <div className="icon_text">
                <div className="label">
                  <span>Order Date:</span>
                </div>
                <div className="text">
                  {convertDateFormat(orderList?.orderData?.Order?.TOrdDate)}
                </div>
              </div>
            </div>

            <div className="icon_text">
              <div className="label">
                <span>Customer Name:</span>
              </div>
              <div className="text">
                {orderList?.orderData?.Order?.CustName}
              </div>
            </div>

            <div>
              <div className="icon_text">
                <div className="label">
                  <span>Priority:</span>
                </div>
                <div className="text">
                  {orderList?.orderData?.Order?.OrderPriority}
                </div>
              </div>
              <div className="icon_text">
                <div className="label">
                  <span>Due Date:</span>
                </div>
                <div className="text">
                  {convertDateFormat(orderList?.orderData?.Order?.DelDate)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bom table */}
        <div className="bom_table">
          <table class="table  bg-tr-even">
            <thead>
              <tr>
                <th scope="col">ITEM NO</th>
                <th scope="col">TYPE</th>
                <th scope="col">FABRIC NAME</th>
                <th scope="col">COLOR TO BE DYED</th>
                <th scope="col">LENGTH (Mtrs)</th>
              </tr>
            </thead>

            <tbody>
              {orderList?.orderData?.Order?.TOrdDtls.map((item, ind) => {
                return (
                  <React.Fragment key={ind}>
                    {item.fabricList.length > 0 &&
                      item.fabricList.map((fab, id) => {
                        return (
                          <tr key={id}>
                            <td>{item.OrdSrNo}</td>
                            <td className="text-center">
                              {fab.ItemType == "Cut Length" ||
                              fab.ItemType == "cut length"
                                ? "E"
                                : fab.ItemType == "Fabric" ||
                                  fab.ItemType == "fabric"
                                ? "I"
                                : fab.ItemType == "Accessories" ||
                                  fab.ItemType == "accessories"
                                ? "A"
                                : ""}
                            </td>
                            <td>
                              {" "}
                              <p className="my-0">
                                {fab.articleDetails.ArticleName}
                              </p>
                              <p className="my-0">{fab.Descriptions}</p>
                            </td>
                            <td>
                              {fab.DyeingComment == ""
                                ? fab.DyeingOption
                                : fab.DyeingComment}
                            </td>
                            <td>{fab.Quantity}</td>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-sm btn-primary" onClick={handleExportToPDF}>
          Export to PDF
        </button>
      </div>
    </div>
  );
};

export default OrderBOM;

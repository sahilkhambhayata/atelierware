import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import jsPDF from "jspdf";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useDispatch, useSelector } from "react-redux";

// import Barcode from "react-barcode";
import { Spinner } from "reactstrap";
import { getInvoicePrintOrder } from "../../../../redux/actions/invoiceAction";
import WorksheetPage1 from "./Worksheet/worksheetPage1";
import WorksheetHeader from "./Worksheet/WorksheetHeader";
import WorksheetPage2 from "./Worksheet/WorksheetPage2";
import { getWorksheetPrintOrder } from "../../../../redux/actions/workSheetAction";
import { useLocation, useNavigate } from "react-router";
import { useTheme } from "../../../../Layout/Provider/Themes";
import Head from "../../../../Layout/head/Head";
import { Button } from "reactstrap";
import backArrowIcon from "./../../../../images/icons/backArrowIcon.svg";

const Worksheet = () => {
  const { tabId } = useTheme();
  const dispatch = useDispatch();
  // const { worksheetData } = useSelector((state) => state?.worksheetData);
  const { isLoader } = useSelector((state) => state?.worksheetData);

  const location = useLocation();
  // const TOrdHdID = location.state;

  const [TOrdHdID, setTOrdHdID] = useState();
  useEffect(() => {
    // if (location?.state == null) {
    //   navigate("/dashboard");
    // }

    if (tabId) {
      const blncData = localStorage.getItem(`TOrdHdID${tabId}`);
      if (location.state !== null) {
        setTOrdHdID(localStorage.getItem(`TOrdHdID${tabId}`));
      } else if (blncData !== null) {
        const data = JSON.parse(localStorage.getItem("orderEditData"));
        setTOrdHdID(localStorage.getItem(`TOrdHdID${tabId}`));
      } else {
        const data = JSON.parse(localStorage.getItem("orderEditData"));
        setTOrdHdID(data.TOrdHdID);
        localStorage.setItem(`TOrdHdID${tabId}`, data.TOrdHdID);
      }
    }
  }, [tabId]);

  // const TOrdHdID = localStorage.getItem(`TOrdHdID${tabId}`);
  const getWorksheetData = async () => {
    dispatch(getWorksheetPrintOrder(TOrdHdID));
  };

  const navigate = useNavigate();
  const handleBackToLastPage = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (TOrdHdID == null || TOrdHdID == "null" || TOrdHdID == undefined) {
      // navigate(-1);
    } else {
      getWorksheetData(TOrdHdID);
    }
  }, [TOrdHdID]);

  const handleExportToPDF = () => {
    const element = document.getElementById("pdfConvert");
    if (element) {
      const pdf = new jsPDF();
      html2pdf(element, {
        margin: 1,
        filename: "Workheet.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        pagebreak: {
          avoid: ["tr", "div", "p", "span", ".page1"],
          before: ".page-break",
        },
        // jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        jsPDF: pdf, // Pass the jsPDF instance
      });
    } else {
      console.error("Element not found");
    }
  };

  const convertDateFormat = (inputDate) =>
    new Date(inputDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  useEffect(() => {
    if (TOrdHdID == null || TOrdHdID == "null" || TOrdHdID == undefined) {
      // navigate(-1);
    } else {
      dispatch(getInvoicePrintOrder(TOrdHdID));
    }
  }, [TOrdHdID]);

  // useEffect(() => {
  //   dispatch(getInvoicePrintOrder(TOrdHdID));
  // }, []);

  const { worksheetData } = useSelector((state) => state?.worksheetData);

  return (
    <>
      <Head title="WorkSheet"></Head>
      <div className="bg-white pt-1 pb-2 mb-2">
        <Button
          outline
          color="light"
          className="mt-2 ms-2"
          onClick={handleBackToLastPage}
        >
          <img src={backArrowIcon} alt="viewIcon" />
          <span className="ms-1">Back</span>
        </Button>
      </div>
      <div
        className={`worksheet_invoice ${isLoader ? "isLoading" : ""}`}
        id="pdfConvert"
      >
        {isLoader ? (
          <div className="isLoading_div">
            <div className="d-flex justify-content-center align-items-center w-100 h-100">
              <Spinner className="" />
            </div>
          </div>
        ) : (
          ""
        )}
        {worksheetData?.woorksheet?.map((item, i) => {
          const newImageObjects =
            item.TOrdDtls &&
            Object.keys(item.TOrdDtls)

              .filter(
                (key) =>
                  (key.startsWith("attach_img_") ||
                    key.startsWith("attach_garment_img_")) &&
                  !key.endsWith("_desc") &&
                  item.TOrdDtls[key] !== null
              )
              .map((imgKey) => {
                const descKey = `${imgKey}_desc`;
                return {
                  image: item.TOrdDtls[imgKey],
                  desc: item.TOrdDtls.hasOwnProperty(descKey)
                    ? item.TOrdDtls[descKey]
                    : null,
                };
              });

          const finalImageObjects = newImageObjects?.slice(0);

          return (
            <div Key={i}>
              <div className="page1 a4-size">
                <WorksheetHeader worksheetData={item} />
                <WorksheetPage1 worksheetData={item} />
              </div>
              {finalImageObjects.length > 1 && (
                <div className="page-2 a4-size">
                  <WorksheetHeader worksheetData={item} />
                  <WorksheetPage2 worksheetData={item} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-sm btn-primary" onClick={handleExportToPDF}>
          Export to PDF
        </button>
      </div>
    </>
  );
};

export default Worksheet;

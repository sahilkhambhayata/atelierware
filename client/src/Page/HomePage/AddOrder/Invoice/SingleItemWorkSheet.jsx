import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import jsPDF from "jspdf";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";

// import Barcode from "react-barcode";
import { Spinner } from "reactstrap";
// import { getInvoicePrintOrder } from "../../../../redux/actions/invoiceAction";
import WorksheetPage1 from "./SingleItemWorksheet/worksheetPage1";
import WorksheetHeader from "./SingleItemWorksheet/WorksheetHeader";
import WorksheetPage2 from "./SingleItemWorksheet/WorksheetPage2";
import { getSingleItemWorksheetPrintOrder } from "../../../../redux/actions/workSheetAction";
import { useLocation, useNavigate } from "react-router";
import { useTheme } from "../../../../Layout/Provider/Themes";
import Head from "../../../../Layout/head/Head";
import backArrowIcon from "./../../../../images/icons/backArrowIcon.svg";

const SingleItemWorkSheet = () => {
  const { tabId } = useTheme();
  const dispatch = useDispatch();
  const worksheetData = useSelector((state) => state?.worksheetData);
  const { isLoader } = useSelector((state) => state?.worksheetData);
  const navigate = useNavigate();
  const location = useLocation();
  // const TOrdDtId = localStorage.getItem(`TOrdDtID${tabId}`);
  const [TOrdDtId, setTOrdDtId] = useState();
  
  useEffect(() => {
    // if (location?.state == null) {
    //   navigate("/dashboard");
    // }

    if (tabId) {
      const blncData = localStorage.getItem(`TOrdDtID${tabId}`);
      
      if (location.state !== null) {
        setTOrdDtId(localStorage.getItem(`TOrdDtID${tabId}`));
      } else if (blncData !== null) {
        const data = JSON.parse(localStorage.getItem("orderEditData"));
        setTOrdDtId(localStorage.getItem(`TOrdDtID${tabId}`));
      } else {
        
        const data = JSON.parse(localStorage.getItem("orderEditData"));
     
        setTOrdDtId(data.TOrdDtID);
        localStorage.setItem(`TOrdDtID${tabId}`, data.TOrdDtID);
      }
    }
  }, [tabId]);

  useEffect(() => {
    if (TOrdDtId == "null" || TOrdDtId == "undefined" || TOrdDtId == null) {
      // navigate(-1);
    } else {
      

      dispatch(getSingleItemWorksheetPrintOrder(TOrdDtId));
    }
  }, [dispatch, TOrdDtId]);

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

  // useEffect(() => {
  //   dispatch(getInvoicePrintOrder(TOrdHdID));
  // }, []);

  const [finalImageObjects, setFinalImageObjects] = useState([]);

  // const handleBackToLastPage = () => {
  //   navigate(-1);
  // };

  useEffect(() => {
    if (
      worksheetData &&
      worksheetData.worksheetData &&
      worksheetData.worksheetData.TOrdDtls
    ) {
      const newImageObjects = Object.keys(worksheetData.worksheetData.TOrdDtls)
        .filter(
          (key) =>
            (key.startsWith("attach_img_") ||
              key.startsWith("attach_garment_img_")) &&
            worksheetData.worksheetData.TOrdDtls[key] !== null
        )
        .map((imgKey) => {
          const descKey = `${imgKey}_desc`;
          return {
            image: worksheetData.worksheetData.TOrdDtls[imgKey],
            desc: worksheetData.worksheetData.TOrdDtls.hasOwnProperty(descKey)
              ? worksheetData.worksheetData.TOrdDtls[descKey]
              : null,
          };
        });

      if (newImageObjects.length > 0) {
        setFinalImageObjects(
          newImageObjects.slice(1, newImageObjects.length / 2)
        );
      }
      // const finalObjects = newImageObjects.slice(1, newImageObjects.length / 2);
      // setFinalImageObjects(finalObjects);
    }
  }, [worksheetData]);
  // const finalImageObjects =
  return (
    <>
      <Head title="WorkSheet"></Head>
      {/* <div className="bg-white pt-1 pb-2 ">
        <Button
          outline
          color="light"
          className="mt-2 ms-2"
          onClick={handleBackToLastPage}
        >
          <img src={backArrowIcon} alt="viewIcon" />
          <span className="ms-1">Back</span>
        </Button>
      </div> */}
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
        <div>
          <div>
            <div className="page1 a4-size">
              <WorksheetHeader />
              <WorksheetPage1 />
            </div>

            {finalImageObjects?.length > 1 && (
              <div className="page-2 a4-size">
                <WorksheetHeader />
                <WorksheetPage2 />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-sm btn-primary" onClick={handleExportToPDF}>
          Export to PDF
        </button>
      </div>
    </>
  );
};

export default SingleItemWorkSheet;

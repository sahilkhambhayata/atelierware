import React, { useEffect, useState } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  Button,
  Spinner,
} from "reactstrap";
import Icon from "../../../../Components/icon/Icon";
import ExportIcon from "../../../../images/icons/export-icon.svg";
import { saveAs } from "file-saver";
// import xlsx from 'xlsx';
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";

import Papa from "papaparse";
import { getExportData } from "../../../../redux/actions/orderDetailAction";
import { getItemExportData } from "../../../../redux/actions/itemDetailAction";
import { toast } from "react-toastify";
import { useLocation } from "react-router";
import { usePermissions } from "../../../Provider/PermissionsContext";

const Export = ({ ic }) => {
  const { handleAction } = usePermissions();

  const order = useSelector((state) => state?.orderDetails);
  const item = useSelector((state) => state?.itemDetails);
  const location = useLocation();
  const dispatch = useDispatch();
  const BU_Id = localStorage.getItem("BU_Id");
  // useEffect(() => {
  //   if (BU_Id) {
  //     if (location.pathname === "/dashboard" || location.pathname === "/") {
  //       dispatch(getExportData(ic == undefined ? "0" : ic, BU_Id));
  //     } else {
  //       dispatch(getItemExportData(ic == undefined ? "0" : ic, BU_Id));
  //     }
  //   }
  // }, [ic, location]);

  const [csvLoader, setCsvLoader] = useState(false);
  const [sheetLoader, setSheetLoader] = useState(false);
  const downloadSheet = () => {
    setSheetLoader(true);
    let data;
    if (location.pathname === "/dashboard" || location.pathname === "/") {
      dispatch(getExportData(ic == undefined ? "0" : ic, BU_Id)).then((res) => {
        if (res.data.success) {
          setSheetLoader(false);
          data = res.data.orderDetails;
          if (data && data.length > 0) {
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            const excelBuffer = XLSX.write(wb, {
              bookType: "xlsx",
              type: "array",
            });
            const blob = new Blob([excelBuffer], {
              type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(blob, "order_data.xlsx");
          } else {
            toast.error("No Data Available");
          }
        }
      });
    } else if (location.pathname == "/item-tracker") {
      dispatch(getItemExportData(ic == undefined ? "0" : ic, BU_Id)).then(
        (res) => {
          if (res.data.success) {
            setSheetLoader(false);
            data = res.data?.orderItemList;
            if (data && data.length > 0) {
              const ws = XLSX.utils.json_to_sheet(data);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
              const excelBuffer = XLSX.write(wb, {
                bookType: "xlsx",
                type: "array",
              });
              const blob = new Blob([excelBuffer], {
                type:
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              });
              saveAs(blob, "_data.xlsx");
            } else {
              toast.error("No Data Available");
            }
          }
        }
      );
    }
  };
  const save = () => {
    const data = item?.item?.orderItemList;
  };

  const downloadPDF = () => {
    let data;
    if (location.pathname === "/dashboard" || location.pathname === "/") {
      data = order?.order?.orderDetails;
      if (data && data.length > 0) {
        const selectedColumns = [
          "TOrdHdID",
          "TOrdNo",
          "TOrdDate",
          "OrdBarcode",
          "TrialDate",
          "DelDate",
          "CustName",
          "MobNo",
          "Email",
          "Address",
          "DelAdd",
          "DiscValue",
          "SalesmanName",
          "SalesType",
          "CustGSTIN",
        ]; // Replace with your column names

        // Filter the data to include only the selected columns
        const filteredData = data.map((row) => {
          const filteredRow = {};
          selectedColumns.forEach((col) => {
            filteredRow[col] = row[col];
          });
          return filteredRow;
        });

        const pdf = new jsPDF("l", "pt");

        const columns = selectedColumns;
        const rows = filteredData.map((obj) => columns.map((col) => obj[col]));

        pdf.autoTable({
          head: [columns],
          body: rows,
          theme: "plain",
          tableLineWidth: 0.1,
          showHead: "firstPage",
        });

        // Save the PDF to a file
        pdf.save("data.pdf");
      }
      // data = item?.item?.orderItemList;
    } else if (location.pathname === "/item-tracker") {
      data = item?.item?.orderItemList;
      if (data && data.length > 0) {
        const selectedColumns = [
          "TOrdDtId",
          "TOrdHdID",
          "SrNo",
          "ItemId",
          "ItemName",
          "barcode",
          "DelDate",
          "TrialDate",
          "DesignerId",
          "MasterId",
          "Rate",
          "DisPer",
          "DisAmt",
          "VatPerc",
          "SGSTPer",
          "CGSTPer",
          "ItemStatus",
          "NextPId",
          "LastUpdateddate",
        ]; // Replace with your column names

        // Filter the data to include only the selected columns
        const filteredData = data.map((row) => {
          const filteredRow = {};
          selectedColumns.forEach((col) => {
            filteredRow[col] = row[col];
          });
          return filteredRow;
        });

        const pdf = new jsPDF("l", "pt");

        const columns = selectedColumns;
        const rows = filteredData.map((obj) => columns.map((col) => obj[col]));

        pdf.autoTable({
          head: [columns],
          body: rows,
          theme: "plain",
          tableLineWidth: 0.1,
          showHead: "firstPage",
        });

        // Save the PDF to a file
        pdf.save("data.pdf");
      }
      // data = item?.item?.orderItemList;
    }
  };

  const downloadCSV = () => {
    setCsvLoader(true);
    let data;
    if (location.pathname === "/dashboard" || location.pathname === "/") {
      dispatch(getExportData(ic == undefined ? "0" : ic, BU_Id)).then((res) => {
        if (res.data.success) {
          setCsvLoader(false);
          data = res.data.orderDetails;
          if (data && data.length > 0) {
            const csv = Papa.unparse(data);
            const blob = new Blob([csv], {
              type: "text/csv;charset=utf-8;",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "order_data.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // saveAs(blob, "order_data.xlsx");
          } else {
            toast.error("No Data Available");
          }
        } else {
          toast.error("Failed to fetch data");
        }
      });
    } else if (location.pathname === "/item-tracker") {
      dispatch(getItemExportData(ic == undefined ? "0" : ic, BU_Id)).then(
        (res) => {
          if (res.data.success) {
            setCsvLoader(false);

            data = res.data?.orderItemList;
            if (data && data.length > 0) {
              const csv = Papa.unparse(data);
              const blob = new Blob([csv], {
                type: "text/csv;charset=utf-8;",
              });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "item_data.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }
        }
      );
    }
  };

  return (
    <UncontrolledDropdown className="user-dropdown">
      <DropdownToggle tag="a" className="">
        <Button outline color="light" className="mt-2 mb-2">
          <img src={ExportIcon} alt="ExportIcon" className="mx-2" />
          Export
        </Button>
      </DropdownToggle>
      <DropdownMenu
        className="dropdown-menu-s1 mt-0 ps-2 pt-1"
        style={{ width: "2px" }}
      >
        <div className="dropdown-body">
          <ul>
            {/* <li onClick={() => downloadPDF()} style={{ cursor: "pointer" }}>
              PDF
            </li> */}
            {csvLoader ? (
              <li>
                <Spinner size="sm" color="light" />
              </li>
            ) : (
              <li
                onClick={() =>
                  handleAction(
                    location.pathname == "/dashboard"
                      ? "BtnOrdTrckrExportCSV"
                      : "BtnItemTrckrExportCSV",
                    // "printwotracker",

                    "action",
                    downloadCSV
                  )
                }
                style={{ cursor: "pointer" }}
              >
                CSV
              </li>
            )}
            {sheetLoader ? (
              <Spinner size="sm" color="light" />
            ) : (
              <li
                onClick={() =>
                  handleAction(
                    // "printwotracker",
                    location.pathname == "/dashboard"
                    ? "BtnOrdTrckrExportXLSX"
                    : "BtnItemTrckrExportXLSX",
                    "action",
                    downloadSheet
                  )
                }
                style={{ cursor: "pointer" }}
              >
                XLSX
              </li>
            )}
          </ul>
        </div>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default Export;

import React, { useState } from "react";
import Barcode from "react-barcode";
import { useSelector } from "react-redux";

const WorksheetHeader = ({worksheetData}) => {
  // const { worksheetData } = useSelector((state) => state?.worksheetData);


  return (
    <div className="invoice_header">
      <div className="d-flex justify-content-between align-items-center">
        <div className="header_text">
          <div className="title_ans_text">
            <div className="in_text">CLIENT</div>
            <div className="in_number">{worksheetData?.ordhead?.CustName}</div>
          </div>
          <div className="title_ans_text">
            <div className="in_text">Item</div>
            <div className="in_number">
              {worksheetData?.TOrdDtls?.ItemName}
            </div>
          </div>
          <div className="title_ans_text">
            <div className="in_text">DESIGNER</div>
            <div className="in_number">
              {worksheetData?.ordhead?.SalesmanName}
            </div>
          </div>
        </div>

        <div className="invoice_image">
          <img
            src={worksheetData?.Company?.Logo}
            alt=""
            // className="img-fluid in_img"
            style={{width:"50px",height:"50px"}}
          ></img>
          
        </div>

        <div className="barcode_image_text">
          <div className="barcode_image">
            <div className="barcode_text text-center">{worksheetData?.TOrdDtls?.barcode}</div>
            <Barcode value={`*${worksheetData?.TOrdDtls?.barcode}*`}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorksheetHeader;

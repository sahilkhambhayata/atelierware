import React, { useState } from "react";
import { useSelector } from "react-redux";
import Accordion from "react-bootstrap/Accordion";
import DownArrowIcon from "./../../../../images/icons/up-arrow.svg";

const NetPayableData = () => {
  let orderList = useSelector((state) => state.groupOrderList);
  const getConfig = useSelector((state) => state?.config?.orderType);

  const [isNetPayment, setIsNetPayment] = useState(false);
  const RoundUpToDecimal =
    getConfig?.RoundUpToDecimal == 0 ||
    getConfig?.RoundUpToDecimal == undefined ||
    getConfig?.RoundUpToDecimal == null
      ? 2
      : getConfig?.RoundUpToDecimal;
  const handleAccordionToggle = () => {
    setIsNetPayment(!isNetPayment);
  };
  const symbol = localStorage.getItem("countrySymbol");
  return (
    <div className="">
      <Accordion className="bg-gray10 border rounded-2">
        <Accordion.Item eventKey="0">
          <Accordion.Header
            className="bg-gray10"
            onClick={handleAccordionToggle}
          >
            <div className="fw-bold w-100 bg-light d-flex justify-content-between align-items-center border px-3 rounded-2 py-1 bg-gray10">
              <span>Net Payable</span>
              <div className="w-25">
                <div
                  // style={{ backgroundColor: "#E4E6EA" }}
                  className="p-1 d-flex justify-content-between text-center rounded-2 py-2 bg-gray1"
                >
                  <img
                    src={DownArrowIcon}
                    alt="DownArrowIcon"
                    width={"16px"}
                    className="mx-1 ctransition-05"
                    style={{
                      rotate: isNetPayment ? "0deg" : "180deg",
                    }}
                  />
                  <span>
                    {symbol} {orderList?.orderData?.Order?.OrdAmt}
                  </span>
                </div>
              </div>
            </div>
          </Accordion.Header>
          <Accordion.Body className="px-2 mt-2">
            <div className="fw-bold fs-16">Order Summary</div>
            <div className="d-flex justify-content-between p-1 w-100 fs-12">
              <span>Total Basic Amt</span>
              <span>
                {symbol}{" "}
                {(
                  orderList?.orderData?.Order?.totalBasicAmt +
                  orderList?.orderData?.Order?.TotalFabAmt
                )?.toFixed(RoundUpToDecimal)}
              </span>
            </div>
            <div className="d-flex justify-content-between p-1 w-100 fs-12">
              <span>Total Discount</span>
              <span>
                {symbol} {orderList?.orderData?.Order?.totalDisAmt}
              </span>
            </div>
            <div className="d-flex justify-content-between  w-100 fs-12">
              <span>Total Taxable Amt</span>
              <span>
                {symbol}{" "}
                {(
                  orderList?.orderData?.Order?.totalBasicAmt +
                  orderList?.orderData?.Order?.TotalFabAmt
                )?.toFixed(RoundUpToDecimal) -
                  orderList?.orderData?.Order?.totalTaxAmt}
              </span>
            </div>
            <div className="d-flex justify-content-between p-1 w-100 fs-12">
              <span>Total Tax</span>
              <span>
                {symbol} {(orderList?.orderData?.Order?.totalTaxAmt)?.toFixed(RoundUpToDecimal)}
              </span>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default NetPayableData;

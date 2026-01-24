import React, { useState } from "react";
import Button from "../../../../Components/button/Button";
import { Modal } from "reactstrap";

import Cimages from "./../../Images/CommonImageFile";
import Cicon from "./../../Images/CommonIconFile";

import PayNowModel from "../EditOrder/PayNowModel";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomBalanceCell = ({ balanceData }) => {
  const [isPayment, setIsPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const { handleAction } = usePermissions();

  const handlePayment = () => {
    // e.stopPropagation();
    setIsPayment(true);
  };
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
  const balance =
    balanceData.balanceData.OrdAmt - balanceData.balanceData.TotalPaid;
  return (
    <div>
      <div className="balance td-padding">
        <div className="text-center paid-val">
          {Math.floor(balance)}
          <span className="fontvariant">
            {(balance % 1)?.toFixed(2).slice(2)}
          </span>
        </div>

        {balanceData.balanceData.OrdAmt > 0 && (
          <div className="balance-btn text-center mt-0">
            <Button
              outline
              color="light"
              id="BtnOrdTrckrPayment"
              onClick={() =>
                handleAction(
                  "BtnOrdTrckrPayment",
                  "action",
                  handlePayment
                  // balanceData.balanceData
                )
              }
            >
              <img src={Cicon.balanceIcon} alt="balance icon" />
              <span className="ms-1">Pay Now</span>
            </Button>
          </div>
        )}
      </div>
      <div className="">
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
          <PayNowModel
          TOrdHdID={balanceData.balanceData.TOrdHdID}
          AccountId={balanceData.balanceData.AccountId}
            onPaymentMethod={handlePaymentMethod}
            onPaymentModal={handlePaymentModal}
            onPaymentDelete={handlePaymentDelete}
            onForm={handleDispalyForm}
            onSummary={handleDisplaySummary}
            // tab="other"
          />
        </Modal>
      </div>
    </div>
  );
};

export default CustomBalanceCell;

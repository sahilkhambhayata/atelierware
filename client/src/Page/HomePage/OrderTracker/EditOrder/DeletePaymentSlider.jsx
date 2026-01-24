import React, { useState } from "react";
import { Button, Spinner } from "reactstrap";
import viewIcon from "../../../../images/icons/viewIcon.svg";
import PaymentInputInfoIcon from "../../../../images/icons/payment-input-info-icon.svg";
import { Tooltip as ReactTooltip } from "react-tooltip";
import DeleteItemIcon from "../../../../images/icons/delete-item-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { deletePayment } from "../../../../redux/actions/paymentSubmitAction";
import { toast } from "react-toastify";
import { getGroupOrderListAsyncData } from "../../../../redux/actions/groupOrderListAction";
import { useTheme } from "../../../../Layout/Provider/Themes";

import backArrowIcon from "./../../../../images/icons/backArrowIcon.svg";

const DeletePaymentSlider = ({ togglePaymentSidebar, selectedPaymentMood }) => {
  const { tabId } = useTheme();
  const [confirmText, setConfirmText] = useState("");
  const TOrdHdId = localStorage.getItem(`TOrdHdID${tabId}`);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const dispatch = useDispatch();
 
  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setConfirmText(newValue);
  };

  
  const handleVerify = () => {
    setDeleteLoader(true);
    try {
      const data = {
        vouno: selectedPaymentMood.VouNo,
        TrId: selectedPaymentMood.TrId,
        TOrdHdId: TOrdHdId,
      };
      dispatch(deletePayment(data)).then((res) => {
        if (res.success) {
          dispatch(getGroupOrderListAsyncData(TOrdHdId)).then((response) => {
            
            if (response) {
              setDeleteLoader(false);
              setConfirmText("");
              toast.success(res.message);
              togglePaymentSidebar(false);
            } else {
              toast.error(res.message);
            }
          });
        }
      });
      // dispatch(verifyOrderDeleteOtp(conSelectedRowsNum, email, otp));
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleToggleSidebar = () => {
    togglePaymentSidebar(false);
  };

  return (
    <div>
      <Button outline color="light" onClick={handleToggleSidebar}>
      <img
          src={backArrowIcon}
          alt="viewIcon"
          // style={{
          //   rotate: "180deg",
          // }}
        />
        <span className="ms-1">Back</span>
      </Button>

      <div className="d-flex align-items-center mt-2 mb-2">
        <span className="fs-5 fw-bold">Delete Payment</span>
        <div className="ms-2 p-0">
          {/* <div className="d-flex text-dark" data-tooltip-id="my-tooltip-1">
            <img src={PaymentInputInfoIcon} alt="PaymentInputInfoIcon" />
          </div>

          <ReactTooltip
            id="my-tooltip-1"
            place="end"
            variant=""
            effect="solid"
            content="Lorem ipsum dolor sit amet, consectetuer adipiscing elit"
            style={{
              outlineBottom: "4px solid #db2314",
              padding: "10px",
              zIndex: "999999 !important",
            }}
            className="p-2 border-bottom border-2 border-danger"
          /> */}
        </div>
      </div>

      <div className="bg-light p-3 d-flex ">
        <div>
          <img src={DeleteItemIcon} alt="" width={70} />
        </div>
        <div className="ms-4">
          <ul style={{ listStyleType: "disc" }} className="text-justify">
            <li>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Perferendis, vero. Vero quae, magni amet repellat magnam ipsum
              accusamus tenetur.
            </li>
            <li>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam,
              quos molestiae?
            </li>
            <li>Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
          </ul>
        </div>
      </div>

      <div className="d-flex align-items-center mt-2 mb-2">
        <span className="fs-5 fw-bold">Payment</span>
        <div className="ms-2 p-0">
          <div className="d-flex text-dark" data-tooltip-id="my-tooltip-1">
            <img src={PaymentInputInfoIcon} alt="PaymentInputInfoIcon" />
          </div>

          <ReactTooltip
            id="my-tooltip-1"
            place="end"
            variant=""
            effect="solid"
            content="Lorem ipsum dolor sit amet, consectetuer adipiscing elit"
            style={{
              outlineBottom: "4px solid #db2314",
              padding: "10px",
              zIndex: "999999 !important",
            }}
            className="p-2 border-bottom border-2 border-danger"
          />
        </div>
      </div>

      <div className="px-3 py-2 border rounded-sm d-flex justify-content-between">
        <div>
          <span>{selectedPaymentMood?.Date}</span>
        </div>

        <div>
          <span>{selectedPaymentMood?.VouNo}</span>
        </div>
        <div>
          <span>
            {selectedPaymentMood?.PaymentMode !== null
              ? selectedPaymentMood?.PaymentMode
              : "Cash Discount"}
          </span>
        </div>
        <div>
          <span>{selectedPaymentMood?.Amount}</span>
        </div>
      </div>

      <div className="mt-5">
        <span className="fs-5 fw-bold">Permanently delete objects?</span>
      </div>
      <div className=" w-50 p-2">
        <div>
          To confirm deletion, type <i><b>permanently delete</b></i> in the text input
          field.
        </div>

        <div>
          <input
            type="text"
            id="default-01"
            value={confirmText}
            onChange={handleTextChange}
            placeholder="Search"
            className="form-control-lg form-control pl-4 mb-2 "
          />
        </div>
      </div>
      <div className="d-flex justify-content-end ">
        <Button
          color="light"
          onClick={() => setConfirmText("")}
          className="mr-2"
        >
          <span className="ms-1">Cancel</span>
        </Button>

        {deleteLoader ? (
          <Spinner size="sm" className="mx-1 " />
        ) : (
          <Button
            color="light"
            onClick={handleVerify}
            disabled={!confirmText || confirmText !== "permanently delete"}
            className="btn btn-light"
          >
            Delete Object
          </Button>
        )}
      </div>
    </div>
  );
};

export default DeletePaymentSlider;

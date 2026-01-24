import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";

import {
  Button,
  DropdownMenu,
  DropdownToggle,
  UncontrolledTooltip,
  UncontrolledDropdown,
  Spinner,
} from "reactstrap";

import DeleteItemIcon from "../../../../images/icons/delete-item-icon.svg";
import viewIcon from "../../../../images/icons/viewIcon.svg";
import { Tooltip as ReactTooltip } from "react-tooltip";
import PaymentInputInfoIcon from "../../../../images/icons/payment-input-info-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  // getOrderDetailsAsyncData,
  // getSingleOrder,
  sendOrderDeleteOtp,
  verifyOrderDeleteOtp,
} from "../../../../redux/actions/orderDetailAction";

import { BlockDes } from "../../../../Components/Block/Block";
import { toast } from "react-toastify";
import backArrowIcon from "./../../../../images/icons/backArrowIcon.svg";

import { useNavigate } from "react-router";
import { useTheme } from "../../../../Layout/Provider/Themes";

const DeleteSliderViewToEdit = ({
  setMood,
  toggleSidebar,
  // onChangeMood
}) => {
  const { tabId } = useTheme();
  const getConfig = useSelector((state) => state?.config?.orderType);
  const RoundUpToDecimal =
    getConfig?.RoundUpToDecimal == 0 ||
    getConfig?.RoundUpToDecimal == undefined ||
    getConfig?.RoundUpToDecimal == null
      ? 2
      : getConfig?.RoundUpToDecimal;
  const email = useSelector(
    (state) => state?.loginUser?.user?.user?.RecoveryEmail
  );

  const [otp, setOtp] = useState("");
  const [sendOTP, setSendOTP] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const dispatch = useDispatch();
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();
  const conSelectedRows = [localStorage.getItem(`TOrdHdID${tabId}`)];

  // const handleOTP = () => {
  //   setSendOTP(true);
  //   dispatch(sendOrderDeleteOtp(conSelectedRows, email)).then((res) => {
  //
  //     if (res?.data?.success == true) {
  //       toast.success(res.data.message);

  //       setIsCountingDown(true);
  //     } else {
  //       toast.error(res.data.message);
  //     }
  //   });
  // };

  // const handleVerify = () => {
  //   try {
  //     dispatch(verifyOrderDeleteOtp(email, otp)).then((res) => {
  //
  //       if (res.success) {
  //         toast.success(res.message);
  //         toggleSidebar(false);
  //       }
  //       // if (res == false || res == undefined) {
  //       else {
  //         toast.error(res.message);
  //       }
  //     });
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }
  // };

  // const [isConfirm, setIsConfirm] = useState(false);

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setConfirmText(newValue);
  };

  // const [openedRow, setOpenedRow] = useState(-1);

  const handleOTP = () => {
    setSendOTP(true);
    dispatch(sendOrderDeleteOtp(conSelectedRows, email)).then((res) => {
      if (res?.data?.success == true) {
        toast.success(res.data.message);

        setIsCountingDown(true);
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const handleVerify = () => {
    setIsLoader(true);
    try {
      dispatch(verifyOrderDeleteOtp(email, otp)).then((res) => {
        if (res.success) {
          setIsLoader(false);
          toggleSidebar(false);
          handleResendClick();
          // toast.success(res.message);
          setMood("edit");
          localStorage.setItem(`mood${tabId}`, "edit");
          // onChangeMood("edit");
        }
        // if (res == false || res == undefined) {
        else {
          setIsLoader(false);
          toast.error(res.message);
        }
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    if (isCountingDown) {
      startCountdown();
    }
  }, [isCountingDown]);

  const handleResendClick = () => {
    if (!isCountingDown) {
      setIsCountingDown(true);
      setCountdown(60);
      startCountdown();
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(timer);
          setIsCountingDown(false);
          return 10; // Reset the countdown to 180 seconds
        }
        return prevCountdown - 1;
      });
    }, 1000); // Update the countdown every 1 second
  };

  const handleOTPChange = (e) => {
    const newValue = e.target.value;
    setOtp(newValue);
  };

  // const handleToggleSidebar = () => {
  //   toggleSidebar(false); // Toggle the sidebar
  // };
  const handleToggleSidebar = () => {
    setIsCountingDown(false); // Stop the countdown
    setCountdown(60); // Reset the countdown value
    setSendOTP(false); // Toggle the sendOTP state
    toggleSidebar(false); // Toggle the sidebar
  };

  return (
    <div className="overflow-auto">
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
        <span className="fs-5 fw-bold">Edit Order</span>
        <div className="ms-2 p-0">
          {/* <div className="d-flex text-dark" data-tooltip-id="my-tooltip-1">
            <img src={PaymentInputInfoIcon} alt="PaymentInputInfoIcon" />
          </div>

          <ReactTooltip
            // end
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
        <span className="fs-5 fw-bold">Order</span>
        <div className="ms-2 p-0">
          <div className="d-flex text-dark" data-tooltip-id="my-tooltip-1">
            <img src={PaymentInputInfoIcon} alt="PaymentInputInfoIcon" />
          </div>

          <ReactTooltip
            // end
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

      <div className="mt-2 w-50 p-2">
        <div>An OTP will be send to your Admin Email </div>
        <div>
          {/* <span className="fw-bold">{email}</span> */}
        </div>
        <div className={`${!sendOTP ? "d-none" : "d-block"}`}>
          <div>
            <span
              style={{
                color: "red",
                cursor: isCountingDown ? "not-allowed" : "pointer",
              }}
              onClick={handleResendClick}
            >
              {isCountingDown ? (
                <div className="d-flex justify-content-end">
                  <BlockDes>Resend OTP({countdown}s)</BlockDes>
                </div>
              ) : (
                <div className="d-flex justify-content-end" onClick={handleOTP}>
                  Resend OTP
                </div>
              )}
            </span>
          </div>
          <input
            type="text"
            id="default-01"
            value={otp}
            onChange={handleOTPChange}
            placeholder="Enter OTP"
            className="form-control-lg form-control pl-4 mb-2 "
          />
        </div>

        {!sendOTP ? (
          <Button color="light" onClick={handleOTP}>
            <span className="ms-1">Send OTP</span>
          </Button>
        ) : isLoader ? (
          <>
            <span>
              <Spinner size="sm" color="light" className="mx-1 py-1" />
            </span>
          </>
        ) : (
          <Button color="light" onClick={handleVerify}>
            <span className="ms-1">Verify</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default DeleteSliderViewToEdit;

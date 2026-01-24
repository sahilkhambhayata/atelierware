import React, { useState } from "react";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
} from "../../../Components/Block/Block";
import swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

import { Form, Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "../../../Components/icon/Icon";
import Button from "../../../Components/button/Button";
import Logo from "../../../images/logo.png";
import ErrorIcon from "../../../images/icons/error-icon2.jpg";
import SuccessIcon from "../../../images/icons/Vector.jpg";

import LogoDark from "../../../images/logo-dark.png";
import { PreviewCard } from "../../../Components/preview/Preview";
// import Head from "../../../Layout/head/Head";
import { useDispatch } from "react-redux";
import {
  ChangePasswordAction,
  ResetForgetPassword,
} from "../../../redux/actions/loginAction";
import AuthFooter from "../AuthFooter/AuthFooter";
import Head from "../../../Layout/head/Head";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const stateData = localStorage.getItem("email");

  const [loading, setLoading] = useState(false);
  const [oldPassState, setOldPassState] = useState(false);
  const [passState, setPassState] = useState(false);
  const [conpassState, setConpassState] = useState(false);
  const [errorVal, setError] = useState("");
  const [countdown, setCountdown] = useState(5); // Initial countdown value in seconds

  const onFormSubmit = (formData) => {
    setLoading(true);

    if (formData.password == formData.confirmpassword) {
      // setModal(true);
      // startCountdown();
      dispatch(
        ChangePasswordAction(
          formData.oldPassword,
          formData.password,
          formData.confirmpassword
        )
      ).then((data) => {
        if (data?.success === true) {
          localStorage.clear();
          setLoading(false);
          reset();
          startCountdown();
          toast.success(data.message);
        } else {
          setLoading(false);
          reset();

          toast.error(data.message);
        }
      });
    } else {
      setTimeout(() => {
        setError("Password And Confirm Password Does Not Match");
        setLoading(false);
      }, 1000);
    }
  };

  const startCountdown = () => {
    let timerInterval;
    let remainingTime = countdown;
    let isPopupOpen = false;

    swal
      .fire({
        width: "100px!important",
        title: "Password changed successfully",
        html: `Taking you to Login Page in <b>${remainingTime}</b> seconds.<br><br>Click here to go to <a href ="/" style="color:red;" }}><u>Login Page</u></a>.`,
        imageUrl: SuccessIcon,
        showConfirmButton: false,
        timer: countdown * 1000,
        customClass: {
          container: "custom-sweetalert-container",
        },
        onClose: () => {
          clearInterval(timerInterval);
          setCountdown();
          if (isPopupOpen) {
            navigate("/");
          }
        },
      })
      .then((result) => {
        if (result.dismiss === swal.DismissReason.timer) {
          isPopupOpen = false;
          setCountdown();
          navigate("/");
        }
      });
    isPopupOpen = true;
    timerInterval = setInterval(() => {
      remainingTime--;
      setCountdown(remainingTime);

      if (isPopupOpen) {
        swal.update({
          html: `Taking you to Login Page in <b>${remainingTime}</b> seconds.<br><br>Click here to go to <a href="/" style="color:red;"><u>Login Page</u></a>.`,
          customClass: {
            container: "custom-sweetalert-container",
          },
        });
      }

      if (remainingTime <= 0) {
        setCountdown();
        if (isPopupOpen) {
          navigate("/");
          isPopupOpen = false;
        }
      }
    }, 1000);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  return (
    <>
      <Head title="Change Password"></Head>
      <div className="nk-app-root nk-auth">
        <div
          className={`${location.pathname === "/dashboard" &&
            "nk-wrap nk-wrap-nosidebar"}`}
        >
          <div className="nk-content">
            <Block className="nk-block-middle nk-auth-body  wide-xs">
              <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
                <div className="brand-logo pb-4 text-start">
                  <Link
                    to={import.meta.env.PUBLIC_URL + "/"}
                    className="logo-link"
                  >
                    <img
                      className="logo-light logo-img logo-img-lg"
                      src={Logo}
                      alt="logo"
                    />
                    <img
                      className="logo-dark logo-img logo-img-lg"
                      src={LogoDark}
                      alt="logo-dark"
                    />
                  </Link>
                </div>
                <BlockHead>
                  <BlockContent>
                    <BlockTitle tag="h4">Set New Password</BlockTitle>
                    <BlockDes>
                      <p>Access Dashlite using your email and password.</p>
                    </BlockDes>
                  </BlockContent>
                </BlockHead>

                <Form
                  className="is-alter"
                  onSubmit={handleSubmit(onFormSubmit)}
                >
                  <div className="form-group">
                    <div className="form-label-group">
                      <label className="form-label" htmlFor="password">
                        Old Password
                      </label>
                    </div>
                    <div className="form-control-wrap">
                      <a
                        href="#password"
                        onClick={(ev) => {
                          ev.preventDefault();
                          setOldPassState(!oldPassState);
                        }}
                        className={`form-icon lg form-icon-right passcode-switch ${
                          oldPassState ? "is-hidden" : "is-shown"
                        }`}
                      >
                        <Icon
                          name="eye"
                          className="passcode-icon icon-show"
                        ></Icon>

                        <Icon
                          name="eye-off"
                          className="passcode-icon icon-hide"
                        ></Icon>
                      </a>
                      <input
                        type={oldPassState ? "text" : "password"}
                        id="oldPassword"
                        {...register("oldPassword", {
                          required: "This field is required",
                        })}
                        defaultValue=""
                        placeholder="Enter your password"
                        className={`form-control-lg form-control ${
                          oldPassState ? "is-hidden" : "is-shown"
                        }`}
                      />
                      {/* {errors.passcode && (
                        <span className="invalid">
                          {errors.passcode.message}
                        </span>
                      )} */}
                    </div>
                  </div>

                  {/* password */}
                  <div className="form-group">
                    <div className="form-label-group">
                      <label className="form-label" htmlFor="password">
                        New Password
                      </label>
                    </div>
                    <div className="form-control-wrap">
                      <a
                        href="#password"
                        onClick={(ev) => {
                          ev.preventDefault();
                          setPassState(!passState);
                        }}
                        className={`form-icon lg form-icon-right passcode-switch ${
                          passState ? "is-hidden" : "is-shown"
                        }`}
                      >
                        <Icon
                          name="eye"
                          className="passcode-icon icon-show"
                        ></Icon>

                        <Icon
                          name="eye-off"
                          className="passcode-icon icon-hide"
                        ></Icon>
                      </a>
                      <input
                        type={passState ? "text" : "password"}
                        id="password"
                        {...register("password", {
                          required: "This field is required",
                        })}
                        defaultValue=""
                        placeholder="Enter your password"
                        className={`form-control-lg form-control ${
                          passState ? "is-hidden" : "is-shown"
                        }`}
                      />
                      {/* {errors.passcode && (
                        <span className="invalid">
                          {errors.passcode.message}
                        </span>
                      )} */}
                    </div>
                  </div>

                  {/* confirm password */}
                  <div className="form-group">
                    <div className="form-label-group">
                      <label className="form-label" htmlFor="password">
                        Confirm Password
                      </label>
                    </div>
                    <div className="form-control-wrap">
                      <a
                        href="#password"
                        onClick={(ev) => {
                          ev.preventDefault();
                          setConpassState(!conpassState);
                        }}
                        className={`form-icon lg form-icon-right passcode-switch ${
                          conpassState ? "is-hidden" : "is-shown"
                        }`}
                      >
                        <Icon
                          name="eye"
                          className="passcode-icon icon-show"
                        ></Icon>

                        <Icon
                          name="eye-off"
                          className="passcode-icon icon-hide"
                        ></Icon>
                      </a>
                      <input
                        type={conpassState ? "text" : "password"}
                        id="confirmpassword"
                        {...register("confirmpassword", {
                          required: "This field is required",
                        })}
                        defaultValue=""
                        placeholder="Enter your password"
                        className={`form-control-lg form-control ${
                          passState ? "is-hidden" : "is-shown"
                        }`}
                      />
                      {/* {errors.confirmpasscode && (
                        <span className="invalid">
                          {errors.confirmpasscode.message}
                        </span>
                      )} */}
                    </div>
                  </div>
                  <div className="my-2">
                    {errorVal && (
                      <span style={{ color: "red" }} className="py-1">
                        <img
                          className="logo-img logo-img-lg mr-3"
                          src={ErrorIcon}
                          alt="error"
                        />{" "}
                        {errorVal}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <Button
                      size="lg"
                      className="btn-block"
                      type="submit"
                      color="primary"
                    >
                      {loading ? <Spinner size="sm" color="light" /> : "Submit"}
                      {/* Sign in */}
                    </Button>
                  </div>
                </Form>
              </PreviewCard>
            </Block>
            <AuthFooter />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;

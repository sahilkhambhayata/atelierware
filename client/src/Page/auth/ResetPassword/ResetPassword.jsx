import React, { useState } from "react";
import Logo from "../../../images/logo.png";
import LogoDark from "../../../images/logo-dark.png";
import Icon from "../../../Components/icon/Icon";
import ErrorIcon from "../../../images/icons/error-icon2.jpg";
import Button from "./../../../Components/button/Button";
import { useLocation, useNavigate } from "react-router";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
} from "../../../Components/Block/Block";
import { Link } from "react-router-dom";
import { PreviewCard } from "../../../Components/preview/Preview";
import { Form, Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import infoIcon from "../../../images/icons/info-icon.svg";
import Head from "../../../Layout/head/Head";
import { useDispatch } from "react-redux";
import { forgetPassword } from "../../../redux/actions/loginAction";
import AuthFooter from "../AuthFooter/AuthFooter";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const dispatch = useDispatch();

  const onFormSubmit = (formData) => {
    setLoading(true);

    dispatch(forgetPassword(formData.name)).then((data) => {
      if (data?.success === true) {
        localStorage.setItem("email", formData.name);

        navigate("/otp-verify");
      } else {
        setTimeout(() => {
          setError("Old Password Not Matched");
          setLoading(false);
        }, 1);
      }
    });
    //
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <>
      <Head title="Reset Password" />
      <div className="nk-app-root nk-auth">
        <div
          className={`${location.pathname === "/dashboard" &&
            "nk-wrap nk-wrap-nosidebar"}`}
        >
          <div className="nk-content">
            <Block className="nk-block-middle nk-auth-body  wide-xs">
              {/* <div className="brand-logo pb-4 text-start">
              <Link to={import.meta.env.PUBLIC_URL + "/"} className="logo-link">
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
            </div> */}

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
                    <BlockTitle tag="h4">Reset Password</BlockTitle>
                    <BlockDes>
                      <p>
                        If you forgot your password, well, then we'll email you
                        instructions to reset your password.
                      </p>
                    </BlockDes>
                  </BlockContent>
                </BlockHead>

                <Form
                  className="is-alter"
                  onSubmit={handleSubmit(onFormSubmit)}
                >
                  <div className="form-group">
                    <div className="form-label-group">
                      <label className="form-label" htmlFor="default-01">
                        Email
                      </label>
                    </div>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        id="default-01"
                        {...register("name", {
                          required: "This field is required",
                          pattern: {
                            value: emailPattern,
                            message: "Invalid email",
                          },
                        })}
                        defaultValue=""
                        placeholder="Enter your email address or username"
                        className="form-control-lg form-control"
                      />
                    </div>
                  </div>

                  {errors.name && (
                    <>
                      <div className="d-flex align-items-center">
                        <img src={infoIcon} alt="info icon" className="me-1" />
                        <p style={{ color: "red" }}>{errors.name?.message}</p>
                      </div>
                    </>
                  )}
                  <div className="form-group">
                    <Button
                      size="lg"
                      className="btn-block"
                      type="submit"
                      color="primary"
                    >
                      {loading ? (
                        <Spinner size="sm" color="light" />
                      ) : (
                        "Send OTP to Email"
                      )}
                      {/* Sign in */}
                    </Button>
                  </div>
                </Form>
                <div className="form-note-s2 text-center pt-4">
                  Return to{" "}
                  <Link to={`/`}>
                    <span style={{ color: "red" }}>Sign in</span>
                  </Link>
                </div>
              </PreviewCard>
            </Block>
            <AuthFooter />
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;

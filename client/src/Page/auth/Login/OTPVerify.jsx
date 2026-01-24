import React, { useEffect, useState } from "react";
import Logo from "../../../images/logo.png";
import LogoDark from "../../../images/logo-dark.png";
import Icon from "../../../Components/icon/Icon";
import Button from "./../../../Components/button/Button";
import { useLocation, useNavigate } from "react-router";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
} from "../../../Components/Block/Block";
import ErrorIcon from "../../../images/icons/error-icon2.jpg";
import { Link } from "react-router-dom";
import { PreviewCard } from "../../../Components/preview/Preview";
import { Form, Spinner, Alert, Col, Row } from "reactstrap";
import { useForm } from "react-hook-form";
import infoIcon from "../../../images/icons/info-icon.svg";
import Head from "../../../Layout/head/Head";

const OTPVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorVal, setErrors] = useState("");
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [countdown, setCountdown] = useState(180);
  // const [concatenatedOTP, setConcatenatedOTP] = useState("");

  // const [otp, setOTP] = useState("");

  const onFormSubmit = (formData) => {
    setLoading(true);

    if (formData.otp == "1111") {
      navigate("/dashboard");
    } else {
      setErrors("Please Enter Valid OTP");
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();



  const handleResendClick = () => {
    if (!isCountingDown) {
      setIsCountingDown(true);
      setCountdown(10);
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

  useEffect(() => {
    if (isCountingDown) {
      startCountdown();
    }
  }, []);
  return (
    <div>
      <Head title="OTP-Verify" />
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
                    <BlockTitle tag="h4">Enter OTP</BlockTitle>
                    <BlockDes>
                      <p>An 4 digit code has been sent</p>
                      <p>info@softnio.com</p>
                    </BlockDes>
                  </BlockContent>
                </BlockHead>

                <Form
                  className="is-alter"
                  onSubmit={handleSubmit(onFormSubmit)}
                >
                  <div className="form-group ">
                    <Row>
                      <Col>
                        <input
                          type="text"
                          id="default-01"
                          {...register("otp", {
                            required: "otp is required",
                          })}
                          maxLength={8}
                          minLength={4}
                          defaultValue=""
                          placeholder="Enter otp"
                          className="form-control-lg form-control"
                        />
                        {/* <Row className="g-2">
                          {otp.map((digit, index) => (
                            <Col className="">
                              <input
                                key={index}
                                id={`otpInput${index}`}
                                type="number"
                                className="w-100 form-control"
                                style={{ height: "36px", paddingLeft: "12px" }}
                                maxLength={1}
                                minLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyUp={(e) => handleKeyUp(e, index)}

                              />
                            </Col>
                          ))}
                        </Row> */}
                      </Col>
                      <Col className="d-none d-sm-block"></Col>
                    </Row>
                  </div>
                  <Row>
                    <Col className="py-2">
                      {errorVal && (
                        <>
                          <div className="d-flex align-items-center">
                            <img
                              src={infoIcon}
                              alt="info icon"
                              className="me-1"
                            />
                            <p style={{ color: "red" }}>{errorVal}</p>
                          </div>
                        </>
                      )}
                    </Col>
                    <Col className="form-note-s2 text-end py-2">
                      <span
                        style={{
                          color: "red",
                          cursor: isCountingDown ? "not-allowed" : "pointer",
                        }}
                        onClick={handleResendClick}
                      >
                        {isCountingDown ? (
                          <BlockDes>Resend OTP({countdown}s)</BlockDes>
                        ) : (
                          "Resend OTP"
                        )}
                      </span>
                    </Col>
                  </Row>
                  <div className="form-group">
                    <Button
                      size="lg"
                      className="btn-block"
                      type="submit"
                      color="primary"
                      // disabled={errorVal}
                    >
                      {loading ? <Spinner size="sm" color="light" /> : "Verify"}
                      {/* Sign in */}
                    </Button>
                  </div>
                </Form>
                {/* <div className="form-note-s2 text-center pt-4">
                  Return to{" "}
                  <Link to={`/`}>
                    <span style={{ color: "red" }}>Sign in</span>
                  </Link>
                </div> */}
              </PreviewCard>
            </Block>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerify;

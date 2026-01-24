import React, { useEffect, useState } from "react";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
} from "../../../Components/Block/Block";
import { Form, Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "../../../Components/icon/Icon";
import Button from "../../../Components/button/Button";
import Logo from "../../../images/logo.png";
import LogoDark from "../../../images/logo-dark.png";
import { PreviewCard } from "../../../Components/preview/Preview";
import Head from "../../../Layout/head/Head";
import infoIcon from "../../../images/icons/info-icon.svg";


const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const onFormSubmit = (formData) => {
    setLoading(true);
    const name = "";
    const loginName = "";
    const pass = "";
    // navigate("/dashboard");
    // window.history.pushState(
    //         `${import.meta.env.PUBLIC_URL ? import.meta.env.PUBLIC_URL : "/dashboard"}`,
    //         "auth-login",
    //         `${import.meta.env.PUBLIC_URL ? import.meta.env.PUBLIC_URL : "/dashboard"}`
    //       );
    if (
      formData.name !== "" &&
      formData.passcode !== "" &&
      formData.email !== ""
    ) {
      localStorage.setItem("accessToken", "token");
      setTimeout(() => {
        window.history.pushState(
          `${import.meta.env.PUBLIC_URL ? import.meta.env.PUBLIC_URL : "/"}`,
          "auth-login",
          `${import.meta.env.PUBLIC_URL ? import.meta.env.PUBLIC_URL : "/"}`
        );
        window.location.reload();
      }, 1000);
    } else {
      setTimeout(() => {
        setError("Cannot Login With Credentials");
        setLoading(false);
      }, 1000);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <>
      <Head title="Register" />
      <div className="nk-app-root nk-auth">
        <div
          className={`${
            location.pathname === "/dashboard" && "nk-wrap nk-wrap-nosidebar"
          }`}
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
                    <BlockTitle tag="h4">Register</BlockTitle>
                    <BlockDes>
                      <p>
                        Access the Atelierware panel using your email and passcode.
                      </p>
                    </BlockDes>
                  </BlockContent>
                </BlockHead>

                <Form
                  className="is-alter"
                  onSubmit={handleSubmit(onFormSubmit)}
                >
                  {/* name */}
                  <div className="form-group">
                    <div className="form-label-group">
                      <label className="form-label" htmlFor="default-01">
                        Name
                      </label>
                    </div>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        id="default-01"
                        {...register("name", {
                          required: "Name field is required",
                        })}
                        defaultValue="softnio"
                        placeholder="Enter your name"
                        className="form-control-lg form-control"
                      />
                      {/* {errors.name && (
                        <span className="invalid">{errors.name.message}</span>
                      )} */}
                    </div>
                  </div>

                  {/* email */}
                  <div className="form-group">
                    <div className="form-label-group">
                      <label className="form-label" htmlFor="default-01">
                        Email or Username
                      </label>
                    </div>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        id="default-01"
                        {...register("email", {
                          required: "Email field is required",
                          pattern: {
                            value: emailPattern,
                            message: "Invalid email address",
                          },
                        })}
                        defaultValue="info@softnio.com"
                        placeholder="Enter your email address or username"
                        className="form-control-lg form-control"
                      />
                      {/* {errors.email && (
                        <span className="invalid">{errors.email.message}</span>
                      )} */}
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-label-group">
                      <label className="form-label" htmlFor="password">
                        Passcode
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
                        {...register("passcode", {
                          required: "Password field is required",
                        })}
                        defaultValue="123456"
                        placeholder="Enter your passcode"
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
                  <div>
                    {(errors.name || errors.email || errors.passcode) && (
                      <>
                        <div className="d-flex align-items-center">
                          <img
                            src={infoIcon}
                            alt="info icon"
                            className="me-1"
                          />
                          <p style={{ color: "red" }}>
                            {errors.name?.message ||
                              errors.email?.message ||
                              errors.passcode.message}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

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
                        "Sign in"
                      )}
                      {/* Sign in */}
                    </Button>
                  </div>
                </Form>
                <div className="form-note-s2 text-center pt-4">
                  Already have an account?{" "}
                  <Link to={`/`} className="link-primary">
                    Sign in instead
                  </Link>
                </div>
              </PreviewCard>
            </Block>
          </div>
        </div>
      </div>
      {/* <AuthFooter /> */}
    </>
  );
};

export default Register;

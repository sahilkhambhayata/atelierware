import React, { useEffect, useRef, useState } from "react";
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
import AuthFooter from "../AuthFooter/AuthFooter";
import slide1 from "../../../images/slides/promo-a.png";
import Slider from "react-slick";
import infoIcon from "../../../images/icons/info-icon.svg";
import closeIcon from "../../../images/icons/close-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "../../../redux/actions/loginAction";
import { permissionByRole } from "../../../redux/actions/Role/permissionByRoleAction";
import { getBranch } from "../../../redux/actions/branchAction";
import { toast, useToast } from "react-toastify";
import { getOrderCount } from "../../../redux/actions/orderCount";

const Login = () => {
  // space
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.loginUser);
  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");
  const [sliderActive, setSliderActive] = useState(false);
  const sliderRef = useRef(null);
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formValid, setFormValid] = useState(false);
  const dispatch = useDispatch();
  const id = localStorage.getItem("userId");
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const handleEmailChange = (e) => {
    const newValue = e.target.value;
    setEmail(newValue);
    validateForm(newValue, password);
  };

  const handlePasswordChange = (e) => {
    const newValue = e.target.value;
    setPassword(newValue);
    validateForm(email, newValue);
  };

  const [token, setToken] = useState("");
  const [data, setData] = useState({});
  const validateForm = (emailValue, passwordValue) => {
    const isEmailValid = emailPattern.test(emailValue);
    const isPasswordValid = passwordValue !== "";
    const isValid = isEmailValid && isPasswordValid;
    setFormValid(isValid);
  };
  const onFormSubmit = (formData) => {
    setLoading(true);
    dispatch(loginAdmin(email, password)).then((data) => {
      if (data?.success === true) {
        // // localStorage.setItem("token", data.user.Token);
        
        // setToken(data.user.Token);
        // setData(data);
      } else {
        toast.error(data.message);

        setTimeout(() => {
          setError(data.message);
          setLoading(false);
        }, 1000);
      }
    });
  };

  // useEffect(() => {
  //   if (token != "") {
  //     dispatch(getBranch(data.user.BranchId)).then((res) => {
  //       if (res.success === true) {
  //         localStorage.setItem("BU_Id", res.branch.BU_Id);
  //         localStorage.setItem("CompanyId", res.branch.Companyid);
  //         localStorage.setItem("BranchId", data.user.BranchId);
  //         localStorage.setItem("userId", data.user.UserId);
  //         localStorage.setItem("RoleId", data.user.RoleId);
  //         localStorage.setItem(
  //           "countrySymbol",
  //           data.user.MstBranch.country
  //             ? data.user.MstBranch.country.Currsymbol
  //             : ""
  //         );

  //         dispatch(getOrderCount());
  //         navigate("/dashboard");
  //       } else {
  //         console.log(res, "ERROR in getBranch");
  //         toast.error(res.message);
  //         setLoading(false);
  //       }
  //     });
  //   }
  // }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleClickToi = () => {
    setSliderActive(!sliderActive);
  };
  useEffect(() => {
    const idData = localStorage.getItem("userId");
    if (idData) {
      navigate("/dashboard");
    }
  }, [user]);

  return (
    <>
      {id ? (
        ""
      ) : (
        <>
          <Head title="Login" />
          <div className="nk-app-root nk-auth">
            <div className="nk-main">
              <div
                className={`${location.pathname === "/dashboard" &&
                  "nk-wrap nk-wrap-nosidebar"}`}
              >
                <div className="nk-content">
                  <div className="nk-split nk-split-page nk-split-lg">
                    <div className="nk-split-content nk-block-area nk-block-area-column nk-auth-container bg-white">
                      <div className="absolute-top-right d-lg-none p-3 p-sm-5">
                        <div
                          href="#"
                          className="toggle btn-white btn btn-icon btn-light"
                          onClick={handleClickToi}
                          ref={sliderRef}
                        >
                          <em className="icon ni ni-info"></em>
                        </div>
                      </div>
                      <Block className="nk-block-middle nk-auth-body ">
                        <div className="brand-logo pb-4 ">
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
                            <BlockTitle tag="h4">Sign-In</BlockTitle>
                            <BlockDes>
                              <p>
                                Access Atelierware using your email and
                                passcode.
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
                              <label
                                className="form-label"
                                htmlFor="default-01"
                              >
                                Email or Username
                              </label>
                            </div>
                            {/* <div className="form-control-wrap">
                          <input
                            type="text"
                            id="default-01"
                            {...register("name", {
                              required: "email is required",
                              pattern: {
                                value: emailPattern,
                                message: "Please enter valid email address.",
                              },
                            })}
                            defaultValue="info@softnio.com"
                            placeholder="Enter your email address or username"
                            className="form-control-lg form-control"
                          />

                        </div> */}
                            <input
                              type="text"
                              id="default-01"
                              value={email}
                              onChange={handleEmailChange}
                              placeholder="Enter your registered email"
                              className="form-control-lg form-control"
                            />
                          </div>
                          <div className="form-group">
                            <div className="form-label-group">
                              <label className="form-label" htmlFor="password">
                                Password
                              </label>
                              <Link
                                className="link text-danger link-sm"
                                to={`/reset-password`}
                              >
                                Forgot Password ?
                              </Link>
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
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="Enter your password"
                                className={`form-control-lg form-control ${
                                  passState ? "is-hidden" : "is-shown"
                                }`}
                              />
                            </div>
                          </div>
                          {/* <div>
                          {errors.name && (
                            <span className="text-danger">
                              <Icon name="exclamation"></Icon>
                              {errors.name.message}
                            </span>
                          )}
                        </div> */}

                          {errorVal && (
                            <>
                              <div className="d-flex align-items-center py-2">
                                <img
                                  src={infoIcon}
                                  alt="info icon"
                                  className="me-1"
                                />
                                <p style={{ color: "red" }}>{errorVal}</p>
                              </div>
                            </>
                          )}

                          <div className="form-group">
                            <Button
                              size="lg"
                              className="btn-block"
                              type="submit"
                              color="primary"
                              disabled={!formValid}
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
                        <div className="form-note-s2  pt-4">
                          New on our platform?{" "}
                          <Link to={`/register`} className="text-danger">
                            Create an account
                          </Link>
                        </div>
                      </Block>
                      <AuthFooter />
                    </div>
                    <div
                      className={`nk-split-content nk-split-stretch bg-lighter d-flex toggle-break-lg toggle-slide toggle-slide-right toggle-screen-lg ${sliderActive &&
                        "content-active cust_bg-white"}`}
                    >
                      <div className="absolute-top-right d-lg-none p-3 p-sm-4">
                        {/* <Icon
                      name="alert-circle"
                      onClick={() => setSliderActive(false)}
                    /> */}
                        <img
                          src={closeIcon}
                          alt="close"
                          className=""
                          onClick={() => setSliderActive(false)}
                        />
                      </div>
                      <div className="slider-wrap w-100 w-max-550px p-3 p-sm-5 m-auto">
                        <Slider
                          {...settings}
                          autoplay={true}
                          autoplaySpeed={2000}
                        >
                          <div className="nk-feature nk-feature-center ">
                            <div className="nk-feature-img">
                              <img className="round" src={slide1} alt="" />
                            </div>
                            <div className="nk-feature-content py-4 p-sm-5">
                              <h4>Atelierware</h4>
                              <p>
                                You can start to create your products easily
                                with its user-friendly design &amp; most
                                completed responsive layout.
                              </p>
                            </div>
                          </div>
                          <div className="nk-feature nk-feature-center">
                            <div className="nk-feature-img">
                              <img className="round" src={slide1} alt="" />
                            </div>
                            <div className="nk-feature-content py-4 p-sm-5">
                              <h4>Atelierware</h4>
                              <p>
                                You can start to create your products easily
                                with its user-friendly design &amp; most
                                completed responsive layout.
                              </p>
                            </div>
                          </div>
                          <div className="nk-feature nk-feature-center">
                            <div className="nk-feature-img">
                              <img className="round" src={slide1} alt="" />
                            </div>
                            <div className="nk-feature-content py-4 p-sm-5">
                              <h4>Atelierware</h4>
                              <p>
                                You can start to create your products easily
                                with its user-friendly design &amp; most
                                completed responsive layout.
                              </p>
                            </div>
                          </div>
                          <div className="nk-feature nk-feature-center">
                            <div className="nk-feature-img">
                              <img className="round" src={slide1} alt="" />
                            </div>
                            <div className="nk-feature-content py-4 p-sm-5">
                              <h4>Atelierware</h4>
                              <p>
                                You can start to create your products easily
                                with its user-friendly design &amp; most
                                completed responsive layout.
                              </p>
                            </div>
                          </div>
                          <div className="nk-feature nk-feature-center">
                            <div className="nk-feature-img">
                              <img className="round" src={slide1} alt="" />
                            </div>
                            <div className="nk-feature-content py-4 p-sm-5">
                              <h4>Atelierware</h4>
                              <p>
                                You can start to create your products easily
                                with its user-friendly design &amp; most
                                completed responsive layout.
                              </p>
                            </div>
                          </div>
                        </Slider>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Login;

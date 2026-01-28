import React, { useEffect, useRef, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  Form,
  DropdownItem,
  UncontrolledTooltip,
  Modal,
  ModalBody,
  Button,
  // Button,
} from "reactstrap";
import EmailIcon from "./../../../images/icons/email-icon.svg";

import CategoryIcon from "./../../../images/icons/add-order-caterory-icon.svg";
import LocationIcon from "./../../../images/icons/add-order-location-icon.svg";
import CallIcon from "./../../../images/icons/add-order-phone-icon.svg";
import BirthdayIcon from "./../../../images/icons/bod-icon.svg";
import AnniversoryIcon from "./../../../images/icons/anniversory-icon.svg";
import IndividualIcon from "./../../../images/icons/individual-icon.svg";
import GreenIndividualIcon from "./../../../images/icons/green-individual-icon.svg";
import CorporateIcon from "./../../../images/icons/corporate-icon.svg";
import TinIcon from "./../../../images/icons/add-order-tin-icon.svg";
import PaymentInputInfoIcon from "./../../../images/icons/payment-input-info-icon.svg";
import ProfileImageFrontIcon from "./../../../images/icons/profile-image-icon-front.svg";
import ProfileImagerightIcon from "./../../../images/icons/profile-image-icon-right.svg";
import ProfileImageLeftIcon from "./../../../images/icons/profile-image-icon-left.svg";
import ProfileImagebackIcon from "./../../../images/icons/profile-image-icon-back.svg";
import ProfileImageIcon from "./../../../images/icons/profile-image-icon.svg";
import imageUploadIcon from "./../../../images/icons/image-upload-icon.svg";
import DatePicker from "react-datepicker";
import ReactFlagsSelect from "react-flags-select";
// import Flag from "./../Flag"
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerStyle } from "../../../redux/actions/styleAction";
import { getSingleCountry } from "../../../redux/actions/countryAction";
import ToolTipContent from "../../../Components/Tooltip/ToolTipContent";
import Tooltip from "../../../Components/Tooltip/Tooltip";
import { getBranch } from "../../../redux/actions/branchAction";
import Webcam from "react-webcam";
import Icon from "../../../Components/icon/Icon";
import CameraIcon from "./../../../images/icons/camera-icon.svg";
import * as faceapi from "face-api.js";
import Resizer from "react-image-file-resizer";
import { debounce } from "lodash";

const EditPersonalDetailForm = ({ editSingleData, onDataChange }) => {
  const [isDropdownOpenCustType, setIsDropdownOpenCustType] = useState(false);
  const [isDropdownOpenStatus, setIsDropdownOpenStatus] = useState(false);
  const BU_Id = localStorage.getItem("BU_Id");
  const branch = localStorage.getItem("BranchId");

  const dispatch = useDispatch();

  const styleDetails = useSelector((state) => state.styleDetails);

  const { country } = useSelector((state) => state.countryDetails);

  const [data, setData] = useState({
    name: editSingleData?.AccName || "",
    address: editSingleData?.Address || "",
    countryCode: editSingleData?.countryCode || "IN",
    dialcode: editSingleData?.dialcode || "+91",
    mobileNo: editSingleData?.MobileNo || "",
    email: editSingleData?.Email || "",
    CustTypeId: editSingleData?.CustTypeId || null,
    category: "category",
    BODDate: editSingleData?.BirthDate
      ? new Date(editSingleData.BirthDate)
      : null,
    AniDate: editSingleData?.AnniDate
      ? new Date(editSingleData.AnniDate)
      : null,
    selectedStatus: editSingleData?.CustType || "",
    vatTno: editSingleData?.VatTNo || "",
  });

  const [error, setError] = useState("");
  const [mobError, setMobError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isMobFocused, setIsMobFocused] = useState(false);
  const [cameraModel, setCameraModel] = useState(false);

  
  useEffect(() => {
    if (editSingleData?.MobileNo) {
      // Extract country code from the mobile number
      const countryCode = editSingleData?.MobileNo.split(" ")[0];
      // setCode(countryCode);
      setData((prevData) => ({
        ...prevData,
        dialcode: `+91`,
      }));
    } else {
      // Set default country code if editSingleData?.MobileNo is not available
      setData((prevData) => ({
        ...prevData,
        dialcode: `+91`,
      })); // Default country code
    }
  }, [editSingleData?.MobileNo]);

  const [image, setImage] = useState({
    profileImg: editSingleData?.profile_img,
    backImg: editSingleData?.profile_back,
    rightImg: editSingleData?.profile_side,
    frontImg: editSingleData?.profile_front,
  });

  // useEffect(() => {
  //   // Event listener for blur
  //   const input = document.querySelector("#phone");
  //   input.addEventListener("blur", handleBlur);

  //   // Cleanup
  //   return () => {
  //     input.removeEventListener("blur", handleBlur);
  //   };
  // }, []);


  useEffect(() => {
    const input = document.querySelector("#phone");
    const errorMsg = document.querySelector("#error-msg");
    const validMsg = document.querySelector("#valid-msg");

    const errorMap = [
      "Invalid number",
      "Invalid country code",
      "Too short",
      "Too long",
      "Invalid number",
    ];

    const iti = intlTelInput(input, {
      initialCountry: data.countryCode.toLowerCase(),
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.12/js/utils.js",
    });

    // Ensure the input value includes the default dial code if it's empty
    if (!input.value || input.value.trim() === "") {
      input.value = data.dialcode;
    }

    const reset = () => {
      input.classList.remove("error");
      errorMsg.innerHTML = "";
      errorMsg.style.display = "none";
      validMsg.style.display = "none";
    };

    input.addEventListener("blur", () => {
      reset();

      if (input.value.trim()) {
        const isValidNumber = iti.isValidNumber() && !isNaN(iti.getNumber());
        const isDesiredFormat = input.value === "##" || /\d{2}/.test(input.value);

        if (isDesiredFormat || isValidNumber) {
          setData((prevData) => ({
            ...prevData,
            mobileNo: (iti.getNumber()).replace(data.dialcode, "").trim(),
          }));
          validMsg.style.display = "";
        } else {
          input.classList.add("error");
          const errorCode = iti.getValidationError();
          errorMsg.innerHTML = errorMap[errorCode];
          errorMsg.style.display = "";
        }
      }
    });

    const handleCountryChange = debounce(() => {
      const inputVal = input.value;
      const newCountryCodeData = iti.getCountryData().find(country => inputVal.startsWith(`+${country.dialCode}`));
      
      if (newCountryCodeData) {
        const dialCodeRegex = new RegExp(`^\\${data.dialcode}`);

        
        const newMobileNo = inputVal.replace(dialCodeRegex, "").trim();
        
        iti.setCountry(newCountryCodeData.iso2.toLowerCase());
        setData((prevData) => ({
          ...prevData,
          countryCode: newCountryCodeData.iso2.toUpperCase(),
          dialcode: `+${newCountryCodeData.dialCode}`,
          mobileNo: inputVal,
        }));
      }
    }, 300); // 300ms debounce time

    input.addEventListener("input", handleCountryChange);

    return () => {
      input.removeEventListener("blur", reset);
      input.removeEventListener("input", handleCountryChange);
    };
  }, [data.countryCode]);
  
  

  const uploadRefs = {
    profileImg: React.useRef(),
    backImg: React.useRef(),
    rightImg: React.useRef(),
    frontImg: React.useRef(),
  };

  useEffect(() => {
    if (data.countryCode) {
      dispatch(getSingleCountry(data.countryCode));
    }
  }, [data.countryCode, dispatch]);

  useEffect(() => {
    if (country?.ID) {
      setData((prevData) => ({
        ...prevData,
        countryId: country.ID,
      }));
    }
  }, [country]);
  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (isFocused) setError("");
    if (isMobFocused) setMobError("");
  };
  const validateEmail = (email) => {
    // Email validation regular expression
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

 
  const validateMobileNumber = (mobileNo) => {
    const re = /^[0-9]+$/;
    const cleanNumber = mobileNo.replace(data.dialcode, "").trim();

    return (
      re.test(String(cleanNumber)) &&
      cleanNumber.length >= country?.Mobminlen &&
      cleanNumber.length <= country?.MobMaxLen
    );
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!validateEmail(data.email)) {
      setError("Please enter a valid email address");
    }
  };
  const handleMobileBlur = () => {
    setIsMobFocused(false);

    if (!validateMobileNumber(data.mobileNo)) {
      setMobError("Please enter a valid mobile number");
    }
  };

  useEffect(() => {
    if (BU_Id) {
      dispatch(getCustomerStyle(BU_Id));
    }
  }, [BU_Id]);

  // useEffect(() => {
  //   if (branch) {
  //     dispatch(getBranch(branch));
  //   }
  // }, []);

  const handleBODDateChange = (date) => {
    setData({ ...data, BODDate: date });
    // onDataChange({ newData });
  };

  useEffect(() => {
    onDataChange({ data, image });
  }, [data, image]);

  const handleAniDateChange = (date) => {
    setData({ ...data, AniDate: date });
  };

  const handleStatusChange = (status) => {
    setData({ ...data, selectedStatus: status });
  };
  const handleType = (selectedtype) => {
    setData({
      ...data,
      CustTypeId: selectedtype,
      // CustType: selectedtype.CustType,
    });
  };

  const selectedCustType = styleDetails?.data?.find(
    (item) => item.CustTypeId == data?.CustTypeId
  );

  //image logic start==============================================================================
  const [hasWebcam, setHasWebcam] = useState(false);

  const [webcamError, setWebcamError] = useState("");
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [currentImageKey, setCurrentImageKey] = useState(null);

  const handleImageSelect = (event, key) => {
    const file = event.target.files[0];
    if (file) {
      Resizer.imageFileResizer(
        file,
        300, // maxWidth
        300, // maxHeight
        "JPEG", // compressFormat
        70, // quality
        0, // rotation
        (uri) => {
          setImage((prevImage) => ({
            ...prevImage,
            [key]: uri,
          }));
        },
        "base64"
      );
    }
  };

  const checkWebcam = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasWebcam(false);
        setWebcamError("Webcam access not supported in this browser.");
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (stream) {
        setHasWebcam(true);
        return true;
      } else {
        setHasWebcam(false);
        setWebcamError("No camera found.");
        return false;
      }
    } catch (error) {
      setWebcamError(
        "Error accessing webcam. Please check your browser settings."
      );
      setHasWebcam(false);
      return false;
    }
  };
  const handleBrowseImage = async (key, event) => {
    event.preventDefault();
    event.stopPropagation();
    setCurrentImageKey(key);
    const hasCamera = await checkWebcam();
    if (hasCamera) {
      setCameraModel(true);
    } else {
      uploadRefs[key].current.click();
    }
  };

  const handleCameraModelClose = () => {
    setCameraModel(false);
    setHasWebcam(false);
    setCurrentImageKey(null);
  };

  const capturePhoto = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], `captured_image_${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      // onImageSelect([file]);
      handleImageSelect({ target: { files: [file] } }, currentImageKey);
      await compareImages(imageSrc, image[currentImageKey]);
      handleCameraModelClose();
    }
  };

  const compareImages = async (webcamImage, referenceImage) => {
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");

    const img1 = await faceapi.fetchImage(webcamImage);
    const img2 = await faceapi.fetchImage(referenceImage);

    const detection1 = await faceapi
      .detectSingleFace(img1)
      .withFaceLandmarks()
      .withFaceDescriptor();
    const detection2 = await faceapi
      .detectSingleFace(img2)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection1 && detection2) {
      const distance = faceapi.euclideanDistance(
        detection1.descriptor,
        detection2.descriptor
      );
      if (distance < 0.6) {
        // console.log("Faces match!");
      } else {
        // console.log("Faces do not match.");
      }
    } else {
      // console.log("Face detection failed.");
    }
  };

  return (
    
      <div>
         <Form>
          <div className="row w-full justify-content-between custom-m-nk-header">
            <div className=" px-md-0 px-lg-1 col-md-6">
              <div className="pb-1" id="name-tooltip">
                <div className="position-relative nk-header-searchbox">
                  <input
                    type="text"
                    id="username"
                    name="name"
                    value={data.name}
                    onChange={handleDataChange}
                    placeholder="Full Name"
                    className="form-control-lg form-control search-input"
                  />
                  <img
                    src={CategoryIcon}
                    alt=""
                    className="position-absolute input-field-icon"
                  />
                </div>
              </div>
              <Tooltip
                id={`name-tooltip`}
                direction="top"
                text={ToolTipContent.coustomerName}
              />

              <div className="pb-1" id="phone-tooltip">
                <div className="position-relative nk-header-searchbox border rounded-2 ">
                  <div className="d-flex">
                    <div className="ml-4">
                      <input type="hidden" id="phone2" name="phone" />
                      <input
                        id="phone"
                        type="tel"
                        className="form-control-lg form-control search-input border-0"
                        name="mobileNo"
                        value={data.mobileNo}
                        onBlur={handleMobileBlur}
                        onFocus={() => setIsMobFocused(true)}
                        onChange={handleDataChange}
                        placeholder="Mobile No"
                      />
                    </div>
                  </div>

                  <img
                    src={CallIcon}
                    alt=""
                    className="position-absolute input-field-icon"
                  />
                </div>
                {!isMobFocused && mobError && (
                  <div className="text-danger text-8px">{mobError}</div>
                )}
              </div>
              <Tooltip
                id={`phone-tooltip`}
                direction="top"
                text={ToolTipContent.mobileNumber}
              />

              <div className="pb-1" id="email-tooltip">
                <div className="position-relative nk-header-searchbox">
                  <input
                    type="text"
                    id="default-01"
                    name="email"
                    value={data.email}
                    onBlur={handleBlur}
                    onFocus={() => setIsFocused(true)}
                    onChange={handleDataChange}
                    placeholder="Email Address"
                    className="form-control-lg form-control search-input "
                  />
                  <img
                    width="20px"
                    src={EmailIcon}
                    alt=""
                    className="position-absolute input-field-icon"
                  />
                </div>
                {!isFocused && error && (
                  <div className="text-danger text-8px">{error}</div>
                )}
              </div>

              <Tooltip
                id={`email-tooltip`}
                direction="top"
                text={ToolTipContent.emailAddress}
              />
            </div>

            <div className=" px-md-0 px-lg-1 col-md-6">
              <div className="pb-1" id="address-tooltip">
                <div className="position-relative nk-header-searchbox">
                  <textarea
                    name="address"
                    id=""
                    rows="2"
                    className="form-control search-input min-h-90"
                    value={data.address}
                    onChange={handleDataChange}
                    placeholder="Address"
                  ></textarea>
                  <img
                    src={LocationIcon}
                    alt=""
                    className="position-absolute textarea-field-icon"
                  />
                </div>
              </div>

              <Tooltip
                id={`address-tooltip`}
                direction="top"
                text={ToolTipContent.address}
              />

              <div className="pb-1">
                <div className="d-flex w-full justify-content-between ">
                  <UncontrolledDropdown
                    className="user-dropdown position-relative nk-header-searchbox w-100 form-control-lg form-control"
                    id="custType"
                    isOpen={isDropdownOpenCustType}
                    toggle={() =>
                      setIsDropdownOpenCustType(!isDropdownOpenCustType)
                    }
                  >
                    <div className="w-100">
                      <DropdownToggle
                        tag="a"
                        className="w-100 cursor-pointer"
                        onClick={() =>
                          setIsDropdownOpenCustType(!isDropdownOpenCustType)
                        }
                      >
                        <div className="d-flex text-dark align-items-center">
                          <img src={CategoryIcon} alt="" className="mr-2" />
                          <div className="">
                            <span className="lowercase ">
                              {selectedCustType
                                ? selectedCustType.CustType
                                : "Type"}
                            </span>
                          </div>
                        </div>
                      </DropdownToggle>

                      <DropdownMenu
                        className="dropdown-menu-s1 mt-1"
                        style={{ width: "190px" }}
                      >
                        <div className="dropdown-body">
                          <div className="p-2">
                            <ul>
                              {styleDetails?.data?.map((item, ind) => {
                                return (
                                  <>
                                    <DropdownItem
                                      id={`item-${ind}`}
                                      key={ind}
                                      className="fw-medium fs-6 d-flex align-items-center cursor-pointer onHoverttext-dark"
                                      onClick={() =>
                                        handleType(item.CustTypeId)
                                      }
                                    >
                                      {item.CustType?.length > 13
                                        ? item.CustType.slice(0, 13) + "..."
                                        : item.CustType}
                                    </DropdownItem>
                                    {item.CustType?.length > 13 ? (
                                      <>
                                        <Tooltip
                                          id={`item-${ind}`}
                                          direction="right"
                                          text={item.CustType}
                                        />
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </DropdownMenu>
                    </div>
                  </UncontrolledDropdown>

                  {!isDropdownOpenCustType && (
                    <Tooltip
                      id={`custType`}
                      direction="left"
                      text={ToolTipContent.customerType}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-light my-2 py-2 px-5  updateCustomerDetail">
            <div className="row align-items-center  ">
              <div
                className="col-lg-3 col-sm-6 col-12 py-1 py-lg-0"
                id="toottip-birthdate"
              >
                <div>
                  <div className="d-flex align-items-center">
                    <img src={BirthdayIcon} alt="" className="" width="25px" />
                    <DatePicker
                      placeholderText="Select birth date"
                      className="border-0 fw-medium fs-14 bg-light mt-5px  ms-1 birthDate"
                      name="BODDate"
                      selected={data.BODDate}
                      dateFormat="dd/MM/yyyy"
                      onChange={handleBODDateChange}
                    ></DatePicker>
                  </div>
                </div>
              </div>
              <Tooltip
                id={`toottip-birthdate`}
                direction="top"
                text={ToolTipContent.selectBOD}
              />

              <div
                className="col-lg-3 col-sm-6 col-12 py-1 py-lg-0"
                id="toottip-anidate"
              >
                <div>
                  <div className="d-flex align-items-center">
                    <img
                      src={AnniversoryIcon}
                      alt=""
                      className=""
                      width="25px"
                    />
                    <DatePicker
                      placeholderText="Select Anniversory date"
                      className="border-0 fw-medium fs-14 bg-light  text-color ms-1 w-100"
                      name="AniDate"
                      selected={data.AniDate}
                      dateFormat="dd/MM/yyyy"
                      onChange={handleAniDateChange}
                      minDate={data.BODDate}
                    ></DatePicker>
                  </div>
                </div>
              </div>

              <Tooltip
                id={`toottip-anidate`}
                direction="top"
                text={ToolTipContent.selectAnniDate}
              />

              <div
                className="col-lg-3 col-sm-6 col-12 py-1 py-lg-0"
                id="toottip-status"
              >
                <div className="mt-4px">
                  <UncontrolledDropdown
                    className="user-dropdown"
                    isOpen={isDropdownOpenStatus}
                    toggle={() =>
                      setIsDropdownOpenStatus(!isDropdownOpenStatus)
                    }
                  >
                    <DropdownToggle
                      tag="a"
                      className=""
                      onClick={() =>
                        setIsDropdownOpenStatus(!isDropdownOpenStatus)
                      }
                    >
                      <div className="d-flex text-dark align-items-center">
                        <img
                          src={
                            data.selectedStatus === "1"
                              ? GreenIndividualIcon
                              : CorporateIcon
                          }
                          alt=""
                          className="mr-2"
                        />
                        <div className="">
                          <span className="border-0 fw-medium fs-14  text-color ms-1 w-100 cursor-pointer ">
                            {data.selectedStatus === "1"
                              ? "Individual"
                              : "Corporate"}
                          </span>
                        </div>
                      </div>
                    </DropdownToggle>

                    <DropdownMenu
                      end
                      className="dropdown-menu-s1 mt-2 "
                      style={{ width: "180px" }}
                    >
                      <div className="dropdown-body">
                        <div className=" p-2">
                          <ul>
                            <DropdownItem
                              className="fw-medium fs-6 d-flex align-items-center text-color cursor-pointer"
                              onClick={() => handleStatusChange("1")}
                            >
                              <img
                                src={GreenIndividualIcon}
                                alt=""
                                className="mr-2"
                              />
                              Individual
                            </DropdownItem>
                            <DropdownItem
                              className="fw-medium fs-6 d-flex align-items-center text-color cursor-pointer"
                              onClick={() => handleStatusChange("2")}
                            >
                              <img
                                src={CorporateIcon}
                                alt=""
                                className="mr-2"
                              />
                              Corporate
                            </DropdownItem>
                          </ul>
                        </div>
                      </div>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </div>
              {!isDropdownOpenStatus && (
                <Tooltip
                  id={`toottip-status`}
                  direction="top"
                  text={ToolTipContent.selectIndividual}
                />
              )}
              <div
                className={`col-lg-3 col-sm-6 col-12 py-1 py-lg-0 ${
                  data.selectedStatus === "2" ? "d-block" : "d-none"
                }`}
              >
                <div className="d-flex w-100">
                  <img
                    src={TinIcon}
                    alt=""
                    className="mr-2 align-items-center"
                  />
                  <div className="">
                    <input
                      type="text"
                      id="default-01"
                      name="vatTno"
                      value={data.vatTno}
                      maxLength={15}
                      onChange={handleDataChange}
                      placeholder="tax identification number"
                      className="border-0 w-100 bg-light outline-0 tinIcon-input"
                    />
                    
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <div className="w-100  d-flex justify-content-center">
              <div className=" w-75 text-center  px-4 py-1 rounded-2">
                <div className="d-flex  justify-content-center">
                  <span className="fw-bold"> Upload Customer Images </span>
                  <div id="toottip-image-upload">
                    <img
                      className="ml-1"
                      src={PaymentInputInfoIcon}
                      alt="PaymentInputInfoIcon"
                    />
                  </div>

                  <Tooltip
                    id={`toottip-image-upload`}
                    direction="top"
                    text={ToolTipContent.uploadCustomerImage}
                  />
                </div>
                <div className=" mt-4 justify-content-center custome-add-profile-box-image">
                  {["profileImg", "rightImg", "frontImg", "backImg"].map(
                    (key) => (
                      <div className="custome-width-image-box" key={key}>
                        <label
                          htmlFor={`${key}Input`}
                          className={`cursor-pointer`}
                          onClick={(event) => handleBrowseImage(key, event)}
                        >
                          {image[key] ? (
                            <>
                              <div className="position-relative setImage">
                                <img
                                  src={image[key]}
                                  width="90px"
                                  height="90px"
                                  className="rounded-2"
                                />
                                <div className="position-absolute upload-image">
                                  <img
                                    src={imageUploadIcon}
                                    alt="imageUploadIcon"
                                  />
                                </div>
                              </div>
                              <p className="pb-0 pt-1">
                                {key.replace("Img", "")}
                              </p>
                            </>
                          ) : (
                            <>
                              <img
                                src={ProfileImageFrontIcon}
                                alt=""
                                width="90px"
                                height="90px"
                                className=""
                              />
                              <p className="pb-0 pt-1">
                                {key.replace("Img", "")}
                              </p>
                            </>
                          )}
                        </label>
                        {!hasWebcam && !isMobile && (
                          <input
                            type="file"
                            id={`${key}Input`}
                            accept="image/*"
                            ref={uploadRefs[key]}
                            style={{ display: "none" }}
                            onChange={(event) => handleImageSelect(event, key)}
                          />
                        )}
                        {isMobile && (
                          <input
                            type="file"
                            id={`${key}Input`}
                            accept="image/*"
                            ref={uploadRefs[key]}
                            style={{ display: "none" }}
                            onChange={(event) => handleImageSelect(event, key)}
                          />
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </Form>

        <Modal
          isOpen={cameraModel}
          toggle={handleCameraModelClose}
          size="lg"
          className="rounded-top-4 "
        >
          <div className="bg-1c2b4c text-white py-2 px-4 rounded-top-4">
            <div className="d-flex justify-content-between align-items-center w-100">
              <div>
                <span>Capture Photo</span>
              </div>
              <Icon name="cross" onClick={handleCameraModelClose}></Icon>
            </div>
          </div>
          <ModalBody className=" mb-5 p-4">
            <Webcam
              className="w-100 webcam"
              ref={webcamRef}
              audio={true}
              screenshotFormat="image/jpeg"
             
            />
            <div className="text-center ">
              <Button outline color="light" onClick={capturePhoto}>
                <img src={CameraIcon}></img>
              </Button>
            </div>
          </ModalBody>
        </Modal> 
      </div>
   
  );
};

export default EditPersonalDetailForm;

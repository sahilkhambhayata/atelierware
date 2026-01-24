import React, { useEffect, useRef, useState } from "react";
import cameraIcon from "./../../../../../../images/icons/camera-icon.svg";
import browseImageIcon from "./../../../../../../images/icons/browse-image-icon.svg";
import browseCatalogIcon from "./../../../../../../images/icons/browse-catalog-icon.svg";
import PaymentDeleteIcon from "./../../../../../../images/icons/payment-delete-icon.svg";
import { toast } from "react-toastify";

import Webcam from "react-webcam";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import Icon from "../../../../../../Components/icon/Icon";
import CameraIcon from "../../../../../../images/icons/camera-icon.svg";
import MainImageIcon from "./../../../../../../images/icons/main-image-icon.svg";
import MainImageIcon1 from "./../../../../../../images/icons/main-image-icon1.svg";
import editImageIcon from "./../../../../../../images/icons/edit-icon.png";
import { usePermissions } from "../../../../../../Layout/Provider/PermissionsContext";
import * as faceapi from "face-api.js";
import Resizer from "react-image-file-resizer";

// const videoConstraints = {
//   width: "100%",
//   facingMode: "environment"
// };

const ImageSearch = ({
  mood,
  onImageSelect,
  onImageClick,
  onImageRemoveClick,
  onCatalogSelection,
  // catelogDescriptions,
  mergedImageArray,
  mainImage,
}) => {
  const { handleAction } = usePermissions();

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
  const [cameraModel, setCameraModel] = useState(false);
  const [hoverIndex, setHoverIndex] = useState();
  const [error, setError] = useState("");
  const [hasWebcam, setHasWebcam] = useState(false);

  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (mainImage && mergedImageArray) {
      const matchedObject = mergedImageArray.find(
        (img) => img.id === mainImage.id
      );
    }
  }, [mainImage, mergedImageArray]);

  // const [videoConstraints, setVideoConstraints] = useState({ width: 640, height: 480, facingMode: "environment" });

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const updateVideoConstraints = () => {
  //   if (modalBodyRef.current) {
  //     const { clientWidth, clientHeight } = modalBodyRef.current;
  //     setVideoConstraints({ width: clientWidth, height: clientHeight, facingMode: "environment" });
  //   }
  // };

  const checkWebcam = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasWebcam(false);
        console.log("Webcam access not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (stream) {
        setHasWebcam(true);
        return true;
      } else {
        setHasWebcam(false);
        console.log("No camera found.");
        return false;
      }
    } catch (error) {
      console.log(
        "Error accessing webcam. Please check your browser settings."
      );
      setHasWebcam(false);
      return false;
    }
  };

  const handleBrowseProfileImage = async () => {
    if (mood == "view") {
      toast.error("You have no rights to change");
    } else {
      if (!hasWebcam) {
        const hasCamera = await checkWebcam();
        if (!hasCamera) {
          // If there's no webcam, open the file input
          fileInputRef.current.click();
          return;
        }
      }
      setCameraModel(true);
    }
  };

  const handleCameraModelClose = () => {
    setCameraModel(false);
    setHasWebcam(false);
  };

  const capturePhoto = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], `captured_image_${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      Resizer.imageFileResizer(
        file,
        300, // maxWidth
        300, // maxHeight
        "JPEG", // compressFormat
        50, // quality
        0, // rotation
        (base64String) => {
          // Using base64 string directly
          onImageSelect([base64String]); // This will pass the base64 URL
          handleCameraModelClose();
        },
        "base64"
      );
    }
  };

  const onUserMedia = (e) => {};

  const handleImageSelect = (event) => {
    if (mood == "view") {
      toast.error("You have no rights to change");
    } else {
      const newMergedImageArray = Array.from(event.target.files);
      const updatedImages = [];

      newMergedImageArray.forEach((file) => {
        if (file.size <= 5 * 1024 * 1024) {
          Resizer.imageFileResizer(
            file,
            undefined, // maxWidth
            undefined, // maxHeight
            "JPEG", // compressFormat
            50, // quality
            0, // rotation
            (base64String) => {
              // Here we just add the base64 string as the "URL"
              updatedImages.push(base64String);

              // Once all images are processed, update the state or call onImageSelect
              if (updatedImages.length === newMergedImageArray.length) {
                const newMergedImages = [...mergedImageArray, ...updatedImages];

                onImageSelect(newMergedImages); // This will contain base64 URLs
              }
            },
            "base64" // Output as base64 string
          );
        } else {
          toast.error(
            `File ${file.name} exceeds the maximum size limit of 5MB and will not be uploaded.`
          );
        }
      });
    }
  };

  const handleKeyDown = (e) => {
    if (mood === "view") {
      e.preventDefault();
      toast.error("You have no rights to change");
    }
  };

  const [hasInbuiltCamera, setHasInbuiltCamera] = useState(false);

  useEffect(() => {
    const checkForCamera = async () => {
      try {
        // Get all media devices
        const devices = await navigator.mediaDevices.enumerateDevices();

        // Filter for video input devices
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        // Check if any video device label includes "built-in"
        const inbuiltCamera = videoDevices.length > 0;

        setHasInbuiltCamera(inbuiltCamera);
      } catch (error) {
        console.error("Error detecting camera:", error);
      }
    };

    checkForCamera();
  }, []);
  return (
    <div>
      <div className="position-relative nk-header-searchbox border m-0 px-lg-5 px-md-2 px-2 pt-3 shadow">
        <div className="pb-5">
          <div className="col-12 row justify-content-center g-2">
            {!hasInbuiltCamera && (
              <div className="col-md-6 col-12 col-lg-3 mx-2 border rounded-2 text-center p-lg-3 p-1">
                <label
                  id="BtnBkAnOrderAddImgWeb"
                  // htmlFor={!hasWebcam && "fileInputs"}
                  className="cursor-pointer text-center"
                  // onClick={() =>
                  //   handleAction(
                  //     "BtnBkAnOrderAddImgWeb",
                  //     "action",
                  //     handleBrowseProfileImage,
                  //     null

                  //   )
                  // }
                  onClick={handleBrowseProfileImage}
                >
                  <img src={cameraIcon} alt="" className="" />
                  <p className="mt-4 fw-bold">Take Photo</p>
                </label>
                {!hasWebcam && !isMobile && (
                  <input
                    type="file"
                    // id="fileInputs"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    // multiple
                    onChange={handleImageSelect}
                    capture="environment"
                  />
                )}
                {isMobile && (
                  <input
                    type="file"
                    // id="fileInputs"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    // multiple
                    onChange={handleImageSelect}
                    capture="environment"
                  />
                )}
              </div>
            )}
            <div className="col-md-6 col-12 col-lg-3 mx-2 border rounded-2 text-center p-lg-3 p-1">
              <label
                htmlFor="BtnBkAnOrderAddImgBrows"
                className="cursor-pointer text-center"
              >
                <img src={browseImageIcon} alt="" className="" />
                <p className="mt-4 fw-bold">Browse Image</p>
              </label>
              <input
                type="file"
                id="BtnBkAnOrderAddImgBrows"
                accept="image/*"
                style={{ display: "none" }}
                multiple
                readOnly={mood === "view"}
                onKeyDown={handleKeyDown}
                // onChange={() =>
                //   handleAction(
                //     "BtnBkAnOrderAddImgBrows",
                //     "action",
                //     handleImageSelect,
                //     null
                //     )
                // }
                onChange={handleImageSelect}
              />
            </div>

            <div className="col-md-6 col-12 col-lg-3 mx-2 border rounded-2 text-center p-lg-3 p-1">
              <img
                src={browseCatalogIcon}
                alt=""
                id="BtnBkAnOrderAddImgCat"
                className=""
                height="53px"
                onClick={onCatalogSelection}
              />
              <p className="mt-4 fw-bold">Browse Catalog</p>
            </div>
          </div>
        </div>
      </div>

      {mergedImageArray?.length > 0 &&
        mergedImageArray?.map((img, ind) => {
          const isHovered = hoverIndex === ind;

          return (
            <div
              className="bg-light w-100  bg-light "
              key={ind}
              onMouseEnter={() => isDesktop && setHoverIndex(ind)}
              onMouseLeave={() => isDesktop && setHoverIndex(null)}
            >
              <div
                className={`my-1 position-relative bg-white border rounded-2 p-1 d-flex align-items-center justify-content-between ${
                  isHovered ? "shadow-lg" : "shadow-sm"
                }`}
              >
                <div className="d-flex align-items-center">
                  <img
                    // src={URL.createObjectURL(img.image)}
                    src={img.image}
                    alt={`Selected Image ${ind}`}
                    width="50px"
                    height="50px"
                    onClick={() => onImageClick(true, img, ind)}
                    className="rounded-2"
                  />
                  <div className="ml-3">
                    <span>{img.description || img.desc}</span>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  {mainImage?.id
                    ? mainImage?.id === img?.id && (
                        <img
                          src={MainImageIcon1}
                          alt=""
                          className="mx-1 cursor-pointer"
                        />
                      )
                    : mainImage?.image === img.image && (
                        <img
                          src={MainImageIcon1}
                          alt=""
                          className="mx-1 cursor-pointer"
                        />
                      )}

                  {(isHovered || !isDesktop) && (
                    <div className=" d-flex align-items-center">
                      <img
                        src={editImageIcon}
                        alt=""
                        className="mx-1 cursor-pointer"
                        width="30px"
                        onClick={() => onImageSelect(mergedImageArray)}
                      />
                      <img
                        src={PaymentDeleteIcon}
                        alt=""
                        width="30px"
                        id="BtnBkAnOrderImgDel"
                        className="cursor-pointer mx-1"
                        onClick={() => onImageRemoveClick(true, img, ind, "1")}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

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
            // videoConstraints={videoConstraints}

            // onUserMedia={updateVideoConstraints}
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

export default ImageSearch;

import React, { useEffect, useRef, useState } from "react";
import cameraIcon from "./../../../../../../images/icons/camera-icon.svg";
import browseImageIcon from "./../../../../../../images/icons/browse-image-icon.svg";
import PaymentDeleteIcon from "./../../../../../../images/icons/payment-delete-icon.svg";

import { toast } from "react-toastify";
import Webcam from "react-webcam";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import Icon from "../../../../../../Components/icon/Icon";
import CameraIcon from "../../../../../../images/icons/camera-icon.svg";
import MainImageIcon1 from "./../../../../../../images/icons/main-image-icon1.svg";
import { usePermissions } from "../../../../../../Layout/Provider/PermissionsContext";
import Resizer from "react-image-file-resizer";
import editImageIcon from "./../../../../../../images/icons/edit-icon.png";

import imageCompression from "browser-image-compression";
// const videoConstraints = {
//   width: 590,
//   facingMode: "environment"
// };

const GarmentSearch = ({
  mood,
  onGarmentSelect,
  onGarmentClick,
  onGarmentRemoveClick,
  //   onCatalogSelection,
  // catelogDescriptions,
  mergedGarmentArray,
  mainGarment,
}) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
  const [cameraModel, setCameraModel] = useState(false);
  const [hoverIndex, setHoverIndex] = useState();
  const [hasWebcam, setHasWebcam] = useState(false);
  const videoRef = useRef(null);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const { handleAction } = usePermissions();
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

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const checkWebcam = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasWebcam(false);
        setError("Webcam access not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (stream) {
        setHasWebcam(true);
        return true;
        // videoRef.current.srcObject = stream;
        // videoRef.current.play();
      } else {
        setHasWebcam(false);
        setError("No camera found.");
        return false;
      }
    } catch (error) {
      setError("Error accessing webcam. Please check your browser settings.");
      setHasWebcam(false);
      return false;
    }
  };

  // return () => {
  //   if (videoRef.current && videoRef.current.srcObject) {
  //     videoRef.current.srcObject.getTracks().forEach(track => track.stop());
  //   }
  // };

  const handleCheckWebCam = async () => {
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
          onGarmentSelect([base64String]); // This will pass the base64 URL
          handleCameraModelClose();
        },
        "base64"
      );

      onGarmentSelect([file]);
      handleCameraModelClose();
    }
    // setUrl(imageSrc);
    // onImageSelect(imageSrc);
  };

  // const handleGarmentSelectorBr = (event) => {
  //   const newMergedGarmentArray = Array.from(event.target.files);
  //   const updatedImages = [];

  //   for (let i = 0; i < newMergedGarmentArray.length; i++) {
  //     const file = newMergedGarmentArray[i];

  //     // Check if the file size is less than or equal to 5MB (5 * 1024 * 1024 bytes)
  //     if (file.size <= 5 * 1024 * 1024) {
  //       updatedImages.push(file);
  //     } else {
  //       toast.error(
  //         `File ${file.name} exceeds the maximum size limit of 5MB and will not be uploaded.`
  //       );
  //     }
  //   }
  //   const newMergedImages = [...mergedGarmentArray, ...updatedImages];
  //   onGarmentSelect(newMergedImages);
  // };

  const handleGarmentSelect = (event) => {
    if (mood == "view") {
      toast.error("You have no rights to change");
    } else {
      const newMergedGarmentArray = Array.from(event.target.files);
      const updatedImages = [];

      newMergedGarmentArray.forEach((file) => {
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

              // Once all images are processed, update the state or call onGarmentSelect
              if (updatedImages.length === newMergedGarmentArray.length) {
                const newMergedImages = [
                  ...mergedGarmentArray,
                  ...updatedImages,
                ];

                
                onGarmentSelect(newMergedImages); // This will contain base64 URLs
              }
            },
            "base64"
          );
        } else {
          toast.error(
            `File ${file.name} exceeds the maximum size limit of 5MB and will not be uploaded.`
          );
        }
      });
    }
    // const newMergedImages = [...mergedGarmentArray, ...updatedImages];
    // onGarmentSelect(newMergedImages);
  };
  // console.log(isMobile, "");
  return (
    <div>
      <div className="position-relative nk-header-searchbox border m-0 px-lg-5 px-md-2 px-2 pt-3 shadow">
        <div className="pb-5">
          <div className="col-12 row justify-content-center g-2">
            {!hasInbuiltCamera && (
              <div className="col-md-6 col-12 col-lg-3 mx-2 border rounded-2 text-center p-lg-3 p-1">
                <label
                  id="handleCheckWebCam"
                  // htmlFor="fileInputGarment"
                  className="cursor-pointer text-center"
                  // onClick={() =>
                  //   handleAction(
                  //     "BtnBkAnOrderAddGarmentWeb",
                  //     "action",
                  //     handleCheckWebCam,
                  //     null
                  //   )
                  // }
                  onClick={handleCheckWebCam}
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
                    onChange={handleGarmentSelect}
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
                    onChange={handleGarmentSelect}
                    capture="environment"
                  />
                )}
              </div>
            )}
            <div className="col-md-6 col-12 col-lg-3 mx-2 border rounded-2 text-center p-lg-3 p-1">
              <label
                htmlFor="BtnBkAnOrderAddGarmentBrowse"
                className="cursor-pointer text-center"
              >
                <img src={browseImageIcon} alt="" className="" />
                <p className="mt-4 fw-bold">Browse Image</p>
              </label>
              <input
                type="file"
                id="BtnBkAnOrderAddGarmentBrowse"
                accept="image/*"
                style={{ display: "none" }}
                multiple
                // onChange={() =>
                //   handleAction(
                //     "BtnBkAnOrderAddGarmentBrowse",
                //     "action",
                //     handleGarmentSelect,
                //     null

                //   )
                // }
                onChange={handleGarmentSelect}
              />
            </div>
          </div>
        </div>
      </div>

      {mergedGarmentArray?.length > 0 &&
        mergedGarmentArray?.map((img, ind) => {
          const isHovered = hoverIndex === ind;

          return (
            <div
              className="bg-light w-100 bg-light "
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
                    onClick={() => onGarmentClick(true, img, ind)}
                    className="rounded-2"
                  />
                  <div className="ml-3">
                    <span>{img.description || img.desc}</span>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  {mainGarment?.id
                    ? mainGarment?.id === img?.id && (
                        <img
                          src={MainImageIcon1}
                          alt=""
                          className="mx-1 cursor-pointer"
                        />
                      )
                    : mainGarment?.image === img.image && (
                        <img
                          src={MainImageIcon1}
                          alt=""
                          className="mx-1 cursor-pointer"
                        />
                      )}

                  {(isHovered || !isDesktop) && (
                    <div className="d-flex align-items-center">
                      <img
                        src={editImageIcon}
                        alt=""
                        width="30px"
                        className="mx-1 cursor-pointer"
                        onClick={() => onGarmentSelect(mergedGarmentArray)}
                      />
                      <img
                        src={PaymentDeleteIcon}
                        alt=""
                        id="BtnBkAnOrderGarmentDel"
                        width="30px"
                        // onClick={() =>
                        //   handleAction(
                        //     "BtnBkAnOrderGarmentDel",
                        //     "action",
                        //     onGarmentRemoveClick,
                        //     (true, img, ind, "1")

                        //   )
                        // }
                        className="mx-1 cursor-pointer"
                        onClick={() =>
                          onGarmentRemoveClick(true, img, ind, "1")
                        }
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

            // onUserMedia={onUserMedia}
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

export default GarmentSearch;

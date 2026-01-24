import React, { useEffect, useRef, useState } from "react";
// import jecek from "../../../../images/icons/service-jecet01.svg";
import Cimages from "./../../Images/CommonImageFile";

import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "reactstrap";

import ImagesSlider from "./ModalSlider/ImagesSlider";
import { useDispatch, useSelector } from "react-redux";
import { getItemImage } from "../../../../redux/actions/itemImageAction";
import Skeleton from "@mui/material/Skeleton";
import useHandleCellClick from "./useHandleCellClick";

const CustomService2Cell = ({ service2Data }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setModalIsOpen] = useState(false);
  const [activeImg, setActiveImg] = useState();
  const [fetchedIds, setFetchedIds] = useState([]);
  const imageObj = useSelector((state) => state.itemImage);
  const handleCellClick = useHandleCellClick();
  const dispatch = useDispatch();
  const [finalImageObjects, setFinalImageObjects] = useState();
  const dropdownRef = useRef(null);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const handleImageClick = (e, img, ind) => {
    e.stopPropagation();
    setModalIsOpen(true);
    setActiveImg(ind);
  };
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(true);
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    // Open modal when clicking inside dropdown menu
    openModal();
  };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setIsDropdownOpen(false);
  //     }
  //   };

  //   const handleScroll = () => {
  //     setIsDropdownOpen(false);
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   document.addEventListener("scroll", handleScroll, true);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //     document.removeEventListener("scroll", handleScroll, true);
  //   };
  // }, []);

  useEffect(() => {
    if (isDropdownOpen && !fetchedIds.includes(service2Data.id)) {
      setFetchedIds([...fetchedIds, service2Data.id]);
      dispatch(getItemImage(service2Data.id)).then((res) => {
        if (res.success) {
          const newImageObjects = [];
          for (let i = 1; i <= 10; i++) {
            const imgKey = `attach_img_${i}`;
            const descKey = `attach_img_${i}_desc`;
            if (res.data[imgKey] !== null) {
              newImageObjects.push({
                image: res.data[imgKey],
                desc: res.data[descKey] || "",
              });
            }
          }
          for (let i = 1; i <= 3; i++) {
            const imgKey = `attach_garment_img_${i}`;
            const descKey = `attach_garment_img_${i}_desc`;
            if (res.data[imgKey] !== null) {
              newImageObjects.push({
                image: res.data[imgKey],
                desc: res.data[descKey] || "",
              });
            }
          }
          setFinalImageObjects(newImageObjects);
        }
      });
    }
  }, [isDropdownOpen, service2Data.id, fetchedIds, dispatch]);
  
  return (
    <>
      <div
        className="service-sec cursor-pointer"
        id="BtnItemTrckrView"
        onTouchStart={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="d-flex align-items-center  justify-content-center  jecet-box mb-1">
          <div className="jecet-icon">
            <img src={Cimages.jecek} alt="jecet-icon" />
          </div>
          <div className="jecet-name">{service2Data.desc}</div>
        </div>
        <UncontrolledDropdown
          className="user-dropdown table-Customer-col w-100 justify-content-center"
          isOpen={isDropdownOpen}
          toggle={() => {}}
          // onClick={openModal}
          ref={dropdownRef}
        >
          <DropdownToggle tag="a">
            <div className="avatar-stack mt-1">
              {service2Data.imgCount > 0 && (
                <>
                  <div
                    className="avatar-stack avtar-add-image d-flex w-fit"
                    id={`avtarImageTooltip`}
                    onClick={() =>
                      handleAction(
                        "BtnItemTrckrView",
                        "action",
                        handleCellClick,
                        service2Data
                        // balanceData.balanceData
                      )
                    }
                    // onClick={() => handleImageModel(service2Data.imageArray)}
                  >
                    {[...Array(Math.min(service2Data.imgCount, 4))].map(
                      (_, index) => (
                        <div className="avatar-item" key={index}>
                          <img
                            className="avatar rounded-circle"
                            src={Cimages.jecek}
                            alt={`dummy-${index}`}
                            width="25px"
                            height="25px"
                          />
                        </div>
                      )
                    )}

                    {service2Data.imgCount > 4 ? (
                      <div className="avatar-item">
                        <span className="avatar">
                          +{service2Data.imgCount - 4}
                        </span>
                      </div>
                    ) : (
                      <div className="">
                        <span className=""></span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </DropdownToggle>

          {service2Data.imgCount > 0 && (
            <DropdownMenu
              container="body"
              className="pl-2 pr-2 dropdown-menu-custom dropdown-menu-s1"
              style={{ position: "absolute", top: 0, zIndex: 1 }}
            >
              <div className="dropdown-body p-2">
                <div className="avtar-rows-container">
                  {finalImageObjects ? (
                    finalImageObjects?.reduce((rows, img, ind) => {
                      if (ind % 5 === 0) {
                        // Start a new row for every 5 images
                        rows.push(
                          <div
                            className="avtar-row"
                            key={ind / 5}
                            style={{ marginTop: ind === 5 ? "3px" : "0" }}
                          >
                            {finalImageObjects
                              ?.slice(ind, ind + 5)
                              .map((item, innerInd) => (
                                <div
                                  className="avatar-image"
                                  key={ind + innerInd}
                                >
                                  <img
                                    className="avatar"
                                    src={item.image}
                                    alt={`image-${ind + innerInd}`}
                                    onClick={(e) =>
                                      handleImageClick(e, item, ind + innerInd)
                                    }
                                  />
                                </div>
                              ))}
                          </div>
                        );
                      }
                      return rows;
                    }, [])
                  ) : (
                    <div className="avtar-row">
                      {Array.from(
                        { length: Math.ceil(service2Data.imgCount / 5) * 5 },
                        (_, ind) => {
                          if (ind < service2Data.imgCount) {
                            return (
                              <div className="avatar-image" key={ind}>
                                <Spinner />
                              </div>
                            );
                          }
                          return null;
                        }
                      )}
                    </div>
                  )}
                </div>
              </div>
            </DropdownMenu>
          )}
        </UncontrolledDropdown>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} toggle={closeModal} size="md">
        <ModalBody className="overflow-hidden border-bottom-red">
          <ImagesSlider
            service2Data={finalImageObjects}
            // images={images}
            activeImg={activeImg}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default CustomService2Cell;

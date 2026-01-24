import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Import Swiper's base CSS
import "swiper/css/navigation"; // Import navigation CSS
import "swiper/css/pagination"; // Import pagination CSS
import { Navigation, Pagination } from "swiper/modules"; // Import Swiper modules
// import images from './../../../Images/CommonImageFile';
import icon from "./../../../Images/CommonIconFile";

import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";

const ImagesSlider = ({ service2Data, activeImg }) => {
  const [activeIndex, setActiveIndex] = useState(activeImg);
  const [singleImg, setSingleImg] = useState();
  const [isModalOpen, setModalIsOpen] = useState(false);

  const swiperRef = useRef(null);
 

  const handleSingleImageClick = (singleImage, index) => {
    setModalIsOpen(true);
    setSingleImg(index);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handlePrint = () => {
    // Find the currently active slide
    const activeSlide = swiperRef.current.swiper.slides[swiperRef.current.swiper.activeIndex];
    // Find the image within the active slide
    const activeImage = activeSlide.querySelector('.slider-images');
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Generate HTML content for printing
    const printContent = `
      <html>
        <head>
          <title>Print</title>
          <style>
            /* Add any additional styling here */
          </style>
        </head>
        <body>
         <img id="printImage" src="${activeImage.src}" alt="Active Image" />
        </body>
      </html>
    `;
    
    // Write content to the new window
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    const printImage = printWindow.document.getElementById('printImage');
    printImage.onload = () => {
      printWindow.print();
      printWindow.close(); // Close the print window after printing
    };

    
  };
  return (
    <>
      <Swiper
        navigation={true}
        loop
        modules={[Navigation, Pagination]} // Add both Navigation and Pagination modules
        className="mySwiper"
        initialSlide={activeIndex}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        ref={swiperRef}
        pagination={{
          dynamicBullets: true,
          el: ".swiper-pagination", // Reference to the pagination element
          clickable: true, // Enable clickable bullets
          renderBullet: function(index, className) {
            return `<span class="${className}">
                <img src="${
                  service2Data[index].image
                }" alt="Image ${index + 1}" />
              </span>`; // Customize the pagination bullet
          },
        }}
      >
        {service2Data?.map((avatarImage, index) => (
          <SwiperSlide key={index}>
            <div className="d-flex justify-content-center">
              <img
                src={avatarImage.image}
                alt="avatarImages"
                className="slider-images "
                width="100px"
                height="400px"
                onClick={() => handleSingleImageClick(avatarImage.image, index)}
              />
            </div>
            <div className="modal-photo-dec">
              <div className="d-flex align-items-center justify-content-end">
                
                <div className="print-icon">
                  <img
                    src={icon.printerIcon}
                    alt="printer-icon"
                    className="cursor-pointer"
                    onClick={handlePrint}
                  />
                </div>
              </div>
              <div className="p-dec mt-1">
              {avatarImage.desc}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="position-relative " style={{ height: 80 }}>
        <div className="swiper-pagination"></div>
      </div>

      <Modal
        isOpen={isModalOpen}
        toggle={closeModal}
        size="lg"
        className="singe-image-slider"
      >
        <div className="overflow-hidden">
          <Swiper
            navigation={true}
            loop
            modules={[Navigation]} // Add both Navigation and Pagination modules
            className="mySwiper"
            initialSlide={singleImg}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            ref={swiperRef}
          >
            {service2Data?.map((avatarImage, index) => (
              <SwiperSlide key={index}>
                <div className="">
                  <img
                    src={avatarImage.image}
                    alt="avatarImages"
                    className="w-100"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Modal>
    </>
  );
};

export default ImagesSlider;

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation"; // Import navigation CSS
import "swiper/css/pagination"; // Import pagination CSS
import { Navigation, Pagination } from "swiper/modules"; // Import Swiper modules
import zoomIn from "./../../../../images/icons/zoom-icon.svg";
import zoomOut from "./../../../../images/icons/zoom-out.svg";
import imageFocus from "./../../../../images/icons/imgae_focus-icon.svg";
// import { ReactImageZoom } from "react-image-zoom";

const ImagesSlider = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const swiperRef = useRef(null);
  const [zoom, setZoom] = useState({});

  const containerRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(null);
  const [scrollLeft, setScrollLeft] = useState(null);

  const handleZoomIn = (curuntimage) => {
    const actimg = document.querySelectorAll("." + curuntimage);
    const currentValue =
      zoom[curuntimage] !== undefined ? +zoom[curuntimage]?.toFixed(2) : 1;
    actimg.forEach((actimg) => {
      actimg.style.transition = "transform 0.2s";
      actimg.style.transform = `scale(${currentValue + 0.1})`;
      // Add more styles as needed
    });
    setZoom({ ...zoom, [curuntimage]: currentValue + 0.1 });
  };

  const handleZoomOut = (curuntimage) => {
    const actimg = document.querySelectorAll("." + curuntimage);
    const currentValue =
      zoom[curuntimage] !== undefined ? +zoom[curuntimage]?.toFixed(2) : 1;
    actimg.forEach((actimg) => {
      actimg.style.transition = "transform 0.2s";
      actimg.style.transform = `scale(${currentValue - 0.1})`;
      // Add more styles as needed
    });
    setZoom({ ...zoom, [curuntimage]: currentValue - 0.1 });
  };

  const handleFullscreenImage = (curuntimageclass, img) => {
    setLightboxImage(img);
    setFullscreen(true);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    setFullscreen(false);
  };

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) return;
    e.preventDefault();

    const x = e.pageX - containerRef.current.offsetLeft;
    const y = e.pageY - containerRef.current.offsetTop;

    const walkX = (x - startX) * 2; // Adjust scroll speed here
    const walkY = (y - startY) * 2; // Adjust scroll speed here

    containerRef.current.scrollLeft = scrollLeft - walkX;
    containerRef.current.scrollTop = scrollTop - walkY;
  };
  return (
    <>
      {/* <button onClick={handleZoom}>
        <img src={zoomIn} alt="" />
      </button> */}

      <Swiper
        // navigation={true}
        loop
        spaceBetween={24}
        modules={[Navigation, Pagination]}
        initialSlide={activeIndex}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        ref={swiperRef}
        navigation={{
          nextEl: ".custom-next-button", // Provide a selector or HTMLElement for the next button
          prevEl: ".custom-prev-button", // Provide a selector or HTMLElement for the prev button
        }}
        pagination={{
          dynamicBullets: true,
          el: ".swiper-pagination",
          clickable: true,
          renderBullet: function(index, className) {
            return `<span class="${className}">
                <img src="${images[index]?.image}" alt="Image ${index + 1}" />
              </span>`;
          },
        }}
      >
        {images?.map((avatarImage, index) => (
          <SwiperSlide key={index}>
            <div className="d-flex justify-content-center align-items-center slider-images-customm">
              <div className="position-relative w-100">
                <div>
                  <div className="custome-min-h">{avatarImage.desc}</div>
                  <div className="position-absolute zoom-btn-position d-flex  gap-1">
                    <div
                      className="zoom-btn-style "
                      onClick={() => {
                        handleFullscreenImage(
                          "avatarImage_" + index,
                          avatarImage.image
                        );
                      }}
                    >
                      <img src={imageFocus} alt="" />
                    </div>

                    {activeIndex == index &&
                      zoom[`avatarImage_${index}`] >= 1.1 && (
                        <div
                          className="zoom-btn-style"
                          onClick={() => {
                            handleZoomOut("avatarImage_" + index);
                          }}
                        >
                          <img src={zoomOut} alt="" />
                        </div>
                      )}

                    <div
                      className="zoom-btn-style "
                      onClick={() => {
                        handleZoomIn("avatarImage_" + index);
                      }}
                    >
                      <img src={zoomIn} alt="" />
                    </div>
                  </div>
                  <div className="sl-image position-relative">
                    {/* <div>
                      {" "}
                      <img
                        src={avatarImage.image}
                        alt="avatarImages"
                        className="img-fluid"
                        style={{
                          transform: `scale(${zoom})`, // Apply the zoom factor
                          transition: "transform 0.2s", // Add a smooth transition
                          transformOrigin: "0 0",

                          overflow: "hidden", // Set the transformation origin to the top-left corner
                        }}
                        {` ${fullscreen ? "fullscreen" : ""}`}
                      />
                    </div> */}
                    <div
                      className={`img-section w-100 h-100 ${
                        fullscreen ? "fullscreen" : ""
                      }`}
                      style={{ whiteSpace: "nowrap" }}
                      ref={containerRef}
                      onMouseDown={handleMouseDown}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                    >
                      <img
                        src={avatarImage.image}
                        className={`img-fluid w-100 h-100 avatarImage_${index}`}
                        alt={avatarImage.image}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="custom-next-button">
        <svg
          width="16"
          height="26"
          viewBox="0 0 16 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.64844 2L12.9984 13L1.64844 24"
            stroke="#1C2B4C"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <div className="custom-prev-button">
        <svg
          width="16"
          height="26"
          viewBox="0 0 16 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.3516 2L3.00162 13L14.3516 24"
            stroke="#1C2B4C"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </div>

      <div className="position-relative " style={{ height: 80 }}>
        <div className="swiper-pagination"></div>
      </div>

      {fullscreen && (
        <div className="position-absolute top-0 start-0 w-100 h-100 ">
          <div className="lightbox-modal-overlay" onClick={closeLightbox}>
            <div className="lightbox-modal">
              <img src={lightboxImage} alt="Fullscreen" className="img-fluid" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImagesSlider;

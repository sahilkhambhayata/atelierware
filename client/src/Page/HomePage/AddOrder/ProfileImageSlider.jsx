import React, { useRef, useState } from "react";
import { axiosClient } from "../../../axios/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation"; // Import navigation CSS
import "swiper/css/pagination"; // Import pagination CSS
import { Navigation, Pagination } from "swiper/modules"; // Import Swiper modules

// import imageFocus from "./../../../../images/icons/imgae_focus-icon.svg";
// import { ReactImageZoom } from "react-image-zoom";

const ProfileImageSlider = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  return (
    <>
      <Swiper
        loop
        spaceBetween={24}
        modules={[Navigation, Pagination]}
        initialSlide={activeIndex}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        ref={swiperRef}
        navigation={{
          nextEl: ".custom-next-button",
          prevEl: ".custom-prev-button",
        }}
        pagination={{
          dynamicBullets: true,
          el: ".swiper-pagination",
          clickable: true,
          renderBullet: (index, className) => {
            const imageSrc = !images[index] ? ""
              : images[index].startsWith?.("data:") || images[index].startsWith?.("http")
                ? images[index]
                : `${axiosClient.defaults.baseURL}${images[index]}`;
            return `<span class="${className}">
                <img src="${imageSrc}" alt="Image ${index + 1}" />
              </span>`;
          },
        }}
      >
        {images?.map((avatarImage, index) => {

          return (
            <SwiperSlide key={index}>
              <div className="d-flex justify-content-center align-items-center slider-images-customm">
                <div className="position-relative w-100">

                  <div className="sl-image position-relative">
                    <div className="img-section w-100 h-100">
                      <img
                        src={
                          !avatarImage ? null
                            : avatarImage.startsWith?.("data:") || avatarImage.startsWith?.("http")
                              ? avatarImage
                              : `${axiosClient.defaults.baseURL}${avatarImage}`
                        }
                        className={`img-fluid w-100 h-100 avatarImage_${index}`}
                        alt={avatarImage}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
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
            strokeWidth="3"
            strokeLinecap="round"
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
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="position-relative " style={{ height: 80 }}>
        <div className="swiper-pagination"></div>
      </div>
    </>
  );
};

export default ProfileImageSlider;

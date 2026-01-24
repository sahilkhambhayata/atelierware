import React from "react";
import data from "./NotificationData";
import { DropdownToggle, DropdownMenu, UncontrolledDropdown } from "reactstrap";
import Icon from "../../../../Components/icon/Icon";

const NotificationItem = (props) => {
  const { icon, iconStyle, text, userName, date, time, id } = props;
  return (
    <div className="p-2 " key={id} id={id}>
      <div className="nk-notification-content">
        <div className="d-flex justify-content-between">
          <div>
            <div
              className="nk-notification-text fw-normal"
              style={{ fontSize: "15px" }}
            >
              {text}
            </div>
            <div className="nk-notification-time">{userName}</div>
          </div>
          <div>
            <div className="nk-notification-time">{date}</div>
            <div className="nk-notification-time">{time}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Notification = () => {
  return (
    <UncontrolledDropdown className="user-dropdown">
      <DropdownToggle tag="a" className="dropdown-toggle nk-quick-nav-icon">
        <div className="icon-status icon-status-info">
          <Icon name="bell" />
        </div>
      </DropdownToggle>
      <DropdownMenu
        end
        className=" dropdown-menu-s1"
        style={{ width: "350px", height: "auto" }}
      >
        <div className="dropdown-head">
          <span className="sub-title nk-dropdown-title fw-bold fs-6">
            {data.title}
          </span>
        </div>

        <div className="d-flex justify-content-center p-5 mb-5">
          <div className="text-center">
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_128_1435)">
                <path
                  d="M91.2504 78.139L90.306 77.3057C87.6274 74.9177 85.2822 72.1802 83.3338 69.1668C81.2045 65.008 79.9295 60.465 79.5838 55.8057V42.0834C79.6022 34.7657 76.9477 27.6931 72.1192 22.1945C67.2906 16.6959 60.6203 13.1497 53.3615 12.2223V8.639C53.3615 7.65549 52.9708 6.71226 52.2754 6.01681C51.58 5.32136 50.6367 4.93066 49.6532 4.93066C48.6697 4.93066 47.7265 5.32136 47.031 6.01681C46.3356 6.71226 45.9449 7.65549 45.9449 8.639V12.2779C38.7511 13.2721 32.1615 16.8397 27.3963 22.3198C22.6312 27.8 20.0136 34.8213 20.0282 42.0834V55.8057C19.6825 60.465 18.4075 65.008 16.2782 69.1668C14.364 72.1733 12.0565 74.9105 9.4171 77.3057L8.47266 78.139V85.9723H91.2504V78.139Z"
                  fill="#D1D1D1"
                />
                <path
                  d="M42.5547 88.8887C42.7983 90.6494 43.6708 92.2626 45.011 93.4302C46.3513 94.5978 48.0688 95.241 49.8464 95.241C51.6239 95.241 53.3414 94.5978 54.6817 93.4302C56.0219 92.2626 56.8944 90.6494 57.138 88.8887H42.5547Z"
                  fill="#D1D1D1"
                />
              </g>
              <defs>
                <clipPath id="clip0_128_1435">
                  <rect width="100" height="100" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <p className="fw-bold fs-6">Your Notification Live Here.</p>
          </div>
        </div>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default Notification;

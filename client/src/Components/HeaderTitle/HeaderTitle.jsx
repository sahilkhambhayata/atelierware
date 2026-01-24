import React, { useEffect, useState } from "react";
import { BlockDes, BlockHeadContent, BlockTitle } from "../Block/Block";
import ExportIcon from "../../images/icons/export-icon.svg";
import { Button } from "reactstrap";
import Icon from "../icon/Icon";
import TrainingIcon from "../../images/icons/training-icon.svg";
import ItemTrackerIcon from "../../images/icons/item-traker-icon.svg";
import inventoryIcon from "../../images/icons/inventory-icon.svg";
import Training from "../../Layout/header/dropdown/training/Training";
import { useLocation, useNavigate } from "react-router";
import { usePermissions } from "../../Layout/Provider/PermissionsContext";

const HeaderTitle = ({ title }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();
  const { handleAction } = usePermissions();

  //date and time
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // Update the date every second

    return () => {
      clearInterval(intervalId); // Cleanup interval on component unmount
    };
  }, []);

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    return date.toLocaleString(undefined, options);
  };
  const location = useLocation();

  const handleItemTracker = () => {
    if (location.pathname === "/item-tracker") navigate("/dashboard");
    else {
      navigate("/item-tracker");
    }
  };
  return (
    <div className="d-flex">
      <div className="d-flex align-items-center">
        <BlockHeadContent>
          <BlockTitle page>{title}</BlockTitle>
          <div className="d-none d-xl-block">
            <BlockDes className="text-soft ">
              <p className="mb-0">{formatDate(currentDate)}</p>
            </BlockDes>
          </div>
        </BlockHeadContent>
        {location.pathname !== "/role" && location.pathname !== "/user" && (
          <>
            <Button
              color="custom"
              className="pe-2 m-2"
              onClick={() =>
                handleAction("PgItemTracker", "page", handleItemTracker)
              }
              // onClick={handleItemTracker}
            >
              {/* <Icon name="plus"></Icon> */}
              <img
                src={ItemTrackerIcon}
                alt="Training"
                className="me-2  text-white"
              />
              <div className="text-white d-xl-block d-none">
                {title === "Item Tracker" ? "Order Tracker" : "Item Tracker"}
              </div>
            </Button>
            {/* <Button color="custom" className="btn-icon pe-2 ps-1">
              <Training />
            </Button> */}
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderTitle;

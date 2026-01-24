import React, { useEffect, useState } from "react";
import {
  Button,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import noImageIcon from "./../../../../../../images/icons/no-image-icon.svg";
import DownArrowIcon from "./../../../../../../images/icons/down-arrow.svg";
import UpArrowIcon from "./../../../../../../images/icons/up-arrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { getStyleHeadDataAction } from "../../../../../../redux/actions/getStyleHeadDataAction";
import { useTheme } from "../../../../../../Layout/Provider/Themes";
import { toast } from "react-toastify";

const StyleSearch = ({
  mood,
  styleData,
  setStyleData,
  setActiveId,
  activeID,
  modelStyle,
  onModelOpenChange,
  // selectedButton,
  // selectedColar,
  // selectedPocket,
  // selectedCuff,
  selectedImage,
  singleImageRecord,
  setSingleImageRecord,
  setDetailsData,
  saveStyleHeadData,
  setSaveStyleHeadData,
}) => {
  const { tabId } = useTheme();
  const symbol = localStorage.getItem("countrySymbol");
  const [isChecked, setIsChecked] = useState(false);
  // const [modelOpen, setmodelOpen] = useState(false);

  const BU_ID = localStorage.getItem("BU_Id");
  const serviceId = localStorage.getItem(`serviceId${tabId}`);
  const dispatch = useDispatch();

  const getStyleHeadData = useSelector(
    (state) => state?.getStyleHeadData?.customer
  );

  const handleCheckboxChange = () => {
    if (mood == "view") {
      toast.error("You have no rights to change");
    } else {
      setIsChecked(!isChecked);
    }
  };
  const [modelMeasurement, setModelMeasurement] = useState(false);

  const [selectedMeas, setSelectedMeas] = useState("Copy Style From");
  const toggleDropdownMeasurement = () => {
    setModelMeasurement(!modelMeasurement);
    // setisOpenDropdown(!modelStatus);
  };
  const singleOrderData = useSelector((state) => state.orderListData.single);

  const formattedDate = new Date(
    singleOrderData?.orderItemList?.[0]?.LastUpdateddate
  )?.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  useEffect(() => {
    setSingleImageRecord(singleOrderData);
  }, [singleOrderData]);
  const handleSelectStyleImage = (item) => {
    // if (Object.keys(singleOrderData).length !== 0) {
    //   if (singleOrderData.orderItemList[0]) {

    //     // setActiveId(singleOrderData.orderItemList[0].imageOrdStyle[0])
    //   }}
    if (mood == "edit") {
      toast.error("You have no rights to change");
    } else {
      setActiveId(item.StyleId);
      setDetailsData(item);
      // setSingleImageRecord()
      // setStyleData(item);
      setStyleData(getStyleHeadData.orderItemList);
      onModelOpenChange(!modelStyle);
    }
  };

  const [newArray, setNewArray] = useState({});
  const [finalArr, setFinalArr] = useState([]);
  // useEffect(() => {

  //   // const key = `s${item.CNTSID}`;
  //   if (Object.keys(singleOrderData).length !== 0) {
  //     if (singleOrderData.orderItemList[0]) {
  //       const arr = singleOrderData?.orderItemList[0]?.imageOrdStyle?.map(
  //         (res) => res.details
  //       );
  //       setFinalArr(arr?.filter((res) => res !== undefined).flat(1));
  //       const superFinalArr = {};

  //       finalArr?.forEach((res) => {
  //         setSaveStyleHeadData((prevData) => ({
  //           ...prevData,
  //           ["S" + res.CNTSID]: res.StyleId,
  //           ["OP" + res.CNTSID]: res.Options,
  //           ["Amt" + res.CNTSID]: res.Amount,
  //         }));
  //         superFinalArr[res.StyleId] = res;
  //       });

  //       //   finalArr?.map((val) => {
  //       //     superFinalArr[val.StyleId] = val;
  //       //     return {
  //       //       [val.StyleId]: val,
  //       //     };
  //       //   });

  //       setNewArray({ ...singleImageRecord, ...superFinalArr });
  //     }
  //   }
  //   // if(getStyleHeadData.orderItemList !== undefined){
  //   //   const matchedItems = getStyleHeadData?.orderItemList?.filter(item =>
  //   //     finalArr?.some(detail => detail.StyleId === item.StyleId)
  //   //   );
  //   //   setSingleImageRecord(matchedItems);
  //   // }
  // }, [singleOrderData]);

  const [isLoader, setIsLoader] = useState(false);
  const [isStyle, setIsStyle] = useState(true);
  useEffect(() => {
    setIsLoader(true);
    if (serviceId) {
      dispatch(getStyleHeadDataAction(BU_ID, serviceId)).then((data) => {
        if (data.success === true) {
          setIsLoader(false);
        } else {
          setTimeout(() => {
            setIsStyle(false);
            setIsLoader(false);
          }, 3000);
        }
      });
    }
  }, [serviceId]);

  useEffect(() => {
    if (getStyleHeadData.orderItemList !== undefined) {
      const arr = getStyleHeadData.orderItemList.map((res) => {
        if (res.details.filter((val) => val.IsDefault === true).length !== 0) {
          return res.details.filter((val) => val.IsDefault === true);
        }
      });

      const finalArr = arr.filter((res) => res !== undefined).flat(1);
      finalArr.forEach((res) =>
        setSaveStyleHeadData((prevData) => ({
          ...prevData,
          ["S" + res.CNTSID]: res.StyleId,
          ["OP" + res.CNTSID]: res.Options,
          ["Amt" + res.CNTSID]: res.Amount,
        }))
      );
      let superFinalArr = {};
      finalArr.map((val) => {
        superFinalArr[val.StyleId] = val;
        return {
          [val.StyleId]: val,
        };
      });

      const newArrar = { ...singleImageRecord, ...superFinalArr };

      setSingleImageRecord(newArrar);
    }
  }, [singleOrderData, getStyleHeadData]);

  const handleKeyDown = (e) => {
    if (mood === "view") {
      e.preventDefault();
      toast.error("You have no rights to change");
    }
  };

  return (
    <>
      <UncontrolledDropdown
        isOpen={modelMeasurement}
        toggle={toggleDropdownMeasurement}
        className="user-dropdown w-100 "
      >
        <DropdownToggle
          tag="a"
          className="dropdown-toggle border-dark rounded w-100"
        >
          <Button
            outline
            className="w-100 d-flex justify-content-between"
            color="light"
          >
            <span className="text-dark d-none d-md-block">{selectedMeas}</span>
            <img
              src={modelMeasurement ? UpArrowIcon : DownArrowIcon}
              className={`ms-1 text-dark text-end`}
              width="15px"
            ></img>
          </Button>
        </DropdownToggle>
        <DropdownMenu
          className="dropdown-menu-s1 dropdown-menu-custom-width link-list-opt"
          style={{ width: "100%" }}
        >
          {" "}
          {""}{" "}
        </DropdownMenu>
      </UncontrolledDropdown>
      <div>
        {/* <span className="fw-bold"> Copy Styles from</span> */}
        <div className="row align-items-center text-center">
          {/* {Object.keys(singleOrderData).length !== 0 &&
          singleOrderData.orderItemList[0].imageOrdStyle
            ? // ? singleOrderData.orderItemList[0]?.imageOrdStyle?.map(
              //      (item, i) => {
              getStyleHeadData?.orderItemList?.map((item, i) => {

                const matchingStyle = singleOrderData.orderItemList[0].imageOrdStyle.find(
                  (style) => style.StyleId === item.StyleId
                );


                return (
                  // <React.Fragment key={i}>
                  //   <div className="col-sm-6 col-12 col-md-3 mt-3 ">
                  //     <div onClick={() => handleSelectStyleImage(item)}>
                  //       <img
                  //         src={
                  //           singleImageRecord[item.StyleId] === undefined
                  //             ? noImageIcon
                  //             : singleImageRecord[item.StyleId].images
                  //         }
                  //         height="120px"
                  //         width="100%"
                  //         alt=""
                  //         className={`${
                  //           singleImageRecord[item.StyleId] === undefined
                  //             ? ""
                  //             : "object-fit"
                  //         }`}
                  //       />
                  //       <div className="text-md-start text-center px-md-2  px-0 mt-1">
                  //         <span className="fw-bold">{item.StyleName}</span>
                  //         <p className="custom-light-text">
                  //           {singleImageRecord?.[item.StyleId]?.Amount >
                  //             0 && (
                  //             <>
                  //               {symbol} {singleImageRecord?.[item.StyleId]?.Amount}
                  //             </>
                  //           )}
                  //         </p>
                  //       </div>
                  //     </div>
                  //   </div>
                  // </React.Fragment>
                  <React.Fragment key={i}>
                    <div className="col-sm-6 col-12 col-md-3 mt-3 ">
                      <div onClick={() => handleSelectStyleImage(item)}>
                        <img
                          src={
                            matchingStyle
                              ? matchingStyle.details[0].images
                              : noImageIcon
                          }
                          height="120px"
                          width="100%"
                          alt=""
                          className={`${matchingStyle ? "object-fit" : ""}`}
                        />
                        <div className="text-md-start text-center px-md-2  px-0 mt-1">
                          <span className="fw-bold">{item.StyleName}</span>
                          <p className="custom-light-text">
                            {matchingStyle?.details[0]?.Amount > 0 && (
                              <>{symbol} {matchingStyle.details[0].Amount}</>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            : getStyleHeadData?.orderItemList?.map((item, i) => {
                return (
                  <React.Fragment key={i}>
                    <div className="col-sm-6 col-12 col-md-3 mt-3 ">
                      <div onClick={() => handleSelectStyleImage(item)}>
                        <img
                          src={
                            singleImageRecord[item.StyleId] === undefined
                              ? noImageIcon
                              : singleImageRecord[item.StyleId].images
                          }
                          height="120px"
                          width="100%"
                          alt=""
                          className={`${
                            singleImageRecord[item.StyleId] === undefined
                              ? ""
                              : "object-fit"
                          }`}
                        />
                        <div className="text-md-start text-center px-md-2  px-0 mt-1">
                          <span className="fw-bold">{item.StyleName}</span>
                          <p className="custom-light-text">
                            {singleImageRecord?.[item.StyleId]?.Amount > 0 && (
                              <>{symbol} {singleImageRecord?.[item.StyleId]?.Amount}</>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })} */}

          {isLoader ? (
            <div className="w-100 d-flex justify-content-center">
              <Spinner color="dark" className="my-2" />
            </div>
          ) : !isStyle ? (
            <>No Data Found</>
          ) : (
            getStyleHeadData?.orderItemList?.map((item, i) => {
              return (
                <React.Fragment key={i}>
                  <div className="col-sm-6 col-12 col-md-3 mt-3 ">
                    <div onClick={() => handleSelectStyleImage(item)}>
                      <img
                        src={
                          singleImageRecord[item.StyleId] === undefined
                            ? noImageIcon
                            : singleImageRecord[item.StyleId].images
                        }
                        height="120px"
                        width="100%"
                        alt=""
                        className={`${
                          singleImageRecord[item.StyleId] === undefined
                            ? ""
                            : "object-fit"
                        }`}
                      />
                      <div className="text-md-start text-center px-md-2  px-0 mt-1">
                        <span className="fw-bold">{item.StyleName}</span>
                        <p className="custom-light-text custom-text-transform">
                          {singleImageRecord?.[item.StyleId]?.Amount > 0 && (
                            <>
                              {symbol}{" "}
                              {singleImageRecord?.[item.StyleId]?.Amount}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}
        </div>
      </div>

      <div className="row align-items-center justify-content-between ">
        {/* <div className="d-flex align-items-center p-2 col-md-8 col-12">
          <input
            type="checkbox"
            // name=""
            checked={isChecked}
            id="Training-Mode"
            onChange={handleCheckboxChange}
            style={{ backgroundColor: "black" }}
            className="mr-2"
          />
          <span
            htmlFor="Dyeing"
            className="custom-light-text custom-text-transform text-wrap"
          >
            Save This Styles to all Similar Garments in This Order
          </span>
        </div> */}
        <div className=" col-12 text-end">
          <span className="custom-light-text custom-text-transform">
            {formattedDate}
          </span>
        </div>
      </div>
    </>
  );
};

export default StyleSearch;

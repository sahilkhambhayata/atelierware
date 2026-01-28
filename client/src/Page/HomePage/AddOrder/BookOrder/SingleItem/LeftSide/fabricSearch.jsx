import React, { useEffect, useRef, useState } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  Button,
  DropdownItem,
  UncontrolledTooltip,
  Spinner,
  //   Form,
  // Button,
} from "reactstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Icon from "../../../../../../Components/icon/Icon";

import SherwaniImage from "./../../../../../../images/avatar/sherwani-image.png";
import addIcon from "./../../../../../../images/icons/add-icon.svg";
import barcodeImg from "./../../../../../../images/icons/odertable-barcode.svg";
import DownArrowIcon from "./../../../../../../images/icons/down-arrow.svg";
import UpArrowIcon from "./../../../../../../images/icons/up-arrow.svg";
import cameraIcon from "./../../../../../../images/icons/camera-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { getFabricAccDetailsAsyncData } from "../../../../../../redux/actions/fabricAccessoriesSearchAction";
import {
  createDebouncedSearchFabric,
  getFebricSearchDetailsAsyncData,
} from "../../../../../../redux/actions/getFebricAction";
import {
  getSingleArticleDetailsAsyncData,
  getSingleFabricAction,
} from "../../../../../../redux/actions/GetSingleArticleDetailsAction";
import FabricSkeleton from "./fabricSkeleton";
import {
  addFabricAccessories,
  getFabricAccessoriesList,
} from "../../../../../../redux/actions/fabricAndAccessoriesCrudAction";
// import {
//   AddOrderBook,
//   generateTOrdDtId,
// } from "../../../../../../redux/actions/AddOrderBookAction";
import { toast } from "react-toastify";

import { useTheme } from "../../../../../../Layout/Provider/Themes";
import Tooltip from "../../../../../../Components/Tooltip/Tooltip";
import { usePermissions } from "../../../../../../Layout/Provider/PermissionsContext";
const FabricSearch = ({
  onCountChange,
  mood,
  onDataChange,
  handleAddFabricSuccess,
}) => {
  const { tabId } = useTheme();
  const symbol = localStorage.getItem("countrySymbol");
  const [modelStatus, setModelStatus] = useState(false);

  const getFebData = useSelector((state) => state?.getSingleArticleDetails);
  const getConfig = useSelector((state) => state?.config?.orderType);
  const fabricDropDownList = useSelector((state) => state.fabricDropDownList);

  const RoundUpToDecimal =
    getConfig?.RoundUpToDecimal == 0 ||
      getConfig?.RoundUpToDecimal == undefined ||
      getConfig?.RoundUpToDecimal == null
      ? 2
      : getConfig?.RoundUpToDecimal;

  let val = getFebData?.single;

  // const [haveCamera, setHaveCamera] = useState(true);
  const [formState, setFormState] = useState({
    qty: 0,
    price: 0,
    total: 0,
    description: "",
    isDyeing: false,
    dyeingOptionId: 0,
    dyeingOption: "Ask Designer",
    dyeingComment: "",
    modelFabric: false,
  });
  const { handleAction } = usePermissions();

  // const [fabricArray, setFabricArray] = useState([]);
  const {
    qty,
    price,
    description,
    total,
    isDyeing,
    dyeingOptionId,
    dyeingOption,
    dyeingComment,
    // selectedInst,
    // selectedFabric,
    modelFabric,
    // custom,
  } = formState;

  const dispatch = useDispatch();

  const BU_ID = localStorage.getItem("BU_Id");
  const serviceId = localStorage.getItem(`serviceId${tabId}`);

  useEffect(() => {
    // setSelectedFabricNo(fabricCount);
    // onDataChange({ formState });
    setFormState({
      qty: val.articleData ? val.Quantity : "",
      price: val.articleData ? val?.Total_Amount : val.Sale_Rate,
      total: 0,
      description: val.articleData ? val.Descriptions : "",
      isDyeing: val.articleData ? (val.IsDyeing ? true : false) : false,
      dyeingOptionId: val.articleData ? val.DyeingOptionId : 0,
      dyeingOption: val.articleData ? val.DyeingOption : "Ask Designer",
      dyeingComment: val.articleData ? val.DyeingComment : "",
      // selectedInst: "color Instructions",
      // selectedFabric: "Alternate Fabric 2",
      modelFabric: false,
      // custom: "",
    });
    // setIsChecked(false);
  }, [val]);

  useEffect(() => {
    setFormState({
      ...formState,
      total: Number(formState.qty) * Number(formState.price),
    });
  }, [formState.qty, formState.price]);

  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      dyeingComment: "",
    }));
  }, [dyeingOptionId]);

  const toggleDropdownStatus = () => {
    setModelStatus(!modelStatus);
  };

  const toggleDropdownFabric = () => {
    setFormState({ ...formState, modelFabric: !modelFabric });
  };

  const handleCheckboxChange = () => {
    setFormState({ ...formState, isDyeing: !isDyeing });
    // setIsChecked(!isChecked);
  };

  const singleFabricForEdit = useSelector(
    (state) => state?.fabricCRUDDetails?.single
  );

  const itemId = localStorage.getItem(`serviceId${tabId}`);
  const service = useSelector((state) => state?.service?.service?.orderDetails);
  const ItemID = useSelector(
    (state) => state?.service?.singleGroupService?.data?.itemDetails
  );
  // const ItemID = service.find((item) => item?.ItemId === itemId);

  let TOrdHdID = localStorage.getItem(`TOrdHdID${tabId}`);

  let TOrdDtID = localStorage.getItem(`TOrdDtID${tabId}`);

  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAddFabric = (data) => {
    if (formState.qty > 0) {
      setLoading(true);
      setCount(count + 1);

      const peremeter = {
        TOrd_FabricId: val.articleData ? val.TOrd_FabricId : null,

        TOrdHD_Id: Number(TOrdHdID),
        TOrdDtId: Number(TOrdDtID),
        SrNo: count,
        ItemID: Number(ItemID.ItemId),
        ItemType: data.ItemType,
        Item_name: data.ItemName,
        Quantity: formState.qty,
        Unit: data.Unit,
        Size_Id: data.size,
        Color_Id: data.Color,
        Descriptions: formState.description,
        ArticleID: data.Article_ID,
        BrandID: data.BrandID,
        Item_rate: formState.total ? formState.total : 0,
        Basic_Amt: data.MRP,
        VatPer: data.VatPercent,
        Total_Amount: formState.price,
        CompanyId: data.CompanyID,
        BranchId: data.BranchID,
        OutFitSize: data.Size,
        ActualCutQty: 2,
        StatusId: 1,
        AvailableQty: 0,
        IsDyeing: formState.isDyeing,
        DyeingOptionId: formState.dyeingOptionId,
        DyeingOption: formState.dyeingOption,
        DyeingComment: formState.dyeingComment,
      };

      dispatch(addFabricAccessories(peremeter)).then((data) => {
        if (data.success === true) {
          setFormState({
            qty: null,
            price: 0,
          });
          setFab("");
          if (TOrdDtID) {
            dispatch(getFabricAccessoriesList(TOrdDtID));
          }
          dispatch(getSingleFabricAction({}));
          toast.success(data.message);
          setLoading(false);
          const isAddFab = "add fabric";
          handleAddFabricSuccess(isAddFab);
        }
      });
      onDataChange(formState);
    } else {
      toast.error("Quantity Must Not Be Zero!");
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const instractionList = [
    {
      ind: 0,
      name: "Ask Designer",
    },

    {
      ind: 1,
      name: "Select Color",
    },
    {
      ind: 2,
      name: "Select Fabric",
    },
    {
      ind: 3,
      name: "Custom",
    },
  ];

  const debouncedSearchRef = useRef(createDebouncedSearchFabric());

  const handleFabricChange = (e) => {
    const inputValue = e.target.value;
    debouncedSearchRef.current(dispatch, e.target.value);
    // dispatch(getFebricSearchDetailsAsyncData(e.target.value));
    setFab(inputValue);
  };
  const [fab, setFab] = useState("");

  const [isInputFocused, setIsInputFocused] = useState(false);

  // Removed duplicate debounced search call
  // handleFabricChange already calls debouncedSearchRef.current when user types
  // This useEffect was causing duplicate searchFabOrAcc API calls (3x total)
  // useEffect(() => {
  //   debouncedSearchRef.current(dispatch, fab);
  // }, [fab]);

  const gerFabricSearchDetails = useSelector(
    (state) => state.FabricDetailsData
  );
  const handleSuggestionClick = (val) => {
    setFab(val.ArticleName);
    setIsInputFocused(false);
    dispatch(getSingleArticleDetailsAsyncData(val.Article_ID));
  };

  const [selectedFabric, setSelectedFabric] = useState("");

  const handleSelectFabric = (data) => {
    setSelectedFabric(data);
  };

  useEffect(() => {
    setFormState({ ...formState, dyeingComment: selectedFabric });
  }, [selectedFabric]);

  const [selectedColor, setSelectedColor] = useState("#000000"); // Initial color, you can set it to any default color

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    setFormState({ ...formState, dyeingComment: newColor });
  };
  const handleKeyDown = (e) => {
    if (mood === "view") {
      e.preventDefault();
      toast.error("You have no rights to change");
    }
  };

  return (
    <>
      <div className="mx-2 my-2 position-relative">
        <input
          type="text"
          id="default-01"
          value={fab}
          onChange={handleFabricChange}
          placeholder="Search Fabric / Accessories By Name And Barcode"
          className="form-control-lg form-control search-input"
          autoComplete="off"
          readOnly={mood === "view"}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setFab("");
            setIsInputFocused(true);
          }}
          onBlur={() => {
            // Using setTimeout to handle the case where onBlur is triggered before onClick when clicking outside
            setTimeout(() => {
              setIsInputFocused(false);
            }, 300);
          }}
        />

        <Icon
          name="search"
          className="position-absolute fs-5"
          style={{ top: "15px", left: "8px" }}
        ></Icon>
      </div>

      {isInputFocused && (
        <div className=" bg-white fabricAutoCompalate position-absolute">
          {gerFabricSearchDetails.FebricData.message == "No data found" ? (
            <>NO Data Found</>
          ) : gerFabricSearchDetails.isLoader ? (
            <>loading....</>
          ) : (
            gerFabricSearchDetails?.FebricData?.SearchArticle?.map(
              (val, ind) => (
                <div
                  key={ind}
                  className="fabricAutoCompalate-items"
                  onClick={() => handleSuggestionClick(val)}
                >
                  {val.ArticleName}
                </div>
              )
            )
          )}
        </div>
      )}

      {Object.keys(val).length !== 0 ? (
        <>
          <div className="position-relative nk-header-searchbox border m-0">
            <div className="border p-1 d-flex m-2 justify-content-between img_con_leb">
              <div className="d-flex w-100 align-items-center extra-sm-col">
                <div className="fabCol-img">
                  <img src={SherwaniImage} alt="" height="80px" className="" />
                </div>
                <div className="d-flex  fab-py-2 fab-p-0 align-items-center  cst-w-exsmall">
                  <div className="col-md-6 col-12 py-1 py-md-0 csto-col-st">
                    <div className="custom-border-right d-flex aling-items-center cstflexcol-md">
                      <h6 className="mb-0" id="single-ArticleName-tooltip">
                        {val.articleData ? (
                          <>
                            {val.articleData.ArticleName.length > 8
                              ? val.articleData.ArticleName?.slice(0, 8) + "..."
                              : val.articleData.ArticleName}

                            {val.articleData.ArticleName.length > 8 && (
                              <Tooltip
                                id={`single-ArticleName-tooltip`}
                                direction="right"
                                text={val.articleData.ArticleName}
                              />
                            )}
                          </>
                        ) : (
                          <>

                            {val.ArticleName.length > 8
                              ? val.ArticleName?.slice(0, 8) + "..."
                              : val.ArticleName}

                            {val.ArticleName.length > 8 && (
                              <Tooltip
                                id={`single-ArticleName-tooltip`}
                                direction="right"
                                text={val.ArticleName}
                              />
                            )}
                          </>
                        )}
                      </h6>

                      <span className="fab-title custom-light-text custom-text-transform">
                        {"("}
                        {val.articleData
                          ? val.articleData.Brandtbl.BrandName
                          : val.BrandName}
                        {/* {val.BrandName} */}
                        {")"}
                      </span>
                    </div>
                    <div className="row p-2  pb-0 align-items-center sig-fab-inp-filds">
                      <div className="col-12"></div>
                    </div>
                  </div>
                  <div className="customer-name custom-light-text custom-text-transform col-md-6 col-12  py-1 py-md-0 csto-col-sec">
                    <div className="fab-title">
                      {val.Barcode !== null ? (
                        <>
                          {val.articleData ? (
                            <>
                              {val.articleData.Barcode !== null && (
                                <img src={barcodeImg} alt="" />
                              )}
                              {val.articleData.Barcode}
                            </>
                          ) : (
                            <>
                              <img src={barcodeImg} alt="" /> {val.Barcode}
                            </>
                          )}
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                    {val.articleData ? val.Item_name : val.ItemName}
                    <br />
                    {val.articleData
                      ? val.articleData.Colortbl.ColourName
                      : val.BrandName}{" "}
                    | size -{" "}
                    {val.articleData ? val.articleData.Sizetbl.Size : val.Size}
                  </div>
                </div>
              </div>

              <div className=" csu-col-2 px-0 fabcol-100 custom-mt">
                <div
                  className=" text-white text-center custom-yello-box px-2 "
                  id="stock"
                >
                  <span className="fs-12 mb-0">
                    {val.OppStock} {val?.Unit}
                  </span>
                  <Tooltip
                    id={`stock`}
                    direction="right"
                    text={`${val.OppStock} ${val.Unit} stock Available`}
                  />
                </div>
                <div
                  className="text-white text-center custom-green-box px-2 "
                  id="tax"
                >
                  <span className="fs-12 mb-0">
                    {val.articleData ? "GST" : val.TaxationType} -{" "}
                    {val.articleData ? val.VatPer : val.VatPercent}%
                  </span>
                  <Tooltip id={`tax`} direction="right" text={`Tax`} />
                </div>
                <div
                  className=" text-white text-center custom-blue-box px-2"
                  id="itemType"
                >
                  <span className="fs-12 mb-0">{val.ItemType}</span>
                  <Tooltip
                    id={`itemType`}
                    direction="right"
                    text={`Item Type`}
                  />
                </div>
              </div>
            </div>
            <div className="row p-2  pb-0 align-items-center sig-fab-inp-filds">
              <div className="col-12">
                <textarea
                  rows="2"
                  value={description}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      description: e.target.value,
                    })
                  }
                  className="remove_border_textArea rounded-3 form-control custom-min-height"
                  placeholder="Enter Description here..."
                ></textarea>
              </div>
            </div>
            <div className="row p-2 align-items-center sig-fab-inp-filds">
              <div className="col-md-3 col-12 cust-col-100">
                <InputGroup className="">
                  <InputGroup.Text id="basic-addon1">
                    {val.Unit}
                  </InputGroup.Text>
                  <Form.Control
                    type="number"
                    placeholder="QTY"
                    className="frm-int text-end"
                    // aria-label="Username"
                    value={qty}
                    onChange={(e) =>
                      setFormState({ ...formState, qty: e.target.value })
                    }
                    maxLength={2}
                  />
                </InputGroup>
              </div>
              <div className="col-md-1 col-12 text-center cust-col-100">
                <span className="">X</span>
              </div>
              <div className="col-md-3 col-12 cust-p-0 cust-col-100">
                <InputGroup className="">
                  <InputGroup.Text id="basic-addon1">{symbol}</InputGroup.Text>
                  <Form.Control
                    type="number"
                    className="frm-int text-end"
                    placeholder="50,000.00"
                    value={price}
                    onChange={(e) =>
                      setFormState({ ...formState, price: e.target.value })
                    }
                  />
                </InputGroup>
              </div>
              <div className="col-md-1 col-12 text-center cust-col-100">
                <span className="">=</span>
              </div>
              <div className="col-md-4 col-12 cust-col-100">
                <InputGroup className="w-100">
                  <InputGroup.Text
                    id="basic-addon1"
                    className="w-25"
                    style={{ backgroundColor: "#c5c5c5" }}
                  >
                    {symbol}
                  </InputGroup.Text>
                  <InputGroup.Text id="basic-addon2" className="w-75">
                    <span className="text-end w-100">
                      {/* {basicAmt === 0 ? "-" : makingAmt} */}
                      {(formState.qty * formState.price)?.toFixed(
                        RoundUpToDecimal
                      )}
                    </span>
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </div>

            {val.ItemType == "Cut Length" ||
              val.ItemType == "fabric" ||
              val.ItemType == "Fabric" ||
              val.ItemType == "cut length" ? (
              <>
                <div className="d-flex align-items-center ">
                  <div className="d-flex align-items-center p-2">
                    <input
                      type="checkbox"
                      // name=""z
                      checked={formState.isDyeing}
                      id="Training-Mode"
                      onChange={handleCheckboxChange}
                      style={{ backgroundColor: "black" }}
                      className="mr-2"
                    />
                    <label htmlFor="Dyeing" className="mb-0 fs-6  ">
                      Dyeing
                    </label>
                  </div>
                  {formState.isDyeing ? (
                    <div className="ml-3 mr-3 d-flex">
                      <UncontrolledDropdown
                        isOpen={modelStatus}
                        toggle={toggleDropdownStatus}
                        className="user-dropdown"
                      >
                        <DropdownToggle
                          tag="a"
                          className="dropdown-toggle border-dark rounded"
                        >
                          <Button outline color="light">
                            <span className="text-dark ">
                              {formState.dyeingOption}
                            </span>
                            <img
                              src={modelStatus ? UpArrowIcon : DownArrowIcon}
                              className={`ms-1 text-dark`}
                              width="15px"
                            ></img>
                          </Button>
                        </DropdownToggle>
                        <DropdownMenu
                          className="dropdown-menu-s1 dropdown-menu-custom-width link-list-opt"
                          style={{ width: "180px" }}
                        >
                          <div className="dropdown-body">
                            <div className="nk-notification ">
                              {Object.keys(instractionList).map(
                                (instraction) => (
                                  <div key={instraction}>
                                    <DropdownItem
                                      onClick={() =>
                                        setFormState({
                                          ...formState,
                                          dyeingOptionId:
                                            instractionList[instraction].ind,
                                          dyeingOption:
                                            instractionList[instraction].name,
                                        })
                                      }
                                      className="mb-1"
                                    >
                                      <strong className="fs-bolder ms-2 fs-14 ">
                                        {instractionList[instraction].name}
                                      </strong>
                                    </DropdownItem>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </DropdownMenu>
                      </UncontrolledDropdown>

                      <div className="ml-3">
                        {formState.dyeingOptionId === 1 && (
                          <div className="d-flex align-items-center border pl-2 pr-2 rounded border-dark">
                            <input
                              type="color"
                              className="form-control-color"
                              value={selectedColor}
                              onChange={handleColorChange}
                            />
                            <label htmlFor="color" className="mb-0">
                              Color
                            </label>
                          </div>
                        )}
                        {formState.dyeingOptionId === 2 && (
                          <UncontrolledDropdown
                            isOpen={formState.modelFabric}
                            toggle={toggleDropdownFabric}
                            className="user-dropdown"
                          >
                            <DropdownToggle
                              tag="a"
                              className="dropdown-toggle border-dark rounded"
                            >
                              <Button outline color="light">
                                <span className="text-dark ">
                                  {/* {formState.dyeingComment} */}

                                  {selectedFabric}
                                </span>
                                <img
                                  src={
                                    formState.modelFabric
                                      ? UpArrowIcon
                                      : DownArrowIcon
                                  }
                                  className={`ms-1 text-dark`}
                                  width="15px"
                                ></img>
                              </Button>
                            </DropdownToggle>

                            {fabricDropDownList?.febriclist?.length > 0 && (
                              <DropdownMenu
                                className="dropdown-menu-s1 dropdown-menu-custom-width link-list-opt"
                                style={{ width: "180px" }}
                              >
                                <div className="dropdown-body">
                                  <div className="nk-notification ">
                                    {fabricDropDownList?.febriclist?.map(
                                      (fabric) => {
                                        return (
                                          <div key={fabric}>
                                            <DropdownItem
                                              onClick={(e) =>
                                                handleSelectFabric(
                                                  fabric.Descriptions
                                                )
                                              }
                                              // setFormState({
                                              //   ...formState,
                                              //   dyeingComment:
                                              //     fabricList[fabric].name,
                                              // })

                                              className="mb-1"
                                            >
                                              <strong className="fs-bolder ms-2 fs-14 ">
                                                {fabric.Descriptions}
                                              </strong>
                                            </DropdownItem>
                                          </div>
                                        );
                                      }
                                    )}

                                    {/* {Object.keys(fabricList).map((fabric) => (
                                    <div key={fabric}>
                                      <DropdownItem
                                        onClick={(e) =>
                                          handleSelectFabric(fabricList[fabric])
                                        }
                                        // setFormState({
                                        //   ...formState,
                                        //   dyeingComment:
                                        //     fabricList[fabric].name,
                                        // })

                                        className="mb-1"
                                      >
                                        <strong className="fs-bolder ms-2 fs-14 ">
                                          {fabricList[fabric].name}
                                        </strong>
                                      </DropdownItem>
                                    </div>
                                  ))} */}
                                  </div>
                                </div>
                              </DropdownMenu>
                            )}
                          </UncontrolledDropdown>
                        )}
                        {formState.dyeingOptionId === 3 && (
                          <input
                            type="text"
                            name="custom"
                            value={formState.dyeingComment}
                            onChange={(e) =>
                              setFormState({
                                ...formState,
                                dyeingComment: e.target.value,
                              })
                            }
                            placeholder="Enter Dying Instructions"
                            className="form-control-lg form-control mr-3"
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}

            <div className="d-flex justify-content-center my-2 border-top pt-2">
              <Button
                outline
                color="light"
                id="BtnBkAnOrderAddFab"
                className="ps-2 pe-2 d-flex "
                // onClick={() =>
                //   handleAction(
                //     "BtnBkAnOrderAddFab",
                //     "action",
                //     handleAddFabric,
                //     val

                //   )
                // }
                onClick={() => handleAddFabric(val)}
              >
                {loading ? (
                  <Spinner size="sm" className="mx-1" />
                ) : (
                  <>
                    <img src={addIcon} alt="" className="mr-2" />
                    {val.articleData ? "update" : "Add to Item"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </>
      ) : fab.length !== 0 ? (
        // fab.length !== 0 && (
        //   <>
        <FabricSkeleton />
      ) : (
        //   </>
        // )
        <></>
      )}
    </>
  );
};

export default FabricSearch;

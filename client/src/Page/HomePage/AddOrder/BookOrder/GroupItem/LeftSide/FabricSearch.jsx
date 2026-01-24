import React, { useEffect, useRef, useState } from "react";
import Icon from "../../../../../../Components/icon/Icon";
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
import SherwaniImage from "./../../../../../../images/avatar/sherwani-image.png";
import addIcon from "./../../../../../../images/icons/add-icon.svg";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import barcodeImg from "./../../../../../../images/icons/odertable-barcode.svg";
import DownArrowIcon from "./../../../../../../images/icons/down-arrow.svg";
import UpArrowIcon from "./../../../../../../images/icons/up-arrow.svg";
import {
  createDebouncedSearchFabric,
  getFebricSearchDetailsAsyncData,
} from "../../../../../../redux/actions/getFebricAction";
import { useDispatch, useSelector } from "react-redux";
import FabricSkeleton from "./fabricSkeleton";
import { toast } from "react-toastify";

import { getSingleArticleDetailsAsyncData } from "../../../../../../redux/actions/GetSingleArticleDetailsAction";
import {
  addGroupFabricAccessories,
  // getFabricAccessoriesList,
} from "../../../../../../redux/actions/groupFabricAndAccessoriesCRUDAction";

import { getSingleGroupOrderList } from "../../../../../../redux/actions/groupOrderListAction";
import { useTheme } from "../../../../../../Layout/Provider/Themes";
import Tooltip from "../../../../../../Components/Tooltip/Tooltip";
import { usePermissions } from "../../../../../../Layout/Provider/PermissionsContext";

const FabricSearch = ({
  mood,
  onCountChange,
  fabricCount,
  onDataChange,
  handleAddFabricSuccess,
}) => {
  const symbol = localStorage.getItem("countrySymbol");
  const dispatch = useDispatch();
  const { tabId } = useTheme();
  
  const ItemID = localStorage.getItem(`serviceId${tabId}`);
  const { handleAction } = usePermissions();

  let TOrdHdID = localStorage.getItem(`TOrdHdID${tabId}`);
  let TOrdDtID = localStorage.getItem(`TOrdDtID${tabId}`);

  const [fab, setFab] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [mapedState, setMapedState] = useState([]);
  const [selectedFabric, setSelectedFabric] = useState("");
  const [selectedColor, setSelectedColor] = useState("#000000"); // Initial color, you can set it to any default color

  const [formState, setFormState] = useState({
    // qty: 0,
    // price: 0,
    description: "",
    isDyeing: false,
    dyeingOptionId: 0,
    dyeingOption: "Ask Designer",
    dyeingComment: "",
    modelFabric: false,
  });

  const {
    description,
    // total,
    isDyeing,
    dyeingOptionId,
    dyeingOption,
    dyeingComment,
    // selectedInst,
    // selectedFabric,
    modelFabric,
  } = formState;

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

  const fabricList = [
    {
      ind: 0,
      name: "Alternate Fabric 1",
    },
    {
      ind: 1,
      name: "Alternate Fabric 2",
    },
    {
      ind: 2,
      name: "Main Fabric",
    },
  ];
  const getFebData = useSelector((state) => state?.getSingleArticleDetails);
  const selectedGroupItem = useSelector(
    (state) => state.service?.singleGroupService?.data?.itemDetails
  );

  const groupData = useSelector(
    (state) => state?.groupOrderList?.single?.orderItemList
  );

  const getConfig = useSelector((state) => state?.config?.orderType);
  const groupDetails = useSelector(
    (state) => state?.addGroupOrderDetails?.creategroupitem?.GROUPITEM
  );

  const gerFabricSearchDetails = useSelector(
    (state) => state.FabricDetailsData
  );

  const RoundUpToDecimal =
    getConfig?.RoundUpToDecimal == 0 ||
    getConfig?.RoundUpToDecimal == undefined ||
    getConfig?.RoundUpToDecimal == null
      ? 2
      : getConfig?.RoundUpToDecimal;

  let val = getFebData?.single;
  const debouncedSearchRef = useRef(createDebouncedSearchFabric());

  const handleFabricChange = (e) => {
    if (mood == "view") {
      toast.error("You have no rights to change");
    } else {
      const inputValue = e.target.value;
      debouncedSearchRef.current(dispatch, e.target.value);
      // dispatch(getFebricSearchDetailsAsyncData(e.target.value));
      setFab(inputValue);
    }
  };
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

  const handleAddFabric = (data) => {
    setLoading(true);

    const hasZeroQty = mapedState.some((item) => item.qty === 0);

    if (hasZeroQty) {
      toast.error("Quantity should be greater than 0 for all items");
      setLoading(false);
      return; // Stop further execution
    } else {
      let fabricDataArray;
      if (groupDetails) {
        fabricDataArray = groupDetails?.map((item, index) => {
          return {
            TOrd_FabricId: val.articleData ? val.TOrd_FabricId : null,
            TOrdHD_Id: Number(TOrdHdID),
            // TOrdHD_Id: 20416,
            TOrdDtId: Number(item.TOrdDtId),
            SrNo: index + 1,
            ItemID: Number(item.ItemId),
            ItemType: val.ItemType,
            Item_name: item.ItemName,
            Quantity: mapedState[index]?.qty || 0,
            Unit: data.Unit,
            Size_Id: data.size,
            Color_Id: data.Color,
            Descriptions: description,
            ArticleID: data?.Article_ID,
            BrandID: item.BrandID,
            Item_rate: mapedState[index]?.price || 0,
            Basic_Amt: item.MRP,
            VatPer: item.VatPercent,
            Total_Amount: mapedState[index]?.qty * mapedState[index]?.price,
            CompanyId: item.CompanyID,
            BranchId: item.BranchID,
            OutFitSize: data.Size,
            ActualCutQty: 2,
            StatusId: 1,
            AvailableQty: 0,
            IsDyeing: isDyeing,
            DyeingOptionId: dyeingOptionId,
            DyeingOption: dyeingOption,
            DyeingComment: dyeingComment,
          };
        });
      } else {
        fabricDataArray = groupData?.groupItemList?.map((item, index) => {
          return {
            TOrd_FabricId: val.articleData ? val.TOrd_FabricId : null,
            TOrdHD_Id: Number(TOrdHdID),
            // TOrdHD_Id: 20416,
            TOrdDtId: Number(item.TOrdDtId),
            SrNo: index + 1,
            ItemID: Number(item.ItemId),
            ItemType: val.ItemType,
            Item_name: item.ItemName,
            Quantity: mapedState[index]?.qty || 0,
            Unit: data.Unit,
            Size_Id: data.size,
            Color_Id: data.Color,
            Descriptions: description,
            ArticleID: data?.Article_ID,
            BrandID: item.BrandID,
            Item_rate: mapedState[index]?.price || 0,
            Basic_Amt: item.MRP,
            VatPer: item.VatPercent,
            Total_Amount: mapedState[index]?.qty * mapedState[index]?.price,
            CompanyId: item.CompanyID,
            BranchId: item.BranchID,
            OutFitSize: data.Size,
            ActualCutQty: 2,
            StatusId: 1,
            AvailableQty: 0,
            IsDyeing: isDyeing,
            DyeingOptionId: dyeingOptionId,
            DyeingOption: dyeingOption,
            DyeingComment: dyeingComment,
          };
        });
      }

      dispatch(addGroupFabricAccessories(fabricDataArray)).then((data) => {
        if (data.success === true) {
          setFormState({
            qty: null,
            price: 0,
          });
          setFab("");
          dispatch(getSingleGroupOrderList(TOrdDtID)).then((res) => {
            if (res.success) {
              setLoading(false);
            }
          });
          // dispatch(getFabricAccessoriesList(TOrdDtID));
          // dispatch(getSingleFabricAction({}));
          // onDataChange(formState);
          toast.success("add successfully");
          setLoading(false);
          const isAddFab = "add fabric";
          handleAddFabricSuccess(isAddFab);
        }
      });
      // setSelectedFabricNo(selectedFabricNo + 1);
      // onCountChange(selectedFabricNo + 1);
      onDataChange(formState);
    }
  };

  const handleSuggestionClick = (val) => {
    setFab(val.ArticleName);
    setIsInputFocused(false);
    dispatch(getSingleArticleDetailsAsyncData(val.Article_ID));
  };

  const handleSelectFabric = (data) => {
    const newData = data.name;
    setSelectedFabric(data.name);
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    setFormState({ ...formState, dyeingComment: newColor });
  };

  useEffect(() => {
    if (selectedGroupItem?.GROUPITEM.length > 0) {
      setMapedState(
        selectedGroupItem?.GROUPITEM?.map(() => ({
          qty: 0,
          price: val?.Sale_Rate,
        }))
      );
    } else {
      setMapedState(
        groupDetails?.map(() => ({
          qty: 0,
          price: val?.Sale_Rate,
        }))
      );
    }
  }, [selectedGroupItem, val, groupDetails]);

  useEffect(() => {
    // setSelectedFabricNo(fabricCount);
    // onDataChange({ formState });
    setFormState({
      // qty: val.articleData ? val.Quantity : "",
      // price: val.articleData ? val?.Total_Amount : val.Sale_Rate,
      // total: 0,
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
      rate: Number(formState.qty) * Number(formState.price),
    });
  }, [formState.qty, formState.price]);

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
                <div className="fabcol-img">
                  <img src={SherwaniImage} alt="" height="80px" className="" />
                </div>

                <div className="d-flex  fab-py-2 fab-p-0 align-items-center  cst-w-exsmall ">
                  <div className="col-md-6 col-12 py-1 py-md-0 csto-col-st">
                    <div className="custom-border-right d-flex pr-4 aling-items-center cstflexcol-md">
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
              <div className="csu-col-2 px-0 fabcol-100 custom-mt">
                <div className=" text-white text-center custom-yello-box px-2">
                  <span className="fs-12 mb-0">{val?.OppStock} {val?.Unit}</span>
                </div>
                <div className="text-white text-center custom-green-box px-2">
                  <span className="fs-12 mb-0">
                    {val.articleData ? "GST" : val.TaxationType} -{" "}
                    {val.articleData ? val.VatPer : val.VatPercent}%
                  </span>
                </div>
                <div className="text-white text-center custom-blue-box px-2">
                  <span className="fs-12 mb-0">{val.ItemType}</span>
                </div>
              </div>
            </div>

            <div className="row p-2  pb-0 align-items-center sig-fab-inp-filds">
              <div className="col-12">
                {
                  <textarea
                    rows="1"
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
                }
              </div>
            </div>

            {selectedGroupItem?.GROUPITEM.length > 0
              ? selectedGroupItem?.GROUPITEM?.map((item, i) => {
                  const currentItemState = mapedState?.[i];

                  return (
                    <div className="d-md-flex align-items-center m-2 custome-fab-input cust-bordr">
                      <div className="mx-3 col-2">
                        <span className="fw-bold">{item.ItemName}</span>
                      </div>
                      <div className="row p-2 align-items-center w-100 px-4 cust-px-2 col-10">
                        <div className="col-md-3 col-12 px-0">
                          <InputGroup className="">
                            <InputGroup.Text id="basic-addon1">
                              {val.Unit}
                            </InputGroup.Text>
                            <Form.Control
                              type="number"
                              placeholder="QTY"
                              // aria-label="Username"
                              // value={qty}
                              value={currentItemState?.qty}
                              className="frm-int text-end"
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const maxLength = 2; // Maximum number of digits allowed (excluding decimal point)

                                // Validate the input value to accept only integers and floats
                                const isValid = /^(\d*\.?\d*)$/.test(
                                  inputValue
                                );

                                // Check the length of the input excluding the decimal point
                                const lengthWithoutDecimal = inputValue.replace(
                                  ".",
                                  ""
                                ).length;

                                if (
                                  isValid &&
                                  lengthWithoutDecimal <= maxLength
                                ) {
                                  setMapedState((prevState) => {
                                    const newState = Array.isArray(prevState)
                                      ? [...prevState]
                                      : [];
                                    newState[i].qty = inputValue;
                                    return newState;
                                  });
                                }
                              }}
                            />
                          </InputGroup>
                        </div>
                        <div className="col-md-1 col-12 text-center px-0">
                          <span className="">X</span>
                        </div>
                        <div className="col-md-3 col-12 px-0">
                          <InputGroup className="">
                            <InputGroup.Text id="basic-addon1">
                              {symbol}
                            </InputGroup.Text>
                            <Form.Control
                              type="text"
                              className="frm-int text-end"
                              placeholder="50,000.00"
                              value={currentItemState?.price}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                // Validate input to allow only numeric values, commas, and decimal points
                                const regex = /^[0-9,.]*$/;
                                if (regex.test(inputValue)) {
                                  // Update the state only if the input matches the allowed format
                                  setMapedState((prevState) => {
                                    const newState = Array.isArray(prevState)
                                      ? [...prevState]
                                      : [];
                                    newState[i].price = inputValue;
                                    return newState;
                                  });
                                }
                              }}
                            />
                          </InputGroup>
                        </div>
                        <div className="col-md-1 col-12 text-center px-0">
                          <span className="">=</span>
                        </div>
                        <div className="col-md-4 col-12 px-0 cust-col-100">
                          <InputGroup className="w-100">
                            <InputGroup.Text
                              id="basic-addon1"
                              className="w-25"
                              style={{ backgroundColor: "#c5c5c5" }}
                            >
                              {symbol}
                            </InputGroup.Text>
                            <InputGroup.Text
                              id="basic-addon1"
                              className="w-75 justify-content-end"
                            >
                              <span className="text-end w-100">
                                {(
                                  currentItemState?.qty *
                                  currentItemState?.price
                                )?.toFixed(RoundUpToDecimal)}
                              </span>
                              {/* {formState.qty * formState.price} */}
                            </InputGroup.Text>
                          </InputGroup>
                        </div>
                      </div>
                    </div>
                  );
                })
              : groupDetails?.map((item, i) => {
                  const currentItemState = mapedState[i];
                  return (
                    <div className="d-md-flex align-items-center m-2 custome-fab-input cust-bordr">
                      <div className="mx-3 col-2">
                        <span className="fw-bold">{item.ItemName}</span>
                      </div>
                      <div className="row p-2 align-items-center w-100 px-4 cust-px-2 col-10">
                        <div className="col-md-3 col-12 px-0">
                          <InputGroup className="">
                            <InputGroup.Text id="basic-addon1">
                              {val.Unit}
                            </InputGroup.Text>
                            <Form.Control
                              type="number"
                              placeholder="QTY"
                              // aria-label="Username"
                              // value={qty}
                              value={currentItemState?.qty}
                              className="frm-int text-end"
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const maxLength = 2; // Maximum number of digits allowed (excluding decimal point)

                                // Validate the input value to accept only integers and floats
                                const isValid = /^(\d*\.?\d*)$/.test(
                                  inputValue
                                );

                                // Check the length of the input excluding the decimal point
                                const lengthWithoutDecimal = inputValue.replace(
                                  ".",
                                  ""
                                ).length;

                                if (
                                  isValid &&
                                  lengthWithoutDecimal <= maxLength
                                ) {
                                  setMapedState((prevState) => {
                                    const newState = Array.isArray(prevState)
                                      ? [...prevState]
                                      : [];
                                    newState[i].qty = inputValue;
                                    return newState;
                                  });
                                }
                              }}
                            />
                          </InputGroup>
                        </div>
                        <div className="col-md-1 col-12 text-center px-0">
                          <span className="">X</span>
                        </div>
                        <div className="col-md-3 col-12 px-0">
                          <InputGroup className="">
                            <InputGroup.Text id="basic-addon1">
                              {symbol}
                            </InputGroup.Text>
                            <Form.Control
                              type="number"
                              className="frm-int text-end"
                              placeholder="50,000.00"
                              // value={price}
                              // onChange={(e) =>
                              //   setFormState({
                              //     ...formState,
                              //     price: e.target.value,
                              //   })
                              // }
                              value={currentItemState?.price}
                              onChange={(e) =>
                                setMapedState((prevState) => {
                                  const newState = Array.isArray(prevState)
                                    ? [...prevState]
                                    : [];
                                  newState[i].price = e.target.value;
                                  return newState;
                                })
                              }
                            />
                          </InputGroup>
                        </div>
                        <div className="col-md-1 col-12 text-center px-0">
                          <span className="">=</span>
                        </div>
                        <div className="col-md-4 col-12 px-0 cust-col-100">
                          <InputGroup className="w-100">
                            <InputGroup.Text
                              id="basic-addon1"
                              className="w-25"
                              style={{ backgroundColor: "#c5c5c5" }}
                            >
                              {symbol}
                            </InputGroup.Text>
                            <InputGroup.Text
                              id="basic-addon1"
                              className="w-75 justify-content-end"
                            >
                              {(
                                currentItemState?.qty * currentItemState?.price
                              )?.toFixed(RoundUpToDecimal)}

                              {/* {formState.qty * formState.price} */}
                            </InputGroup.Text>
                          </InputGroup>
                        </div>
                      </div>
                    </div>
                  );
                })}

            {val.ItemType == "Cut Length" ||
            val.ItemType == "fabric" ||
            val.ItemType == "Fabric" ||
            val.ItemType == "cut length" ? (
              <>
                <div className="d-flex align-items-center ">
                  <div className="d-flex align-items-center p-2">
                    <input
                      type="checkbox"
                      // name=""
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
                        {formState.dyeingOptionId == 1 && (
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
                            <DropdownMenu
                              className="dropdown-menu-s1 dropdown-menu-custom-width link-list-opt"
                              style={{ width: "180px" }}
                            >
                              <div className="dropdown-body">
                                <div className="nk-notification ">
                                  {Object.keys(fabricList).map((fabric) => (
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
                                  ))}
                                </div>
                              </div>
                            </DropdownMenu>
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
                            placeholder="lorem hbgd "
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
                id="BtnBkAnOrderGroupItemAddFab"
                className="ps-2 pe-2 d-flex bg-white border border-1 rounded p-1 border-dark"
                // onClick={() =>
                //   handleAction(
                //     "BtnBkAnOrderGroupItemAddFab",
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
                  <img src={addIcon} alt="" className="mr-2" />
                )}
                Add to Item
              </Button>
            </div>
          </div>
        </>
      ) : fab.length !== 0 ? (
        <FabricSkeleton />
      ) : (
        <></>
      )}
    </>
  );
};

export default FabricSearch;

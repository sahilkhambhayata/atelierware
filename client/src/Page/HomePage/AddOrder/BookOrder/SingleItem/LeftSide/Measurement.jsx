import React, { useEffect, useState } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  Button,
  DropdownItem,
  Spinner,
  //   Form,
  // Button,
} from "reactstrap";
import { toast } from "react-toastify";
import Icon from "./../../../../../../Components/icon/Icon";
import DownArrowIcon from "./../../../../../../images/icons/down-arrow.svg";
import UpArrowIcon from "./../../../../../../images/icons/up-arrow.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  addMeasurement,
  getMeasureList,
  getMeasurementByItemId,
  oldItemList,
  oldMeasurementList,
} from "../../../../../../redux/actions/measurementAction";
import { useTheme } from "../../../../../../Layout/Provider/Themes";
import { usePermissions } from "../../../../../../Layout/Provider/PermissionsContext";

const Measurement = ({ mood, handleAddMeasurementSuccess }) => {
  const [modelMeasurement, setModelMeasurement] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const { tabId } = useTheme();
  const [measurement, setMeasurement] = useState([]);
  const toggleDropdownMeasurement = () => {
    setModelMeasurement(!modelMeasurement);
  };
  const { handleAction } = usePermissions();

  const oldMeasure = useSelector((state) => state.oldMeasure);

  const oldItemMeasList = useSelector((state) => state.oldItemList);
  const measureByItem = useSelector((state) => state.measureByItem);

  const measure = useSelector((state) => state.measure);
  const BU_ID = localStorage.getItem("BU_Id");
  const itemId = localStorage.getItem(`serviceId${tabId}`);
  const custId = localStorage.getItem(`customerId${tabId}`);
  const [selectedMeas, setSelectedMeas] = useState({
    ItemId: "",
    ItemName: "Copy Measurement",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (itemId != null && custId != null) {
      dispatch(getMeasureList(BU_ID, itemId));
      dispatch(oldItemList(custId, itemId));

      dispatch(oldMeasurementList(custId, itemId));
    }
  }, [tabId, itemId, custId]);

  // useEffect(() => {
  //   if (custId !== "" && itemId !== "") {

  //   }
  // }, [custId, itemId]);

  // oldMeasurementList;
  const [count, setCount] = useState(0);

  const [formMeas, setFormMeas] = useState({});
  const [saveClicked, setSaveClicked] = useState(false);
  const [extraFormMeas, setExtraFormMeas] = useState({
    remarks: "",
    saveToSimilarGarments: false,
    measurementDate: new Date(),
  });

  const getConfig = useSelector((state) => state?.config);
  const formattedDate = extraFormMeas.measurementDate.toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  const TOrdHdId = localStorage.getItem(`TOrdHdID${tabId}`);
  const TOrdDtId = localStorage.getItem(`TOrdDtID${tabId}`);

  const handleAddMeasurement = () => {
    const updatedFormMeas = Object.keys(formMeas)
      .filter((key) => key !== "MRemarks")
      .reduce((obj, key) => {
        obj[key] = formMeas[key];
        return obj;
      }, {});

    const isAnyInputEmpty = Object.values(updatedFormMeas).some(
      (value) => value === "" || value === null || value === undefined
    );
    setSaveClicked(true);

    if (getConfig?.orderType?.NotNullMsmt) {
      if (isAnyInputEmpty) {
        toast.error("Please Enter Valid Value For All Measurement");
        return;
      } else {
        setIsLoader(true);
        dispatch(
          addMeasurement(
            custId,
            itemId,
            TOrdHdId,
            TOrdDtId,
            updatedFormMeas,
            // updatedFormMeas2,
            extraFormMeas
          )
        ).then((res) => {
          if (res.success) {
            setSaveClicked(false);

            toast.success(res.message);
            const isAddMeas = "add measurements";
            handleAddMeasurementSuccess(isAddMeas);
            setIsLoader(false);
            const resetFormMeas = Object.keys(formMeas).reduce((acc, key) => {
              acc[key] = 0;
              return acc;
            }, {});

            // setFormMeas(resetFormMeas);
          } else {
            setTimeout(() => {
              setIsLoader(false);
            }, 500);
          }
          setTimeout(() => {
            setIsLoader(false);
          }, 5000);
        });
      }
    } else {
      setIsLoader(true);
      dispatch(
        addMeasurement(
          custId,
          itemId,
          TOrdHdId,
          TOrdDtId,
          updatedFormMeas,
          extraFormMeas
        )
      ).then((res) => {
        if (res.success) {
          setSaveClicked(false);

          toast.success(res.message);
          const isAddMeas = "add measurements";
          handleAddMeasurementSuccess(isAddMeas);
          setIsLoader(false);
          const resetFormMeas = Object.keys(formMeas).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
          }, {});

          // setFormMeas(resetFormMeas);
        } else {
          setTimeout(() => {
            setIsLoader(false);
          }, 500);
        }
        setTimeout(() => {
          setIsLoader(false);
        }, 5000);
      });
    }
  };

  const handleInputChange = (measurement, value) => {
    setFormMeas((prevFormMeas) => ({
      ...prevFormMeas,
      [measurement]: value,
    }));
  };

  const handleaddextramager = (e) => {
    setExtraFormMeas({
      ...extraFormMeas,
      remarks: e.target.value,
    });
  };
  const handleCheckboxChange = () => {
    setExtraFormMeas((prevExtraFormMeas) => ({
      ...prevExtraFormMeas,
      saveToSimilarGarments: !prevExtraFormMeas.saveToSimilarGarments,
    }));
  };

  const singleOrderData = useSelector((state) => state.orderListData.single);

  useEffect(() => {
    const updatedFormMeas = {};
    measure?.Measurement?.forEach((item) => {
      const key = `M${item.CNTMID}`;

      if (Object.keys(singleOrderData).length !== 0) {
        if (singleOrderData.orderItemList[0]) {
          const measuObj = singleOrderData.orderItemList[0].ordMeasure[0];
          if (measuObj?.[key] !== undefined) {
            const isAddMeas = "add measurements";
            handleAddMeasurementSuccess(isAddMeas);
            updatedFormMeas[key] = measuObj[key];
          }
        }
      }
    });
    // console.log(Object.keys(singleOrderData).length !== 0, "updatedFormMeas1");

    if (Object.keys(updatedFormMeas).length > 0) {
      setFormMeas(updatedFormMeas);
    }
  }, [singleOrderData]);

  useEffect(() => {
    if (measureByItem.success && measureByItem.data) {
      const measurementData = measureByItem.data;
      const updatedFormMeas = { ...formMeas };

      // Iterate over the keys of the measurementData object
      Object.keys(measurementData).forEach((key) => {
        // Check if the key starts with 'M' to identify measurement keys
        if (key.startsWith("M")) {
          // Extract the index from the key (assuming key format is 'M{index}')
          const index = parseInt(key.slice(1));
          // Set the value in the formMeas object
          updatedFormMeas[key] = measurementData[key];
        }
      });

      // Update the form state with the new measurement values
      console.log(updatedFormMeas, "number 2");
      // number 2
      setFormMeas(updatedFormMeas);
    }
  }, [measureByItem]);

  // useEffect(() => {
  //   const initialFormMeas = {};
  //   measure?.Measurement?.forEach((item, ind) => {
  //     initialFormMeas[`M${ind + 1}`] = "";
  //   });

  //   setFormMeas(initialFormMeas);
  // }, [measure]);

  const textareaStyle =
    saveClicked && extraFormMeas.remarks === "" ? { borderColor: "red" } : {};
  const inputStyle = (ind) => {
    const value = formMeas[`M${ind + 1}`] || "";
    const isFieldEmpty = value === "" || value === null || value === undefined;
    return saveClicked && isFieldEmpty ? { borderColor: "red" } : {};
  };

  useEffect(() => {
    if (oldMeasure.data) {
      const oldMeasurements = oldMeasure.data;
      if (oldMeasurements) {
        const updatedFormMeas = { ...formMeas };
        Object.keys(oldMeasurements).forEach((key) => {
          if (key.startsWith("M")) {
            updatedFormMeas[key] = oldMeasurements[key];
          }
        });

        console.log(updatedFormMeas, "number 3");

        // number 3
        setFormMeas(updatedFormMeas);
      }
    }
  }, [oldMeasure.data]);

  const handleSelectItem = (item) => {
    setSelectedMeas(item);
    dispatch(getMeasurementByItemId(custId, item.ItemId));
  };

  const handleKeyDown = (e) => {
    if (mood === "view") {
      e.preventDefault();
      toast.error("You have no rights to change");
    }
  };

  return (
    <div className="position-relative nk-header-searchbox border m-0 px-md-5 px-2 pt-3">
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
            <span className="text-dark d-none d-md-block">
              {selectedMeas.ItemName}
            </span>
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
          {oldItemMeasList?.data &&
            oldItemMeasList.data.map((key, ind) => {
              return (
                <DropdownItem
                  className="d-flex px-2 mt-1 justify-content-between"
                  key={ind}
                  onClick={() => handleSelectItem(key)}
                >
                  <span className="bg-light p-1">{key.ItemName}</span>
                </DropdownItem>
              );
            })}
        </DropdownMenu>
      </UncontrolledDropdown>
      <div className="w-100 px-3">
        {measure?.Measurement?.map((item, ind) => {
          // console.log(formMeas);

          return (
            <div className="row align-items-center" key={item.CNTMID}>
              <div className="col-sm-4 col-12 fw-medium fs-12">
                {item.Measurement}
              </div>
              <div className="col-sm-8 col-12">
                <input
                  type={getConfig?.orderType?.DecimalMsrmt ? "number" : "text"}
                  id={`measurement-input-${item.CNTMID}`}
                  value={formMeas[`M${item.CNTMID}`] || ""}
                  name={item.Measurement}
                  onChange={(e) =>
                    handleInputChange(`M${item.CNTMID}`, e.target.value)
                  }
                  readOnly={mood === "view"}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter"
                  style={{ ...inputStyle(item.CNTMID), width: "100%" }}
                  className="form-control-lg form-control my-2"
                />
              </div>
            </div>
          );
        })}
      </div>
      <textarea
        name=""
        id=""
        rows="2"
        readOnly={mood === "view"}
        onKeyDown={handleKeyDown}
        style={{ width: "100%" }}
        className="mt-3 rounded-3 form-control remove_border_textArea"
        placeholder="Remarks Box"
        value={extraFormMeas.remarks}
        onChange={(e) => handleaddextramager(e)}
      ></textarea>

      <div className="row align-items-center justify-content-between ">
        <div className="d-flex align-items-center p-2 col-md-8 col-12">
          {/* <input
            type="checkbox"
            checked={extraFormMeas.saveToSimilarGarments}
            id="Dyeing"
            onChange={handleCheckboxChange}
            style={{ backgroundColor: "black" }}
            className="mr-2"
          />
          <label htmlFor="Dyeing" className="mb-0 fs-12">
            Save this Measurement to all similar Garments in This Order
          </label> */}
        </div>
        <div className="col-12 text-end">
          <span className="custom-light-text custom-text-transform">
            {" "}
            Updated On {formattedDate}
          </span>
        </div>
      </div>

      <div className="d-flex justify-content-center my-2">
        <Button
          outline
          id="BtnBkAnOrderAddMeas"
          color="light"
          className="ps-2 pe-2 d-flex "
          // className="px-2 d-flex bg-white border border-1 rounded border-dark"
          onClick={handleAddMeasurement}
          // onClick={() =>
          //   handleAction(
          //     "BtnBkAnOrderAddMeas",
          //     "action",
          //     handleAddMeasurement,
          //     null
          //   )
          // }
        >
          {isLoader ? (
            <>
              <span>
                <Spinner size="sm" className="mx-1 py-1" />
              </span>
            </>
          ) : (
            <span>Save</span>
          )}
        </Button>
      </div>
    </div>
  );
};
export default Measurement;

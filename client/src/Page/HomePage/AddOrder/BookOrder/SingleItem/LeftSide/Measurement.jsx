import React, { useEffect, useState, useRef } from "react";
import "./MeasurementTape.css";

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

const MeasurementTape = ({ onValueChange, activeField, initialValue }) => {
  const tapeRef = useRef(null);
  const audioCtx = useRef(null);
  const [currentValue, setCurrentValue] = useState(initialValue || 0);
  // Ultra-fine resolution: 1/16th of an inch (0.0625)
  const values = Array.from({ length: 1281 }, (_, i) => i * 0.0625);
  const itemHeight = 10; // Very dense marks

  // Mechanical Click sound (Noise-based)
  const playTick = () => {
    try {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const bufferSize = audioCtx.current.sampleRate * 0.008; // 8ms
      const buffer = audioCtx.current.createBuffer(1, bufferSize, audioCtx.current.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize / 3));
      }
      const source = audioCtx.current.createBufferSource();
      source.buffer = buffer;
      const gain = audioCtx.current.createGain();
      gain.gain.value = 0.05;
      source.connect(gain);
      gain.connect(audioCtx.current.destination);
      source.start();
    } catch (e) {
      console.log("Audio error", e);
    }
  };

  useEffect(() => {
    if (tapeRef.current && initialValue !== undefined) {
      const index = values.indexOf(parseFloat(initialValue || 0));
      if (index !== -1) {
        tapeRef.current.scrollTop = index * itemHeight;
      }
    }
  }, [activeField.key, activeField.type]);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const newValue = values[index];
    if (newValue !== currentValue) {
      setCurrentValue(newValue);
      onValueChange(newValue);
      playTick();
    }
  };

  return (
    <div className="tape-column">
      <div className="tape-title">Precision Scale</div>
      <div className="tape-wrapper" style={{ height: '500px' }}>
        <div className="tape-indicator"></div>
        <div className="tape-scroll" ref={tapeRef} onScroll={handleScroll}>
          <div className="tape-content" style={{ padding: '245px 0' }}>
            {values.map((v, i) => {
              const decimal = v % 1;
              const isMajor = decimal === 0;
              const isHalf = decimal === 0.5;
              const isQuarter = decimal === 0.25 || decimal === 0.75;
              const isEighth = decimal === 0.125 || decimal === 0.375 || decimal === 0.625 || decimal === 0.875;
              const isActive = v === currentValue;
              
              let typeClass = '';
              if (isMajor) typeClass = 'major';
              else if (isHalf) typeClass = 'half';
              else if (isQuarter) typeClass = 'quarter';
              else if (isEighth) typeClass = 'eighth';
              else typeClass = 'sixteenth';

              return (
                <div 
                  key={v} 
                  className={`tape-mark ${typeClass} ${isActive ? 'active' : ''}`}
                  style={{ height: `${itemHeight}px` }}
                >
                  {isMajor && (
                    <span className="mark-value">
                      {v}
                    </span>
                  )}
                  <div className="mark-line"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="value-display">{currentValue}"</div>
    </div>
  );
};

const Measurement = ({ mood, handleAddMeasurementSuccess }) => {
  const [activeField, setActiveField] = useState({ key: null, type: 'measurement' });
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
  const [garmentFormMeas, setGarmentFormMeas] = useState({});
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

  const handleGarmentInputChange = (measurement, value) => {
    setGarmentFormMeas((prevFormMeas) => ({
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
    // // console.log(Object.keys(singleOrderData).length !== 0, "updatedFormMeas1");

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
      // console.log(updatedFormMeas, "number 2");
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

        // console.log(updatedFormMeas, "number 3");

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

  const handleTapeValueChange = (value) => {
    if (activeField.key) {
      if (activeField.type === 'measurement') {
        handleInputChange(activeField.key, value);
      } else {
        handleGarmentInputChange(activeField.key, value);
      }
    }
  };

  return (
    <div className="measurement-container">
      {/* Header Boxes */}
      <div className="measurement-headers">
        <div className="header-box active">
          {selectedMeas.ItemName !== "Copy Measurement" ? selectedMeas.ItemName : "Area Name"}
        </div>
        <div className="header-box">Measurements</div>
        <div className="header-box">Garment Fields</div>
      </div>

      <UncontrolledDropdown
        isOpen={modelMeasurement}
        toggle={toggleDropdownMeasurement}
        className="user-dropdown w-100 mb-3"
      >
        <DropdownToggle
          tag="a"
          className="dropdown-toggle border-dark rounded w-100"
        >
          <Button
            outline
            className="w-100 d-flex justify-content-between"
            color="light"
            style={{ borderRadius: '2px' }}
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

      <div className="measurement-layout">
        <div className="measurement-inputs">
          {measure?.Measurement?.map((item, ind) => {
            const fieldKey = `M${item.CNTMID}`;
            const isMeasActive = activeField.key === fieldKey && activeField.type === 'measurement';
            const isGarmActive = activeField.key === fieldKey && activeField.type === 'garment';
            
            return (
              <div className="input-row" key={item.CNTMID}>
                <div className="input-label">
                  {item.Measurement}
                </div>
                
                {/* Measurement Input */}
                <input
                  type={getConfig?.orderType?.DecimalMsrmt ? "number" : "text"}
                  value={formMeas[fieldKey] || ""}
                  onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                  onFocus={() => setActiveField({ key: fieldKey, type: 'measurement' })}
                  readOnly={mood === "view"}
                  placeholder="Enter"
                  className={`custom-input ${isMeasActive ? 'active' : ''}`}
                />

                {/* Garment Input */}
                <input
                  type={getConfig?.orderType?.DecimalMsrmt ? "number" : "text"}
                  value={garmentFormMeas[fieldKey] || ""}
                  onChange={(e) => handleGarmentInputChange(fieldKey, e.target.value)}
                  onFocus={() => setActiveField({ key: fieldKey, type: 'garment' })}
                  readOnly={mood === "view"}
                  placeholder="Garment"
                  className={`custom-input ${isGarmActive ? 'active' : ''}`}
                />
              </div>
            );
          })}
        </div>

        <div style={{ width: '120px' }}>
          <MeasurementTape 
            activeField={activeField}
            initialValue={activeField.key ? (activeField.type === 'measurement' ? formMeas[activeField.key] : garmentFormMeas[activeField.key]) : 0}
            onValueChange={handleTapeValueChange}
          />
        </div>
      </div>

      <textarea
        rows="2"
        readOnly={mood === "view"}
        onKeyDown={handleKeyDown}
        className="mt-3 rounded-1 form-control remove_border_textArea"
        placeholder="Add Remarks here..."
        style={{ fontSize: '13px' }}
        value={extraFormMeas.remarks}
        onChange={(e) => handleaddextramager(e)}
      ></textarea>

      <div className="save-section">
        <Button
          outline
          id="BtnBkAnOrderAddMeas"
          color="none"
          className="premium-btn"
          onClick={handleAddMeasurement}
        >
          {isLoader ? (
            <Spinner size="sm" />
          ) : (
            <span>Save Measurements</span>
          )}
        </Button>
      </div>
    </div>
  );
};


export default Measurement;

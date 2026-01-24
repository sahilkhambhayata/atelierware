import React, { useState } from "react";
import { UncontrolledTooltip } from "reactstrap";
import Cimages from "../../Images/CommonImageFile";
import Tooltip from "../../../../Components/Tooltip/Tooltip";
import useHandleCellClick from "./useHandleCellClick";
import { usePermissions } from "../../../../Layout/Provider/PermissionsContext";

const CustomDesignerCell = ({ ValueData }) => {
  const handleCellClick = useHandleCellClick();
  const { handleAction } = usePermissions();
  const [clickedRow, setClickedRow] = useState(null);

  const handleRowClick = () => {
    setClickedRow(ValueData.index);
    handleAction(
      "BtnOrdTrckrViewOrder",
      "action",
      handleCellClick,
      ValueData,
      setClickedRow
    );
  };

  return (
    <div
      className={` ${
        clickedRow === ValueData.index
          ? "clicked cursor-sppiner"
          : "cursor-pointer"
      }`}
      id="BtnOrdTrckrViewOrder"
      // onClick={handleRowClick}
      // onClick={() => handleCellClick(ValueData)}
    >
      <div className="commitments td-padding">
        <div>
          {ValueData.designerImg !== "" && ValueData.designerName !== "" ? (
            <div className="value td-padding d-flex align-items-center justify-content-center ">
              <div
                className="img-sec ml-4 rounded-circle"
                id={`designer${ValueData.index}`}
              >
                <img
                  src={ValueData.designerImg}
                  alt=""
                  width={"30px"}
                  height={"30px"}
                  className="rounded-circle object-fit-fill"
                />
              </div>
              <Tooltip
                id={`designer${ValueData.index}`}
                direction="right"
                text={ValueData.designerName}
              />
            </div>
          ) : ValueData.designerImg !== "" && ValueData.designerName == "" ? (
            <div className="value td-padding d-flex align-items-center justify-content-center ">
              <div
                className="img-sec ml-4 rounded-circle"
                id={`designer${ValueData.index}`}
              >
                <img
                  src={ValueData.designerImg}
                  alt=""
                  width={"30px"}
                  height={"30px"}
                  className="rounded-circle object-fit-fill"
                />
              </div>
            </div>
          ) : ValueData.designerImg == "" && ValueData.designerName !== "" ? (
            <div className="value td-padding d-flex align-items-center justify-content-center ">
              <div
                className="img-sec ml-4 rounded-circle"
                id={`designer${ValueData.index}`}
              >
                <div className="px-2 py-1 bg-custome rounded-full text-white">
                  <span>
                    {(ValueData.designerName || "")
                      .split(" ")
                      ?.slice(0, 2)
                      ?.map((value) => value[0])
                      ?.join("")}
                  </span>
                </div>
                {/* <img
                  src={Cimages.designerImage}
                  alt=""
                  width={"30px"}
                  height={"30px"}
                  className="rounded-circle object-fit-fill"
                /> */}
              </div>
              <Tooltip
                id={`designer${ValueData.index}`}
                direction="right"
                text={ValueData.designerName}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
        <div>
          {ValueData.masterImg !== "" && ValueData.masterName !== "" ? (
            <div className="value td-padding d-flex align-items-center justify-content-center ">
              <div
                className="img-sec ml-4 rounded-circle"
                id={`master${ValueData.index}`}
              >
                <img
                  src={ValueData.masterImg}
                  alt=""
                  width={"30px"}
                  height={"30px"}
                  className="rounded-circle object-fit-fill"
                />
              </div>
              <Tooltip
                id={`master${ValueData.index}`}
                direction="right"
                text={ValueData.masterName}
              />
            </div>
          ) : ValueData.masterImg !== "" && ValueData.masterName == "" ? (
            <div className="value td-padding d-flex align-items-center justify-content-center ">
              <div
                className="img-sec ml-4 rounded-circle"
                id={`master${ValueData.index}`}
              >
                <img
                  src={ValueData.masterImg}
                  alt=""
                  width={"30px"}
                  height={"30px"}
                  className="rounded-circle object-fit-fill"
                />
              </div>
            </div>
          ) : ValueData.masterImg == "" && ValueData.masterName !== "" ? (
            <div className="value td-padding d-flex align-items-center justify-content-center ">
              <div
                className="img-sec ml-4 rounded-circle"
                id={`master${ValueData.index}`}
              >
                <div className="px-2 py-1 bg-custome rounded-full text-white">
                  <span>
                    {(ValueData.masterName || "")
                      .split(" ")
                      ?.slice(0, 2)
                      ?.map((value) => value[0])
                      ?.join("")}
                  </span>
                </div>

                {/* <img
                  src={Cimages.designerImage}
                  alt=""
                  width={"30px"}
                  height={"30px"}
                  className="rounded-circle object-fit-fill"
                /> */}
              </div>
              <Tooltip
                id={`master${ValueData.index}`}
                direction="right"
                text={ValueData.masterName}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      {clickedRow === ValueData.index && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CustomDesignerCell;

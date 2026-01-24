import React from "react";
import Skeleton from "@mui/material/Skeleton";
import { Button } from "reactstrap";
import viewIcon from "./../../../../../../images/icons/viewIcon.svg";
import addIcon from "./../../../../../../images/icons/add-icon.svg";

const fabricSkeleton = () => {
  const rows = 1;

  return (
    <div>
      <div className="p-1">
        <div className="shadow p-3 bg-white rounded ">
          {Array.from({ length: rows }, (_, ind) => (
            <div className="" key={ind}>
              <div className="d-flex justify-content-between border p-1">
                <div
                  className="bg-light"
                  style={{ width: "80px", height: "80px" }}
                  //image
                ></div>
                <div className="">
                  <div
                    className=" bg-light rounded-3"
                    style={{
                      width: "150px",
                      height: "25px",
                      //no,name
                    }}
                  ></div>
                  <div
                    className="bg-light rounded-3 mt-1"
                    style={{
                      width: "150px",
                      height: "25px",
                      //description
                      // backgroundColor: "#e0e0e0",
                    }}
                  ></div>
                </div>
                <div className="">
                  <div
                    className=" bg-light rounded-3"
                    style={{
                      width: "150px",
                      height: "25px",
                      //type
                      // backgroundColor: "#e0e0e0",
                    }}
                  ></div>
                  <div
                    className="bg-light rounded-3 mt-1"
                    style={{
                      width: "150px",
                      height: "25px",
                      //size
                      // backgroundColor: "#e0e0e0",
                    }}
                  ></div>
                </div>
                <div className="">
                  <div
                    className="bg-light rounded-3"
                    style={{
                      width: "100px",
                      height: "25px",
                      //mts
                      backgroundColor: "#f4bd0e",
                    }}
                  ></div>
                  <div
                    className="bg-light rounded-3 mt-1"
                    style={{
                      width: "100px",
                      height: "25px",
                      //gst
                      backgroundColor: "#1ee0ac",
                    }}
                  ></div>
                  <div
                    className="bg-light rounded-3 mt-1"
                    style={{
                      width: "100px",
                      height: "25px",
                      //fabric/accessories
                      backgroundColor: "#559bfb",
                    }}
                  ></div>
                </div>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <div
                  style={{
                    width: "200px",
                    height: "35px",
                    backgroundColor: "#e0e0e0",
                  }}
                  className="my-1 rounded-2"
                />
                <div>
                  <span></span>
                </div>
                <div
                  style={{
                    width: "200px",
                    height: "35px",
                    backgroundColor: "#e0e0e0",
                  }}
                  className="my-1 rounded-2"
                />
                <div>
                  <span></span>
                </div>
                <div
                  style={{
                    width: "200px",
                    height: "35px",
                    backgroundColor: "#e0e0e0",
                  }}
                  className="my-1 rounded-2"
                />
              </div>

              <div>
                <div
                  style={{
                    width: "100px",
                    height: "20px",
                    backgroundColor: "#e0e0e0",
                  }}
                  className="mt-1 rounded-2"
                />
              </div>

              <div className="d-flex justify-content-center my-2 border-top pt-2">
                <button
                  className="ps-2 pe-2 d-flex bg-white border border-1 rounded p-1 border-dark"
                  // onClick={() => handleAddFabric(val)}
                >
                  <img src={addIcon} alt="" className="mr-2" />
                  Add to Item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default fabricSkeleton;

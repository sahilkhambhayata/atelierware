import React from "react";
import Skeleton from "@mui/material/Skeleton";
import { Button } from "reactstrap";
import viewIcon from "./../../../../images/icons/viewIcon.svg";

const SkelatonTable = () => {
  const rows = 3;

  return (
    <div>
      <div className=" px-lg-5 px-md-3 px-0 mt-5">
        <div className="shadow p-3 bg-white rounded ">
          <div className="action-btn mt-1 ">
            <Button outline color="light">
              <img src={viewIcon} alt="viewIcon" />
              <span className="ms-1 d-sm-block d-none">Service</span>
            </Button>
          </div>


          
          {Array.from({ length: rows }, (_, ind) => (
            <div
              className="table-resposive border rounded-2 p-2 my-2"
              key={ind}
            >
              <div className="row">
                <div className="col-lg-1 col-12">
                  <div
                    className="bg-light"
                    style={{ width: "80px", height: "80px" }}
                  ></div>
                </div>
                <div className="col-lg-2 col-12 d-none d-sm-block custome-div2">
                  <div
                    className=" bg-light rounded-3"
                    style={{
                      // width: "150px",
                      height: "15px",
                      // backgroundColor: "#e0e0e0",
                    }}
                  ></div>
                  <div
                    className="mt-2  bg-light rounded-3"
                    style={{
                      // width: "170px",
                      height: "15px",
                      // backgroundColor: "#e0e0e0",
                    }}
                  ></div>
                  <div
                    className="mt-2  bg-light rounded-3"
                    style={{
                      // width: "200px",
                      height: "15px",
                      // backgroundColor: "#e0e0e0",
                    }}
                  ></div>
                </div>
                <div className="col-lg-8 col-12 mt-0 px-sm-3 px-0 mt-lg-3 rounded-2 p-2 bg-light d-none d-sm-block">
                  <div className="row">
                    <div className="col-md-10 col-12 row">
                      <div className="col-md-8 col-12">
                        <div
                          style={{
                            width: "60px",
                            height: "8px",
                            backgroundColor: "#c5c5c5",
                          }}
                          className="my-1 rounded-2"
                        />
                        <div
                          style={{
                            width: "50px",
                            height: "8px",
                            backgroundColor: "#c5c5c5",
                          }}
                          className="my-1 rounded-2"
                        />
                        <div
                          style={{
                            width: "60px",
                            height: "8px",
                            backgroundColor: "#c5c5c5",
                          }}
                          className="my-1 rounded-2"
                        />
                        <div
                          style={{
                            width: "40px",
                            height: "8px",
                            backgroundColor: "#c5c5c5",
                          }}
                          className="my-1 rounded-2"
                        />
                        <div
                          style={{
                            width: "40px",
                            height: "8px",
                            backgroundColor: "#c5c5c5",
                          }}
                          className="my-1 rounded-2"
                        />
                        <div
                          style={{
                            width: "30px",
                            height: "8px",
                            backgroundColor: "#c5c5c5",
                          }}
                          className="my-1 rounded-2"
                        />
                        <div
                          style={{
                            width: "49px",
                            height: "8px",
                            backgroundColor: "#c5c5c5",
                          }}
                          className="my-1 rounded-2"
                        />
                      </div>
                      <div className="d-flex justify-content-end col-md-4 col-12">
                        <div className="">
                          <div
                            style={{
                              width: "60px",
                              height: "8px",
                              backgroundColor: "#c5c5c5",
                            }}
                            className="my-1 rounded-2 d-flex justify-content-end"
                          />
                          <div
                            style={{
                              width: "50px",
                              height: "8px",
                              backgroundColor: "#c5c5c5",
                            }}
                            className="my-1 rounded-2 d-flex justify-content-end "
                          />
                          <div
                            style={{
                              width: "60px",
                              height: "8px",
                              backgroundColor: "#c5c5c5",
                            }}
                            className="my-1 rounded-2 d-flex justify-content-end"
                          />
                          <div
                            style={{
                              width: "40px",
                              height: "8px",
                              backgroundColor: "#c5c5c5",
                            }}
                            className="my-1 rounded-2 d-flex justify-content-end"
                          />
                          <div
                            style={{
                              width: "40px",
                              height: "8px",
                              backgroundColor: "#c5c5c5",
                            }}
                            className="my-1 rounded-2 d-flex justify-content-end"
                          />
                          <div
                            style={{
                              width: "30px",
                              height: "8px",
                              backgroundColor: "#c5c5c5",
                            }}
                            className="my-1 rounded-2 d-flex justify-content-end"
                          />
                          <div
                            style={{
                              width: "49px",
                              height: "8px",
                              backgroundColor: "#c5c5c5",
                            }}
                            className="my-1 rounded-2 d-flex justify-content-end"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-2 col-12 d-flex justify-content-center">
                      <div
                        className="p-3"
                        style={{ backgroundColor: "#e0e0e0" }}
                      >
                        <div
                          style={{
                            width: "80px",
                            height: "10px",
                            backgroundColor: "#c5c5c5",
                          }}
                          className="mt-1 rounded-2"
                        />
                        <div
                          style={{
                            width: "80px",
                            height: "16px",
                            backgroundColor: "#c5c5c5",
                          }}
                          className="mt-1 rounded-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-1 col-12 d-none d-md-block">
                  <div className="text-end ms-3 ">
                    <div className="d-flex justify-content-around">
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: "#e0e0e0",
                        }}
                        className="mt-1 rounded-2"
                      />
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: "#e0e0e0",
                        }}
                        className="mt-1 rounded-2"
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          width: "80px",
                          height: "20px",
                          backgroundColor: "#e0e0e0",
                        }}
                        className="mt-1 rounded-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkelatonTable;

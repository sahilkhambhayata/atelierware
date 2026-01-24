import React from "react";
import { useNavigate } from "react-router";
import { Button } from "reactstrap";

const NotFound = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/dashboard");
  };
  return (
    <div
      className="w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div id="" className="text-center">
        <img src="https://i.imgur.com/qIufhof.png" width="30%" height="30%" />

        <div id="info" className="">
          <h3>This page could not be found</h3>
        </div>

        <Button onClick={() => handleBack()} className="mt-2">Back To Home</Button>
      </div>
    </div>
  );
};

export default NotFound;

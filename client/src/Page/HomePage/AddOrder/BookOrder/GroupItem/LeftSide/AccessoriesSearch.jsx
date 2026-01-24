import React, { useEffect, useState } from "react";
import SherwaniImage from "./../../../../../../images/avatar/sherwani-image.png";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import addIcon from "./../../../../../../images/icons/add-icon.svg";
import barcodeImg from "./../../../../../../images/icons/odertable-barcode.svg";

const AccessoriesSearch = ({
  onCountChange,
  accessoriesCount,
  onDataChange,
}) => {
  const symbol = localStorage.getItem("countrySymbol");
  const [selectedAccNo, setSelectedAccNo] = useState();
  const { qty, price, rate } = formState;
  const [formState, setFormState] = useState({
    qty: 0,
    price: 0,
    rate: 0,
  });
  

  const handleAddAccessories = () => {
    setSelectedAccNo(selectedAccNo + 1);
    onCountChange(selectedAccNo + 1);
    onDataChange(formState);
  };

  useEffect(() => {
    setFormState({
      ...formState,
      rate: Number(formState.qty) * Number(formState.price),
    });
  }, [formState.qty, formState.price]);

  useEffect(() => {
    setSelectedAccNo(accessoriesCount);
    // onDataChange({ formState });
    // setFormState({
    //   qty: 0,
    //   price: 0,
    //   rate: 0,
    // });
  }, [accessoriesCount]);
  
  return (
    <div className="position-relative nk-header-searchbox border m-0">
      <div className="border p-1  row justify-content-between m-2 ">
        <div className="col-md-2 col-12 fabcol-100">
          <img
            src={SherwaniImage}
            alt=""
            // width="auto"
            height="80px"
            className="mr-3"
          />
        </div>
        <div className="row col-md-10 cst-col-12 col-12 align-items-center justify-content-between  py-0">
          <div className="col-md-8 col-12 row justify-content-between  fabcol-100  fab-py-2 fab-p-0 ">
            <div className="col-md-6 col-12 py-1 py-md-0">
              <div className="custom-border-right d-flex pr-4 aling-items-center">
                <h6 className="mb-0">#12345679</h6>
                <span className="fab-title custom-light-text custom-text-transform ">(Raymond)</span>
              </div>
              <span className="custom-light-text custom-text-transform"> Enter Description</span>
            </div>
            <div className="customer-name custom-light-text custom-text-transform col-md-6 col-12  py-1 py-md-0">
              <div className="fab-title">
                <img src={barcodeImg} alt="" /> 12345678
              </div>
              100% cotton <br />
              Red | 2.5 size
            </div>
          </div>

          <div className="col-md-4 col-12 fabcol-100">
            <div className="bg-warning text-white text-center custom-green-box px-2">
              <span className="fs-12 mb-0">34.50 Mtrs</span>
              {/* <br />
              <span>18%</span> */}
            </div>
            <div className="bg-success text-white  text-center custom-yello-box">
              <span className="fs-12 mb-0"> GST 18%</span>
              {/* <p className="mb-0"> 18%</p> */}
            </div>
            <div className="bg-primary text-white text-center custom-blue-box">
              <span className="fs-12 mb-0">Fabric</span>
              {/* <p className="mb-0">18%</p> */}
            </div>
          </div>
        </div>
      </div>

      <div className="d-md-flex  align-items-center m-2 custome-fab-input cust-bordr">
        <div className="mx-3">
          <span className="fw-bold">Jacket</span>
        </div>
        <div className="row p-2 align-items-center w-100 px-4 cust-px-2">
          <div className="col-md-3 col-12 px-0">
            <InputGroup className="">
              <InputGroup.Text id="basic-addon1">Nos</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="QTY"
                // aria-label="Username"
                value={qty}
                className="frm-int"
                onChange={(e) =>
                  setFormState({ ...formState, qty: e.target.value })
                }
                maxLength={2}
              />
            </InputGroup>
          </div>
          <div className="col-md-1 col-12 text-center px-0">
            <span className="">X</span>
          </div>
          <div className="col-md-3 col-12 px-0">
            <InputGroup className="">
              <InputGroup.Text id="basic-addon1">{symbol} </InputGroup.Text>
              <Form.Control
                type="number"
                className="frm-int"
                placeholder="50,000.00"
                value={price}
                onChange={(e) =>
                  setFormState({ ...formState, price: e.target.value })
                }
              />
            </InputGroup>
          </div>
          <div className="col-md-1 col-12 text-center px-0">
            <span className="">=</span>
          </div>
          <div className="col-md-4 col-12 px-0">
            <InputGroup className="w-100">
              <InputGroup.Text id="basic-addon1" className="w-25">
              {symbol} 
              </InputGroup.Text>
              <InputGroup.Text id="basic-addon1" className="w-75 bg-white">
                {formState.qty * formState.price}
              </InputGroup.Text>
            </InputGroup>
          </div>
        </div>
      </div>
      <div className="d-md-flex  align-items-center m-2 custome-fab-input cust-bordr">
        <div className="mx-3">
          <span className="fw-bold">Jacket</span>
        </div>
        <div className="row p-2 align-items-center w-100 px-4 cust-px-2">
          <div className="col-md-3 col-12 px-0">
            <InputGroup className="">
              <InputGroup.Text id="basic-addon1">Nos</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="QTY"
                // aria-label="Username"
                value={qty}
                className="frm-int"
                onChange={(e) =>
                  setFormState({ ...formState, qty: e.target.value })
                }
                maxLength={2}
              />
            </InputGroup>
          </div>
          <div className="col-md-1 col-12 text-center px-0">
            <span className="">X</span>
          </div>
          <div className="col-md-3 col-12 px-0">
            <InputGroup className="">
              <InputGroup.Text id="basic-addon1">{symbol} </InputGroup.Text>
              <Form.Control
                type="number"
                className="frm-int"
                placeholder="50,000.00"
                value={price}
                onChange={(e) =>
                  setFormState({ ...formState, price: e.target.value })
                }
              />
            </InputGroup>
          </div>
          <div className="col-md-1 col-12 text-center px-0">
            <span className="">=</span>
          </div>
          <div className="col-md-4 col-12 px-0">
            <InputGroup className="w-100">
              <InputGroup.Text id="basic-addon1" className="w-25">
              {symbol} 
              </InputGroup.Text>
              <InputGroup.Text id="basic-addon1" className="w-75 bg-white">
                {formState.qty * formState.price}
              </InputGroup.Text>
            </InputGroup>
          </div>
        </div>
      </div>
      <div className="d-md-flex  align-items-center m-2 custome-fab-input cust-bordr">
        <div className="mx-3">
          <span className="fw-bold">Jacket</span>
        </div>
        <div className="row p-2 align-items-center w-100 px-4 cust-px-2">
          <div className="col-md-3 col-12 px-0">
            <InputGroup className="">
              <InputGroup.Text id="basic-addon1">Nos</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="QTY"
                // aria-label="Username"
                value={qty}
                className="frm-int"
                onChange={(e) =>
                  setFormState({ ...formState, qty: e.target.value })
                }
                maxLength={2}
              />
            </InputGroup>
          </div>
          <div className="col-md-1 col-12 text-center px-0">
            <span className="">X</span>
          </div>
          <div className="col-md-3 col-12 px-0">
            <InputGroup className="">
              <InputGroup.Text id="basic-addon1">{symbol} </InputGroup.Text>
              <Form.Control
                type="number"
                className="frm-int"
                placeholder="50,000.00"
                value={price}
                onChange={(e) =>
                  setFormState({ ...formState, price: e.target.value })
                }
              />
            </InputGroup>
          </div>
          <div className="col-md-1 col-12 text-center px-0">
            <span className="">=</span>
          </div>
          <div className="col-md-4 col-12 px-0">
            <InputGroup className="w-100">
              <InputGroup.Text id="basic-addon1" className="w-25">
              {symbol} 
              </InputGroup.Text>
              <InputGroup.Text id="basic-addon1" className="w-75 bg-white">
                {formState.qty * formState.price}
              </InputGroup.Text>
            </InputGroup>
          </div>
        </div>
      </div>
      <div className="d-md-flex  align-items-center m-2 custome-fab-input cust-bordr">
        <div className="mx-3">
          <span className="fw-bold">Jacket</span>
        </div>
        <div className="row p-2 align-items-center w-100 px-4 cust-px-2">
          <div className="col-md-3 col-12 px-0">
            <InputGroup className="">
              <InputGroup.Text id="basic-addon1">Nos</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="QTY"
                // aria-label="Username"
                value={qty}
                className="frm-int"
                onChange={(e) =>
                  setFormState({ ...formState, qty: e.target.value })
                }
                maxLength={2}
              />
            </InputGroup>
          </div>
          <div className="col-md-1 col-12 text-center px-0">
            <span className="">X</span>
          </div>
          <div className="col-md-3 col-12 px-0">
            <InputGroup className="">
              <InputGroup.Text id="basic-addon1">{symbol} </InputGroup.Text>
              <Form.Control
                type="number"
                className="frm-int"
                placeholder="50,000.00"
                value={price}
                onChange={(e) =>
                  setFormState({ ...formState, price: e.target.value })
                }
              />
            </InputGroup>
          </div>
          <div className="col-md-1 col-12 text-center px-0">
            <span className="">=</span>
          </div>
          <div className="col-md-4 col-12 px-0">
            <InputGroup className="w-100">
              <InputGroup.Text id="basic-addon1" className="w-25">
              {symbol} 
              </InputGroup.Text>
              <InputGroup.Text id="basic-addon1" className="w-75 bg-white">
                {formState.qty * formState.price}
              </InputGroup.Text>
            </InputGroup>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center my-2 border-top pt-2">
        <button
          className="ps-2 pe-2 d-flex bg-white border border-1 rounded p-1 border-dark"
          onClick={handleAddAccessories}
        >
          <img src={addIcon} alt="" className="mr-2" />
          Add
        </button>
      </div>
    </div>
  );
};

export default AccessoriesSearch;

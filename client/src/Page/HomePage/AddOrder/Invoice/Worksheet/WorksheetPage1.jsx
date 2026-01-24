import React from "react";
import dolimage from "../../../../../images/Subtract.svg";
import { useSelector } from "react-redux";
const WorksheetPage1 = ({ worksheetData }) => {
  // const { worksheetData } = useSelector((state) => state?.worksheetData);

 
  return (
    <>
      {/* Invoice_description Start*/}
      <div className="description_text">
        <div className="title_ans_text">
          <div className="description_text_title">description</div>
          <p className="text">{worksheetData?.TOrdDtls?.ItemDesc}</p>
        </div>
      </div>
      {/* Invoice_description End*/}

      {/* invoice_GrandTotal Start */}
      <div className="invoice_MainImage">
        <div className="d-flex justify-content-between">
          <div className="hsn_sac_table d-flex justify-content-center">
            <div className="image-sec mt-4">
              <img
                src={worksheetData?.TOrdDtls?.attach_img_1}
                alt=""
                className="img-fluid"
              />
            </div>
          </div>
          <div className="grandTotal_table">
            <table className="table table-bordered  bg-tr-even">
              <thead className="text-center">
                <tr>
                  <th>SAMPLE</th>
                  <th>{worksheetData.Sample_Garment}</th>
                </tr>
              </thead>
              <tbody>
                {worksheetData.ShortNameMeasure ? (
                  Object.entries(worksheetData.ShortNameMeasure).map(
                    ([key, value], index) => (
                      <tr key={index}>
                        <td>{key}</td>
                        <td>{value}</td>
                      </tr>
                    )
                  )
                ) : (
                  <></>
                )}
              </tbody>
            </table>
            <table className="table table-bordered  bg-tr-even">
              {worksheetData?.AccessoryDtls?.length > 0 && (
                <>
                  <thead className="text-center">
                    <tr>
                      <th className="FabricAcsors">ACCESSORIES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {worksheetData?.AccessoryDtls?.map((item, i) => {
                      return (
                        <tr>
                          <td className="FabricAcsors_td"></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </>
              )}
            </table>

            {/* <tr>
                  <td className="FabricAcsors_td">
                    <div className="td_inner_text">Lining </div>
                    <div className="td_inner_text">Falls</div>
                    <div className="td_inner_text">Pico</div>
                    <div className="td_inner_text">Pad</div>
                    <div className="td_inner_text">Underwire</div>
                    <div className="td_inner_text">Boning Wire </div>
                    <div className="td_inner_text">Zip</div>
                    <div className="td_inner_text">Buckram</div>
                    <div className="td_inner_text">Tassel</div>
                  </td>
                </tr> */}

            <table className="table table-bordered  bg-tr-even">
              {/* <thead className="text-center">
                <tr>
                  <th className="FabricAcsors">Fabric</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="FabricAcsors_td">
                    <div className="td_inner_text">Lining </div>
                    <div className="td_inner_text">Falls</div>
                    <div className="td_inner_text">Pico</div>
                    <div className="td_inner_text">Pad</div>
                    <div className="td_inner_text">Underwire</div>
                    <div className="td_inner_text">Boning Wire </div>
                    <div className="td_inner_text">Zip</div>
                    <div className="td_inner_text">Buckram</div>
                    <div className="td_inner_text">Tassel</div>
                  </td>
                </tr>
              </tbody> */}
              {worksheetData?.Fabricdtls?.length > 0 && (
                <>
                  <thead className="text-center">
                    <tr>
                      <th className="FabricAcsors">Fabric</th>
                    </tr>
                  </thead>
                  <tbody>
                    {worksheetData?.Fabricdtls?.map((item, i) => {
                      return (
                        <tr>
                          <td className="FabricAcsors_td">{item.Item_name}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </>
              )}
            </table>
          </div>
        </div>
      </div>
      {/* invoice_GrandTotal End */}

      {/* invoice_SPECIAL_INSTRUCTIONS Start */}
      <div className="invoice_Special_Instructions">
        <div className="d-flex justify-content-between">
          <table className="table table-bordered  bg-tr-even">
            <thead className="text-center">
              <tr>
                <th className="FabricAcsors text-start">
                  SPECIAL INSTRUCTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="FabricAcsors_td">
                  <div className="row">
                    <div className="col-6">
                      <div className="sp_tab_td_innter_tex">
                        {worksheetData?.SpecialInstraction?.MRemarks}
                      </div>
                    </div>
                    <div className="col-6">
                      {" "}
                      <div className="sp_tab_td_innter_tex">
                        {worksheetData?.SpecialInstraction?.SRemarks}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* invoice_SPECIAL_INSTRUCTIONS End */}
    </>
  );
};

export default WorksheetPage1;

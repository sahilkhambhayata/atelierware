import React from "react";

import dolimage from "../../../../../images/Subtract2.svg";
import { useSelector } from "react-redux";
const WorksheetPage2 = ({ worksheetData }) => {
  // const { worksheetData } = useSelector((state) => state?.worksheetData);

  const imageData = worksheetData?.TOrdDtls;

  const newImageObjects =
    imageData &&
    Object.keys(imageData)

      .filter(
        (key) =>
          (key.startsWith("attach_img_") ||
            key.startsWith("attach_garment_img_")) &&
          imageData[key] !== null
      )
      .map((imgKey) => {
        const descKey = `${imgKey}_desc`;
        return {
          image: imageData[imgKey],
          desc: imageData.hasOwnProperty(descKey) ? imageData[descKey] : null,
        };
      });

  const finalImageObjects = newImageObjects?.slice(
    0,
    newImageObjects.length / 2
  );

  return (
    <>
      {/* Invoice_description Start*/}
      <div className="description_text">
        <div className="title_ans_text">
          <div className="description_text_title">description</div>
          <p className="text">
            <p className="text">{worksheetData?.TOrdDtls?.attach_img_1_desc}</p>
          </p>
        </div>
      </div>
      {/* Invoice_description End*/}

      {/* invoice_group_image  Start*/}
      <div className="invoice_group_Images mt-1">
        <div className=" invoice_group_Images_flex  justify-content-around">
          {finalImageObjects?.map((item, i) => {
            if (i === 0) {
              // Skip rendering the first item
              return null;
            }
            return (
              <div className="image_card ">
                <div className="image-sec">
                  <img src={item.image} alt="" />
                </div>
                <div className="image-desc">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* invoice_group_image  End*/}
    </>
  );
};

export default WorksheetPage2;

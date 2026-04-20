import React, { useEffect, useState } from "react";
import { axiosClient } from "./../../../../../axios/axios";
import { useSelector } from "react-redux";

const WorksheetPage2 = () => {
  const worksheetData = useSelector((state) => state?.worksheetData);
  const [finalImageObjects, setFinalImageObjects] = useState([]);


  useEffect(() => {
    if (
      worksheetData &&
      worksheetData.worksheetData &&
      worksheetData.worksheetData.TOrdDtls
    ) {
      const newImageObjects = Object.keys(worksheetData.worksheetData.TOrdDtls)
        .filter(
          (key) =>
            (key.startsWith("attach_img_") ||
              key.startsWith("attach_garment_img_")) &&
            !key.endsWith("_desc") &&
            worksheetData.worksheetData.TOrdDtls[key] !== null
        )
        .map((imgKey) => {
          const descKey = `${imgKey}_desc`;
          return {
            image: worksheetData.worksheetData.TOrdDtls[imgKey],
            desc: worksheetData.worksheetData.TOrdDtls.hasOwnProperty(descKey)
              ? worksheetData.worksheetData.TOrdDtls[descKey]
              : null,
          };
        });


      if (newImageObjects.length > 0) {
        setFinalImageObjects(
          newImageObjects.slice(1)
        );
      }
      // const finalObjects = newImageObjects.slice(1, newImageObjects.length / 2);
      // setFinalImageObjects(finalObjects);
    }
  }, [worksheetData]);

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
          {finalImageObjects.map((item, i) => (
            <div className="image_card " key={i}>
              <div className="image-sec">
                <img
                  src={
                    !item.image
                      ? ""
                      : item.image instanceof File || item.image instanceof Blob
                        ? URL.createObjectURL(item.image)
                        : item.image.startsWith?.("data:") || item.image.startsWith?.("http")
                          ? item.image
                          : `${axiosClient.defaults.baseURL}${item.image}`
                  }
                  alt=""
                />
              </div>
              <div className="image-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
      {/* invoice_group_image  End*/}
    </>
  );
};

export default WorksheetPage2;

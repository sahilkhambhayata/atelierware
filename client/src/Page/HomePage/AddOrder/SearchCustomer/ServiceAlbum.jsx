import React, { useEffect } from "react";
import service1 from "../../../../images/avatar/ServiceAlbum/service1.png";

import { useDispatch, useSelector } from "react-redux";
import { getServiceListAsyncData } from "../../../../redux/actions/serviceAction";
import { loading } from "./../../../../redux/actions/catelogAction";

const ServiceAlbum = ({ onImageClick, searchService }) => {
  const handleClick = (item) => {
    onImageClick(item);
  };

  const BU_ID = localStorage.getItem("BU_Id");
  const service = useSelector((state) => state.service?.service);
  const serviceNoData = useSelector((state) => state.service);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getServiceListAsyncData(BU_ID, searchService));
  }, []);

  useEffect(() => {
    dispatch(getServiceListAsyncData(BU_ID, searchService));
  }, [searchService,BU_ID,dispatch]);


  
  return (
    <div className="row m-0 w-100 ">

    
      {!serviceNoData.noData ? (
        service ? (
          service?.orderDetails?.map((item, ind) => {
            return (
              <div
                className="col-6 col-sm-4 col-lg-3 col-xl-2 mb-2 px-2 px-sm-1"
                key={ind}
              >
                <div
                  className="album text-center"
                  onClick={() => handleClick(item)}
                  //  onClick={() => handleClick(img.path)}
                >
                  {item.ItemImage ? (
                    <img src={item.ItemImage} className="img-fluid w-100" />
                  ) : (
                    <img src={service1} className="img-fluid w-100"></img>
                  )}
                  {/* <p className="image-title-position"></p> */}
                  <p className="image-title-position">
                    {item.IsGroup && " (group item) "}
                    {item.ItemName}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="" style={{ height: 520 }}>
            loading...
          </div>
        )
      ) : (
        <>
          <div className="" style={{ height: 520 }}>
            No data Found
          </div>
        </>
      )}
    </div>
  );
};

export default ServiceAlbum;

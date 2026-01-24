import React from "react";
import service1 from "../../../../images/avatar/ServiceAlbum/service1.png";
import service2 from "../../../../images/avatar/ServiceAlbum/service2.png";
import service3 from "../../../../images/avatar/ServiceAlbum/service3.png";
import service4 from "../../../../images/avatar/ServiceAlbum/service4.png";
import service5 from "../../../../images/avatar/ServiceAlbum/service5.png";
import service6 from "../../../../images/avatar/ServiceAlbum/service6.png";

const ProductAlbum = ({ onImageClick }) => {
  const images = [
    { name: "Service 1", path: service1 },
    { name: "Service 2", path: service2 },
    { name: "Service 3", path: service3 },
    { name: "Service 4", path: service4 },
    { name: "Service 5", path: service5 },
    { name: "Service 6", path: service6 },
    { name: "Service 1", path: service1 },
    { name: "Service 2", path: service2 },
    { name: "Service 3", path: service3 },
    { name: "Service 4", path: service4 },
    { name: "Service 5", path: service5 },
    { name: "Service 6", path: service6 },
    { name: "Service 1", path: service1 },
    { name: "Service 2", path: service2 },
    { name: "Service 3", path: service3 },
    { name: "Service 4", path: service4 },
    { name: "Service 5", path: service5 },
    { name: "Service 6", path: service6 },
    { name: "Service 1", path: service1 },
    { name: "Service 2", path: service2 },
  ];
  const handleClick = (imagePath) => {
    onImageClick(imagePath);
  };

  return (
    <div className="row mt-1">
      {images.map((img, ind) => {
        return (
          <div className="col-6 col-sm-4 col-lg-3 col-xl-2 my-2 px-1" key={ind}>
            <div
              className="album text-center"
              onClick={() => handleClick(img.path)}
            >
              <img src={img.path} alt="" className="p-0  img-fluid" />
              <p className="image-title-position">{img.name}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductAlbum;

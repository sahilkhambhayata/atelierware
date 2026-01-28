import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Skeleton from "@mui/material/Skeleton";

import Accordion from "react-bootstrap/Accordion";
import { Button, Spinner, UncontrolledTooltip } from "reactstrap";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import Icon from "../../../../../Components/icon/Icon";
import service1 from "./../../../../../images/avatar/ServiceAlbum/service1.png";
import PaymentEditIcon from "./../../../../../images/icons/payment-edit-icon.svg";
import DownArrowIcon from "./../../../../../images/icons/down-arrow.svg";
import UpArrowIcon from "./../../../../../images/icons/up-arrow.svg";
import MainImageIcon from "./../../../../../images/icons/main-image-icon.svg";
import MainImageIcon1 from "./../../../../../images/icons/main-image-icon1.svg";
import fabricIcon from "./../../../../../images/icons/fabric-icon.svg";
import measurementIcon from "./../../../../../images/icons/measurement-icon.svg";
import SherwaniImage from "./../../../../../images/avatar/sherwani-image.png";
import styleIcon from "./../../../../../images/icons/style-icon.svg";
import deleteWaringIcon from "./../../../../../images/icons/delete-waring-icon.svg";
import imagesIcon from "./../../../../../images/icons/photos-icon.svg";
import barcodeImg from "./../../../../../images/icons/odertable-barcode.svg";
import redDeleteIcon from "./../../../../../images/icons/red-delete-icon.svg";
import catelogFolderIcon from "./../../../../../images/icons/catelog-folder-icon.svg";
import noImageIcon from "./../../../../../images/icons/no-image-icon.svg";
import Measurement from "./LeftSide/Measurement";
import StyleSearch from "./LeftSide/StyleSearch";
import ImageSearch from "./LeftSide/ImageSearch";
import { useDispatch, useSelector } from "react-redux";
import CategoryIcon from "./../../../../../images/icons/add-order-caterory-icon.svg";
import {
  getCatelogListData,
  getSingleCatelogDetail,
} from "../../../../../redux/actions/catelogAction";
import {
  addStyleHeadDataAction,
  getStyleHeadDataAction,
} from "../../../../../redux/actions/getStyleHeadDataAction";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import {
  createDebouncedSearchFabric,
  getFebricSearchDetailsAsyncData,
} from "../../../../../redux/actions/getFebricAction";
import {
  getSingleArticleDetailsAsyncData,
  getSingleFabricAction,
} from "../../../../../redux/actions/GetSingleArticleDetailsAction";
import {
  deleteFabricAcc,
  getFabricAccessoriesList,
} from "../../../../../redux/actions/fabricAndAccessoriesCrudAction";
import FabricSearch from "./LeftSide/fabricSearch";
import {
  getDirectImageArray,
  sendImageArray,
} from "../../../../../redux/actions/getDirectImageArrayAction";
import {
  setTotalAccessoriesAmount,
  setTotalFabricAmount,
} from "../../../../../redux/actions/getDirectFabriAccAmountAction";
import { getSingleGroupItemData } from "../../../../../redux/actions/serviceAction";
import GarmentSearch from "./LeftSide/GarmentSearch";
import {
  getDirectGarmentArray,
  sendGarmentArray,
} from "../../../../../redux/actions/getDirectGarmentArrayAction";
import { useLocation } from "react-router";
import { useTheme } from "../../../../../Layout/Provider/Themes";
import Tooltip from "../../../../../Components/Tooltip/Tooltip";
import { fabicDropDownList } from "../../../../../redux/actions/fabicDropDownListAction";
import { getDiscription } from "../../../../../redux/actions/getDiscriptionAction";
import { usePermissions } from "../../../../../Layout/Provider/PermissionsContext";

const LeftSideDetail = ({ imagePath }) => {
  const symbol = localStorage.getItem("countrySymbol");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

  const { tabId } = useTheme();

  const mood = localStorage.getItem(`mood${tabId}`);
  // const [mood, setMood] = useState();
  const handleKeyDown = (e) => {
    if (mood === "view") {
      e.preventDefault();
      toast.error("You have no rights to change");
    }
  };

  // useEffect(() => {
  //   // if (isFromOrderTrackerList || isFromItemTrackerList) {
  //   if (location.state !== null) {

  //     setMood(location.state.mood);
  //   } else {

  //     const data = JSON.parse(localStorage.getItem("orderEditData"));

  //     setMood(data.mood);
  //   }
  //   // }
  // }, [tabId]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const { handleAction } = usePermissions();
  const [uniqueId, setUniqueId] = useState(uuidv4());
  const location = useLocation();
  const createOrderData = useSelector(
    (state) => state.createorddtls?.ordDetails?.upCrtOrder
  );

  if (
    createOrderData?.TOrdHdID != null ||
    createOrderData?.TOrdHdID != undefined
  ) {
    localStorage.setItem(`TOrdHdID${tabId}`, createOrderData?.TOrdHdID);
  }

  const [modelStyle, setModelStyle] = useState(false);
  const [isSample, setIsSample] = useState(false);
  const [activeID, setActiveId] = useState("");
  const [styleData, setStyleData] = useState([]);
  const [detailsData, setDetailsData] = useState({});

  const handleCheckboxChange = () => {
    setIsSample(!isSample);
  };

  const BU_ID = localStorage.getItem("BU_Id");
  const dispatch = useDispatch();
  const [accordionFabric, setAccordionFabric] = useState(false);
  const [accordionMeas, setAccordionMeas] = useState(false);
  const [accordionStyle, setAccordionStyle] = useState(false);
  const [accordionImage, setAccordionImage] = useState(false);
  const [accordionGarment, setAccordionGarment] = useState(false);
  const toggleFabric = () => {
    setAccordionFabric(!accordionFabric);
  };
  const toggleMeas = () => {
    setAccordionMeas(!accordionMeas);
  };
  const toggleStyle = () => {
    setAccordionStyle(!accordionStyle);
  };
  const toggleImage = () => {
    setAccordionImage(!accordionImage);
  };
  const toggleGarment = () => {
    setAccordionGarment(!accordionGarment);
  };
  const service = useSelector((state) => state.service);

  const serviceId = localStorage.getItem(`serviceId${tabId}`);
  const singleOrderData = useSelector((state) => state.orderListData.single);
  const selectedGroupItem = service?.singleGroupService?.data?.itemDetails;
  const catelog = useSelector((state) => state.catelog);
  const imageStore = useSelector((state) => state.imageArray);
  const fabAccAmountObject = useSelector((state) => state.getFabAccAmount);
  const EnableInventory = useSelector(
    (state) => state?.config?.orderType.EnableInventory
  );
  const [isHeadLoader, setIsHeadLoader] = useState(true);

  useEffect(() => {
    if (selectedGroupItem?.ItemName) {
      setIsHeadLoader(false);
    }
  }, [selectedGroupItem]);

  const measurementLenght = useSelector((state) => state.measure);

  const [isImage, setIsImage] = useState(false);
  const [isGarment, setIsGarment] = useState(false);

  //fabric and accessories logic------------------------------------------------------------------------------------------------------------------------------------------------

  const [fabric, setFabric] = useState([]);

  const handleFabricData = (data) => {
    setFabric([...fabric, data]);
  };

  const [accessories, setAccessories] = useState([]);

  const handleStyleModelOpen = (value) => {
    setModelStyle(value);
  };
  const handleStyleModelClose = (value) => {
    setModelStyle(false);
    // setStyleSwitchValue(activeID);
  };

  const [deletefabricModal, setDeleteFabricModal] = useState(false);

  const [deleteFabric, setDeleteFabric] = useState();

  const handleFabricDeleteModelClose = (ind) => {
    setDeleteFabricModal(false);
  };
  const handleRemoveAccessories = (ind) => {
    const updatedAccessories = [...accessories];
    updatedAccessories.splice(ind, 1);
    setAccessories(updatedAccessories);
  };

  //fabric and accessories logic close------------------------------------------------------------------------------------------------------------------------------------------------

  const addedFabricList = useSelector((state) => state?.fabricCRUDDetails);

  const debouncedSearchRef = useRef(createDebouncedSearchFabric());
  useEffect(() => {
    if (selectedGroupItem?.ItemId) {
      dispatch(getStyleHeadDataAction(BU_ID, selectedGroupItem?.ItemId)).then(
        (data) => {
          if (data?.success === true) {
            // navigate("/");
          } else {
            setTimeout(() => {
              // navigate("/");
              // alert("logout failed");
              // setLoading(false);
            }, 1000);
          }
        }
      );
    }
    debouncedSearchRef.current(dispatch, "");
    // dispatch(getFebricSearchDetailsAsyncData(""));
  }, [selectedGroupItem?.ItemId]);
  useEffect(() => {
    if (Object.keys(singleOrderData).length !== 0) {
      if (singleOrderData.orderItemList[0]) {
        if (singleOrderData?.orderItemList[0]?.imageOrdStyle?.length > 0) {
          setIsStyle(true);
          const updatedSingleImageRecord = {};
          singleOrderData.orderItemList[0].imageOrdStyle.forEach((item) => {
            const { CNTSID, details } = item;
            const { StyleId, Options, Amount, images } = details[0];
            updatedSingleImageRecord[StyleId] = {
              ...details[0],
              CNTSID: CNTSID,
            };
            setSaveStyleHeadData((prevData) => ({
              ...prevData,
              ["S" + CNTSID]: StyleId,
              ["OP" + CNTSID]: Options,
              ["Amt" + CNTSID]: Amount,
            }));
            setSelectedImage(images);
          });
          setSingleImageRecord((prevRecord) => ({
            ...prevRecord,
            ...updatedSingleImageRecord,
          }));
        }
      }
    }
  }, [singleOrderData]);

  const getStyleHeadData = useSelector(
    (state) => state?.getStyleHeadData?.customer
  );
  const [selectedImage, setSelectedImage] = useState(noImageIcon);

  const [singleImageRecord, setSingleImageRecord] = useState({});
  useEffect(() => {
    // Set default selected image when the modal opens
    if (Object.keys(singleImageRecord).length > 0 && !selectedImage) {
      const defaultImage = Object.values(singleImageRecord)[0].images;
      setSelectedImage(defaultImage);
    }
  }, [singleImageRecord]);

  const [saveStyleHeadData, setSaveStyleHeadData] = useState("");
  const itemId = localStorage.getItem(`serviceId${tabId}`);
  const custId = localStorage.getItem(`customerId${tabId}`);
  const [isLoader, setIsLoader] = useState(false);

  const hendleStyleDataSubmit = () => {
    setModelStyle(false);
  };
  const [isStyle, setIsStyle] = useState(false);
  const TOrdHdId = localStorage.getItem(`TOrdHdID${tabId}`);
  const TOrdDtId = localStorage.getItem(`TOrdDtID${tabId}`);
  const hendleStyleDataSave = () => {
    setIsLoader(true);

    if (saveStyleHeadData !== "") {
      dispatch(
        addStyleHeadDataAction(
          custId,
          itemId,
          TOrdHdId,
          TOrdDtId,
          saveStyleHeadData
        )
      ).then((res) => {
        if (res.success) {
          setIsStyle(true);
          toggleStyle();
          setAccordionStyle(false);
          toast.success(res.message);
          setIsLoader(false);
        } else {
          // toast.error(res.message);
          setTimeout(() => {
            setIsLoader(false);
          }, 400);
        }
      });
      setTimeout(() => {
        setIsLoader(false);
      }, 4000);
    } else {
      toast.error("please select the style ");
      setTimeout(() => {
        setIsLoader(false);
      }, 400);
    }
  };

  const handleCuffSelect = (image) => {
    setSaveStyleHeadData({
      ...saveStyleHeadData,
      ["S" + image.CNTSID]: image.StyleId,
      ["OP" + image.CNTSID]: image.Options,
      ["Amt" + image.CNTSID]: image.Amount,
    });
    setSelectedImage(image.images);
    setSingleImageRecord({ ...singleImageRecord, [image.StyleId]: image });
  };

  const [styleSwitchValue, setStyleSwitchValue] = useState();

  const handleRemovesingleImageRecord = (data) => {
    const newObj = { ...singleImageRecord };
    delete newObj[data.StyleId];
    setSingleImageRecord(newObj);
    if (selectedImage === singleImageRecord[data.StyleId]?.images) {
      setSelectedImage(null);
    }
  };

  //image logic--------------------------------------------------------------------------------------------------------------------------------------------------------------------

  const [searchCatalog, setSearchCatalog] = useState("");

  //image from browes========================================================

  const [mergedImageArray, setMergedImageArray] = useState([]);
  const [hoverIndex, setHoverIndex] = useState();
  const [imageDeleteModel, setImageDeleteModel] = useState(false);
  const [deleteImage, setDeleteImage] = useState();
  const [deleteImageIndex, setDeleteImageIndex] = useState();
  const [imgFromDatabase, setImageFromDatabase] = useState(false);
  const [bigImageModel, setBigImageModel] = useState(false);
  const [activeImg, setActiveImg] = useState();
  const swiperRef = useRef(null);
  const [mergedGarmentArray, setMergedGarmentArray] = useState([]);
  const [garmentDeleteModel, setGarmentDeleteModel] = useState(false);
  const [deleteGarment, setDeleteGarment] = useState();
  const [deleteGarmentIndex, setDeleteGarmentIndex] = useState();
  const [bigGarmentModel, setBigGarmentModel] = useState(false);
  const [activeGarment, setActiveGarment] = useState();
  const [isCatalog, setIsCatalog] = useState(false);
  const [catalogInd, setCatalogInd] = useState();
  const [mainImage, setMainImage] = useState();
  const [mainGarment, setMainGarment] = useState();
  const [newArray, setNewArray] = useState();
  const [catalogImageArray, setCatalogImageArray] = useState([]);

  const handleAddImageToMergedArray = async (images) => {
    const newImages = images.filter((image) => {
      return !mergedImageArray.some(
        (existingImage) => existingImage.name === image.name
      );
    });

    const newMergedArray = await Promise.all(
      newImages.map(async (image, ind) => {
        const isBase64 = image.startsWith("data:image/");
        const isFile = image instanceof File;
        return new Promise((resolve) => {
          if (isBase64 || !isFile) {
            // Handle base64 strings or paths
            resolve({
              image: isBase64 ? image : image.path,
              name: image.name || `image-${ind}`, // Provide a default name if missing
              description: "",
              id: uuidv4(),
            });
          } else if (isFile) {
            const reader = new FileReader();

            reader.onloadend = () => {
              resolve({
                image: reader.result,
                name: image.name,
                description: "",
                id: uuidv4(),
              });
            };

            reader.readAsDataURL(image);
          }
        });
      })
    );

    setMergedImageArray((prevMergedArray) => [
      ...prevMergedArray,
      ...newMergedArray,
    ]);
  };

  const handleImageModelOpen = (value) => {
    handleAddImageToMergedArray(value);
    setIsImage(true);
  };

  useEffect(() => {
    if (mergedImageArray.length > 0) {
      setMainImage(mergedImageArray[0]);
    }
  }, [mergedImageArray]);

  const handleAddImage = () => {
    if (mergedImageArray.length > 10) {
      toast.error("You can't add more than 10 images");

      setMergedImageArray(mergedImageArray.slice(0, 10));
    }
    // else {
    //   setIsImage(false);
    // }
    setIsImage(false);
  };

  useEffect(() => {
    if (mergedImageArray.length == 0) {
      setMainImage(null);
    }
  }, [mergedImageArray]);

  useEffect(() => {
    // const mainImageIndex = mergedImageArray.findIndex(
    //   (image) => image.id === mainImage.id
    // );

    // const filteredMergedImageArray = mergedImageArray.filter(
    //   (image) => image.id !== mainImage.id
    // );

    // setNewArray([mainImage, ...filteredMergedImageArray]);


    if (mergedImageArray.length > 0 && mergedImageArray.length <= 10) {
      dispatch(getDirectImageArray(mergedImageArray, mainImage));
    }
  }, [mergedImageArray, mainImage, singleOrderData, dispatch]);

  useEffect(() => {
    dispatch(sendImageArray(mergedImageArray));
  }, [mergedImageArray]);

  const handleImageModelClose = () => {
    setIsImage(false);
  };
  //close image from browes========================================================

  const handleSearchCatalogChange = (e) => {
    setSearchCatalog(e.target.value);
  };

  const handleImageClick = (value, img, index) => {
    setActiveImg(index);
    setBigImageModel(value);
  };

  const handleBigImageModelClose = () => {
    setBigImageModel(false);
  };

  const handleImageRemove = (value, img, index, isDatabase) => {
    if (mood == "view") {
      toast.error("You have no rights to change");
    } else {
      setImageDeleteModel(value);
      if (isDatabase === "1") {
        setImageFromDatabase(false);
      } else {
        setImageFromDatabase(true);
      }
      setDeleteImage(img);
      setDeleteImageIndex(index);
    }
  };

  const addMainImage = (img, index) => {
    setMainImage(img);
    const filteredArray = mergedImageArray.filter(
      (item) => item.image !== img.image
    );
    setMergedImageArray([img, ...filteredArray]);
  };

  const handleImageDeleteModelClose = () => {
    setImageDeleteModel(false);
  };

  const handleImageDelete = (img, index, imgFromDatabase) => {
    setMergedImageArray((prevSelectedImages) =>
      prevSelectedImages.filter((_, ind) => ind !== index)
    );
    setImageDeleteModel(false);
  };

  useEffect(() => {
    if (isCatalog) {
      dispatch(getCatelogListData(BU_ID));
    }
  }, [isCatalog]);

  const [subCatLoader, setSubCatLoader] = useState(false);
  const handleCatelog = (id) => {
    setSubCatLoader(true);
    setCatalogInd(id);
    dispatch(getSingleCatelogDetail(id, BU_ID)).then((res) => {
      if (res.success) {
        setSubCatLoader(false);
      }
    });
  };

  const handleCatalogModelOpen = () => {
    if (mood == "view") {
      toast.error("You have no rights to change");
    } else {
      setIsCatalog(true);
    }
  };

  const handleCatalogModelClose = () => {
    setIsCatalog(false);
    setCatalogInd();
    setCatalogImageArray([]);
  };

  const handleCatalogArray = (img) => {
    const catalogSet = new Set(catalogImageArray.map((item) => item.CatDTitle));

    if (catalogSet.has(img.CatDTitle)) {
      setCatalogImageArray((prevCatalogArray) =>
        prevCatalogArray.filter((item) => item.CatDTitle !== img.CatDTitle)
      );
      setMergedImageArray((prevMergedArray) =>
        prevMergedArray.filter((item) => item.name !== img.CatDTitle)
      );
    } else {
      setCatalogImageArray((prevCatalogArray) => [...prevCatalogArray, img]);
      setMergedImageArray((prevMergedArray) => [
        ...prevMergedArray,
        {
          image: img.CatDetImage,
          name: img.CatDTitle,
          description: "",
          id: uuidv4(),
        },
      ]);
    }
  };

  // 2e498475-6a1d-4b06-bdb0-369019317fb6
  // 2e498475-6a1d-4b06-bdb0-369019317fb6

  const handleDescriptionChange = (ind, event) => {
    const updatedMergedArray = [...mergedImageArray];
    updatedMergedArray[ind].desc = event.target.value;
    setMergedImageArray(updatedMergedArray);
  };

  const handleAddCatalogImage = () => {
    setIsCatalog(false);
    setIsImage(true);
  };

  useEffect(() => {
    if (Object.keys(singleOrderData).length !== 0) {
      if (singleOrderData.orderItemList[0]) {
        const obj = singleOrderData.orderItemList[0];

        // console.log(obj);

        //image at edit time
        const newImageObjects = Object.keys(obj)
          .filter((key) => key.startsWith("attach_img_") && obj[key] !== null)
          .map((imgKey) => {
            const descKey = `${imgKey}_desc`;
            return {
              image: obj[imgKey],
              desc: obj.hasOwnProperty(descKey) ? obj[descKey] : null,
            };
          })
          .filter((item) => item.image.startsWith("data:"));

        const finalImageObjects = newImageObjects.slice(
          0,
          newImageObjects.length / 2
        );

        setMergedImageArray(newImageObjects);

        //garment at edit time
        const newGarmentObjects = Object.keys(obj)
          .filter(
            (key) => key.startsWith("attach_garment_img_") && obj[key] !== null
          )
          .map((imgKey) => {
            const descKey = `${imgKey}_desc`;
            return {
              image: obj[imgKey],
              desc: obj.hasOwnProperty(descKey) ? obj[descKey] : null,
            };
          });

        const finalGarmentObjects = newGarmentObjects.slice(
          0,
          newGarmentObjects.length / 2
        );
        setMergedGarmentArray(finalGarmentObjects);
      }
    }
  }, [singleOrderData]);

  //handle garment=============================================================================================================================================
  const handleGarmentModelOpen = (value) => {
    // handleAddImageToMergedArray(value);
    setIsGarment(true);
    handleAddGarmentToMergedArray(value);
  };
  const handleAddGarmentToMergedArray = async (images) => {
    const newImages = images.filter((image) => {
      return !mergedGarmentArray.some(
        (existingImage) => existingImage.name === image.name
      );
    });

    const newMergedArray = await Promise.all(
      newImages.map(async (image, ind) => {
        const isBase64 = image.startsWith("data:image/");
        const isFile = image instanceof File;

        return new Promise((resolve) => {
          if (isBase64 || !isFile) {
            // Handle base64 strings or paths
            resolve({
              image: isBase64 ? image : image.path,
              name: image.name || `image-${ind}`, // Provide a default name if missing
              description: "",
              id: uuidv4(),
            });
          } else if (isFile) {
            const reader = new FileReader();

            reader.onloadend = () => {
              resolve({
                image: reader.result,
                name: image.name,
                description: "",
                id: uuidv4(),
              });
            };

            reader.readAsDataURL(image);
          }
        });
      })
    );

    setMergedGarmentArray((prevMergedArray) => [
      ...prevMergedArray,
      ...newMergedArray,
    ]);
  };

  useEffect(() => {
    if (mergedGarmentArray.length > 0 && !mainGarment) {
      setMainGarment(mergedGarmentArray[0]);
    }
  }, [mergedGarmentArray]);

  const handleAddGarment = () => {
    if (mergedGarmentArray.length > 3) {
      toast.error("You can't add more than 3 images");

      setMergedGarmentArray(mergedGarmentArray.slice(0, 3));
    }
    // else {
    //   setIsImage(false);
    // }
    setIsGarment(false);
  };
  useEffect(() => {
    if (mergedGarmentArray.length == 0) {
      setMainGarment(null);
    }
  }, [mergedGarmentArray]);

  useEffect(() => {
    if (mergedGarmentArray.length > 0 && mergedGarmentArray.length <= 3) {
      dispatch(getDirectGarmentArray(mergedGarmentArray, mainGarment));
    }
  }, [mergedGarmentArray, mainGarment, singleOrderData, dispatch]);

  useEffect(() => {
    dispatch(sendGarmentArray(mergedGarmentArray));
  }, [mergedGarmentArray]);

  const handleGarmentModelClose = () => {
    setIsGarment(false);
  };

  const handleGarmentClick = (value, img, index) => {
    setActiveGarment(index);
    setBigGarmentModel(value);
  };

  const handleBigGarmentModelClose = () => {
    setBigGarmentModel(false);
  };

  const handleGarmentRemove = (value, img, index, isDatabase) => {
    if (mood == "view") {
      toast.error("You have no rights to change");
    } else {
      setGarmentDeleteModel(value);

      setDeleteGarment(img);
      setDeleteGarmentIndex(index);
    }
  };

  const addMainGarment = (img, index) => {
    setMainGarment(img);
  };

  const handleGarmentDeleteModelClose = () => {
    setGarmentDeleteModel(false);
  };

  const handleGarmentDelete = (img, index, imgFromDatabase) => {
    setMergedGarmentArray((prevSelectedImages) =>
      prevSelectedImages.filter((_, ind) => ind !== index)
    );
    setGarmentDeleteModel(false);
  };

  const handleDescriptionGarment = (ind, event) => {
    const updatedMergedArray = [...mergedGarmentArray];
    updatedMergedArray[ind].description = event.target.value;
    setMergedGarmentArray(updatedMergedArray);
  };

  //handleEditFabric ====================================================================================================================================================

  const handleEditFabric = (id) => {
    if (mood == "view") {
      toast.error("You have no rights to change");
    } else {
      const singleEditFabric = addedFabricList?.fabricAcc?.SearchArticle?.find(
        (fabric) => fabric.TOrd_FabricId === id
      );
      dispatch(getSingleFabricAction(singleEditFabric));
      setAccordionFabric(true);
    }
  };

  const TOrdDtID = localStorage.getItem(`TOrdDtID${tabId}`);

  useEffect(() => {
    // Strict validation - prevent API call with null/undefined/"null" string
    // Previous check allowed string "null" to pass, causing fabriclist/null API failure
    if (TOrdDtID && TOrdDtID !== "null" && TOrdDtID !== null && serviceId) {
      dispatch(getFabricAccessoriesList(TOrdDtID));
    } else {
      dispatch({ type: "GET_FABRIC_ACC_LIST", payload: {} });
    }
  }, [TOrdDtID, serviceId]);

  // useLayoutEffect(() => {

  //   // dispatch(getFabricAccessoriesList(TOrdDtID));
  // }, []);

  //handleDeleteFabric ====================================================================================================================================================
  const handleDeleteFabric = (id) => {
    if (mood == "view") {
      toast.error("You have no rights to change");
    } else {
      const singleEditFabric = addedFabricList?.fabricAcc?.SearchArticle?.find(
        (fabric) => fabric.TOrd_FabricId === id
      );

      dispatch(deleteFabricAcc(id)).then((res) => {
        if (res.success) {
          const TOrdDtID = localStorage.getItem(`TOrdDtID${tabId}`);

          dispatch(getFabricAccessoriesList(TOrdDtID));
          toast.success(res.message);
        }
        // else {
        //   toast.error(res.message);
        // }
      });
    }
  };

  const isFromGroupOrderPage =
    location.state && location.state.from == "group-page";
  const isGroupId = location.state && location.state.id;

  const fabArray = addedFabricList?.fabricAcc?.SearchArticle?.filter(
    (val) =>
      val?.ItemType === "Cut Length" ||
      val?.ItemType === "Fabric" ||
      val?.ItemType === "fabric" ||
      val?.ItemType === "cut length"
  );

  const accArray = addedFabricList?.fabricAcc?.SearchArticle?.filter(
    (val) => val?.ItemType === "Accessories" || val?.ItemType === "accessories"
  );

  const totalFabricAmount = fabArray?.reduce((sum, fabric) => {
    // console.log(fabric.Item_rate);
    const product = isFromGroupOrderPage
      ? fabric.Basic_Amt == null || fabric.Basic_Amt == 0
        ? fabric.Item_rate
        : fabric.Quantity * fabric.Basic_Amt
      : fabric.Basic_Amt == null || fabric.Basic_Amt == 0
        ? fabric.Item_rate
        : fabric.Quantity * fabric.Basic_Amt;
    return sum + product;
  }, 0);

  // console.log(totalFabricAmount);
  const totalAccAmount = accArray?.reduce((sum, fabric) => {
    const product = isFromGroupOrderPage
      ? fabric.Basic_Amt == null || fabric.Basic_Amt == 0
        ? fabric.Item_rate
        : fabric.Quantity * fabric.Basic_Amt
      : fabric.Basic_Amt == null || fabric.Basic_Amt == 0
        ? fabric.Item_rate
        : fabric.Quantity * fabric.Basic_Amt;
    return sum + product;
  }, 0);

  const [isMes, setIsMes] = useState(false);
  const handleAddMeasurementSuccess = (parameter) => {
    toggleMeas();

    setAccordionMeas(false);
    setIsMes(true);
  };

  const handleAddFabricSuccess = (parameter) => {
    setAccordionFabric(false);
  };

  useEffect(() => {
    dispatch(setTotalFabricAmount(totalFabricAmount));
    dispatch(setTotalAccessoriesAmount(totalAccAmount));
  }, [totalFabricAmount, totalAccAmount]);

  // const singleOrderData = useSelector((state) => state.orderListData.single);
  useEffect(() => {
    // Fixed: Changed dependency from fabArray?.length to TOrdDtId
    // Previous dependency caused duplicate calls when fabric array was populated
    if (TOrdDtId && TOrdDtId !== "null" && TOrdDtId !== null) {
      dispatch(fabicDropDownList(TOrdDtId));
    }
  }, [TOrdDtId, dispatch]);

  const [itemDesc, setItemDesc] = useState("");
  const handleInputChange = (e) => {
    setItemDesc(e.target.value);
  };

  useEffect(() => {
    if (selectedGroupItem?.ItemDescription) {
      setItemDesc(selectedGroupItem.ItemDescription);
    }
  }, [selectedGroupItem]);

  useEffect(() => {
    // if (itemDesc && itemDesc !== selectedGroupItem?.ItemDescription) {
    dispatch(getDiscription(itemDesc));
    // }
  }, [itemDesc, dispatch]);

  return (
    <div className="mr-2">
      <div className="d-flex">
        {selectedGroupItem?.ItemImage ? (
          <img src={service1} alt="" />
        ) : (
          <div className="text-lg-center ">
            <img
              src={CategoryIcon}
              alt=""
              width="100px"
              height="100px"
              className="bg-light py-2 px-3"
            />
          </div>
        )}
        {isHeadLoader ? (
          <>
            <div>
              <Skeleton
                variant="rectengle"
                width={150}
                height={40}
                className="m-1 ms-3"
              />
              <Skeleton
                variant="rectengle"
                width={300}
                height={30}
                className="m-1 ms-3"
              />
            </div>
          </>
        ) : (
          <div className="ml-2 custom-title-ItemName w-100">
            <p className="fw-bold fs-3 mb-0 ml-2 ml-1">
              {/* {Object.keys(singleOrderData).length !== 0 ? singleOrderData?.orderItemList?.[0]?.ItemName :selectedGroupItem?.ItemName} */}
              {selectedGroupItem?.ItemName}
            </p>
            <input
              className="border p-2 rounded-2 h-full w-100"
              type="text"
              name="itemDesc"
              id="BtnBkAnOrderEditItemDesc"
              value={itemDesc}
              // onChange={() =>
              //   handleAction(
              //     "BtnBkAnOrderEditItemDesc",
              //     "action",
              //     handleInputChange

              //   )
              // }
              readOnly={mood === "view"}
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
            />
            {/* {selectedGroupItem?.ItemDescription && (
              <div className="border p-2 rounded-2 h-full w-100">
                {selectedGroupItem?.ItemDescription}
              </div>
            )} */}
          </div>
        )}
      </div>

      <div className="mt-2 mt-lg-5 acc-sv-box">
        <div className="position-relative nk-accordion-searchbox  ">
          {/* fabric selection====================================================================================================== */}
          {addedFabricList.isLoader ? (
            <div
              className="d-flex justify-content-center"
              style={{
                minHeight: 100,
              }}
            >
              <Spinner className="" />
            </div>
          ) : (
            <>
              {serviceId != null && TOrdDtId != null && (
                <div>
                  <div
                    className={`rounded-2 ${fabArray?.length > 0 ? "border" : "border-0"
                      }`}
                  >
                    {fabArray?.length > 0 ? (
                      <div className="border-bottom mt-1 rounded-2 fw-bold d-flex align-items-center justify-content-between align-items-center getFebric_sec mx-auto px-2 ">
                        <div className="lable_title_acc_feb">
                          Added Fabric
                          <span className=" fabric_pillBox  text-white rounded-pill ">
                            {fabArray?.length < 10 && "0"}
                            {fabArray?.length}
                          </span>
                        </div>
                        <div className=" number_acc_feb rounded fw-bold text-end">
                          <label
                            htmlFor=""
                            className="fs-16 bg-light px-2 py-1 rounded-2"
                          >
                            {symbol} {totalFabricAmount}
                          </label>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}

                    {fabArray?.map((fabric, index) => {
                      return (
                        <div
                          className="d-flex justify-content-between p-1 rounded-3 icons_hide_css"
                          // onMouseEnter={()=>setHoverIndex(index)}
                          key={index}
                        >
                          <div className="row justify-content-start m-1 p-1 w-100 border rounded-2">
                            <div className="d-flex justify-content-center col-md-1 col-sm-6 col-12 p-0 cust_col-fab_Ass">
                              <img
                                src={SherwaniImage}
                                alt=""
                                width="55px"
                                height="55px"
                                className="rounded-2 img-fluid feb_access"
                              />
                            </div>
                            <div className="d-flex custom-border-right p-0 col-md-3 col-sm-6 col-12 cust_feb_asse_name ">
                              <div className="pr-sm-2 pr-0 ml-1">
                                <span
                                  className="mb-0 fw-bold fs-14"
                                  id={`ArticleName${index}`}
                                >
                                  {/* {fabric.articleData.ArticleName} */}
                                  {fabric.articleData.ArticleName.length >= 12
                                    ? fabric.articleData.ArticleName.slice(
                                      0,
                                      12
                                    ) + "..."
                                    : fabric.articleData.ArticleName}
                                </span>
                                {fabric.articleData.ArticleName.length >=
                                  12 && (
                                    <Tooltip
                                      id={`ArticleName${index}`}
                                      direction="right"
                                      text={fabric.articleData.ArticleName}
                                    />
                                  )}
                                <div className="d-flex custom-light-text custom-text-transform">
                                  {fabric.Barcode_Id != null && (
                                    <>
                                      <img src={barcodeImg} alt="" />
                                      <p className="mb-0 fs-12">
                                        {fabric.Barcode_Id}
                                      </p>
                                    </>
                                  )}
                                </div>
                                <div className="d-flex custom-light-text custom-text-transform">
                                  {/* <img src={barcodeImg} alt="" /> */}
                                  <p
                                    className="mb-0 fs-12"
                                    id={`discriptionsls${index}`}
                                  >
                                    {fabric?.Descriptions?.length >= 12
                                      ? fabric?.Descriptions?.slice(0, 12) +
                                      "..."
                                      : fabric?.Descriptions}
                                  </p>

                                  {fabric?.Descriptions?.length >= 12 && (
                                    <Tooltip
                                      id={`discriptionsls${index}`}
                                      direction="right"
                                      text={fabric?.Descriptions}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="col-md-5 col-sm-6 col-12 pl-md-2 pl-0 justify-content-center get-feb-row_cust">
                              <div className="fw-bold "></div>
                              <div className="row custom-name">
                                <div className="custom-border-right col-sm-4 col-12 px-2 custom-light-text custom-text-transform custo_col_respo3">
                                  <span
                                    className="mb-0 fs-12 "
                                    id={`Item_name${index}`}
                                  >
                                    {fabric.Item_name.length >= 8
                                      ? fabric.Item_name.slice(0, 8) + "..."
                                      : fabric.Item_name}

                                    {fabric.Item_name.length >= 8 && (
                                      <Tooltip
                                        id={`Item_name${index}`}
                                        direction="right"
                                        text={fabric.Item_name}
                                      />
                                    )}
                                    {/* 100% COTTON */}
                                    {/* {fabric.Item_name} */}
                                  </span>
                                  <p className="mb-0 fs-12">
                                    {fabric.articleData?.Brandtbl?.BrandName}
                                    {/* PALADINO */}
                                  </p>
                                </div>
                                <div className="custom-border-right px-2 col-sm-5 col-12 custom-light-text custom-text-transform custo_col_respo3">
                                  <span className="mb-0 fs-12">
                                    {fabric.articleData?.Sizetbl?.Size}
                                    {/* SMALL SIZE */}
                                  </span>
                                  <p className="mb-0 fs-12">
                                    {/* LIGHT BROWN */}
                                    {fabric.articleData?.Colortbl?.ColourName}
                                  </p>
                                </div>
                                <div className="px-2 col-sm-3 col-12 custom-light-text custom-text-transform custo_col_respo3">
                                  <span className="mb-0 fs-12">QTY</span>
                                  <p className="mb-0 fs-12">
                                    {fabric.Quantity}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="border text-center my-3 d-flex align-items-center justify-content-center rounded fw-bold col-md-2 col-sm-4 col-8 p-0 feb_Asse_rs_sec ">
                              <label htmlFor="" className="mb-0 fs-14 ">
                                {symbol}
                                {isFromGroupOrderPage
                                  ? fabric.Basic_Amt == null ||
                                    fabric.Basic_Amt == 0
                                    ? fabric.Item_rate
                                    : fabric.Quantity * fabric.Basic_Amt
                                  : fabric.Basic_Amt == null ||
                                    fabric.Basic_Amt == 0
                                    ? fabric.Item_rate
                                    : fabric.Quantity * fabric.Basic_Amt}
                              </label>
                            </div>
                            <div className="col-md-1 col-sm-2 col-4 text-end px-0 edit-icon">
                              <div
                                style={{ cursor: "pointer" }}
                                className=""
                                id="BtnBkAnOrderEditFab"
                                // onClick={() =>
                                //   handleAction(
                                //     "BtnBkAnOrderEditFab",
                                //     "action",
                                //     handleEditFabric,
                                //     fabric?.TOrd_FabricId

                                //   )
                                // }

                                onClick={() =>
                                  handleEditFabric(fabric?.TOrd_FabricId)
                                }
                              >
                                <img src={PaymentEditIcon}></img>
                              </div>
                              <div
                                id="BtnBkAnOrderDelFab"
                                style={{ cursor: "pointer" }}
                                className="mt-1 "
                                // onClick={() =>
                                //   handleAction(
                                //     "BtnBkAnOrderDelFab",
                                //     "action",
                                //     handleDeleteFabric,
                                //     fabric?.TOrd_FabricId

                                //   )
                                // }
                                onClick={() =>
                                  handleDeleteFabric(fabric?.TOrd_FabricId)
                                }
                              >
                                <img src={redDeleteIcon} width="20px"></img>
                              </div>
                            </div>
                            {fabric.IsDyeing ? (
                              <>
                                <div className="d-flex align-items-center gap-2 bg-body-secondary py-2">
                                  <p className={`mb-0 fs-14 text-dark fw-bold`}>
                                    Dyeing{" "}
                                  </p>

                                  <div>
                                    {fabric.IsDyeing && (
                                      <p className={`mb-0  mt-1 fs-12`}>
                                        <span className="fw-bold">
                                          {fabric.DyeingOption}
                                        </span>{" "}
                                        : {fabric.DyeingComment}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                          {/* </div> */}
                        </div>
                      );
                    })}
                  </div>

                  <div
                    className={` mt-2 rounded-2 ${accArray?.length > 0 ? "border" : "border-0"
                      }`}
                  >
                    {accArray?.length > 0 ? (
                      <div className="border-bottom mt-1 rounded-2 fw-bold d-flex align-items-center justify-content-between align-items-center getFebric_sec mx-auto px-2 ">
                        <div className="lable_title_acc_feb">
                          Added Accessories
                          <span className="bg-success fabric_pillBox  text-white rounded-pill ">
                            {accArray?.length < 10 && "0"}
                            {accArray?.length}
                          </span>
                        </div>
                        <div className="number_acc_feb rounded fw-bold text-end">
                          <label
                            htmlFor=""
                            className="fs-16 bg-light px-3 py-1 rounded-2 "
                          >
                            {symbol} {totalAccAmount}
                          </label>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}

                    {accArray?.map((accessory, index) => (
                      <div
                        className="d-flex justify-content-between p-1 rounded-3 icons_hide_css"
                        key={index}
                      >
                        <div className="row justify-content-start m-1 p-1 w-100 border rounded-2">
                          <div className="d-flex justify-content-center col-md-1 col-sm-6 col-12 p-0 cust_col-fab_Ass">
                            <img
                              src={SherwaniImage}
                              alt=""
                              width="55px"
                              height="55px"
                              className="rounded-2 img-fluid feb_access"
                            />
                          </div>
                          <div className="d-flex custom-border-right p-0 col-md-2 col-sm-6 col-12 cust_feb_asse_name ">
                            <div className="pr-sm-2 pr-0 ml-1">
                              <span
                                className="mb-0 fw-bold fs-14"
                                id={`ArticleName${index}`}
                              >
                                {accessory.articleData.ArticleName.length >= 12
                                  ? accessory.articleData.ArticleName.slice(
                                    0,
                                    12
                                  ) + "..."
                                  : accessory.articleData.ArticleName}
                              </span>
                              {accessory.articleData.ArticleName.length >=
                                12 && (
                                  <Tooltip
                                    id={`ArticleName${index}`}
                                    direction="right"
                                    text={accessory.articleData.ArticleName}
                                  />
                                )}

                              <div className="d-flex custom-light-text custom-text-transform">
                                {accessory.Barcode_Id != null && (
                                  <>
                                    <img src={barcodeImg} alt="" />
                                    <p className="mb-0 fs-12">
                                      {accessory.Barcode_Id}
                                    </p>
                                  </>
                                )}
                              </div>
                              <div className="d-flex custom-light-text custom-text-transform">
                                {/* <img src={barcodeImg} alt="" /> */}
                                <p
                                  className="mb-0 fs-12"
                                  id={`discriptionsls${index}`}
                                >
                                  {accessory.Descriptions.length >= 12
                                    ? accessory.Descriptions.slice(0, 12) +
                                    "..."
                                    : accessory.Descriptions}
                                </p>

                                {accessory.Descriptions.length >= 12 && (
                                  <Tooltip
                                    id={`discriptionsls${index}`}
                                    direction="right"
                                    text={accessory.Descriptions}
                                  />
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="col-md-7 col-sm-8 col-12 pl-md-2 pl-0 justify-content-center get-feb-row_cust">
                            <div className="fw-bold ">
                              {accessory.selectedFabric}
                            </div>
                            <div className="row custom-name ">
                              <div className="custom-border-right col-sm-3 col-12 px-2 custom-light-text custo_col_respo3">
                                <span
                                  className="mb-0 fs-12 "
                                  id={`Item_name${index}`}
                                >
                                  {accessory.Item_name.length >= 8
                                    ? accessory.Item_name.slice(0, 8) + "..."
                                    : accessory.Item_name}

                                  {accessory.Item_name.length >= 8 && (
                                    <Tooltip
                                      id={`Item_name${index}`}
                                      direction="right"
                                      text={accessory.Item_name}
                                    />
                                  )}
                                </span>
                                <p className="mb-0 fs-12">
                                  {accessory.articleData?.Brandtbl?.BrandName}
                                </p>
                              </div>
                              <div className="custom-border-right px-2 col-sm-3 col-12 custom-light-text custom-text-transform custo_col_respo3">
                                <span className="mb-0 fs-12">
                                  {accessory.articleData?.Sizetbl?.Size} SIZE
                                  {/* SMALL SIZE */}
                                </span>
                                <p className="mb-0 fs-12">
                                  {/* LIGHT BROWN */}
                                  {accessory.articleData?.Colortbl?.ColourName}
                                </p>
                              </div>
                              <div className="px-2 col-sm-3 col-12 custom-light-text custom-text-transform custo_col_respo3">
                                <span className="mb-0 fs-12">QTY</span>
                                <p className="mb-0 fs-12">
                                  {accessory.Quantity}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="border text-center my-3 d-flex align-items-center justify-content-center rounded fw-bold col-md-1 col-sm-2 col-8 p-0 feb_Asse_rs_sec">
                            <label htmlFor="" className="mb-0 fs-14 ">
                              {symbol}{" "}
                              {isFromGroupOrderPage
                                ? accessory.Basic_Amt == null ||
                                  accessory.Basic_Amt == 0
                                  ? accessory.Item_rate
                                  : accessory.Quantity * accessory.Basic_Amt
                                : accessory.Basic_Amt == null ||
                                  accessory.Basic_Amt == 0
                                  ? accessory.Item_rate
                                  : accessory.Quantity * accessory.Basic_Amt}
                            </label>
                          </div>
                          <div className="col-md-1 col-sm-2 col-4 text-end px-0 edit-icon">
                            <div
                              style={{ cursor: "pointer" }}
                              className=""
                              onClick={() =>
                                handleEditFabric(accessory?.TOrd_FabricId)
                              }
                            >
                              <img src={PaymentEditIcon}></img>
                            </div>
                            <div
                              style={{ cursor: "pointer" }}
                              className="mt-1 "
                              onClick={() =>
                                handleDeleteFabric(accessory?.TOrd_FabricId)
                              }
                            >
                              <img src={redDeleteIcon} width="20px"></img>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {EnableInventory == 1 && (
            <Accordion
              className={`shadow mt-3`}
              activeKey={accordionFabric ? "0" : null}
            // readOnly={mood === "view"}
            // onKeyDown={handleKeyDown}
            >
              <Accordion.Item eventKey="0">
                <Accordion.Header
                  className="custom-accordion-searchbox position-relative"
                  // onClick={mood == "view" ? handleKeyDown : toggleFabric}
                  onClick={toggleFabric}
                >
                  <div
                    className={`form-control-lg form-control search-input pl-5 taxtcolor-light ${(fabArray?.length >
                      0 ||
                      accArray?.length > 0) &&
                      "border custom-accordion-header-green"}`}
                  >
                    <div className="d-flex align-items-center">
                      <span className=" landing-26">Fabric / Accessories</span>
                    </div>
                  </div>
                  <img
                    src={fabricIcon}
                    alt=""
                    className="position-absolute fs-5 d-flex "
                    style={{ top: "30%", left: "10px", opacity: "0.8" }}
                  />

                  {/* <input
                      type="text"
                      id="default-01"
                      value={fab}
                      onChange={handleFabricChange}
                      placeholder="Search Fabric / Accessories By Name And Barcode"
                      className="form-control-lg form-control search-input"
                      autoComplete="off"
                    />

                    <Icon
                      name="search"
                      className="position-absolute fs-5"
                      style={{ top: "15px", left: "8px" }}
                    ></Icon> */}
                  {/* {haveCamera && (
                  <img
                    src={cameraIcon}
                    className={`ms-1 text-dark`}
                    width="15px"
                  ></img>
                )} */}
                  <div className="position-absolute rounded-circle fs-5  p-1 d-flex align-items-center fab-arrowposition">
                    {/* <img
                        src={accordionFabric ? UpArrowIcon : DownArrowIcon}
                        alt=""
                        width="15px"
                      /> */}
                    <img
                      src={UpArrowIcon}
                      alt=""
                      width="15px"
                      style={{
                        transition: "all 0.2s ease-in-out",
                        rotate: accordionFabric ? "0deg" : "180deg",
                      }}
                    />
                  </div>
                  {(fabArray?.length > 0 || accArray?.length > 0) && (
                    <div className="position-absolute check-svg">
                      <svg
                        className="custom_svg"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        width={"21px"}
                        fill="green"
                      >
                        <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                      </svg>
                    </div>
                  )}
                </Accordion.Header>
                <Accordion.Body className="position-relative pb-2">
                  {/* {switchValue === "fabric" ? ( */}
                  <FabricSearch
                    // onCountChange={handleAddFabric}
                    // fabricCount={fabricCount}
                    mood={mood}
                    handleAddFabricSuccess={handleAddFabricSuccess}
                    onDataChange={handleFabricData}
                  />
                  {/* ) : (
                      <AccessoriesSearch
                        onCountChange={handleAccessoriesFabric}
                        accessoriesCount={accessoriesCount}
                        onDataChange={handleAccessoriesData}
                      />
                    )} */}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          )}

          {/* measurement selection====================================================================================================== */}
          <Accordion
            className="shadow mt-3"
            activeKey={accordionMeas ? "0" : null}
          >
            <Accordion.Item eventKey="0">
              <Accordion.Header
                className={`custom-accordion-header position-relative `}
                // onClick={mood == "view" ? handleKeyDown : toggleMeas}
                onClick={toggleMeas}
              >
                <div
                  className={`form-control-lg form-control search-input pl-5 taxtcolor-light ${isMes &&
                    "border custom-accordion-header-green"}`}
                >
                  <div className="d-flex align-items-center">
                    <span className=" landing-26">Measurement</span>
                    {measurementLenght?.Measurement?.length === 0 && (
                      <span className="ms-5 text-danger">No Measurement</span>
                    )}
                  </div>
                </div>

                <img
                  src={measurementIcon}
                  alt=""
                  className="position-absolute fs-5"
                  style={{ top: "25%", left: "10px" }}
                />
                {/* <div
                  className="position-absolute rounded-circle fs-5  p-1 d-flex align-items-center"
                  style={{ top: "20%", right: "10px" }}
                >
                  <img
                    src={accordionMeas ? UpArrowIcon : DownArrowIcon}
                    alt=""
                    width="15px"
                  />
                </div> */}

                <div className="position-absolute rounded-circle fs-5  p-1 d-flex align-items-center fab-arrowposition">
                  {/* <img
                        src={accordionFabric ? UpArrowIcon : DownArrowIcon}
                        alt=""
                        width="15px"
                      /> */}
                  <img
                    src={UpArrowIcon}
                    alt=""
                    width="15px"
                    style={{
                      transition: "all 0.2s ease-in-out",
                      rotate: accordionMeas ? "0deg" : "180deg",
                    }}
                  />
                </div>
                {isMes && (
                  <div className="position-absolute check-svg">
                    <svg
                      className="custom_svg"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      width={"21px"}
                      fill="green"
                    >
                      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                    </svg>
                  </div>
                )}

                {/* <div className="accordion-arrow" onClick={toggleImage}>
                  <span className="arrow-up">▲</span>
                  <span className="arrow-down">▼</span>
                </div> */}
              </Accordion.Header>
              <Accordion.Body>
                <Measurement
                  mood={mood}
                  handleAddMeasurementSuccess={handleAddMeasurementSuccess}
                // saveClicked={saveClicked}
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          {/* style selection====================================================================================================== */}
          <Accordion
            className="shadow mt-3"
            activeKey={accordionStyle ? "0" : null}
          >
            <Accordion.Item eventKey="0">
              <Accordion.Header
                className="custom-accordion-header position-relative"
                onClick={toggleStyle}
              // onClick={mood == "view" ? handleKeyDown : toggleStyle}
              >
                <span
                  className={`form-control-lg form-control search-input pl-5 landing-26 taxtcolor-light ${isStyle &&
                    "border custom-accordion-header-green"}`}
                >
                  Styles
                </span>
                <img
                  src={styleIcon}
                  alt=""
                  className="position-absolute fs-5"
                  style={{ top: "25%", left: "10px" }}
                />
                {/* <div
                  className="position-absolute rounded-circle fs-5  p-1 d-flex align-items-center"
                  style={{ top: "20%", right: "10px" }}
                >
                  <img
                    src={accordionStyle ? UpArrowIcon : DownArrowIcon}
                    alt=""
                    width="15px"
                  />
                </div> */}

                <div className="position-absolute rounded-circle fs-5  p-1 d-flex align-items-center fab-arrowposition">
                  <img
                    src={UpArrowIcon}
                    alt=""
                    width="15px"
                    style={{
                      transition: "all 0.2s ease-in-out",
                      rotate: accordionStyle ? "0deg" : "180deg",
                    }}
                  />
                </div>
                {isStyle && (
                  <div className="position-absolute check-svg">
                    <svg
                      className="custom_svg"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      width={"21px"}
                      fill="green"
                    >
                      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                    </svg>
                  </div>
                )}
              </Accordion.Header>
              <Accordion.Body>
                <div className="position-relative nk-header-searchbox border m-0 px-lg-5 px-md-2 px-2  pt-3">
                  <StyleSearch
                    mood={mood}
                    styleData={styleData}
                    setStyleData={setStyleData}
                    setActiveId={setActiveId}
                    activeID={activeID}
                    modelStyle={modelStyle}
                    onModelOpenChange={handleStyleModelOpen}
                    selectedImage={selectedImage}
                    singleImageRecord={singleImageRecord}
                    setSingleImageRecord={setSingleImageRecord}
                    setDetailsData={setDetailsData}
                    saveStyleHeadData={saveStyleHeadData}
                    setSaveStyleHeadData={setSaveStyleHeadData}
                  />

                  <div className="d-flex justify-content-center my-2">
                    <Button
                      outline
                      color="light"
                      id="BtnBkAnOrderAddStyle"
                      className="ps-2 pe-2 d-flex "
                      // onClick={() =>
                      //   handleAction(
                      //     "BtnBkAnOrderAddStyle",
                      //     "action",
                      //     hendleStyleDataSave,
                      //     null

                      //   )
                      // }
                      onClick={hendleStyleDataSave}
                    >
                      {isLoader ? (
                        <>
                          <span>
                            <Spinner size="sm" color="" className="mx-1 py-1" />
                          </span>
                        </>
                      ) : (
                        <span>Save</span>
                      )}
                    </Button>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          {/* image selection */}
          <Accordion
            className="shadow mt-3"
            activeKey={accordionImage ? "0" : null}
          >
            <Accordion.Item eventKey="0">
              <Accordion.Header
                className="custom-accordion-header position-relative"
                onClick={toggleImage}
              // onClick={mood == "view" ? handleKeyDown : toggleImage}
              >
                <span
                  className={`form-control-lg form-control search-input pl-5 landing-26 taxtcolor-light ${mergedImageArray.length >
                    0 && "border custom-accordion-header-green"}`}
                >
                  Images
                </span>
                <img
                  src={imagesIcon}
                  alt=""
                  className="position-absolute fs-5"
                  style={{ top: "25%", left: "10px" }}
                />

                <div className="position-absolute rounded-circle fs-5  p-1 d-flex align-items-center fab-arrowposition">
                  <img
                    src={UpArrowIcon}
                    alt=""
                    width="15px"
                    style={{
                      transition: "all 0.2s ease-in-out",
                      rotate: accordionImage ? "0deg" : "180deg",
                    }}
                  />
                </div>
                {mergedImageArray.length > 0 && (
                  <div className="position-absolute check-svg">
                    <svg
                      className="custom_svg"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      width={"21px"}
                      fill="green"
                    >
                      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                    </svg>
                  </div>
                )}
              </Accordion.Header>
              <Accordion.Body>
                <ImageSearch
                  // isImage={isImage}
                  mood={mood}
                  onImageSelect={handleImageModelOpen}
                  // selectedBrowseImg={selectedImageArray}
                  // selectedCatelogImg={catalogImageArray}
                  // browseDescriptions={browseDescriptions}
                  // catelogDescriptions={catelogDescriptions}
                  onImageClick={handleImageClick}
                  onImageRemoveClick={handleImageRemove}
                  onCatalogSelection={handleCatalogModelOpen}
                  mergedImageArray={mergedImageArray}
                  mainImage={mainImage}
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          {/* garment selection */}
          <Accordion
            className="shadow mt-3"
            activeKey={accordionGarment ? "0" : null}
          >
            <Accordion.Item eventKey="0">
              <Accordion.Header
                className="custom-accordion-header position-relative"
                onClick={toggleGarment}
              >
                <span
                  className={`form-control-lg form-control search-input pl-5 landing-26 taxtcolor-light ${mergedGarmentArray.length >
                    0 && "border custom-accordion-header-green"}`}
                >
                  Garment
                </span>
                <img
                  src={imagesIcon}
                  alt=""
                  className="position-absolute fs-5"
                  style={{ top: "25%", left: "10px" }}
                />

                <div className="position-absolute rounded-circle fs-5  p-1 d-flex align-items-center fab-arrowposition">
                  <img
                    src={UpArrowIcon}
                    alt=""
                    width="15px"
                    style={{
                      transition: "all 0.2s ease-in-out",
                      rotate: accordionImage ? "0deg" : "180deg",
                    }}
                  />
                </div>
                {mergedGarmentArray.length > 0 && (
                  <div className="position-absolute check-svg">
                    <svg
                      className="custom_svg"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      width={"21px"}
                      fill="green"
                    >
                      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                    </svg>
                  </div>
                )}
              </Accordion.Header>
              <Accordion.Body>
                <GarmentSearch
                  mood={mood}
                  // isImage={isImage}
                  onGarmentSelect={handleGarmentModelOpen}
                  // selectedBrowseImg={selectedImageArray}
                  // selectedCatelogImg={catalogImageArray}
                  // browseDescriptions={browseDescriptions}
                  // catelogDescriptions={catelogDescriptions}
                  onGarmentClick={handleGarmentClick}
                  onGarmentRemoveClick={handleGarmentRemove}
                  // onCatalogSelection={handleCatalogModelOpen}
                  mergedGarmentArray={mergedGarmentArray}
                  mainGarment={mainGarment}
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>

      {/* add style modal */}

      <Modal isOpen={modelStyle} size="lg">
        <div className="w-100 p-2">
          <div className="d-flex align-items-center justify-content-center position-relative ">
            {/* tabbar */}

            <div className="border rounded-pill p-1 d-flex cust_rounded-pill ">
              {styleData.map((item, ind) => {
                return (
                  <div
                    key={ind}
                    className={`px-2 py-1 rounded-pill  cursor-pointer transition-animation min-w-150 ${item.StyleId === activeID ? "bg-1c2b4c text-white" : ""
                      }`}
                    onClick={() => {
                      // setStyleSwitchValue(activeID);
                      setActiveId(item.StyleId);
                      setDetailsData(item);
                    }}
                  >
                    {item.StyleName}
                  </div>
                );
              })}
            </div>
            <div
              className="position-absolute modalcolse-btn"
              onClick={handleStyleModelClose}
            >
              <Icon name="cross" className="cursor-pointer cross-Icon"></Icon>
            </div>
          </div>
        </div>
        <ModalBody className="p-3 border-bottom-red">
          <div className="row custome-styleModal">
            <div
              className={`border border-2 rounded-2 overflow-y-auto min-max-h-700  ${Object.keys(singleImageRecord).length === 0
                ? "custome-col-12"
                : "custome-col-9"
                } `}
              style={{ maxHeight: "600px", minHeight: "600px" }}
            >
              <div className="row ">
                {detailsData?.details?.length !== 0 ? (
                  detailsData?.details?.map((img, ind) => {
                    const isSelectedOrDefault = (img) => {
                      // Check if this image is the selected image or the default image, with precedence to selected image
                      return (
                        selectedImage === img.images ||
                        (selectedImage === null && img.IsDefault)
                      );
                    };

                    return (
                      <div
                        className={`custom-col-3 my-1 images-album group-images-album `}
                        key={ind}
                      >
                        <div
                          className={`album single-album ${isSelectedOrDefault(img)
                            ? "border border-2 rounded-2 shadow"
                            : ""
                            }`}
                          onClick={() =>
                            handleCuffSelect(img.images ? img : noImageIcon)
                          }
                        >
                          <img
                            src={img.images ? img.images : noImageIcon}
                            alt=""
                            className={`p-0 m-0 albumImage `}
                          />
                          <p className=" rounded-0 text-center text-dark mt-0">
                            {img.Options}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="custom-col-3 my-1">No data found</div>
                  </>
                )}
              </div>
            </div>

            {getStyleHeadData?.orderItemList?.length === 0 ? (
              <></>
            ) : (
              <div
                className="border border-2 rounded-2 bg-light overflow-y-auto overflow-scrollbar-track customRight-col-3"
                style={{ maxHeight: "600px", minHeight: "600px" }}
              >
                {getStyleHeadData?.orderItemList?.map((res) => {
                  return (
                    <div className="position-relative c-singleImgaesRecord">
                      {/* {singleImageRecord[res] && ( */}
                      <div className="border rounded-2 bg-white cust_imagesec">
                        <h6>{res.StyleName}</h6>
                        <img
                          src={
                            singleImageRecord[res.StyleId] === undefined
                              ? noImageIcon
                              : singleImageRecord[res.StyleId].images
                          }
                          alt="Selected"
                          className="image-selected"
                        // width="100px"
                        />
                        <br />
                        <span className="fw-medium">{res.StyleName}</span>
                        <p className="custom-light-text custom-text-transform">
                          {symbol}{" "}
                          {singleImageRecord?.[res.StyleId]?.Amount > 0 && (
                            <>
                              {symbol}{" "}
                              {singleImageRecord?.[res.StyleId]?.Amount}
                            </>
                          )}
                        </p>
                      </div>
                      {/* )} */}
                      <div className="position-absolute closebtn-position c-closeBtn">
                        <div
                          className="bg-danger text-white rounded-full custom-cross"
                          onClick={() => handleRemovesingleImageRecord(res)}
                        >
                          <Icon name="cross" className="cursor-pointer"></Icon>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <Button
                  // color="primary"
                  className="w-100 d-flex justify-content-center mt-3 align-items-end"
                  onClick={hendleStyleDataSubmit}
                >
                  Continue
                </Button>
              </div>
            )}
          </div>
        </ModalBody>
      </Modal>

      {/* images================================================================================================================================================================= */}
      {/* add image cemara and browse */}
      <Modal isOpen={isImage} size="xl" className="rounded-top-4">
        <div className="bg-1c2b4c text-white px-4 py-2  rounded-top-4">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>Upload Photo</div>

            <Icon
              name="cross"
              onClick={handleImageModelClose}
              style={{ cursor: "pointer" }}
              className="fs-22"
            ></Icon>
          </div>
        </div>
        <ModalBody
          className="overflow-y-auto mb-5 border m-2 p-1 rounded-2"
          style={{ minHeight: "400px", maxHeight: "500px" }}
        >
          <div className="p-1">
            {mergedImageArray.length > 0 &&
              mergedImageArray.map((image, ind) => {
                const isFile = image instanceof File;
                const isHovered = hoverIndex === ind;
                const isMainImage = mainImage && mainImage === image; // Assume hoverIndex is a state variable tracking the index of the hovered image

                return (
                  <div
                    className={`bg-gray11 p-2 d-flex my-2 rounded-2`}
                    key={ind}
                    onMouseEnter={() => isDesktop && setHoverIndex(ind)}
                    onMouseLeave={() => isDesktop && setHoverIndex(null)}
                  >
                    <div className="mr-3" id={`image-name-tooltip${ind}`}>
                      <img
                        src={isFile ? URL.createObjectURL(image) : image.image}
                        // src={isFile ? URL.createObjectURL(image) : image.path}
                        alt={`Selected Image ${ind}`}
                        width="120px"
                      />

                      <div className="text-center fw-medium">
                        <span></span>
                      </div>
                      <Tooltip
                        id={`image-name-tooltip${ind}`}
                        direction="right"
                        text={image.name}
                      />
                    </div>
                    <div className="w-100">
                      <textarea
                        name=""
                        id=""
                        // cols="95"
                        rows="5"
                        className="border w-100"
                        value={image.description || image.desc}
                        onChange={(e) => handleDescriptionChange(ind, e)}
                      ></textarea>
                    </div>
                    <div className="d-flex flex-column ms-5">
                      {(isHovered || isMainImage || !isDesktop) && (
                        <img
                          src={redDeleteIcon}
                          alt=""
                          className=""
                          onClick={() =>
                            handleImageRemove(true, image, ind, "1")
                          }
                        />
                      )}
                      {(isHovered || isMainImage || !isDesktop) && (
                        <img
                          src={
                            mainImage === image ? MainImageIcon1 : MainImageIcon
                          }
                          alt=""
                          className=" mt-2"
                          onClick={() => addMainImage(image, ind)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* <div className="d-flex align-items-center p-2">
            <input
              type="checkbox"
              // name=""
              checked={isSample}
              id="Training-Mode"
              onChange={handleCheckboxChange}
              style={{ backgroundColor: "black" }}
              className="mr-2"
            />
            <span htmlFor="Dyeing" className="custom-light-text">
              Measurement Sample
            </span>
          </div> */}
          <div className="d-flex justify-content-center ">
            <Button onClick={handleAddImage} className="my-5 px-5 ">
              Update
            </Button>
          </div>
        </ModalBody>
      </Modal>

      {/* show image in big modal */}
      <Modal
        isOpen={bigImageModel}
        toggle={handleBigImageModelClose}
        size="lg"
        className="rounded-top-4 add-order-singe-image-slider"
      >
        <div className="p-4 rounded-top-4">
          <div className="d-flex justify-content-end">
            <Icon
              name="cross"
              onClick={handleBigImageModelClose}
              style={{ cursor: "pointer" }}
            ></Icon>
          </div>
          <Swiper
            navigation={true}
            loop
            modules={[Navigation]} // Add both Navigation and Pagination modules
            className="mySwiper"
            initialSlide={activeImg}
            onSlideChange={(swiper) => setActiveImg(swiper.activeImg)}
            ref={swiperRef}
          >
            {/* {[...selectedImageArray, ...catalogImageArray].map((img, index) => ( */}
            {mergedImageArray.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="p-2">
                  <div>
                    <span>{img.description || img.desc}</span>
                  </div>
                  <img
                    src={img.image}
                    alt="avatarImages"
                    // className="w-100"
                    // width="full"
                    height="500px"
                    width="650px"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Modal>

      {/* delete image */}
      <Modal
        isOpen={imageDeleteModel}
        toggle={handleImageDeleteModelClose}
        size="lg"
        className="rounded-top-4 add-order-singe-image-slider"
      >
        {/* <div className="p-4 rounded-top-4"> */}
        <div className="bg-1c2b4c text-white p-3 rounded-top-4">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>Delete</div>
          </div>
        </div>

        {deleteImage && (
          <ModalBody>
            <div className="border rounded-2">
              <div className="d-flex my-3 mx-2 pb-5">
                <img
                  src={deleteImage.image}
                  alt=""
                  className="mr-2"
                  height="160px"
                />
                <div>
                  {deleteImage.description != "" && (
                    <div className="border rounded-2 p-2">
                      {deleteImage.description}
                    </div>
                  )}
                  <div className="d-flex mt-2 ">
                    <img
                      src={deleteWaringIcon}
                      alt=""
                      className="mr-2"
                      width="50px"
                    />
                    <div>
                      <span className="fw-bold text-warning fs-3">Delete</span>
                      <br />
                      <span className="custom-light-text custom-text-transform">
                        This action will delete this image permanently and
                        cannot be un done. Do you still want to delete it?
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex p-2 border-top justify-content-end">
                <Button
                  outline
                  color="dark"
                  className="mr-2"
                  onClick={() =>
                    handleImageDelete(
                      deleteImage,
                      deleteImageIndex,
                      imgFromDatabase
                    )
                  }
                >
                  Yes
                </Button>
                <Button onClick={handleImageDeleteModelClose}>No</Button>
              </div>
            </div>
          </ModalBody>
        )}
        {/* </div> */}
      </Modal>

      {/* add catelog  */}
      <Modal isOpen={isCatalog} size="lg" className="rounded-top-4">
        <div className="bg-1c2b4c text-white px-4 py-2 rounded-top-4">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>Catalog</div>
            <Icon
              name="cross"
              onClick={handleCatalogModelClose}
              style={{ cursor: "pointer" }}
            ></Icon>
          </div>
        </div>
        {isCatalog && (
          <ModalBody
            className="overflow-y-auto mb-5 border m-2 rounded-2"
          // style={{ minHeight: "400px", maxHeight: "400px" }}
          >
            <div className="catelog-header d-flex justify-content-center">
              <div className="catalog-searchbox w-50 px-lg-0 mb-3">
                <input
                  type="text"
                  id="default-01"
                  name="searchCatalog"
                  value={searchCatalog}
                  onChange={handleSearchCatalogChange}
                  placeholder="Search"
                  className="form-control-lg form-control catalog-input d-lg-block"
                />
                <Icon
                  name="search"
                  className="catalog-search-icon "

                // onClick={handleClick}
                ></Icon>
              </div>
            </div>
            {!catalogInd ? (
              <div style={{ minHeight: "500px" }}>
                <div className="d-flex p-1 row">
                  {catelog.isLoader ? (
                    <div className="d-flex">
                      {Array.from({ length: 4 }, (_, ind) => (
                        <div>
                          <Skeleton
                            variant="rectengle"
                            width={80}
                            height={80}
                            className="m-1 ms-3"
                          />
                          <Skeleton
                            variant="rectengle"
                            width={80}
                            height={20}
                            className="my-2 ms-3"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    catelog?.catelog?.style?.map((item, ind) => {
                      // const base64Image = btoa(
                      //   String.fromCharCode.apply(
                      //     null,
                      //     new Uint8Array(item.CatHDImage.data)
                      //   )
                      // );
                      // const imageUrl = `data:image/jpeg;base64,${base64Image}`;
                      return (
                        <div className="col-2" key={ind}>
                          <img
                            src={catelogFolderIcon}
                            alt={`Selected Image ${ind}`}
                            // width="120px"
                            onClick={() => handleCatelog(item.CatHDId)}
                          />
                          <div className="text-center fw-medium">
                            <span>{item.CatlgHDName}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  {/* {catelog.map((item, ind) => {
                    return (

                    );
                  })} */}
                </div>
              </div>
            ) : (
              <div style={{ minHeight: "500px" }} className="position-relative">
                <div className="d-flex p-1 row">
                  {subCatLoader ? (
                    <div className="d-flex">
                      {Array.from({ length: 4 }, (_, ind) => (
                        <div>
                          <Skeleton
                            variant="rectengle"
                            width={80}
                            height={80}
                            className="m-1 ms-3"
                          />
                          <Skeleton
                            variant="rectengle"
                            width={80}
                            height={20}
                            className="my-2 ms-3"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    catelog?.catelogDetails?.catelog?.map((item, ind) => {
                      // const base64Image = btoa(
                      //   String.fromCharCode.apply(
                      //     null,
                      //     new Uint8Array(item?.CatDetImage?.data)
                      //   )
                      // );
                      // const imageUrl = `data:image/jpeg;base64,${base64Image}`;
                      return (
                        <div
                          key={ind}
                          className={`mt-3 col-2 p-3 ${catalogImageArray.includes(item)
                            ? "bg-light"
                            : "bg-white"
                            }`}
                        >
                          <img
                            src={item?.CatDetImage}
                            alt={`Selected Image ${ind}`}
                            // width="120px"
                            onClick={() => handleCatalogArray(item)}
                          />
                          <div className="text-center fw-medium">
                            <span>{item.CatDTitle}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div
                  className="d-flex justify-content-center position-absolute"
                  style={{ bottom: "5%", left: "40%" }}
                >
                  <Button onClick={handleAddCatalogImage} className="px-5">
                    Attach Catalog (
                    {catalogImageArray.length > 0
                      ? catalogImageArray.length
                      : 0}
                    )
                  </Button>
                </div>
              </div>
            )}
          </ModalBody>
        )}
      </Modal>

      {/* Garment========================================================================================================================================================================== */}
      {/* add image cemara and browse */}
      <Modal isOpen={isGarment} size="xl" className="rounded-top-4">
        <div className="bg-1c2b4c text-white px-4 py-2  rounded-top-4">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>Upload Garment</div>

            <Icon
              name="cross"
              onClick={handleGarmentModelClose}
              style={{ cursor: "pointer" }}
              className="fs-22"
            ></Icon>
          </div>
        </div>
        <ModalBody
          className="overflow-y-auto mb-5 border m-2 p-1 rounded-2"
          style={{ minHeight: "400px", maxHeight: "500px" }}
        >
          <div className="p-1">
            {mergedGarmentArray.length > 0 &&
              mergedGarmentArray.map((image, ind) => {
                const isFile = image instanceof File;
                const isHovered = hoverIndex === ind; // Assume hoverIndex is a state variable tracking the index of the hovered image
                const isMainImage = mainGarment && mainGarment === image;
                return (
                  <div
                    className={`bg-gray11 p-2 d-flex my-2 rounded-2`}
                    key={ind}
                    onMouseEnter={() => isDesktop && setHoverIndex(ind)}
                    onMouseLeave={() => isDesktop && setHoverIndex(null)}
                  >
                    <div className="mr-3" id={`image-name-tooltip${ind}`}>
                      <img
                        // src={image.image}
                        src={isFile ? URL.createObjectURL(image) : image.image}
                        alt={`Selected Image ${ind}`}
                        width="120px"
                      />

                      <div className="text-center fw-medium">
                        <span></span>
                      </div>
                      <Tooltip
                        id={`image-name-tooltip${ind}`}
                        direction="right"
                        text={image.name}
                      />
                    </div>
                    <div className="w-100">
                      <textarea
                        name=""
                        id=""
                        // cols="95"
                        rows="5"
                        className="border w-100"
                        value={image.description || image.desc}
                        onChange={(e) => handleDescriptionGarment(ind, e)}
                      ></textarea>
                    </div>
                    <div className="d-flex flex-column ms-5">
                      {(isHovered || isMainImage || !isDesktop) && (
                        <img
                          src={redDeleteIcon}
                          alt=""
                          className=""
                          onClick={() =>
                            handleGarmentRemove(true, image, ind, "1")
                          }
                        />
                      )}
                      {(isHovered || isMainImage || !isDesktop) && (
                        <img
                          src={
                            mainGarment === image
                              ? MainImageIcon1
                              : MainImageIcon
                          }
                          alt=""
                          className=" mt-2"
                          onClick={() => addMainGarment(image, ind)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="d-flex justify-content-center ">
            <Button onClick={handleAddGarment} className="my-5 px-5 ">
              Update
            </Button>
          </div>
        </ModalBody>
      </Modal>

      {/* show image in big modal */}
      <Modal
        isOpen={bigGarmentModel}
        toggle={handleBigGarmentModelClose}
        size="lg"
        className="rounded-top-4 add-order-singe-image-slider"
      >
        <div className="p-4 rounded-top-4">
          <div className="d-flex justify-content-end">
            <Icon
              name="cross"
              onClick={handleBigGarmentModelClose}
              style={{ cursor: "pointer" }}
            ></Icon>
          </div>
          <Swiper
            navigation={true}
            loop
            modules={[Navigation]} // Add both Navigation and Pagination modules
            className="mySwiper"
            initialSlide={activeGarment}
            onSlideChange={(swiper) => setActiveGarment(swiper.activeGarment)}
            ref={swiperRef}
          >
            {/* {[...selectedImageArray, ...catalogImageArray].map((img, index) => ( */}
            {mergedGarmentArray.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="p-2">
                  <div>
                    <span>{img.description || img.desc}</span>
                  </div>
                  <img
                    src={img.image}
                    alt="avatarImages"
                    // className="w-100"
                    // width="full"
                    height="500px"
                    width="650px"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Modal>

      {/* delete image */}
      <Modal
        isOpen={garmentDeleteModel}
        toggle={handleGarmentDeleteModelClose}
        size="lg"
        className="rounded-top-4 add-order-singe-image-slider"
      >
        {/* <div className="p-4 rounded-top-4"> */}
        <div className="bg-1c2b4c text-white p-3 rounded-top-4">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>Delete</div>
          </div>
        </div>

        {deleteGarment && (
          <ModalBody>
            <div className="border rounded-2">
              <div className="d-flex my-3 mx-2 pb-5">
                <img
                  src={deleteGarment.image}
                  alt=""
                  className="mr-2"
                  height="160px"
                />
                <div>
                  {deleteGarment.description != "" && (
                    <div className="border rounded-2 p-2">
                      {deleteGarment.description}
                    </div>
                  )}
                  <div className="d-flex mt-2 ">
                    <img
                      src={deleteWaringIcon}
                      alt=""
                      className="mr-2"
                      width="50px"
                    />
                    <div>
                      <span className="fw-bold text-warning fs-3">Delete</span>
                      <br />
                      <span className="custom-light-text custom-text-transform">
                        This action will delete this image permanently and
                        cannot be un done. Do you still want to delete it?
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex p-2 border-top justify-content-end">
                <Button
                  outline
                  color="dark"
                  className="mr-2"
                  onClick={() =>
                    handleGarmentDelete(
                      deleteGarment,
                      deleteGarmentIndex
                      // imgFromDatabase
                    )
                  }
                >
                  Yes
                </Button>
                <Button onClick={handleGarmentDeleteModelClose}>No</Button>
              </div>
            </div>
          </ModalBody>
        )}
        {/* </div> */}
      </Modal>

      {/* delete fabric or accessories */}
      <Modal
        isOpen={deletefabricModal}
        toggle={handleFabricDeleteModelClose}
        size="lg"
        className="rounded-top-4 add-order-singe-image-slider"
      >
        {/* <div className="p-4 rounded-top-4"> */}
        <div className="bg-1c2b4c text-white p-3 rounded-top-4">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>Delete</div>
          </div>
        </div>

        {deleteFabric !== undefined && (
          <ModalBody>
            <div className="border rounded-2">
              <div className="d-flex my-3 mx-2 pb-5">
                <img
                  src={SherwaniImage}
                  alt=""
                  width="150px"
                  height="150px"
                  className="mr-3 rounded-2"
                />
                <div>
                  <div>
                    <span className="fw-bold">#123456789152</span>
                  </div>
                  <div>
                    <img src={barcodeImg} alt="" />
                    <span className="custom-light-text custom-text-transform">
                      12345678
                    </span>
                  </div>
                  <div className="fw-bold fs-12">Alternate Fabric 1</div>
                  <div className="d-flex custom-name">
                    <div className="custom-border-right custom-light-text custom-text-transform pe-2">
                      <span className="mb-0 fs-12 ">100% COTTON</span>
                      <p className="mb-0 fs-12">Rymond</p>
                    </div>
                    <div className="custom-border-right px-2 custom-light-text custom-text-transform">
                      <span className="mb-0 fs-12">2.5 SIZE</span>
                      <p className="mb-0 fs-12">Red</p>
                    </div>
                    <div className="pr-2 pl-2 custom-light-text custom-text-transform">
                      <span className="mb-0 fs-12"> QTY</span>
                      <p className="mb-0 fs-12">{fabric.qty}</p>
                    </div>
                  </div>
                  <div className="d-flex mt-2 ">
                    <img
                      src={deleteWaringIcon}
                      alt=""
                      className="mr-2"
                      width="50px"
                    />
                    <div>
                      <span className="fw-bold text-warning fs-3">Delete</span>
                      <br />
                      <span className="custom-light-text custom-text-transform">
                        Do You really want to Remove This?
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex p-2 border-top justify-content-end">
                <Button
                  outline
                  color="dark"
                  className="mr-2"
                  onClick={() => handleDeleteFabric(deleteFabric)}
                >
                  Yes
                </Button>
                <Button onClick={handleFabricDeleteModelClose}>No</Button>
              </div>
            </div>
          </ModalBody>
        )}
        {/* </div> */}
      </Modal>
    </div>
  );
};

export default LeftSideDetail;

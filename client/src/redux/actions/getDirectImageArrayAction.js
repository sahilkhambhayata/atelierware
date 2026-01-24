export const getDirectImageArray = (data, mainImage) => {
  return async (dispatch) => {
    const combinedObject = {
      isPrimaryImage:
        mainImage?.image == null || mainImage?.image == undefined
          ? ""
          : mainImage?.image,
      isPrimaryDescription:
        mainImage?.description == null || mainImage?.description == undefined
          ? ""
          : mainImage?.description,
      isPrimaryId:
        mainImage?.id == null || mainImage?.id == undefined ? "" : mainImage?.id,
      data: data,
    };

    dispatch({ type: "ALL_IMAGE_ARRAY", payload: combinedObject });
  };
};

export const sendImageArray = (data) => {
  
  return async (dispatch) => {
    dispatch({ type: "SEND_IMAGE_ARRAY", payload: data });
  };
};

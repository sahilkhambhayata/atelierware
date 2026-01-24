export const getDirectGarmentArray = (data, mainImage) => {

  return async (dispatch) => {
    const combinedObject = {
      isPrimaryImage: mainImage.image,
      isPrimaryDescription: mainImage.description,
      data: data,
    };

    dispatch({ type: "ALL_GARMENT_ARRAY", payload: combinedObject });
  };
};
export const sendGarmentArray = (data) => {
  
  return async (dispatch) => {
    dispatch({ type: "SEND_GARMENT_ARRAY", payload: data });
  };
};
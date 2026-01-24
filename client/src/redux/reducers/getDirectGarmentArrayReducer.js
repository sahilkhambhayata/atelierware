const initialState = {
  allGarment: {},
  sendGarmentArray: [],
};
export const getDirectGarmentArrayReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ALL_GARMENT_ARRAY":
      return { ...state, allGarment: { ...action.payload } };

    case "SEND_GARMENT_ARRAY":
     
      return { ...state, sendGarmentArray: action.payload };

    default:
      return state;
  }
};

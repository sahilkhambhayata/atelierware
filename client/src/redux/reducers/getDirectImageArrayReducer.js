const initialState = {
  allImage: {},
  sendArray: [],
};

export const getDirectImageArrayReducer = (state = {}, action) => {
  switch (action.type) {
    case "ALL_IMAGE_ARRAY":
      return { ...state, allImage: { ...action.payload } };

    case "SEND_IMAGE_ARRAY":
      
      return { ...state, sendArray: action.payload };

    default:
      return state;
  }
};

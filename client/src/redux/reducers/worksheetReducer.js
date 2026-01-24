const initialState = {
  worksheetData: {},
  isLoader: false,
};

export const worksheetReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_WORKSHEET_DATA":
      return {
        ...state,
        worksheetData: { ...action.payload },
        isLoader: false,
      };
    case "GET_SINGLE_ITEM_WORKSHEET_DATA":
      return {
        ...state,
        worksheetData: { ...action.payload },
        isLoader: false,
      };
    case "IS_LOADING":
      return {
        ...state,
        isLoader: true,
      };
    default:
      return state;
  }
};

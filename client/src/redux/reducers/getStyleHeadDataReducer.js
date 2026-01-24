const initialState = {
  customer: {},
  isLoader: false,
  single: {},
};

export const getStyleHeadDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_STYLE_HEAD_DATA":
      return {
        ...state,
        customer: { ...action.payload },
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

const init = {
  catelog: {},
  isLoader: false,
  catelogDetails: {},
};

export const catelogReducer = (state = init, action) => {
  switch (action.type) {
    case "GET_CATELOG":
      return {
        ...state,
        catelog: { ...action.payload },
        isLoader: false,
        // catelogDetails: {},
      };
    case "IS_LOADING":
      return {
        ...state,
        isLoader: true,
      };

    case "GET_CATELOG_DETAILS":
      return {
        ...state,
        catelogDetails: { ...action.payload },
      };
    default:
      return state;
  }
};

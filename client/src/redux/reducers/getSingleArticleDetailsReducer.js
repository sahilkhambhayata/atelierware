const initialState = {
  single: {},
  isLoader: false,
  editable: [],
};

export const getSingleArticleDetailsReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "GET_SINGLE_ARTICLE_DETAILS":
      return {
        ...state,
        single: { ...action.payload },
        isLoader: false,
      };

    case "SINGLE_FABRIC_FOR_EDIT":
      return {
        ...state,
        single: { ...action.payload },
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

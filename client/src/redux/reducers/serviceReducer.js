const initialState = {
  service: {},
  upservice: {},
  isLoader: false,
  single: {},
  noData: false,
  noupData: false,

  singleGroupService: {},
};

export const serviceReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_SERVICE":
      return {
        ...state,
        service: { ...action.payload },
        noData: false,
        noupData: false,
        isLoader: false,
      };
    case "GET_UP_SERVICE":
      return {
        ...state,
        upservice: { ...action.payload },
        noData: false,
        noupData: false,
        isLoader: false,
      };
    case "IS_LOADING":
      return {
        ...state,
        isLoader: true,
        noData: false,
        noupData: false,
      };
    case "NO_DATA":
      return {
        ...state,
        service: {},
        noData: action.payload,
        isLoader: false,
        noupData: false,
      };
    case "NO_UP_DATA":
      return {
        ...state,
        upservice: {},
        noupData: action.payload,
        isLoader: false,
        noData: false,
      };

    case "GET_SINGLE_GROUP_SERVICE":
      return {
        ...state,
        isLoader: false,
        noData: false,
        singleGroupService: action.payload,
      };

    default:
      return state;
  }
};

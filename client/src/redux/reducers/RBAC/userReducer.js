const initialState = {
  userData: {},
  userLoader: false,
  single: {},
  noData: false,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_USER_DATA":
      return {
        ...state,
        userData: action.payload,
        noData: false,
        userLoader: false,
      };
    case "USER_LOADING":
      return {
        ...state,
        userLoader: true,
        noData: false,
      };
    case "USER_NO_DATA":
      return {
        ...state,
        userData: {},
        noData: true,
        userLoader: false,
      };

    default:
      return state;
  }
};

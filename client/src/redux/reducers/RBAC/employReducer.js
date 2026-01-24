const initialState = {
    employData: {},
    employLoader: false,
    single: {},
    noData: false,
  };
  
  export const employReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_EMPLOY_DATA":
       
        return {
          ...state,
          employData: action.payload,
          noData: false,
          employLoader: false,
        };
  
      case "EMPLOY_LOADING":
        return {
          ...state,
          employLoader: true,
          noData: false,
        };
      case "EMPLOY_NO_DATA":
        return {
          ...state,
          employData: {},
          noData: true,
          employLoader: false,
        };
  
      default:
        return state;
    }
  };
  
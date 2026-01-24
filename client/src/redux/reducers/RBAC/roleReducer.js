const initialState = {
    roleData: {},
    roleLoader: false,
    single: {},
    noData: false,
  };
  
  export const roleReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ROLE_DATA":
       
        return {
          ...state,
          roleData: action.payload,
          noData: false,
          roleLoader: false,
        };
  
      case "ROLE_LOADING":
        return {
          ...state,
          roleLoader: true,
          noData: false,
        };
      case "ROLE_NO_DATA":
        return {
          ...state,
          roleData: {},
          noData: true,
          roleLoader: false,
        };
  
      default:
        return state;
    }
  };
  
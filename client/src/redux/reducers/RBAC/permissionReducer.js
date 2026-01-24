const initialState = {
  permissionData: {},
  permissionLoader: false,
  single: {},
  noData: false,
  oldPermissionData: {},
  noOldData: false,
};

export const permissionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_PERMISSION_DATA":
      return {
        ...state,
        permissionData: action.payload,
        noData: false,
        permissionLoader: false,
      };

    case "GET_OLD_PERMISSION_DATA":
      return {
        ...state,
        oldPermissionData: action.payload,
        noData: false,
        permissionLoader: false,
      };
    case "PERMISSION_LOADING":
      return {
        ...state,
        permissionLoader: true,
        noData: false,
      };
    case "PERMISSION_NO_DATA":
      return {
        ...state,
        permissionData: {},
        noData: true,
        permissionLoader: false,
      };
    case "OLD_PERMISSION_NO_DATA":
      return {
        ...state,
        oldPermissionData: {},
        noOldData: true,
        permissionLoader: false,
      };
    default:
      return state;
  }
};

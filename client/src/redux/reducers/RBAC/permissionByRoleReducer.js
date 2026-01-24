const initialState = {
  rolePermission: {},
  rolePermissionLoader: false,
  single: {},
  noData: false,
};

export const permissionByRoleReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PERMISSION":
      return {
        ...state,
        rolePermission: action.payload,
        noData: false,
        rolePermissionLoader: false,
      };

    //   case "IS_LOADING":
    //     return {
    //       ...state,
    //       rolePermissionLoader: true,
    //       noData: false,
    //     };
    //   case "EMPLOY_NO_DATA":
    //     return {
    //       ...state,
    //       rolePermission: {},
    //       noData: true,
    //       rolePermissionLoader: false,
    //     };

    default:
      return state;
  }
};

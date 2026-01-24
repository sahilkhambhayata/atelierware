export const isActionPermitted = (actionCode) => {
    return transformedPermissionReducer.some(permission => permission.ActionCode === actionCode);
  };
import React, { createContext, useContext, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  //   const [permissions, setPermissions] = useState([]);
  const permissions = useSelector(
    (state) => state.transformedPermissionReducer
  );
  const isMobileOrTablet = () => {
    const userAgent = navigator.userAgent;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    // Mobile and tablet user agent check
    const isMobileUserAgent = /Mobi|Android|iPad|iPhone/i.test(userAgent);

    return isMobileUserAgent && isTouchDevice;
  };

  // const isMobileOrTablet = () => /Mobi|Android|iPad|iPhone/i.test(navigator.userAgent);

  const isActionPermitted = (code, type) => {
    if (type === "action") {
      return permissions?.some((permission) => permission.ActionCode === code);
    } else if (type === "page") {
      return permissions?.some((permission) => permission.PageCode === code);
    }
    return false;
  };

  const handleAction = (code, type, actionHandler, data, callBack) => {
    // Check if permissions have been loaded (non-empty array)
    // If permissions haven't loaded yet, allow navigation to proceed
    // The destination page will handle permission checks via useEffect
    const permissionsLoaded = permissions && permissions.length > 0;

    if (permissionsLoaded && !isActionPermitted(code, type)) {
      toast.error(
        "You are not authorised to perform this action, for more details contact your account admin."
      );
    } else {
      if (isMobileOrTablet()) {
        setTimeout(() => {
          if (callBack) {
            actionHandler(data, callBack); // Call the specific action handler function with data
          } else {
            actionHandler(data); // Call the specific action handler function with data
          }
        }, 500); // Adjust the delay as needed
      } else {
        if (callBack) {
          actionHandler(data, callBack); // Call the specific action handler function with data
        } else {
          actionHandler(data); // Call the specific action handler function with data
        } // Call the specific action handler function with data
      } // Call the specific action handler function with data
    }
  };

  return (
    <PermissionsContext.Provider value={{ handleAction }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionsContext);

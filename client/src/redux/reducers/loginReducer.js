// import { axiosClient } from "../../Components/axios/axios";
let initialState = {
  user: null,
  userOrderCount: null, // This can represent the user's information
  isLoggedIn: false, // A flag to track if the user is logged in
  error: null,
};

export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, isLoggedIn: true };
    case "SINGLE_USER":
      return { ...state, user: action.payload, isLoggedIn: true };
    case "LOGOUT":
      return { ...state, user: null, isLoggedIn: false };
    case "FORGET_PASSWORD":
      return { ...state, user: action.payload };
    case "RESEND_OTP":
      return { ...state, user: action.payload };
    case "NEW_PASSWORD":
      return { ...state, user: action.payload };
    case "CHANGE_PASSWORD":
      return { ...state, user: action.payload };
    case "OTP_VERIFY":
      return { ...state, user: action.payload };
    case "CHANGE_BRANCH":
      return { ...state, user: action.payload, isLoggedIn: true };

    case "ORDER_COUNTING": // Handle the new action for the second API call response
      return { ...state, userOrderCount: action.payload };
    default:
      return state;
  }
};

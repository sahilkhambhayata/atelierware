import { axiosClient } from "./../../axios/axios";
import { getBranch } from "./branchAction";
import { getOrderCount } from "./orderCount";
import { logInfo, logError, logWarn, logDebug } from "../../utils/logger";

export const loginAdmin = (email, password) => {
  return async (dispatch) => {
    const tabId = localStorage.getItem('tabId') || 'N/A';
    
    try {
      logInfo('LOGIN_START', `Attempting login for email: ${email}`, {
        tabId: tabId,
        hasEmail: !!email,
        hasPassword: !!password
      });
      
      const data = await axiosClient.post(`/auth/v1/auth/send-login-otp`, {
        email: email,
        password: password,
      });

      if (data.data.success === true) {
        logInfo('LOGIN_SUCCESS', 'Login successful, storing user data', {
          tabId: tabId,
          userId: data.data.user.UserId,
          branchId: data.data.user.BranchId,
          hasToken: !!data.data.user.Token
        });
        
        localStorage.setItem("token", data.data.user.Token);
        dispatch({ type: "LOGIN", payload: data.data });
        localStorage.setItem("userId", data.data.user.UserId);
        localStorage.setItem("BranchId", data.data.user.BranchId);
        localStorage.setItem("RoleId", data.data.user.RoleId);
        localStorage.setItem(
          "countrySymbol",
          data.data.user.MstBranch.country
            ? data.data.user.MstBranch.country.Currsymbol
            : ""
        );
        localStorage.setItem("BU_Id",data.data.user.MstBranch.BU_Id)
        localStorage.setItem("CompanyId",data.data.user.CompanyId);

        // dispatch(getBranch(data.data.user.BranchId, data.data.user.Token)).then(
        //   (result) => {
        //     if (result.success === true) {
        //       // dispatch(
        //       //   getOrderCount(
        //       //     data.data.user.CompanyId,
        //       //     data.data.user.BranchId,
        //       //     data.data.user.Token
        //       //   )
        //       // );

        //       return data.data;
        //     } else {
        //       return data.data;
        //     }
        //   }
        // );
      } else {
        logError('LOGIN_FAILED', 'Login failed - success false', {
          tabId: tabId,
          response: data.response
        });
        return data.response;
      }
      return data.data;
    } catch (error) {
      logError('LOGIN_ERROR', 'Login request failed', {
        tabId: tabId,
        error: error.response?.data || error.message
      });
      return error.response.data;
    }
  };
};

// export const orderCount = (CompanyId, BranchId, Token) => {
//   return async (dispatch) => {
//     try {
//       const orderData = await axiosClient.post(
//         `auth/v1/OrderCounting`,
//         {
//           CompanyId: CompanyId,
//           BranchId: BranchId,
//         },
//         {
//           headers: {
//             token: Token,
//           },
//         }
//       );

//       if (orderData.data.success === true) {
//         // Dispatch action to store second API response
//         dispatch({ type: "ORDER_COUNTING", payload: orderData.data });
//       }
//     } catch (error) {
//       return error;
//     }
//   };
// };
export const singleAdmin = (id) => {
  return async (dispatch) => {
    try {
      const data = await axiosClient.post(`/auth/v1/auth/refresh`, {
        id: id,
      });
      const orderData = await axiosClient.post(
        `auth/v1/OrderCounting`,
        {
          CompanyId: data.data.user.CompanyId,
          BranchId: data.data.user.BranchId,
        },
        {
          headers: {
            token: data.data.user.Token,
          },
        }
      );

      // dispatch(getBranch(data.data.user.BranchId, data.data.user.Token));
      if (orderData.data.success === true) {
        // Dispatch action to store second API response
        dispatch({ type: "ORDER_COUNTING", payload: orderData.data });
      }
      dispatch({ type: "SINGLE_USER", payload: data.data });
      return data.data;
    } catch (error) {
      return error.response.data;
    }
  };
};

export const TokenAdmin = () => {
  return async (dispatch) => {
    const tabId = localStorage.getItem('tabId') || 'N/A';
    
    try {
      const id = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      logDebug('TOKEN_VALIDATION_START', 'Starting token validation', {
        tabId: tabId,
        userId: id,
        hasToken: !!token
      });

      const data = await axiosClient.post(
        `/auth/v1/get/single/user/detail/${id}`,
        {
          token: token,
        }
      );

      if (data.data.message === "Invalid Token") {
        logWarn('TOKEN_INVALID', 'Token validation failed - invalid token', {
          tabId: tabId,
          userId: id,
          responseMessage: data.data.message
        });
        
        // Auto-logout functionality
        localStorage.clear();
        dispatch({ type: "LOGOUT", payload: {} });
        window.location.href = '/';
        return data.data;
      }

      logInfo('TOKEN_VALID', 'Token validation successful', {
        tabId: tabId,
        userId: id
      });

    } catch (error) {
      logError('TOKEN_VALIDATION_ERROR', 'Token validation request failed', {
        tabId: tabId,
        status: error.response?.status,
        message: error.message,
        errorData: error.response?.data
      });
      
      // Handle network errors or other issues by logging out
      if (error.response?.status === 401 || error.response?.status === 403) {
        logWarn('TOKEN_EXPIRED', 'Token expired during validation', {
          tabId: tabId,
          status: error.response?.status
        });
        
        localStorage.clear();
        dispatch({ type: "LOGOUT", payload: {} });
        window.location.href = '/';
      }
      return error;
    }
  };
};

// export const TokenAdmin = () => {
//   return async (dispatch) => {
//     try {
//       const id = localStorage.getItem("userId");
//       const encryptId = getEncryptID(id)
// ;

//       const token = localStorage.getItem("token");
//       // const asq = localStorage.getItem("asq");
//       // const headers = {
//       //   Authorization: `Bearer ${token}`,
//       // };
//       const data = await axiosClient.post(`/auth/v1/auth/refresh`, {
//         id: id,
//       });
//       if (data.data.message === "Invalid Token") {
//         dispatch(logoutAdmin());
//         return data.data;
//       }
//     } catch (error) {
//       console.log(error);
//       return error;
//     }
//   };
// };

export const forgetPassword = (email) => {
  return async (dispatch) => {
    try {
      const data = await axiosClient.post(`/auth/v1/auth/forgot-password`, {
        email: email,
      });
      if (data.data.success === true) {
        dispatch({ type: "FORGET_PASSWORD", payload: data.data });
        return data.data;
      }
    } catch (error) {
      return error.response.data;
    }
  };
};

export const otpVerifyForgetPassword = (email, otp) => {
  return async (dispatch) => {
    try {
      const data = await axiosClient.post(
        `/auth/v1/auth/otp-verified-forgot-password`,
        {
          email: email,
          otp: Number(otp),
        }
      );
      if (data.data.success === true) {
        dispatch({ type: "OTP_VERIFY", payload: data.data });
        return data.data;
      } else {
      }
      return data.data;
    } catch (error) {
      return error.response.data;
    }
  };
};

export const ResendOtp = (email) => {
  return async (dispatch) => {
    try {
      const data = await axiosClient.post(`/auth/v1/auth/resend-otp`, {
        email: email,
      });
      if (data.data.success === true) {
        dispatch({ type: "RESEND_OTP", payload: data.data });
        return data.data;
      } else {
      }
      return data.data;
    } catch (error) {
      return error.response.data;
    }
  };
};

export const ResetForgetPassword = (email, password) => {
  return async (dispatch) => {
    try {
      const data = await axiosClient.post(
        `/auth/v1/auth/reset-forgot-password`,
        {
          email: email,
          newPassword: password,
        }
      );
      if (data.data.success === true) {
        dispatch({ type: "NEW_PASSWORD", payload: data.data });
        return data.data;
      } else {
      }
      return data.data;
    } catch (error) {
      return error.response.data;
    }
  };
};

export const ChangePasswordAction = (oldPass, newPass, conPass) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("userId");
      const data = await axiosClient.post(
        `auth/v1/auth/reset-password`,
        {
          id: id,
          oldPassword: oldPass,
          newPassword: newPass,
          confirmPassword: conPass,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      if (data.data.success === true) {
        dispatch({ type: "CHANGE_PASSWORD", payload: data.data });
        return data.data;
      } else {
      }
      return data.data;
    } catch (error) {
      return error.response.data;
    }
  };
};

export const logoutAdmin = (id) => {
  return async (dispatch) => {
    try {
      // const token = localStorage.getItem('token');
      const data = await axiosClient.post(`/auth/v1/auth/logout?UserId=${id}`);
      if (data.data.success === true) {
        localStorage.clear();
        dispatch({ type: "LOGOUT", payload: data.data });
        return data.data;
      } else {
        console.log(data.data.error);
      }
      return data.data;
    } catch (error) {
      return error.response.data;
    }
  };
};

export const changeBranch = () => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const UserId = localStorage.getItem("userId");
      const BranchId = localStorage.getItem("BranchId");
      const CompanyId = localStorage.getItem("CompanyId");
      const data = await axiosClient.post(
        `auth/v1/updatebranchforuser`,
        {
          UserId: UserId,
          BranchId: BranchId,
          CompanyId: CompanyId,
        },
        {
          headers: {
            token: token,
          },
        }
      );

      if (data.data.success === true) {
        dispatch({ type: "CHANGE_BRANCH", payload: data.data });
        return data.data;
      } else {
        console.log(data.data.error);
      }
      return data.data;
    } catch (error) {
      return error.response.data;
    }
  };
};

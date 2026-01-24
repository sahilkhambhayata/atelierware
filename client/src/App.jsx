import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import ThemeProvider from "./Layout/Provider/Themes";
import OrderTracker from "./Page/HomePage/OrderTracker/OrderTracker";
import Login from "./Page/auth/Login/Login";
import LoginOTPVerify from "./Page/auth/Login/OTPVerify";
import ResetPassword from "./Page/auth/ResetPassword/ResetPassword";
import OTPVerify from "./Page/auth/ResetPassword/OTPVerify";
import NewPassword from "./Page/auth/ResetPassword/NewPassword";
import Register from "./Page/auth/Register/Register";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { TokenAdmin, singleAdmin } from "./redux/actions/loginAction";
import ItemHomePage from "./Page/HomePage/ItemTracker/ItemHomePage";
import Dashboard from "./Page/Dashboard/Dashboard";
import "./app.css";
import AddOrderHomePage from "./Page/HomePage/AddOrder/BookOrder/SingleItem/AddOrderHomePage";
import GroupOrderHomePage from "./Page/HomePage/AddOrder/BookOrder/GroupItem/GroupOrderHomePage";
import SkelatonPage from "./Page/HomePage/AddOrder/SearchCustomer/SkelatonPage";

// import BookOrder from "./Page/HomePage/AddOrder/BookOrder/BookOrder";
import OrderListPage from "./Page/HomePage/AddOrder/OrderList/OrderListPage";
import Invoice from "./Page/HomePage/AddOrder/Invoice/Invoice";
// import EditOrderPage from "./Page/HomePage/OrderTracker/EditOrder/EditOrderPage";
import { ToastContainer, toast } from "react-toastify";
// import InvoiceDesign1 from "./Page/HomePage/AddOrder/Invoice/InvoiceDesign1";
import WorksheetP1 from "./Page/HomePage/AddOrder/Invoice/Worksheet";
import OrderTrackerSingleOrder from "./Page/HomePage/OrderTracker/EditOrder/OrderTrackerSingleOrder";
import SingleItemWorkSheet from "./Page/HomePage/AddOrder/Invoice/SingleItemWorkSheet";
import Estimate from "./Page/HomePage/AddOrder/Invoice/estimate";
import ItemSearch from "./Page/HomePage/ItemTracker/searched/ItemSearch";
import ChangePassword from "./Page/auth/ResetPassword/ChangePassword";
import AddRole from "./Page/RBAC/role/AddRole";
import AddUser from "./Page/RBAC/user/AddUser";
import { permissionByRole } from "./redux/actions/Role/permissionByRoleAction";
import { setTransformedPermission } from "./redux/actions/Role/transformedPermissionAction";

import { PermissionsProvider } from "./Layout/Provider/PermissionsContext";
import NotFound from "./Page/page404/NotFound";
import OrderBOM from "./Page/HomePage/AddOrder/Invoice/PrintBom/OrderBOM";
import useSessionValidator from "./hooks/useSessionValidator";
import { initializeTabId } from "./utils/tabId";
// import GroupOrderListPage from "./Page/HomePage/AddOrder/OrderList/GroupOrderListPage";

function App() {
  const user = useSelector((state) => state.loginUser);
  const rolePermission = useSelector(
    (state) => state.permissionByRoleReducer.rolePermission.Data
  );

  // Initialize tab ID for debugging
  useEffect(() => {
    initializeTabId();
  }, []);

  // Use session validator for periodic token validation
  useSessionValidator();

  // const transformedPermissionReducer = useSelector((state) =>

  // );

  const dispatch = useDispatch();
  useEffect(() => {
    if (rolePermission) {
      const transformedData = rolePermission.flatMap((module) =>
        module.PAGE.flatMap((page) => {
          if (page.ACTION.length === 0) {
            return [
              {
                ModuleCode: module.ModuleCode,
                PageCode: page.PageCode,
                ActionCode: null,
              },
            ];
          }
          return page.ACTION.map((action) => ({
            ModuleCode: module.ModuleCode,
            PageCode: page.PageCode,
            ActionCode: action.ActionCode,
          }));
        })
      );
      dispatch(setTransformedPermission(transformedData));
    }
  }, [rolePermission, dispatch]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(singleAdmin(userId));
      dispatch(permissionByRole());
    }
  }, []);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname !== "/") {
      if (
        pathname === "/register" ||
        pathname === "/reset-password" ||
        pathname === "/otp-verify" ||
        pathname === "/new-password"
      ) {
        if (pathname === "/register") {
          navigate("/register");
        }
        if (pathname === "/reset-password") {
          navigate("/reset-password");
        }
        if (pathname === "/otp-verify") {
          navigate("/otp-verify");
        }
        if (pathname === "/new-password") {
          navigate("/new-password");
        }
      } else {
        const userId = localStorage.getItem("userId");
        if (userId) {
          dispatch(singleAdmin(userId));
          dispatch(permissionByRole());
          dispatch(TokenAdmin(userId)).then((res) => {
            if (res?.message === "Invalid Token") {
              localStorage.clear();
              // localStorage.removeItem("token");
              // localStorage.removeItem("asq");
              navigate("/");
              toast.error("Your LogIn Session Expired.");
              // toaster.push(
              //   <Message type={"error"} closable>
              //     <p className="fs-6">Your LogIn Session Expired.</p>
              //   </Message>,
              //   { placement: "topEnd", duration: 1500 }
              // );
            }
          });
        } else {
          navigate("/");
        }
      }
    }
  }, [pathname]);

  return (
    <>
      <ThemeProvider>
        <PermissionsProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login-otp" element={<LoginOTPVerify />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/otp-verify" element={<OTPVerify />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/new-password" element={<NewPassword />} />
            <Route element={<Dashboard />}>
              <Route path="/dashboard" element={<OrderTracker />} />
              <Route path="/item-tracker" element={<ItemHomePage />} />
              <Route path="/add-order" element={<SkelatonPage />} />
              <Route
                path="/add-order-home-page"
                element={<AddOrderHomePage />}
              />
              <Route
                path="/group-order-home-page"
                element={<GroupOrderHomePage />}
              />
              <Route
                // path="/order-tracker-single-order/:orderNo/:mood"
                path="/order-tracker-single-order"
                element={<OrderTrackerSingleOrder />}
              />
              <Route path="/order-list" element={<OrderListPage />} />
              <Route path="/invoice" element={<Invoice />} />
              <Route path="/estimate" element={<Estimate />} />
              <Route path="/worksheet" element={<WorksheetP1 />} />
              <Route path="/item-worksheet" element={<SingleItemWorkSheet />} />
              <Route path="/print-bom" element={<OrderBOM />} />


              <Route path="/role" element={<AddRole />} />
              <Route path="/user" element={<AddUser />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </PermissionsProvider>
      </ThemeProvider>

      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;

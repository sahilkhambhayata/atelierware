import { combineReducers } from "redux";
import { loginReducer } from "./loginReducer";
import { branchReducer } from "./branchReducer";
import { configReducer } from "./configReducer";
import { orderReducer } from "./orderReducer";
import { itemReducer } from "./itemReducer";
import { columnReducer } from "./columnListReducer";
import { customerReducer } from "./customerReducer";
import { styleReducer } from "./styleReducer";
import { countryReducer } from "./countryReducer";
import { saletypeReducer } from "./saleReducer";
import { masterReducer } from "./masterReducer";
import { ordertypeReducer } from "./orderTypeReducer";
import { designerReducer } from "./designerReducer";
import { serviceReducer } from "./serviceReducer";
import {
  measureByItemReducer,
  measureReducer,
  oldItemListReducer,
  oldmeasureReducer,
} from "./measureReducer";
import { catelogReducer } from "./catelogReducer";
import { fabricAccReducer } from "./fabricAccReducer";
import { orderCountReducer } from "./orderCountReducer";
import { createorddtlsReducer } from "./createorddtlsReducer";
import { getStyleHeadDataReducer } from "./getStyleHeadDataReducer";
import { VatSlabDataReducer } from "./VatSlabDataReducer";
import { getdirectDataReducer } from "./getdirectDataReducer";
import { FabricDetailsReducer } from "./FabricDetailsReducer";
import { getSingleArticleDetailsReducer } from "./getSingleArticleDetailsReducer";
import { fabricAndAccessoriesCRUDReducer } from "./fabricAndAccessoriesCRUDReducer";
import { getDirectImageArrayReducer } from "./getDirectImageArrayReducer";
import { getDirectTrialDeliveryReducer } from "./getDirectTrialDeliveryReducer";
import { getDirectPaymentInfoReducer } from "./getDirectPaymentInfoReducer";
import { getDirectFabricAccAmountReducer } from "./getDirectFabricAccAmountReducer";
import { orderListReducer } from "./orderListReducer";
import { paymentReducer } from "./paymentMethodReducer";
import { getPaymentDataReducer } from "./getPaymentDataReducer";
import { invoiceReducer } from "./invoiceReducer";
import { groupFabricAndAccessoriesCRUDReducer } from "./groupFabricAndAccessoriesCRUDReducer";
import { AddGroupOrderBookReducer } from "./AddGroupOrderBookReducer";
import { groupOrderListReducer } from "./groupOrderListReducer";
import { getGroupTrialDeliveryReducer } from "./getGroupTrialDeliveryReducer";
import { getGroupPaymentInfoReducer } from "./getGroupPaymentInfoReducer";
import { getGroupFabricAccAmountReducer } from "./getGroupFabricAccAmountReducer";
import { getDirectGarmentArrayReducer } from "./getDirectGarmentArrayReducer";
import { worksheetReducer } from "./worksheetReducer";
import { getDirectSerachData } from "../actions/getDirectSerachData";
import { getDirectSerachDataReducer } from "./getDirectSerachDataReducer";
import { fabicDropDownListReducer } from "./fabicDropDownListReducer";
import { getItemImageReducer } from "./getItemImageReducer";
import { getDiscriptionReducer } from "./getdiscriptionReducer";
import { roleReducer } from "./RBAC/roleReducer";
import { userReducer } from "./RBAC/userReducer";
import { employReducer } from "./RBAC/employReducer";
import { permissionReducer } from "./RBAC/permissionReducer";
import { permissionByRoleReducer } from "./RBAC/permissionByRoleReducer";
import {transformedPermissionReducer} from "./RBAC/transformedPermissionReducer";
import { getOrderExpandReducer } from "./orderRowExpandReducer";
const reducers = combineReducers({
  loginUser: loginReducer,
  branch: branchReducer,
  config: configReducer,
  orderDetails: orderReducer,
  orderCount: orderCountReducer,
  itemDetails: itemReducer,
  orderExpand : getOrderExpandReducer,

  columnsDetails: columnReducer,
  itemImage: getItemImageReducer,
  customerDetails: customerReducer,
  styleDetails: styleReducer,
  countryDetails: countryReducer,
  saleType: saletypeReducer,
  master: masterReducer,
  orderType: ordertypeReducer,
  designer: designerReducer,
  service: serviceReducer,
  measure: measureReducer,
  measureByItem: measureByItemReducer,
  oldMeasure: oldmeasureReducer,
  oldItemList: oldItemListReducer,
  fabricDropDownList: fabicDropDownListReducer,

  catelog: catelogReducer,
  fabricAcc: fabricAccReducer,
  createorddtls: createorddtlsReducer,
  getStyleHeadData: getStyleHeadDataReducer,
  VatSlabData: VatSlabDataReducer,
  getdirectData: getdirectDataReducer,
  FabricDetailsData: FabricDetailsReducer,
  getSingleArticleDetails: getSingleArticleDetailsReducer,
  fabricCRUDDetails: fabricAndAccessoriesCRUDReducer,
  imageArray: getDirectImageArrayReducer,
  garmentArray: getDirectGarmentArrayReducer,
  trialDeliveryDate: getDirectTrialDeliveryReducer,
  getDirectPaymentInfo: getDirectPaymentInfoReducer,
  getFabAccAmount: getDirectFabricAccAmountReducer,
  orderListData: orderListReducer,
  paymentMethodData: paymentReducer,
  paymentDetails: getPaymentDataReducer,
  invoiceData: invoiceReducer,
  worksheetData: worksheetReducer,
  itemDescription: getDiscriptionReducer,

  //group state...........................................................................................................
  groupFabricCRUDDetails: groupFabricAndAccessoriesCRUDReducer,
  addGroupOrderDetails: AddGroupOrderBookReducer,
  groupOrderList: groupOrderListReducer,
  groupTrialDeliveryData: getGroupTrialDeliveryReducer,
  getGroupPaymentInfo: getGroupPaymentInfoReducer,
  getGroupFabAccAmount: getGroupFabricAccAmountReducer,

  itemSerachData: getDirectSerachDataReducer,
  itemReducer: itemReducer,

  //RBAC==================================================================================================
  roleReducer: roleReducer,
  userReducer: userReducer,
  employReducer: employReducer,
  permissionReducer: permissionReducer,
  permissionByRoleReducer: permissionByRoleReducer,
  transformedPermissionReducer: transformedPermissionReducer
});

export default reducers;

import { useDispatch } from "react-redux";
import { useTheme } from "../../../../Layout/Provider/Themes";
import { useNavigate } from "react-router";
import { getSingleCustomer } from "../../../../redux/actions/customerAction";
import { getSingleOrderDtlsAsyncData } from "../../../../redux/actions/createorddtlsAction";
import { getGroupOrderListAsyncData } from "../../../../redux/actions/groupOrderListAction";

const useHandleCellClick = () => {
  const { tabId } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCellClick = (val, callBack) => {
    const data = val.data;
    const tab = val.tab;

    localStorage.setItem(`customerId${tabId}`, data.AccountId);
    localStorage.setItem(`TOrdHdID${tabId}`, data.TOrdHdID);

    dispatch(getSingleCustomer(data.AccountId));
    dispatch(getSingleOrderDtlsAsyncData(data.TOrdHdID));

    dispatch(getGroupOrderListAsyncData(data.TOrdHdID)).then((res) => {
      localStorage.setItem(`mood${tabId}`, "view");

      const sendingData = {
        AccountId: data.AccountId,
        TOrdHdID: data.TOrdHdID,
        from: "order-tracker",
        mood: "view",
        tab: tab,
        TOrdDtId: data.TOrdDtls[0].TOrdDtId,
        ItemId: data.TOrdDtls[0].ItemId,
        // balanceData: data,
        TOrdNo: data.TOrdNo,
      };
      if (callBack) {
        callBack(null);
      }
      // const url = `/#/order-tracker-single-order/${data.TOrdNo}/view`;
      const url = `/#/order-tracker-single-order`;
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      localStorage.setItem("orderEditData", JSON.stringify(sendingData));
    });
  };

  return handleCellClick;
};

export default useHandleCellClick;

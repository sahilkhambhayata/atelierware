import { useDispatch } from "react-redux";
import { useTheme } from "../../../../Layout/Provider/Themes";
import { useNavigate } from "react-router";
import { getSingleCustomer } from "../../../../redux/actions/customerAction";
import { getSingleOrderDtlsAsyncData } from "../../../../redux/actions/createorddtlsAction";
import {
  getGroupOrderListAsyncData,
  getSingleGroupOrderList,
} from "../../../../redux/actions/groupOrderListAction";
import { useState } from "react";
import { getSingleOrderList } from "../../../../redux/actions/orderListAction";

const useHandleCellClick = () => {
  const { tabId } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [matchingObjects, setMatchingObjects] = useState([]);

  const handleCellClick = (val, callBack) => {
  
    const data = val.data;
    const tab = val.tab;
    let results = [];
    let isGroupOrder = false;
    localStorage.setItem(`customerId${tabId}`, data?.orderHead?.AccountId);
    localStorage.setItem(`TOrdHdID${tabId}`, data.TOrdHdID);

    dispatch(getSingleCustomer(data.orderHead.AccountId));
    dispatch(getGroupOrderListAsyncData(data.TOrdHdID)).then((res) => {
      if (res.success) {
        res.Order.TOrdDtls.forEach((item) => {
          if (item?.groupItemList?.length > 0) {
            const groupMatches = item.groupItemList.filter(
              (data1) => data1.TOrdDtId === data.TOrdDtId
            );

            if (groupMatches.length > 0) {
              results.push(item);

              localStorage.setItem(`TOrdDtID${tabId}`, item.TOrdDtId);
              isGroupOrder = true;
            }
          }

          if (item.TOrdDtId === data.TOrdDtId) {
            results.push(item);
            localStorage.setItem(`TOrdDtID${tabId}`, data.TOrdDtId);
          }
        });
        setMatchingObjects(results);
      }

      // const sendingData = {
      //   AccountId: data.orderHead.AccountId,
      //   TOrdHdID: data.TOrdHdID,
      //   from: "item-tracker",
      //   mood: "edit",
      //   tab: "under-booking",
      //   balanceData: results,
      //   TOrdNo: data.orderHead.TOrdNo,
      // };
      if (callBack) {
        callBack(null);
      }
      if (isGroupOrder) {
        const sendingData = {
          AccountId: data.orderHead.AccountId,
          TOrdHdID: data.TOrdHdID,
          from: "item-tracker",
          mood: "view",
          tab: "under-booking",
          TOrdDtId: results?.[0]?.TOrdDtId,
          ItemId: results?.[0]?.ItemId,
          // balanceData: results,
          TOrdNo: data.orderHead.TOrdNo,
        };
        dispatch(getSingleGroupOrderList(results?.[0]?.TOrdDtId));
        const url = `/#/group-order-home-page`;
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        localStorage.setItem("orderEditData", JSON.stringify(sendingData));
      } else {
        const sendingData = {
          AccountId: data.orderHead.AccountId,
          TOrdHdID: data.TOrdHdID,
          from: "item-tracker",
          mood: "view",
          tab: "under-booking",
          TOrdDtId: data?.TOrdDtId,
          ItemId: data.ItemId,
          // balanceData: results,
          TOrdNo: data.orderHead.TOrdNo,
        };
        dispatch(getSingleOrderList(data?.TOrdDtId));

        const url = `/#/add-order-home-page`;
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        localStorage.setItem("orderEditData", JSON.stringify(sendingData));
      }
    });

    dispatch(getSingleOrderDtlsAsyncData(data.TOrdHdID));

    // .then((res) => {
    //   localStorage.setItem(`mood${tabId}`, "view");
    //   const sendingData = {
    //     AccountId: data.orderHead.AccountId,
    //     TOrdHdID: data.TOrdHdID,
    //     from: "item-tracker",
    //     mood: "view",
    //     tab: tab,
    //     balanceData: data,
    //     TOrdNo: data.orderHead.TOrdNo,
    //   };
    //   if (callBack) {
    //     callBack(null);
    //   }
    //   const url = `/#/order-tracker-single-order/${data.orderHead.TOrdNo}/view`;
    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.target = "_blank";
    //   a.rel = "noopener noreferrer";
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);
    //   localStorage.setItem("orderEditData", JSON.stringify(sendingData));
    // });
  };

  return handleCellClick;
};

export default useHandleCellClick;

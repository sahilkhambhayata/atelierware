import React from "react";
import { Table } from "@devexpress/dx-react-grid-material-ui";
import { useTheme } from "../../../../Layout/Provider/Themes";
import { useDispatch } from "react-redux";
import { getSingleCustomer } from "../../../../redux/actions/customerAction";
import { getSingleOrderDtlsAsyncData } from "../../../../redux/actions/createorddtlsAction";
import { getGroupOrderListAsyncData } from "../../../../redux/actions/groupOrderListAction";
import { useNavigate } from "react-router";

const CustomTableRow = ({ row, ...restProps }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentDate = new Date();
  const delDate = row?.commitments?.props?.commitmentsData?.cdelDate;
  const delDatecon = new Date(delDate);
  const day = Math.floor((delDatecon - currentDate) / (24 * 60 * 60 * 1000)); // convert to days
  const greenLine = day >= 3;
  const OrengeLine = day <= 2 && day >= 0;
  const redLine = day <= -1;
  const { tabId } = useTheme();
  const dynamicClass = row.order.props.orderData.mainId;
  const isSelected = row.order.props.isSelected;
  // const customClass = `${dynamicClass}-your-custom-class custom-row-left-br  ${isSelected &&
  //   "custome-border-outline "}   `;

  const customClass = ` ${dynamicClass}-your-custom-class  ${isSelected &&
    "custome-border-outline"}  ${greenLine &&
    "custom-row-left-br-green"} ${OrengeLine &&
    "custom-row-left-br-orenge"} ${redLine && "custom-row-left-br-red"}  `;

  return (
    <Table.Row
      {...restProps}
      className={customClass}
      // style={{ position: "relative" }}
      // onClick={() => handleRowClick()}
    >
      {/* <div className="custom-extra-div"></div>
      {restProps.children} */}
    </Table.Row>
  );
};

export default CustomTableRow;

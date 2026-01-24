// import React, { useState } from "react";

// const TabBar = () => {
//   const [trans, setTrans] = useState("under-booking"); // Set an initial tab

//   const handleTabClick = (tab) => {
//     setTrans(tab);
//   };

//   return (

//     <>
//       {mainTabBar.map((tab, index) => {
//         return (
//           <li
//             key={tab.ind}
//             className={`tab ${isClosed === tab.ind ? "active" : ""}`}
//             onClick={() => handleTabClick(tab.ind)}
//           >
//             <span className={`tab-label ${tab.title}`}>{tab.title}</span>
//             <div className={`capsule ${tab.title}`}>
//               <span className="capsule-text">20</span>
//             </div>
//           </li>
//         );
//       })}
//     </>
//   );
// };

// export default TabBar;

export const orderTabBar = [
  {
    ind: 0,
    title: "under-booking",
    name: "TblOmsOrdTracrUB",
    head: "underBooking",
  },
  {
    ind: 2,
    title: "fresh-order",
    name: "TblOmsOrdTracrFO",
    head: "freshOrd",
  },
  {
    ind: 3,
    title: "under-process",
    name: "TblOmsOrdTracrUP",
    head: "UnderProcess",
  },
  {
    ind: 4,
    title: "ready-delivery",
    name: "TblOmsOrdTracrRD",
    head: "readyDel",
  },
  {
    ind: 5,
    title: "delivered",
    name: "TblOmsOrdTracrDlrd",
    head: "delivered",
  },
  {
    ind: 7,
    title: "all",
    head: "all",
  },
  {
    ind: 6,
    title: "search-result",
  },
];

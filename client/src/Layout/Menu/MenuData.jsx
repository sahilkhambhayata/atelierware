const menu = [
  {
    icon: "dashlite",
    text: "Dashboard",
    id: "MdDashboard",
    newTab: true,
    subMenu: [
      {
        text: "Order Tracker",
        link: "/dashboard",
        pageId: "PgOrderTracker",
        newTab: false,
      },
      {
        text: "Item Tracker",
        link: "/item-tracker",
        pageId: "PgItemTracker",
        newTab: false,
      },
      {
        text: "Book Order",
        link: "/add-order",
        pageId: "PgBookAnOrder",
        newTab: true,
      },
    ],
  },
  {
    icon: "bitcoin-cash",
    text: "Role",
    id: "MdRole",
    newTab: false,
    subMenu: [
      {
        text: "Role",
        link: "/role",
        pageId: "PgUserRoles",
        newTab: false,
      },
      {
        text: "User",
        link: "/user",
        pageId: "PgUsers",
        newTab: false,
      },
    ],
  },
];
export default menu;

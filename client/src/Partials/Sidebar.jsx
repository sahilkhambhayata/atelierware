import React, { useState } from "react";
import classNames from "classnames";
import SimpleBar from "simplebar-react";
import Menu from '../Layout/Menu/Menu';
import Toggle from "../Layout/sidebar/Toggle";
import Logo from "../Layout/logo/Logo";

import { useTheme, useThemeUpdate } from '../Layout/Provider/Themes';

const Sidebar = ({ fixed, className }) => {

  const {theme} = useTheme();
  const themeUpdate = useThemeUpdate();

  const [mouseEnter, setMouseEnter] = useState(false);

  const handleMouseEnter = () => setMouseEnter(true);
  const handleMouseLeave = () => setMouseEnter(false);

  const classes = classNames({
    "nk-sidebar": true,
    "nk-sidebar-fixed": fixed,
    "nk-sidebar-active": theme.sidebarVisibility,
    "nk-sidebar-mobile": theme.sidebarMobile,
    "is-compact": theme.sidebarCompact,
    "has-hover": theme.sidebarCompact && mouseEnter,
    [`is-light`]: theme.sidebar === "white",
    [`is-${theme.sidebar}`]: theme.sidebar !== "white" && theme.sidebar !== "light",
    [`${className}`]: className,
  });

  return (
    <>
      {/* <div className={classes}>
        <SimpleBar className="nk-sidebar-inner">
          <Menu />
        </SimpleBar>
      </div>
      {theme.sidebarVisibility && <div
      onClick={themeUpdate.sidebarVisibility}
       className="nk-sidebar-overlay"></div>} */}

       <div className={classes}>
        <div className="nk-sidebar-element nk-sidebar-head">
          <div className="nk-menu-trigger me-0">
            <Toggle className="nk-nav-toggle nk-quick-nav-icon d-xl-none" icon="arrow-left" click={themeUpdate.sidebarVisibility} />
            <Toggle
              className={`nk-nav-compact nk-quick-nav-icon d-none d-xl-inline-flex ${
                theme.sidebarCompact ? "compact-active" : ""
              }`}
              click={themeUpdate.sidebarCompact}
              icon="menu"
            />
          </div>
          <div className="nk-sidebar-brand">
            <Logo />
          </div>
        </div>
        <div className="nk-sidebar-content" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <SimpleBar className="nk-sidebar-menu">
            <Menu />
          </SimpleBar>
        </div>
      </div>
      {theme.sidebarVisibility && <div
      onClick={themeUpdate.sidebarVisibility}
       className="nk-sidebar-overlay"></div>}
    </>
  );
};
export default Sidebar;

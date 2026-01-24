import React, { useState, createContext, useContext, useEffect } from "react";
import classNames from "classnames";
const ThemeContext = createContext();
const ThemeUpdateContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeUpdate() {
  return useContext(ThemeUpdateContext);
}

const ThemeProvider = ({ ...props }) => {
  const defaultTheme = {
    main: "default", //other value can be passed "clean,shady,softy"
    sidebar: "dark", //other value can be passed "light,white,theme"
    sidebarCompact: true,
    sidebarVisibility: false,
    sidebarMobile: false,
    header: "white", //other value can be passed "light,dark,theme"
    skin: "light", //other value can be passed "dark"
  };
  const [theme, setTheme] = useState(defaultTheme);
  const [tabId, setTabId] = useState("");
  const generateTabId = () => {
    return Math.floor(100 + Math.random() * 900).toString();
  };

  // useEffect(() => {
  //   const storedTabId = sessionStorage.getItem("tabId");

  //   if (storedTabId) {
  //     setTabId(storedTabId);
  //   } else {
  //     const newTabId = generateTabId();
  //     setTabId(newTabId);
  //     sessionStorage.setItem("tabId", newTabId);
  //   }

  //   return () => {
  //     sessionStorage.removeItem("tabId");
  //   };
  // }, []);
  useEffect(() => {
    let currentTabId = sessionStorage.getItem("tabId");

    if (!currentTabId) {
      currentTabId = generateTabId();
      sessionStorage.setItem("tabId", currentTabId);
    }

    setTabId(currentTabId);
  }, []);





  const themeUpdate = {
    uistyle: function(value) {
      setTheme({ ...theme, main: value });
    },
    sidebar: function(value) {
      setTheme({ ...theme, sidebar: value });
    },
    sidebarCompact: function(e) {
      setTheme({ ...theme, sidebarCompact: !theme.sidebarCompact });
    },
    sidebarVisibility: function(e) {
      setTheme({ ...theme, sidebarVisibility: !theme.sidebarVisibility });
    },
    sidebarHide: function(e) {
      setTheme({ ...theme, sidebarVisibility: false });
    },
    header: function(value) {
      setTheme({ ...theme, header: value });
    },
    skin: function(value) {
      setTheme({ ...theme, skin: value });
    },
    reset: function(e) {
      setTheme({
        ...theme,
        main: defaultTheme.main,
        sidebar: defaultTheme.sidebar,
        header: defaultTheme.header,
        skin: defaultTheme.skin,
      });
    },
  };

  // bg-lighter removed to change backgrond color

  const bodyClass = classNames({
    "nk-body  npc-default has-sidebar no-touch nk-nio-theme": true,
  });

  useEffect(() => {
    const body = document.querySelector("body");
    body.className = bodyClass;
  }, []);

  useEffect(() => {
    const body = document.querySelector("body");
    if (theme.main === "default") {
      body.classList.add("ui-default");
      body.classList.remove("ui-clean", "ui-shady", "ui-softy");
    }
    if (theme.main === "clean") {
      body.classList.add(`ui-clean`);
      body.classList.remove("ui-default", "ui-shady", "ui-softy");
    }
    if (theme.main === "shady") {
      body.classList.add(`ui-shady`);
      body.classList.remove("ui-default", "ui-clean", "ui-softy");
    }
    if (theme.main === "softy") {
      body.classList.add(`ui-softy`);
      body.classList.remove("ui-default", "ui-clean", "ui-shady");
    }
    if (theme.skin === "dark") {
      body.classList.add(`dark-mode`);
    } else {
      body.classList.remove("dark-mode");
    }
    if (theme.sidebarVisibility === true) {
      body.classList.add("nav-shown");
    } else {
      body.classList.remove("nav-shown");
    }
  }, []);

  useEffect(() => {
    const body = document.querySelector("body");
    const observer = new ResizeObserver((entries) => {
      let width = entries[0].contentRect.width;
      if (width < 1200) {
        setTheme((prevTheme) => ({
          ...prevTheme,
          sidebarMobile: true,
          sidebarVisibility: false,
        }));
      } else {
        setTheme((prevTheme) => ({
          ...prevTheme,
          sidebarMobile: false,
          sidebarVisibility: false,
        }));
      }
    });
    observer.observe(body);

    return () => {
      observer.unobserve(body);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, tabId }}>
      <ThemeUpdateContext.Provider value={themeUpdate}>
        {props.children}
      </ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  );
};
export default ThemeProvider;

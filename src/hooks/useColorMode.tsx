// import { useEffect } from "react";
// import useLocalStorage from "./useLocalStorage";

// const useColorMode = () => {
//   const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");

//   useEffect(() => {
//     const className = "dark";
//     const bodyClass = window.document.body.classList;

//     colorMode === "dark"
//       ? bodyClass.add(className)
//       : bodyClass.remove(className);
//   }, [colorMode]);

//   return [colorMode, setColorMode];
// };

// export default useColorMode;


import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const useColorMode = (): [string, (mode: string) => void] => {
  const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const className = "dark";
    const element = window.document.documentElement;

    // Apply the theme class to the <html> element
    if (colorMode === "dark") {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }, [colorMode]);

  useEffect(() => {
    // If no theme is set, use the system preference
    if (!colorMode && typeof window !== "undefined") {
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setColorMode(prefersDarkMode ? "dark" : "light");
    }
  }, [colorMode, setColorMode]);

  return [colorMode, setColorMode];
};

export default useColorMode;

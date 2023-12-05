import { useEffect, useState } from "react";
import { useSiteMetadata } from "./lib/SiteMetadataContext";

const ThemeSelector = () => {
  const siteMetadata = useSiteMetadata();
  const [darkThemeName] = useState(siteMetadata?.themes.darkThemeName ?? "mytheme");
  const [lightThemeName] = useState(siteMetadata?.themes.lightThemeName ?? "garden");
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // Function to toggle the theme
  const toggleTheme = () => {
    const newTheme = !isDarkTheme ? darkThemeName : lightThemeName;
    document.documentElement.setAttribute("data-theme", newTheme);
    setIsDarkTheme(!isDarkTheme);

    // Save the selected theme to local storage
    localStorage.setItem("theme", newTheme);
    //applyCustomTheme();
  };

  // useEffect to load the theme from local storage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if localStorage is available
      const savedTheme = localStorage.getItem("theme");

      if (savedTheme && (savedTheme === darkThemeName || savedTheme === lightThemeName)) {
        document.documentElement.setAttribute("data-theme", savedTheme);
        setIsDarkTheme(savedTheme === darkThemeName);
      } else {
        const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const newTheme = prefersDarkMode ? darkThemeName : lightThemeName;
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        setIsDarkTheme(prefersDarkMode);
      }
    }
  }, [darkThemeName, lightThemeName]);

  return (
    <label className="grid cursor-pointer place-items-center">
      <input
        type="checkbox"
        checked={isDarkTheme}
        onChange={toggleTheme}
        className="col-span-2 col-start-1 row-start-1 toggle theme-controller bg-base-content"
      />
      <svg
        className="col-start-1 row-start-1 stroke-base-100 fill-base-100"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </svg>
      <svg
        className="col-start-2 row-start-1 stroke-base-100 fill-base-100"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </label>
  );
};

export default ThemeSelector;

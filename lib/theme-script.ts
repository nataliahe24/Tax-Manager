const STORAGE_KEY = "task-manager-theme";

/**
 * Inline script to run before first paint. Sets the "dark" class on <html>
 * from localStorage so there’s no flash of the wrong theme.
 */
export const THEME_SCRIPT = `(function(){var v=localStorage.getItem("${STORAGE_KEY}");if(v==="dark")document.documentElement.classList.add("dark");else document.documentElement.classList.remove("dark");})();`;

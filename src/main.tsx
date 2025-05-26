import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TempoDevtools } from "tempo-devtools";
import apiService from "./services/api";

// Initialize Tempo Devtools
TempoDevtools.init();

// Initialize CSRF token with more robust error handling
(async function initializeApp() {
    try {
        console.log("Initializing application and fetching CSRF token...");
        // Force refresh of CSRF token on app start
        await apiService.getCsrfToken(true);
        console.log("CSRF token initialized successfully");

        // Display cookies for debugging
        apiService.debugCookies();
    } catch (error) {
        console.error("Failed to initialize CSRF token:", error);
    } finally {
        // Render the app regardless of CSRF success/failure
        createRoot(document.getElementById("root")!).render(<App />);
    }
})();

import axios from "axios";
import { account } from "./appwrite";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token caching to avoid hitting Appwrite rate limits
let cachedToken: string | null = null;
let tokenIssueTime: number = 0;

// Add a request interceptor to include the auth token in headers
api.interceptors.request.use(
  async (config) => {
    try {
        const now = Date.now();
        // Refresh token if it doesn't exist or is older than 10 minutes (tokens last 15m)
        if (!cachedToken || (now - tokenIssueTime > 10 * 60 * 1000)) {
            try {
                const jwt = await account.createJWT();
                cachedToken = jwt.jwt;
                tokenIssueTime = now;
            } catch (jwtErr) {
                // If this fails, we are likely a guest. Clear token and continue.
                cachedToken = null;
                // No need to log a warning every time for guests
            }
        }
        
        if (cachedToken) {
            config.headers.Authorization = `Bearer ${cachedToken}`;
        }
    } catch (error) {
        // Fallback catch to ensure requests aren't blocked
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add Response Interceptor to handle 401s
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.error("API Unauthorized (401):", error.config.url);
            // Optionally redirect to login if not already there
            if (typeof window !== "undefined" && !window.location.pathname.includes("/signin")) {
                 // You might want to trigger a global logout action here if you had access to the store
                 // window.location.href = "/signin"; 
            }
        }
        return Promise.reject(error);
    }
);

export default api;

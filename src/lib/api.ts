import axios from "axios";
import { supabase } from "./supabaseClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token in headers
api.interceptors.request.use(
  async (config) => {
    // List of public routes that don't need auth
    const publicRoutes = ['/auth/signin', '/auth/signup', '/auth/reset-password'];
    const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));

    try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        } else if (!isPublicRoute) {
            // No session and not a public route - cancel the request
            // This prevents the browser from sending the request and getting a 401
            return Promise.reject({
                message: "Unauthorized: No active session",
                config,
                response: { status: 401 }
            });
        }
    } catch (error) {
        // Fallback catch
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
        // Handle manually rejected unauthorized requests silently
        if (error.message === "Unauthorized: No active session") {
            return new Promise(() => {}); // Return a pending promise to stop execution
        }

        if (error.response?.status === 401) {
            // Silently handle 401 - components will handle their own error states
            // We can return a pending promise here too if we want to completely kill the chain
            // but for now we'll just let it pass and be caught by component-level try/catch
        }
        return Promise.reject(error);
    }
);

export default api;


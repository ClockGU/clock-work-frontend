import axios from "axios";

// Create an isolated Axios instance for the Auth API
const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API, // Or your actual auth base URL
  headers: {
    "Accept-Language": "de",
  },
});
const REDIRECT_URI = `${import.meta.env.VITE_PUBLIC_URL}/logging-in`;


const AuthApiService = {
  /**
   * Set a custom header.
   */
  setHeader(header, value) {
    authApi.defaults.headers.common[header] = value;
  },

  /**
   * Set the Authorization header with a Bearer token.
   */
  setAccessToken(accessToken) {
    this.setHeader("Authorization", `Bearer ${accessToken}`);
  },

  /**
   * Remove all headers.
   */
  removeHeader() {
    authApi.defaults.headers.common = {};
  },

  /**
   * Remove a single header.
   */
  removeSingleHeader(header) {
    delete authApi.defaults.headers.common[header];
  },

  /**
   * Login using the provided CAS token.
   */
  login(casToken) {
    return authApi.get("/auth/cas/callback", { params: { code: casToken } });
  },

  /**
   * Login as a supervisor using the provided CAS token.
   */
  loginSupervisor(casToken) {
    return authApi.post("/auth/cas/logging-in", null, { params: { code: casToken } });
  },

  /**
   * Delete the current user's account.
   */
  deleteAccount(userId) {
    return authApi.delete(`/users/${userId}`);
  },

  /**
   * Retrieve data about the currently authenticated user.
   */
  getUser() {
    return authApi.get("/auth/me");
  },

  /**
   * Refresh the access token.
   */
  refreshToken(token) {
    return authApi.get("/auth/refresh", { params: { token } });
  },

  /**
   * Update the current user's information.
   */
  updateUser(userData, userId) {
    return authApi.put(`/users/${userId}`, userData);
  },

  /**
   * Logout the current user by removing the token and headers.
   */
  logout() {
    this.removeHeader();
    // You can also unmount shared interceptors if needed here
  },
  getAuthorizationUrl() {
    return authApi.get("/authorize", {
      params: {
        redirect_uri: REDIRECT_URI
      }
    });
  },
  /**
   * Expose raw Axios instance for interceptor attachment.
   */
  getAxiosInstance() {
    return authApi;
  }
};

export default AuthApiService;

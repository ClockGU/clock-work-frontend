import ApiService from "@/services/api";

const AuthService = {
  /**
   * Login using the provided CAS token.
   */
  login: (casToken) => {
    return ApiService.post("/auth/cas/login", { cas_token: casToken });
  },

  /**
   * Login as a supervisor using the provided CAS token.
   */
  loginSupervisor: (casToken) => {
    return ApiService.post("/auth/cas/login-Supervisor", { cas_token: casToken });
  },

  /**
   * Delete the current user's account.
   */
  deleteAccount: () => {
    return ApiService.delete("/users/me");
  },

  /**
   * Retrieve data about the currently authenticated user.
   */
  getUser: async function () {
    const url = "/auth/me";
    return ApiService.get(url);
  },

  /**
   * Refresh the access token.
   */
  refreshToken: (token) => {
    return ApiService.get("/auth/refresh", { params: { token } });
  },

  /**
   * Update the current user's information.
   */
  updateUser: (userData) => {
    return ApiService.put("/users/me", userData);
  },

  /**
   * Logout the current user by removing the token from storage.
   */
  logout() {
    ApiService.removeHeader();
    ApiService.unmountInterceptor();
  }
};

export default AuthService;
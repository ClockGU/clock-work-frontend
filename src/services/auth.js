import ApiService from "@/services/api";

const AuthService = {
  /**
   * Login using the provided CAS token.
   */
  login: (casToken) => {
    return ApiService.get("/auth/cas/callback", { params: { code: casToken } });
  },
  /**
   * Login as a supervisor using the provided CAS token.
   */
  loginSupervisor: (casToken) => {
    return ApiService.post("/auth/cas/logging-in",{params:{code:casToken}});
  },

  /**
   * Delete the current user's account.
   */
  deleteAccount: (userId) => {
    return ApiService.delete(`/users/${userId}`);
  },

  /**
   * Retrieve data about the currently authenticated user.
   */
  getUser: async function () {
    return ApiService.get("/auth/me");
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
  updateUser: (userData, userId) => {
    return ApiService.put(`/users/${userId}`, userData);
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
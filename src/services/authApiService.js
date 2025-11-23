import axios from 'axios';


const AuthApiService = {
  /**
   * Set a custom header.
   */
  setHeader(header, value) {
    axios.defaults.headers.common[header] = value;
  },

  /**
   * Set the Authorization header with a Bearer token.
   */
  setAccessToken(accessToken) {
    this.setHeader('Authorization', `Bearer ${accessToken}`);
  },

  /**
   * Remove all headers.
   */
  removeHeader() {
    axios.defaults.headers.common = {};
  },

  /**
   * Remove a single header.
   */
  removeSingleHeader(header) {
    delete axios.defaults.headers.common[header];
  },

  /**
   * Login using the provided CAS token.
   */
  login(searchString) {
    return axios.get(
      `${import.meta.env.VITE_AUTH_API}/auth/cas/callback-clockwork` + searchString,{withCredentials: true}
    );
  },

  /**
   * Login as a supervisor using the provided CAS token.
   */
  loginSupervisor(casToken) {
    return axios.post(
      `${import.meta.env.VITE_AUTH_API}/auth/cas/logging-in`,
      null,
      {
        params: { code: casToken },
      }
    );
  },

  /**
   * Delete the current user's account.
   */
  deleteAccount(userId) {
    return axios.delete(`${import.meta.env.VITE_AUTH_API}/users/${userId}`);
  },

  /**
   * Retrieve data about the currently authenticated user.
   */
  getUser() {
    return axios.get(`${import.meta.env.VITE_AUTH_API}/auth/me`);
  },

  /**
   * Refresh the access token.
   */
  refreshToken(token) {
    return axios.get(`${import.meta.env.VITE_AUTH_API}/auth/refresh`, {
      params: { token },
    });
  },

  /**
   * Update the current user's information.
   */
  updateUser(userData, userId) {
    return axios.put(
      `${import.meta.env.VITE_AUTH_API}/users/${userId}`,
      userData
    );
  },

  /**
   * Partially update the current user's information.
   */
  updateUserPartially(userData, userId) {
    return axios.patch(
      `${import.meta.env.VITE_AUTH_API}/users/${userId}`,
      userData
    );
  },

  /**
   * Logout the current user by removing the token and headers.
   */
  logout() {
    this.removeHeader();
  },

  getAuthorizationUrl() {
    const REDIRECT_URI = `${import.meta.env.VITE_PUBLIC_URL}/logging-in`;
    return axios.get(`${import.meta.env.VITE_AUTH_API}/authorize`, {
      withCredentials: true,
      params: {
        redirect_uri: REDIRECT_URI,
      },
    });
  },
};

export default AuthApiService;

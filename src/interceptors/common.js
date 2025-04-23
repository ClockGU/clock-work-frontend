import store from "@/store";
import { log } from "@/utils/log";

export function attachAuthInterceptor(axiosInstance) {
  log("Mounting interceptor on instance");

  const interceptor = axiosInstance.interceptors.response.use(
    (response) => {
      log("Interceptor: resolved");
      return response;
    },
    async (error) => {
      log("Interceptor: rejected");

      const { data } = error.response || {};
      const originalRequest = error.config;

      const tokenNotValid = data?.code === "token_not_valid";
      const accessTokenExpired = data?.detail === "Given token not valid for any token type";
      const refreshTokenExpired = data?.detail === "Token is invalid or expired";
      const isArrayBuffer = data instanceof ArrayBuffer;

      // Handle access token expiration
      if (
        (tokenNotValid && accessTokenExpired) ||
        (error.response?.status === 401 && isArrayBuffer)
      ) {
        try {
          const refreshResponse = await store.dispatch("auth/refreshTokens");
          log("Retrying original request after token refresh");

          return axiosInstance({
            ...originalRequest,
            headers: isArrayBuffer
              ? {}
              : {
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: `Bearer ${refreshResponse.accessToken}`,
              },
            responseType: isArrayBuffer ? "arraybuffer" : undefined,
          });
        } catch (refreshError) {
          log("Token refresh failed", refreshError);

          if (refreshError.response?.status === 401) {
            await store.dispatch("auth/LOGOUT");
          }

          return Promise.reject(refreshError);
        }
      }

      // Handle refresh token expiration
      if (tokenNotValid && refreshTokenExpired) {
        await store.dispatch("auth/LOGOUT");
      }

      return Promise.reject(error);
    }
  );

  // Return unmount method
  return () => {
    log("Unmounting interceptor");
    axiosInstance.interceptors.response.eject(interceptor);
  };
}

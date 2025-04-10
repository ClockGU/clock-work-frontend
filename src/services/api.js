import axios from "axios";
import store from "@/store";
//import i18n from "@/plugins/i18n";
import { log } from "@/utils/log";

const ApiService = {
  _interceptor: null,
  _anonymousInterceptor: null,

  init(baseURL) {
    axios.defaults.baseURL = baseURL;
    axios.defaults.headers.common["Accept-Language"] ="de";
  },
  setHeader(header, value) {
    return new Promise((resolve) => {
      axios.defaults.headers.common[header] = value;
      resolve();
    });
  },
  setAccessToken(accessToken) {
    this.setHeader("Authorization", `Bearer ${accessToken}`);
  },
  removeHeader() {
    axios.defaults.headers.common = {};
  },
  removeSingleHeader(header) {
    delete axios.defaults.headers.common[header];
  },
  get(resource, config = {}) {
    log("ApiService.get called", resource);
    return axios.get(resource, config);
  },
  post(resource, data, config = {}) {
    log("ApiService.post called", resource);
    return axios.post(resource, data, config);
  },
  put(resource, data, config = {}) { 
    log("ApiService.put called", resource);
    return axios.put(resource, data, config);
  },
  patch(resource, data, config = {}) {
    log("ApiService.patch called", resource);
    return axios.patch(resource, data, config);
  },

  delete(resource, config = {}) {
    log("ApiService.delete called", resource);
    return axios.delete(resource, config);
  },
  customRequest(data, config = {}) {
    log("ApiService.customRequest called");
    return axios(data, config);
  },

  mountInterceptor() {
    log("Mounting interceptor");
    this._401interceptor = axios.interceptors.response.use(
      (response) => {
        log("_interceptor: resolved");
        return response;
      },
      async (error) => {
        log("_interceptor: rejected");

        const { data } = error.response;

        const tokenNotValid = data.code === "token_not_valid";
        const accessTokenExpired =
          data.detail === "Given token not valid for any token type";
        const refreshTokenExpired =
          data.detail === "Token is invalid or expired";
        const isArrayBuffer = data instanceof ArrayBuffer;

        if (
          (tokenNotValid && accessTokenExpired) ||
          (error.response.status === 401 && isArrayBuffer)
        ) {
          return store
          //TODO: make api call to refresh token
            .dispatch("auth/refreshTokens")
            .then((response) => {
              const { config: originalRequest } = error;

              // Retry the request
              log("retrying request");
              return axios(
                {
                  ...originalRequest,
                  headers: isArrayBuffer
                    ? {}
                    : {
                        "Content-Type": "application/json;charset=UTF-8"
                      },
                  responseType: isArrayBuffer ? "arraybuffer" : undefined
                },
                {}
              ).catch((error) => {
                // If the retried request fails, reject the Promise
                return Promise.reject(error);
              });
            })
            .catch(async (error) => {
              // Now that the token refresh Promise failed, check that the
              // reponse status is 401 (UNAUTHORIZED). If it is, logout the
              // user, because we could not get a new refresh token for them.
              //
              // In any other case, just reject the Promise and let the caller
              // handle it. Here, the retried request from above succeeded, but
              // returned a non 2xx/401 response. This does not mean, that we
              // need to logout the user!
              if (error.response.status === 401) {
                await store.dispatch("auth/LOGOUT").catch((error) => {
                  log(
                    "Experienced error while logging out in refreshToken-refresh catch: ",
                    error
                  );
                });
              }
              return Promise.reject(error);
            });
        }

        if (tokenNotValid && refreshTokenExpired) {
          await store.dispatch("logout").catch((error) => {
            log(
              "Experienced error while logging out due to expired refreshToken: ",
              error
            );
          });

          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    );
  },
  unmountInterceptor() {
    log("Unmounting interceptor");
    axios.interceptors.response.eject(this._interceptor);
  }
};

export default ApiService;
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
        log("error", error);
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
            .dispatch("auth/REFRESH_TOKEN")
            .then((response) => {
              const { access_token } = response.data;
              const { config: originalRequest } = error;

              // Set new access token
              originalRequest.headers["Authorization"] = `Bearer ${access_token}`;

              // Retry the request
              log("retrying request");
              return this.customRequest({
                ...originalRequest,
                headers: isArrayBuffer
                  ? {}
                  : {
                      "Content-Type": "application/json;charset=UTF-8"
                    },
                responseType: isArrayBuffer ? "arraybuffer" : undefined
              }).catch((error) => {
                // If the retried request fails, reject the Promise
                return Promise.reject(error);
              });
            })
            .catch(async (error) => {
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
          await store.dispatch("auth/LOGOUT").catch((error) => {
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
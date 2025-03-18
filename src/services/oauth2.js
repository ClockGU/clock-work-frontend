import ApiService from "@/services/api";

const REDIRECT_URI = `${import.meta.env.VITE_PUBLIC_URL}/logging-in`;
const url ="http://127.0.0.1:8000/authorize"

const OAuth2Service = {
  getAuthorizationUrl: function () {
    return ApiService.get(url, {
      params: {
        redirect_uri: REDIRECT_URI
      }
    });
  }
};

export default OAuth2Service;
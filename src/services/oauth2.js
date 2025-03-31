import ApiService from "@/services/api";

const REDIRECT_URI = `${import.meta.env.VITE_PUBLIC_URL}/logging-in`;

const OAuth2Service = {
  getAuthorizationUrl: function () {
    return ApiService.get("/authorize", {
      params: {
        redirect_uri: REDIRECT_URI
      }
    });
  }
};

export default OAuth2Service;


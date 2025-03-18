import ApiService from "@/services/api";


const REDIRECT_URI = `https://localhost:5000/logging-in`;

const OAuth2Service = {
  getAuthorizationUrl: function () {
    return ApiService.get(`/authorize?redirect_uri=${REDIRECT_URI}`);
  }
};

export default OAuth2Service;
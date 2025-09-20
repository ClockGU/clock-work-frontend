import axios from 'axios';
import { log } from '@/utils/log';

// Create a scoped Axios instance for the Content API
const contentApi = axios.create({
  baseURL: import.meta.env.VITE_CONTENT_API, // or hardcode your content baseURL
  headers: {
    'Accept-Language': 'de',
  },
});

const ContentApiService = {
  setHeader(header, value) {
    contentApi.defaults.headers.common[header] = value;
  },

  setAccessToken(accessToken) {
    this.setHeader('Authorization', `Bearer ${accessToken}`);
  },

  removeHeader() {
    contentApi.defaults.headers.common = {};
  },

  removeSingleHeader(header) {
    delete contentApi.defaults.headers.common[header];
  },

  get(resource, config = {}) {
    log('ContentApiService.get called', resource);
    return contentApi.get(resource, config);
  },

  post(resource, data, config = {}) {
    log('ContentApiService.post called', resource);
    return contentApi.post(resource, data, config);
  },

  put(resource, data, config = {}) {
    log('ContentApiService.put called', resource);
    return contentApi.put(resource, data, config);
  },

  patch(resource, data, config = {}) {
    log('ContentApiService.patch called', resource);
    return contentApi.patch(resource, data, config);
  },

  delete(resource, config = {}) {
    log('ContentApiService.delete called', resource);
    return contentApi.delete(resource, config);
  },

  customRequest(config = {}) {
    log('ContentApiService.customRequest called');
    return contentApi(config);
  },

  getAxiosInstance() {
    return contentApi;
  },
};

export default ContentApiService;

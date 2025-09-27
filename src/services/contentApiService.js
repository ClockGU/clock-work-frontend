import axios from 'axios';
import { log } from '@/utils/log';

const ContentApiService = {
  get(resource, config = {}) {
    log('ContentApiService.get called', resource);
    return axios.get(`${import.meta.env.VITE_CONTENT_API}${resource}`, config);
  },

  post(resource, data, config = {}) {
    log('ContentApiService.post called', resource);
    return axios.post(`${import.meta.env.VITE_CONTENT_API}${resource}`, data, config);
  },

  put(resource, data, config = {}) {
    log('ContentApiService.put called', resource);
    return axios.put(`${import.meta.env.VITE_CONTENT_API}${resource}`, data, config);
  },

  patch(resource, data, config = {}) {
    log('ContentApiService.patch called', resource);
    return axios.patch(`${import.meta.env.VITE_CONTENT_API}${resource}`, data, config);
  },

  delete(resource, config = {}) {
    log('ContentApiService.delete called', resource);
    return axios.delete(`${import.meta.env.VITE_CONTENT_API}${resource}`, config);
  },

  customRequest(config = {}) {
    log('ContentApiService.customRequest called');
    return axios(config);
  },
};

export default ContentApiService;
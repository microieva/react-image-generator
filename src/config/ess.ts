import env from "../utils/env";


const API_BASE_URL = env.isProduction 
  ? ''  
  : 'http://127.0.0.1:8000';  

export const createEventSource = (url:string, options = {}) => {
  const baseURL = API_BASE_URL;
  const fullUrl = baseURL + url;
  return new EventSource(fullUrl, options);
};
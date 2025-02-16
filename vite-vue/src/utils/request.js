import axios from 'axios';
import { ElMessage } from 'element-plus';

const timeout = 5000

const axiosInstance = axios.create({
  baseURL: 'https://test-ijournal-service.topeditsci.com',
  timeout
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // 请求错误时处理
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error)
    if(error.message == `timeout of ${timeout}ms exceeded`) {
      ElMessage.error('请求超时');
    } else {
      // 其他错误
      ElMessage.error('未知错误');
      console.error('Error:', error.message);
    }
    return Promise.reject(error); // 抛出错误
  }
);

export default axiosInstance;

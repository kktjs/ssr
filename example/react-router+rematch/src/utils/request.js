import axios from 'axios';

let HOST = process.env.HOST;

// Ensure host consistency.
if (typeof window !== 'undefined' && window.location && window.location.hostname) {
  HOST = window.location.hostname;
}

axios.defaults.baseURL = `http://${HOST}:${process.env.PORT}`;

// 拼接url参数
function splitUrl(url, options) {
  let urlNew = url;
  const paramsArray = [];
  Object.keys(options).forEach(key => paramsArray.push(`${key}=${options[key]}`));
  if (Object.keys(options).length === 0) {
    return url;
  }
  if (/\?/.test(urlNew) === false) {
    urlNew = `${urlNew}?${paramsArray.join('&')}`;
  } else {
    urlNew += `&${paramsArray.join('&')}`;
  }
  return urlNew;
}


// Get the current location.
// const location = history.location;
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options = {}) {
  const method = options.method || 'GET';
  const newOptions = {
    url,
    method,
    data: options.body,
    headers: {
      'Content-Type': options.headers && options.headers.ContentType ? options.headers.ContentType : 'application/json; charset=utf-8',
      Accept: 'application/json',
    },
  };

  if (/(GET)/.test(method)) {
    newOptions.url = splitUrl(url, { ...options.body });
    delete newOptions.body;
  }

  return axios.request(newOptions)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      const response = err.response || {};
      if (response && response.status >= 200 && response.status < 300) {
        return response;
      }
      const errortext = codeMessage[response.status] || response.statusText;
      // The server renders the error output.
      if (typeof window === 'undefined') {
        console.log('request--> :', axios.defaults.baseURL); // eslint-disable-line
        console.log('request--> :', response.status, errortext); // eslint-disable-line
        console.log('request--> :', response.statusText); // eslint-disable-line
      }
      if (typeof window !== 'undefined') {
        if (response && response.data) {
          return response.data;
        }
      }
      const error = new Error(errortext);
      error.name = response.status;
      error.response = response;
      if (response.data) {
        // response.data
        return '';
      }
      throw error;
    });
}

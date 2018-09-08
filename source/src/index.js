import { route } from 'preact-router';
import App from './components/app';
import { AppStore } from './lib/store';
import http from 'fetch-bb';
import 'style/index.styl';

const HTTP_UNAUTHORIZED_CODE = 401;

http.responseInterceptor = async (response, status) => {
  if (status === HTTP_UNAUTHORIZED_CODE) {
    // AppStore.remove('token');
    let shortName = AppStore.get('shortName');
    if (Object.keys(shortName).length === 0 && shortName.constructor === Object) {
      route('/admin/login');
    }
    else {
      route(`/${shortName}/login`);
    }
    return response;
  }
  return response;
};

http.requestInterceptor = async (httpConfig) => {
  httpConfig.headers.push({
    name: 'Authorization',
    value: AppStore.get('token').token
  });
  httpConfig.headers.push({
    name: 'Content-Type',
    value: 'application/json'
  });
  return '';
};

export default App;

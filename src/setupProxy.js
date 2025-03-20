const { createProxyMiddleware } = require('http-proxy-middleware');
import BASE_URL from './config';
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.BASE_URL,
      changeOrigin: true,
    })
  );
};
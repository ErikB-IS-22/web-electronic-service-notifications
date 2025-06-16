const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Проксировать API-запросы
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://web:8000',
      changeOrigin: true,
    })
  );

  // Проксировать медиа-файлы
  app.use(
    '/media',
    createProxyMiddleware({
      target: 'http://web:8000',
      changeOrigin: true,
    })
  );
};

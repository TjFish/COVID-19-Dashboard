module.exports = {
  transpileDependencies: ['vuetify'],
  chainWebpack: config => {
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .options({
        fix: true
      });
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/COVID-19-Dashboard/'
    : '/'
};

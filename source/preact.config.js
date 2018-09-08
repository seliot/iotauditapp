import ButternutWebpackPlugin from 'butternut-webpack-plugin';

export default (config, env, helpers) => {
  let { index } = helpers.getPluginsByName(config, 'UglifyJsPlugin')[0] || 0;
  // console.log(plugin.options);
  if (index) {
    config.plugins.splice(index, 1);
    config.plugins.push(new ButternutWebpackPlugin());
  }
};

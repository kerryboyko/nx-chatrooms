import dotenv from 'dotenv';
import { EnvironmentPlugin } from 'webpack';

dotenv.config();

const override = (config, env) => {
  return {
    ...config,
    plugins: config.plugins.concat(new EnvironmentPlugin(Object.keys(env))),
  };
};

module.exports = override;

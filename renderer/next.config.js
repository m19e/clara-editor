const withTM = require("next-transpile-modules")(["react-daisyui"]);

module.exports = withTM({
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
    }

    return config;
  },
});

export default function webpack(config) {
  config.resolve.fallback = {
    aws4: false,
  };

  return config;
}

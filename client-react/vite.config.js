// https://vite.dev/config/
export default {
  server: {
    Proxy: {
      "/api": "http://localhost:5000",
    },
  },
};

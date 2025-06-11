const conf = {
  server1Url: String(import.meta.env.VITE_SERVER1_API),
  server2Url: String(import.meta.env.VITE_SERVER2_API),
  server2Socket: String(import.meta.env.VITE_SERVER2_SOCKET),
}

const configWithHeaders = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

const configWithoutHeaders = {
  withCredentials: true,
};

export { conf, configWithHeaders, configWithoutHeaders };
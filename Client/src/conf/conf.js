const conf = {
  server1Url: 'https://vibespacehttp.techynimbus.com/api/v3',
  server2Url: 'https://vibespaceio.techynimbus.com/api/v3',
  server2Socket: 'wss://vibespaceio.techynimbus.com/', 
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

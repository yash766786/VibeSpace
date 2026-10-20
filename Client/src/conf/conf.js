const conf = {
  // server1Url: 'https://vibespacehttp.techynimbus.com/api/v3',
  // server2Url: 'https://vibespaceio.techynimbus.com/api/v3',
  // server2Socket: 'wss://vibespaceio.techynimbus.com/', 
  server1Url: 'http://localhost:5000/api/v4',
  server2Url: 'http://localhost:9021/api/v4',
  server2Socket: 'http://localhost:9021/', 
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

module.exports = {
    mongodbMemoryServerOptions: {
      instance: {
        dbName: 'jest'
      },
      binary: {
        version: '5.10.0', // Version of MongoDB
        skipMD5: true
      },
      autoStart: false
    }
  };
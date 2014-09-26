'use strict';

var env = require('./config.json');

var environmentConfig = null;

(function () {
    var nodeEnvironment = process.env.NODE_ENV || 'development';
    console.log('Starting server in "' + nodeEnvironment + '" mode');
    environmentConfig = env[nodeEnvironment];
})();

module.exports = {
    environment: function () {
        return environmentConfig;
    },
    privateKey: function () {
      return 'fN9u8gmUFMvXCgNS8SAWkE96535Ttul5lNzpWeP2';
    }
};

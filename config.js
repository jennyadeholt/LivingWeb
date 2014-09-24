'use strict';

var env = require('./config.json');

var environmentConfig = null;

(function () {
    var nodeEnvironment = process.env.TWEETWALL_NODE_ENV || 'development';
    console.log('Starting server in "' + nodeEnvironment + '" mode');
    environmentConfig = env[nodeEnvironment];
})();

module.exports = {
    environment: function () {
        return environmentConfig;
    }
};

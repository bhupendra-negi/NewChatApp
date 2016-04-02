//responsible for config for mode
module.exports = require("./"+ (process.env.NODE_ENV || 'development') + '.json');

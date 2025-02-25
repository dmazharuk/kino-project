const jwtConfig = require('./jwtConfig');

module.exports = {
  access: {
    httpOnly: true,
    maxAge: jwtConfig.access.expiresIn,
  },
  refresh: {
    httpOnly: true,
    maxAge: jwtConfig.refresh.expiresIn,
  },
};

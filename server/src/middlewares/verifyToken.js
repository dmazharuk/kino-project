const jwt = require('jsonwebtoken');

const verifyRefreshToken = (req, res, next) => {
  try {
    const { refreshToken } = req.cookies; // по ключу рефреш значение из cookie
    const { user } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    res.locals.user = user;
    next();
  } catch (error) {
    console.error('Invalid refresh token', error);
    res.clearCookie('refreshToken').sendStatus(401);
  }
};

const verifyAccessToken = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    const { user } = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
    res.locals.user = user;
    next();
  } catch (error) {
    console.error('Invalid refresh token', error);
    res.status(401).end();
  }
};

module.exports = {
  verifyRefreshToken,
  verifyAccessToken,
};

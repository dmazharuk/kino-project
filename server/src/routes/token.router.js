const { verifyRefreshToken } = require('../middlewares/verifyToken');
const generateToken = require('../../utils/generateToken');
const { refresh } = require('../../configs/cookiesConfig');

const router = require('express').Router();

router.get('/refresh', verifyRefreshToken, async (req, res) => {
  try {
    const { accessToken, refreshToken } = generateToken({
      user: res.locals.user,
    });
    res
      .cookie('refreshToken', refreshToken, refresh)
      .json({ user: res.locals.user, accessToken });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

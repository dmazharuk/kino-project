const router = require('express').Router();
const { User } = require('../../db/models');
const { refresh } = require('../../configs/cookiesConfig');
const bcrypt = require('bcrypt');
const generateToken = require('../../utils/generateToken');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../utils/sendEmail');

router.post('/signup', async (req, res) => {
  try {
    const { login, email, password } = req.body;

    if (!(login && email && password)) {
      return res.status(400).json({ message: 'All fields must be provided.' });
    }

    const userLogin = await User.findOne({
      where: { login },
    });

    if (userLogin) {
      return res
        .status(400)
        .json({ message: `User with login ${login} is already exists.` });
    }

    const [user, isCreated] = await User.findOrCreate({
      where: { email },
      defaults: {
        login,
        email,
        password: await bcrypt.hash(password, 10),
        isEmailConfirmed: false,
      },
    });

    if (!isCreated) {
      return res
        .status(400)
        .json({ message: `User with email ${email} is already exists.` });
    }

    const emailConfirmationToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const confirmationLink = `http://localhost:5173/confirm-email/${emailConfirmationToken}`;
    await sendEmail({
      to: email,
      subject: 'Подтверждение email',
      text: `Пожалуйста, подтвердите ваш email, перейдя по ссылке: ${confirmationLink}`,
    });

    const plainUser = user.get({ plain: true });
    delete plainUser.password;
    delete plainUser.resetPasswordToken;
    delete plainUser.resetPasswordExpires;

    const { accessToken, refreshToken } = generateToken({ user: plainUser });

    res
      .cookie('refreshToken', refreshToken, refresh)
      .json({ user: plainUser, accessToken });
    res.end();
    return 'done';
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
    return error;
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!(login && password)) {
      return res.status(400).json({ message: 'All fields must be provided.' });
    }

    const user = await User.findOne({ where: { login } });
    if (!user) {
      return res.status(400).json({
        message: `User with login - ${login} is not defined.`,
      });
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(400).json({
        message: `Incorrect password.`,
      });
    }

    const plainUser = user.get({ plain: true });
    delete plainUser.password;
    delete plainUser.resetPasswordToken;
    delete plainUser.resetPasswordExpires;
    const { accessToken, refreshToken } = generateToken({ user: plainUser });
    res
      .cookie('refreshToken', refreshToken, refresh)
      .json({ user: plainUser, accessToken });
    return 'done';
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
    return error;
  }
});

router.get('/signout', (req, res) => {
  try {
    res.clearCookie('refreshToken').sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get('/confirm-email', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Токен не предоставлен' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(400).json({ message: 'Неверный токен', err });
  }

  const user = await User.findByPk(decoded.userId);

  if (!user) {
    return res.status(400).json({ message: 'Пользователь не найден' });
  }

  if (user.isEmailConfirmed) {
    return res.status(400).json({ message: 'Email уже подтвержден' });
  }

  user.isEmailConfirmed = true;
  await user.save();

  res.status(200).json({ message: 'Email успешно подтвержден!' });
  return 'done';
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Пользователь с таким email не найден.' });
    }

    const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_PASS, {
      expiresIn: '1h',
    });

    await User.update(
      { resetPasswordToken: resetToken, resetPasswordExpires: Date.now() + 3600000 },
      { where: { email } },
    );

    const confirmationLink = `http://localhost:5173/recover/${resetToken}`;
    await sendEmail({
      to: email,
      subject: 'Восстановление пароля',
      text: `Для восстановления пароля перейдите по ссылке: ${confirmationLink}`,
    });

    res.status(200).json({
      message: 'Письмо с инструкциями по восстановлению пароля отправлено на ваш email.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка на сервере. Пожалуйста, попробуйте позже.' });
  }
  return 'done';
});

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
    });

    if (!user || user.resetPasswordExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: 'Недействительный или просроченный токен.' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Пароль успешно изменен.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка на сервере. Пожалуйста, попробуйте позже.' });
  }
  return 'done';
});

module.exports = router;

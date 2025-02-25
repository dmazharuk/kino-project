const router = require('express').Router();
const { Friend, User } = require('../../db/models');

router.get('', async (req, res) => {
  const { userId, friendId } = req.query;
  try {
    const freind = await Friend.findOne({
      where: { userId, friendId },
    });
    res.status(200).json(freind);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

router.post('/', async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    const [freind] = await Friend.findOrCreate({
      where: { userId, friendId },
      defaults: {
        userId,
        friendId,
      },
    });
    res.status(200).json(freind);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

router.delete('/', async (req, res) => {
  const { userId, friendId } = req.body;
  try {
    await Friend.destroy({ where: { userId, friendId } });
    res.status(200).json({ message: `Подписка удалена` });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

router.get('/subscriptions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const allUsers = await User.findAll({
      include: {
        model: User,
        as: 'friends',
        attributes: ['id', 'login'],
      },
      where: { id },
      attributes: ['id', 'login'],
    });

    const users = allUsers.map((el) => el.get({ plain: true }));
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

router.get('/followers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const allUsers = await User.findAll({
      include: {
        model: User,
        as: 'followers',
        attributes: ['id', 'login'],
      },
      where: { id },
      attributes: ['id', 'login'],
    });

    const users = allUsers.map((el) => el.get({ plain: true }));
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;

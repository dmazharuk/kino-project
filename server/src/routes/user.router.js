const router = require('express').Router();
const { User, Friend } = require('../../db/models');

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    const flatUser = user.get({ plain: true });
    delete flatUser.password;
    delete flatUser.resetPasswordToken;
    delete flatUser.resetPasswordExpires;
    res.status(200).json(flatUser);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

router.get('/friend/:login', async (req, res) => {
  const { login } = req.params;
  try {
    const user = await User.findOne({ where: { login }, attributes: ['id', 'login'] });
    const flatUser = user.get({ plain: true });
    delete flatUser.password;
    delete flatUser.resetPasswordToken;
    delete flatUser.resetPasswordExpires;
    res.status(200).json(flatUser);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

router.get('/', async (req, res) => {
  try {
    const allUsers = await User.findAll({ attributes: ['id', 'login'] });
    const users = allUsers.map((el) => el.get({ plain: true }));
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.destroy({ where: { id } });
    if (deletedUser) {
      res.status(200).json({ message: `User with id:${id} deleted!` });
    } else {
      res.status(400).json({ warningMessage: `User with id:${id} not found!` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});





module.exports = router;

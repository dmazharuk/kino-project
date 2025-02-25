const router = require('express').Router();
const { Movie } = require('../../db/models');

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const allWishs = await Movie.findAll({ where: { userId: id, wish: true } });
    const wishs = allWishs.map((el) => el.get({ plain: true }));
    res.status(200).json(wishs);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

router.post('/', async (req, res) => {
  const { userId, movieId, type } = req.body;
  try {
    let wish;
    const movie = await Movie.findOne({
      where: { userId, movieId, type },
    });
    if (movie) {
      wish = await Movie.update({ wish: true }, { where: { userId, movieId, type } });
    } else {
      wish = await Movie.create({ userId, movieId, wish: true, type });
    }
    res.status(201).json(wish);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

router.put('/', async (req, res) => {
  const { userId, movieId, type } = req.body;
  try {
    await Movie.update({ wish: false }, { where: { userId, movieId, type } });
    res.status(200).json({ message: `Фильм удален из списка` });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;

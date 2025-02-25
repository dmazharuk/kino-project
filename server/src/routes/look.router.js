const router = require('express').Router();
const { Movie } = require('../../db/models');

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const allLooks = await Movie.findAll({ where: { userId: id, look: true } });
    const looks = allLooks.map((el) => el.get({ plain: true }));
    res.status(200).json(looks);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

router.post('/', async (req, res) => {
  const { userId, movieId, type, viewed, total } = req.body;
  try {
    let look;
    const movie = await Movie.findOne({
      where: { userId, movieId, type },
    });
    if (movie) {
      look = await Movie.update(
        { look: true, wish: false, viewed, total },
        { where: { userId, movieId, type } },
      );
    } else {
      look = await Movie.create({ userId, movieId, type, look: true, viewed, total });
    }
    res.status(201).json(look);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

router.put('/', async (req, res) => {
  const { userId, movieId, type } = req.body;
  try {
    await Movie.update(
      { look: false, viewed: null, total: null },
      { where: { userId, movieId, type } },
    );
    res.status(200).json({ message: `Фильм удален из списка` });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;

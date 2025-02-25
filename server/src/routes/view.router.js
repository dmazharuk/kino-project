const router = require('express').Router();
const { Movie } = require('../../db/models');

router.get('', async (req, res) => {
  const { userId, movieId } = req.query;
  try {
    const movie = await Movie.findOne({ where: { userId, movieId } });
    res.status(200).json(movie);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const allView = await Movie.findAll({ where: { userId: id, view: true } });
    const views = allView.map((el) => el.get({ plain: true }));
    res.status(200).json(views);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

router.post('/', async (req, res) => {
  const { userId, movieId, type } = req.body;
  try {
    const movie = await Movie.findOne({
      where: { userId, movieId, type },
    });
    if (movie) {
      await Movie.update(
        { view: true, wish: false, look: false },
        { where: { userId, movieId, type } },
      );
    } else {
      await Movie.create({ userId, movieId, view: true, type });
    }
    const movieUser = await Movie.findOne({
      where: { userId, movieId, type },
    });
    res.status(201).json(movieUser);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

router.put('/', async (req, res) => {
  const { userId, movieId, type } = req.body;
  try {
    await Movie.update(
      { view: false, advice: false },
      { where: { userId, movieId, type } },
    );
    res.status(200).json({ message: `Фильм удален из просмотренных` });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;

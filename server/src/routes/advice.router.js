const router = require('express').Router();
const { Movie, sequelize } = require('../../db/models');

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const allAdvices = await Movie.findAll({ where: { userId: id, advice: true } });
    const advices = allAdvices.map((el) => el.get({ plain: true }));
    res.status(200).json(advices);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

router.post('/', async (req, res) => {
  const { userId, movieId } = req.body;
  try {
    const advice = await Movie.update({ advice: true }, { where: { userId, movieId } });
    res.status(201).json(advice);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

router.put('/', async (req, res) => {
  const { userId, movieId } = req.body;
  try {
    await Movie.update({ advice: false }, { where: { userId, movieId } });
    res.status(200).json({ message: `Фильм удален из рекомедаций` });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

router.get('/', async (req, res) => {
  try {
    const allAdvices = await Movie.findAll({
      attributes: [
        'movieId',
        'type',
        [sequelize.fn('COUNT', sequelize.col('advice')), 'count'],
      ],
      where: { advice: true },
      group: ['movieId', 'type'],
      order: [['count', 'DESC']],
      limit: 4,
     
    });
    const advices = allAdvices.map((el) => el.get({ plain: true }));
    res.status(200).json(advices);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;

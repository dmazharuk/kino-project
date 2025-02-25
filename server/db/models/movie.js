'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'userId' });
    }
  }
  Movie.init(
    {
      userId: DataTypes.INTEGER,
      movieId: DataTypes.INTEGER,
      type: DataTypes.STRING,
      viewed: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      look: DataTypes.BOOLEAN,
      view: DataTypes.BOOLEAN,
      advice: DataTypes.BOOLEAN,
      wish: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Movie',
    },
  );
  return Movie;
};

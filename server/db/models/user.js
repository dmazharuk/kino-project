'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Friend, Movie }) {
      this.belongsToMany(User, {
        through: Friend,
        as: 'friends',
        foreignKey: 'userId',
        otherKey: 'friendId',
      });

      this.belongsToMany(User, {
        through: Friend,
        as: 'followers',
        foreignKey: 'friendId',
        otherKey: 'userId',
      });

      this.hasMany(Movie, { foreignKey: 'userId' });
    }
  }
  User.init(
    {
      login: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isEmailConfirmed: DataTypes.BOOLEAN,
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExpires: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Likes.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user"
      });

      Likes.belongsTo(models.Post, {
        foreignKey: "PostId"
      });

    }
  }
  Likes.init({
    userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    postId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'Likes',
  });
  return Likes;
};
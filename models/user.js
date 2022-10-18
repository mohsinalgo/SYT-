'use strict';
const { Model } = require('sequelize');
const jwt = require('jsonwebtoken')
const Joi = require('joi')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, {
        // foreignKey: "userId",
        as: "posts",
        onDelete: 'CASCADE'
      });

      User.hasMany(models.Likes, {
        foreignKey: "userId",
        onDelete: 'CASCADE'
      });
      
    }
  }
  User.init({
    userName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Please fill out the mandatory fields", //"Please enter First Name",
        },
      }
    },
    fullName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Please fill out the mandatory fields", //"Please enter First Name",
        },
      }
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Please fill out the mandatory fields", //"Please enter First Name",
        },
        isEmail: {
          msg: "Incorrect email address",
        },
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [[8, 100]],
          msg: "minimum of 8 characters are required.",
        },
        notNull: true,
        notEmpty: {
          msg: "Please fill out the mandatory fields", //"Please enter First Name",
        },
      }
    },
    dob: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Please fill out the mandatory fields", //"Please enter First Name",
        },
      }
    },
    country: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Please fill out the mandatory fields", //"Please enter First Name",
        },
      }
    },
    division: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Please fill out the mandatory fields", //"Please enter First Name",
        },
      }
    },
    team: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Please fill out the mandatory fields", //"Please enter First Name",
        },
      }
    },
    level: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Please fill out the mandatory fields", //"Please enter First Name",
        },
      }
    },
    season: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Please fill out the mandatory fields", //"Please enter First Name",
        },
      }
    },
    position: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Please fill out the mandatory fields", //"Please enter First Name",
        },
      }
    },
    goal: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Please fill out the mandatory fields", //"Please enter First Name",
        },
      }
    },
    numberOfplayedMatches: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Please fill out the mandatory fields", //"Please enter First Name",
        },
      }
    },
    yellowCard: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Please fill out the mandatory fields", //"Please enter First Name",
        },
      }
    },
    redCard: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Please fill out the mandatory fields", //"Please enter First Name",
        },
      }
    },
    height: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Please fill out the mandatory fields", //"Please enter First Name",
        },
      }
    },
    weight: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "Please fill out the mandatory fields", //"Please enter First Name",
        },
      }
    },


  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};

module.exports.validateUser = (user) => {
  const validator = Joi.object().keys({
    userName: Joi.string().required().label("User Name"),
    fullName: Joi.string().required().label('Full Name'),
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().required().label('Password'),
    dob: Joi.string().required().label('Date of Birth'),
    country: Joi.string().required().label('Country'),
    division: Joi.string().required().label('Division'),
    team: Joi.string().required().label('Team'),
    level: Joi.string().required().label('Level'),
    season: Joi.string().required().label('Season'),
    position: Joi.string().required().label('Position'),
    goal: Joi.string().required().label('Goal'),
    numberOfplayedMatches: Joi.string().required().label('Number Of PlayedMatches'),
    yellowCard: Joi.string().required().label('Yellow Card'),
    redCard: Joi.string().required().label('Red Card'),
    height: Joi.string().optional().label('Height'),
    weight: Joi.string().optional().label('Weight'),
  });
  return validator.validate(user, { abortEarly: false, });
}

module.exports.generateAuthToken = (user) => {
  const userObj = user.dataValues
  delete userObj.password
  const token = jwt.sign(userObj, 'privateKey');
  return { userObj, token }
}

// exports.validateUser = validateUser
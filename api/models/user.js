const bcrypt = require('bcrypt');

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /*
    static resetAutoIncrement = async function() {
      await sequelize.query(`ALTER SEQUENCE ${this.users}_id_seq RESTART WITH 1`);
    } 
      
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Envelope, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
      User.hasMany(models.Transaction, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
    }
  }
  User.init({
    first: DataTypes.STRING,
    last: DataTypes.STRING,
    email: DataTypes.STRING,
    hash: DataTypes.STRING
  }, {
    sequelize,
    timestamps: false,
    modelName: 'User',
  });
  return User;
};



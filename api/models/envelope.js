'use strict';
const {
  Model, BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Envelope extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Envelope.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
      Envelope.hasMany(models.Transaction, {
        foreignKey: 'envelopeId',
        onDelete: 'CASCADE'
      });
    }
  }
  Envelope.init({
    name: DataTypes.STRING,
    monthlyBudget: DataTypes.INTEGER,
    budgetRemaing: DataTypes.INTEGER,
    overspent: DataTypes.BOOLEAN
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Envelope',
  });
  return Envelope;
};
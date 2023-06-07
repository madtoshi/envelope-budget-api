'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
      Transaction.belongsTo(models.Envelope, {
        foreignKey: 'envelopeId',
        onDelete: 'CASCADE'
      });
    }
  }
  Transaction.init({
    envelopeName: DataTypes.STRING,
    amountSpent: DataTypes.INTEGER,
    date: DataTypes.DATE,
    notes: DataTypes.STRING
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Transaction',
  });
  return Transaction;
};
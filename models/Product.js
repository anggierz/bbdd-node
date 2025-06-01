const { DataTypes } = require('sequelize');
const sequelize = require('./index');


const Product = sequelize.define('productos', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
});

module.exports = Product;
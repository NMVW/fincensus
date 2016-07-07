var Sequelize = require('sequelize');

/* Database Models */
exports.Bank = {
  name: {
    type: Sequelize.STRING,
    primaryKey: true,
    autoIncrement: false,
    allowNull: false
  }
};

exports.State = {
  capital: {
    type: Sequelize.STRING,
    primaryKey: true,
    autoIncrement: false,
    allowNull: false
  },
  name: Sequelize.STRING
};

exports.Population = {
  pid: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  population: Sequelize.INTEGER,
  births: Sequelize.INTEGER,
  deaths: Sequelize.INTEGER,
  year: Sequelize.INTEGER
};
  // date -> 2016-01-27T18:14:06.000 when complaint sent to company
exports.Complaint = {
  cid: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  date: Sequelize.DATE,
  report: Sequelize.STRING,
  issue: Sequelize.STRING,
  subIssue: Sequelize.STRING,
  submission: Sequelize.STRING,
  public_response: Sequelize.STRING,
  private_response: Sequelize.STRING
};

exports.Product = {
  name: {
      type: Sequelize.STRING,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false
    }
};

exports.Type = {
  name: {
      type: Sequelize.STRING,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false
    }
};

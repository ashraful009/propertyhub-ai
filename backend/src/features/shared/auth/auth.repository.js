const User = require('./user.model');

const findUserByEmail = async (email, select = '') => {
  return select ? User.findOne({ email }).select(select) : User.findOne({ email });
};

const createUser = async (userData) => {
  return User.create(userData);
};

const saveUser = async (user) => {
  return user.save();
};

module.exports = {
  findUserByEmail,
  createUser,
  saveUser,
};

const bcrypt = require("bcryptjs");
const validateUserInput = (email, password) => {
  return email && password;
};
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
module.exports = { validateUserInput, comparePassword };

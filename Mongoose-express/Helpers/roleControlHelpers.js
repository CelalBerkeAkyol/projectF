// Helpers/roleControlHelpers.js
const isAdmin = (req, res, next) => {
  const userRole = req.user.role; // req.user'dan rolü alın
  
  if (userRole === "admin") {
    return next(); // Yetki varsa, bir sonraki middleware'e geç
  } else {
    return res.status(403).send("You are not authorized to perform this action");
  }
};

module.exports = { isAdmin };
// /middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const {getAccessTokenFromHeader} = require("../Helpers/tokenHelpers");


const getAccessToRoute =(req, res, next) => {
  const access_token = getAccessTokenFromHeader(req);
  if (!access_token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    // kullanıcı verileri decoded içerisinde saklanıyor. 
    const decoded = jwt.verify(access_token, "celalberkeakyol"); // Bu da .env dosyasından alınmalı
    req.user = decoded; 
    return next();

  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

};



module.exports = getAccessToRoute ;
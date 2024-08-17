//auth rotasına gidildiğinde kullanıcı yetkili mi sorgulayacak
const express = require("express");
const router = express.Router();
const { getAccessToRoute, isAdmin } = require("../middlewares/authMiddleware");
const { access_token_using_refresh_token } = require("../Helpers/tokenHelpers");
const {
  login,
  register,
  blocked,
  unblock,
} = require("../controllers/authController"); // token burada oluşturuluyor
const { getUserByIDFromDatabase } = require("../controllers/userController");

// post isteği ile veri tabanına kullanıcı ekleme
router.post("/register", register);

// get isteği ile veri tabanından spesifik kullanıcıları çekme
router.get("/login/:id", getUserByIDFromDatabase);
router.post("/login", login); // Kullanıcının email ve şifre bilgileiri veri tabanı ile eşleşirse giriş yapar
// buraya refresh işlemleri atılacak
router.post("/refresh-token", access_token_using_refresh_token);

// Admin route'u, önce token doğrulaması yapılır, sonra admin kontrolü
router.get("/admin", getAccessToRoute, isAdmin, (req, res) => {
  res.send("Welcome Admin! You have access.");
});
router.get("/default-user", getAccessToRoute, (req, res) => {
  res.send("Welcome default user! You have access.");
});
// idsi gönderilien user banlanır
router.put("/admin/block/:id", getAccessToRoute, isAdmin, blocked);
router.put("/admin/unblock/:id", getAccessToRoute, isAdmin, unblock);
module.exports = router;

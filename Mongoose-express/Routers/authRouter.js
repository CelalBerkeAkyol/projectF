//auth rotasına gidildiğinde kullanıcı yetkili mi sorgulayacak 
const express = require("express");
const router = express.Router();
const tokenCreater = require("../controllers/authController");
const getAccessToRoute = require("../middlewares/authMiddleware");
const { isAdmin } = require("../Helpers/roleControlHelpers");

// Admin route'u, önce token doğrulaması yapılır, sonra admin kontrolü
router.get("/admin", getAccessToRoute, isAdmin, (req, res) => {
    res.send("Welcome Admin! You have access.");
});
router.post("/admin",tokenCreater);
module.exports = router;
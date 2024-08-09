const express = require("express");
const router = express.Router();
const {getUserFromDatabase,postUserToDatabase,deleteUserFromDatabase,updateUserFromDatabase} = require("../controllers/userController");
const verifyToken  = require("../middlewares/authMiddleware"); // kullanıcı kontrolü burada yapılıyor 
const tokenCreater = require("../controllers/authController"); // token burada oluşturuluyor 

// mongo database işlemleri yapılacak 
const mongosee = require("mongoose");
const User = require("../Models/UserSchema");


// get isteği ile veri tabanındaki userları çekme 
router.get("/",getUserFromDatabase );

// post isteği ile veri tabanına kullanıcı ekleme 
router.post("/", postUserToDatabase );

// delete isteği ile kişi silenecek 
router.delete("/:id",deleteUserFromDatabase);

// kullanıcı güncelleme 
router.put("/:id" , updateUserFromDatabase);
  
// delete all user route giriş için şifre ve token alımı 
router.post("/delete-all-users",tokenCreater);

// to do -> token ile kontrol et  
// userRouter'deki tümn veriler yani tüm kullanıcılar silinecek 

router.get("/delete-all-users", verifyToken, async (req, res) => {
  try {
    await User.deleteMany({});
    res.send("All users are deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});




module.exports = router; 
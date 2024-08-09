const express = require("express");
const router = express.Router();
const user = require("./userRouter");
const login = require("./authRouter");
// user işlemleri için userRouter.js dosyasına yönlendirme yapar 
router.use("/user",user); // /user yolu tetiklendiğinde user fonksiyonunu çalıştır ki bu fonksiyon userRouter.js den gelir.
router.use("/login",login);
module.exports = router;
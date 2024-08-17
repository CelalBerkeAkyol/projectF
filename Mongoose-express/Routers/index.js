const express = require("express");
const router = express.Router();
const user = require("./userRouter");
const auth = require("./authRouter");

// user işlemleri için userRouter.js dosyasına yönlendirme yapar
// TO-DO user routesine user login yapmış mı diye kontrol eden bir fonksiyon uygulanabillir mi ?
router.use("/user", user); // /user yolu tetiklendiğinde user fonksiyonunu çalıştır ki bu fonksiyon userRouter.js den gelir.
router.use("/auth", auth);

module.exports = router;

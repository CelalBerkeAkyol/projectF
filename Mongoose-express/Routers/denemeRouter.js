const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const deneme = "";
  if (deneme) {
    console.log("çalıştı len");
  } else console.log("çalışmadı");
  res.send("helloo");
});
module.exports = router;

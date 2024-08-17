// /controllers/authController.js
// kişiye özel token üreten fonksiyon
const jwt = require("jsonwebtoken");
const {
  validateUserInput,
  comparePassword,
} = require("../Helpers/inputHelpers");
const {
  access_token_creater,
  refresh_token_creater,
} = require("../Helpers/tokenHelpers");
const mongosee = require("mongoose");
const User = require("../Models/UserSchema"); // User bir colleciton

const login = async (req, res, next) => {
  // kullanıcı giriş işlemi başarılı olursa token döndür
  // token içeriside id,kullanıcı isim, role bilgileri bulunur
  // giriş yaparken kullanıcı email ve şifre sağladı mı kontrol eder.
  // eğer email değeri veri tabanında bulunuyorsa kullanıcının girdiği şifre ile veri tabanındaki şifreyi kontrol eder uyuşursa kullanıcı oturum açar
  const { email, password } = req.body;
  // email ve şifre değerlerinin girilmesini sağlar
  if (!validateUserInput(email, password)) {
    return res.json({
      success: "false",
      message: "Email ve password giriniz",
    });
  }
  try {
    const user = await User.findOne({ email: email }); // veri tabaında eşleşen kullanıcının nesnesi oluşturuluyor
    // email tek olmazsa sıkıntı çıkar
    // user bulunuyorsa bu blok çalışır
    if (user !== null) {
      // kullanıcı engellenmiş mi kontrol et
      if (user.blocked == true) {
        return res.status(403).json({ message: "you are banned" });
      }
      // giriği şifreyi kontrol et
      if (comparePassword(password, user.password)) {
        // eğer req body içerisindeki password ile veri tabanındaki password eşleşirse true döner ve if bloğu çalışır
        refresh_token_creater(user._id);
        const access_token = await access_token_creater(user);
        res.status(201).json({
          message: "Kullanıcı başarı ile giriş yaptı",
          access_token: access_token,
        });
      } else res.status(403).json({ message: "yanlış şifre tekrar dene" });
    } else res.status(404).json({ message: "Böyle bir email bulunmamaktadır" });
  } catch (error) {
    throw new Error(error);
  }
};
const register = async (req, res) => {
  const {
    userName,
    email,
    password,
    lastName,
    phoneNumber,
    age,
    tc,
    role,
    adress,
    country,
    city,
    Province,
    Neighborhood,
    street,
  } = req.body;

  try {
    // kullanıcı hali hazırda var mı kontrol edilir
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        status: "failed",
        data: [],
        message: "It seems you already have an account, please log in instead.",
      });

    // kullanıcı veri tabanına kaydedilir
    const user = await User.create({
      userName,
      lastName,
      email,
      password,
      phoneNumber,
      age,
      tc,
      role,
      adress,
      country,
      city,
      Province,
      Neighborhood,
      street,
    });
    // kayıt olan kullanıcı için token oluşturulur
    const user_id = user._id;
    const access_token = await access_token_creater(user); // user -> user information olarak alınır
    refresh_token_creater(user_id);
    console.log("kullanıcı başarı ile kaydedildi");
    res.status(201).json({ access_token });
  } catch (error) {
    return next(error);
  }
};
const blocked = async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    console.log("böyle bir kullanıcı yok ");
    res.status(401).send("Böyle bir kullanıcı yok");
  }
  // kullanıcı bulunuyorsa
  user.blocked = true;
  await user.save();
  return res.send("User blocked");
};
const unblock = async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    console.log("böyle bir kullanıcı yok ");
    res.status(401).send("Böyle bir kullanıcı yok");
  }
  // kullanıcı bulunuyorsa
  user.blocked = false;
  await user.save();
  return res.send("user unblocked");
};

module.exports = {
  login,
  register,
  blocked,
  unblock,
};

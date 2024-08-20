const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// bir kullanıcının hangi verileri olacak ve saklanacak
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  userName: String,
  lastName: String,
  phoneNumber: String,
  age: Number,
  tc: String,
  blocked: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  adress: {
    country: String,
    city: String,
    Province: String,
    Neighborhood: String,
    street: String,
  },
  refreshToken: {
    type: String,
    default: " ",
  },
  resetPasswordToken: {
    type: String,
    default: "",
  },
  resetPasswordExpire: {
    type: Date,
    default: Date.now(),
  },
});
// ------ fonksiyonlar -------
// reset password token oluşturucu
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(15).toString("hex");
  const { RESET_PASSWORD_EXPIRE } = process.env;
  // veri tabanına kaydeder
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE); // 5 dakika geçerli
  return resetToken;
};

// Şifre hashlama
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("User", userSchema); // dışarıya collection çıkartır

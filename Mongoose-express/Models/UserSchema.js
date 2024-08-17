const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
});
userSchema.pre("save", function (next) {
  // parola değişmemişse
  if (this.isModified("password")) {
    next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      // Store hash in your password DB.
      this.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("User", userSchema); // dışarıya collection çıkartır

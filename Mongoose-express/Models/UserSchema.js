const mongoose  = require("mongoose");
// bir kullanıcının hangi verileri olacak ve saklanacak
const userSchema = new mongoose.Schema({
  userName : String,
    lastName: String,
    phoneNumber: String,
    age: Number,
    tc: String,
    adress: {
        country: String,
        city: String,
        Province: String,
        Neighborhood : String,
        street : String

    },

  });
module.exports = mongoose.model("User",userSchema);
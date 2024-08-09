// mongo database ile işlem yapabilmek için 
const mongosee = require("mongoose");
const User = require("../Models/UserSchema");

const getUserFromDatabase = async (req,res) => {
    const bilgiler = await User.find({});
    res.json(bilgiler);
};

const postUserToDatabase = async (req,res) => {
    const {userName, email, lastName, phoneNumber,age,tc,role,adress,country,city,Province,Neighborhood,street} = req.body;
   
    try {
      
    // async await 
    const user = await User.create({
      userName,
      email,
      phoneNumber,
      age,
      tc,
      role,
      adress,
      country,
      city,
      Province,
      Neighborhood,
      street
  
    });
  
    res
    .status(201)
    .json({
      succes: true,
      data: user
    });
    } catch (error) {
      return next(error);
    }
  };

const deleteUserFromDatabase = async(req,res)=>{
    const user_id = req.params.id;
    await User.deleteOne({ _id: user_id });
  
    res.send('User has been deleted successfully');
};
const updateUserFromDatabase =  async(req,res)=>{
    const user_id = req.params.id; // urlden kullanıcı idsi alındı 
  const updatedData = req.body;
  try {
    // Kullanıcıyı bul ve güncelle
    const updatedUser = await User.findByIdAndUpdate(user_id, updatedData, {
      new: true,            // Güncellenmiş kullanıcıyı geri döndürür
      runValidators: true,  // Schema validation'ları çalıştırır
    });

    if (!updatedUser) {
      return res.status(404).send('User not found'); // Kullanıcı bulunamazsa 404 döndür
    }

    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
  

};
module.exports = {getUserFromDatabase,postUserToDatabase,deleteUserFromDatabase,updateUserFromDatabase}
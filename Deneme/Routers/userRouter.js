const express = require("express");
const app = express();
const router = express.Router();




// mongo database işlemleri yapılacak 
const mongosee = require("mongoose");
const User = require("../Models/UserSchema");



// get isteği ile veri tabanındaki userları çekme 
router.get("/", async (req,res)=>{

  const bilgiler = await User.find({});
    res.json(bilgiler);

});

// post isteği ile veri tabanına kullanıcı ekleme 
router.post("/",  async (req, res) => {
  const {userName, phoneNumber,age,tc,adress,country,city,Province,Neighborhood,street} = req.body;
   
    try {
      
    // async await 
    const user = await User.create({
      userName,
      phoneNumber,
      age,
      tc,
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
  
    

});

// delete isteği ile kişi silenecek 
router.delete("/:id",async (req,res) =>{
  const user_id = req.params.id;
  await User.deleteOne({ _id: user_id });

  res.send('User has been deleted successfully');

});
// kullanıcı güncelleme 
router.put("/:id" , async(req,res)=>{
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
  
})


module.exports = router; 
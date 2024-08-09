// /controllers/authController.js
// kişiye özel token üreten fonksiyon 
const jwt = require("jsonwebtoken");
const {validateUserInput} = require("../Helpers/inputHelpers");

const tokenCreater = async (req, res) => {
    const {email,password,role} = req.body;

    if(!validateUserInput(email,password)){
        return res.json({
            success: "false",
            message: "Email ve password giriniz"
        })
            
        
    }
    
    const JWT_SECRET_KEY = "celalberkeakyol"; // Bunu .env dosyasından almanız güvenlik açısından daha iyidir
    const userPayload = {
        email,
        password,
        role
    };
    
    // Token oluşturuluyor
    const accessToken = jwt.sign(userPayload, JWT_SECRET_KEY, { expiresIn: '20s' }); // Token geçerlilik süresi de eklenebilir
    res.json({ accessToken });
};

module.exports =  tokenCreater ;
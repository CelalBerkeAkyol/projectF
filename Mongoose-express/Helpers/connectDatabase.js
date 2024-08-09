const mongoose = require("mongoose");
const connectDatabase = () => {
    
    mongoose.connect('mongodb+srv://buscberke:HSv8RZ0fIqJeqqPe@clusterfero.50rkaal.mongodb.net/')
    .then(()=> {
        console.log("MongoDb conneciton succesfull");

    })
    .catch(err=>{
        console.error(err);
    })
};

module.exports = connectDatabase;
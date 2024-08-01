const mongoose = require("mongoose");
const connectDatabase = () => {

    mongoose.connect('URL')
    .then(()=> {
        console.log("MongoDb conneciton succesfull");

    })
    .catch(err=>{
        console.error(err);
    })
};

module.exports = connectDatabase;
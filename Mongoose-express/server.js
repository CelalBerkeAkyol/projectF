const express = require('express')
const connectDatabase = require("./Helpers/connectDatabase");
const router = require("./Routers/index");

const app = express()
const port = 3000

// json formayına dönüştürmek için gerekli olan kodlar 
app.use(express.json()); // json formatına çeviriyor
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('Hello World!')
});
app.use("/api",router);


// Database connection
connectDatabase();
// app.use(express.json());  
// app.use(bodyParser.json());


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
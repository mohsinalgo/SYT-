const express = require("express")
const cors = require('cors')
const routes = require('./router/routes')
var expressBusboy = require('express-busboy');
// const dotenv = require('dotenv');
var bodyParser = require('body-parser')
const formidable = require('express-formidable');

const app = express()

// expressBusboy.extend(app);
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())
//  //parse application/x-www-form-urlencoded
// // // parse application/json
// // const { S3Client } = require('@aws-sdk/client-s3');

// dotenv.config()
// import './src/config/db.config.js'
// import routes from './src/router/routes.js'

const port = process.env.PORT || 5000


// app.use(formidable());

app.use('/api', routes)
app.route('/').get((req, res) => res.send("Application is Running..."))
app.get('*', (req, res) => res.send('404! This is an invalid URL.'));


app.listen(port, () => console.log(`listen ${port}`))


// const connection = mysql.createConnection({
//   host: "eu-cdbr-west-03.cleardb.net",//'localhost',
//   user: "bfd18fb2b227ed",//'root',
//   password: 'a1033099',//'12345678'
//   database: 'heroku_feb079c83e8dae0'//'ans-proj'
// });

// // console.log("connection: ", connection)

// connection.connect((err) => {
//   if (err) throw err;
//   console.log('Connected to MySQL Server!');
// });



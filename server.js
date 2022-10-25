const path = require('path');
const express = require('express');
const https = require('https')
const fs = require('fs')
const cookieParser = require('cookie-parser')

require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');

const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./routes/routes')(app);

app.get('/', function(req, res) {
    res.render('index');
});


const sslServer = https.createServer({
    key: fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/certificate.pem')
}, app);

sslServer.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}: ${BASE_URL}${PORT}`);
});

app.use(express.static('public'));

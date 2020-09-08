const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

require('dotenv').config();

const imageUploadRoutes = require('./routes/image-upload');
const authRoutes = require('./routes/auth');
const imagesRoutes = require('./routes/images');
const signUpRoutes = require('./routes/sign-up');
const reviewRoutes = require('./routes/review');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(authRoutes);
app.use(imagesRoutes);
app.use(imageUploadRoutes);
app.use(signUpRoutes);
app.use(reviewRoutes);

const port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log("Node server started on port " + port);
});
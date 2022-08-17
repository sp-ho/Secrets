// require packages
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true}); // name of database: userDB

// set up new user schema for userDB database
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });
// copy paste this from https://www.npmjs.com/package/mongoose-encryption

// set up model for collection
const User = new mongoose.model("User", userSchema);

//////////// view the browsers //////////////////////////////

// to view the home route browser
app.get("/", function(req, res) {
  res.render("home"); // render home.ejs
});

// to view the log in route browser
app.get("/login", function(req, res) {
  res.render("login"); // render login.ejs
});

// to view the register route browser
app.get("/register", function(req, res) {
  res.render("register"); // render register.ejs
});

/////////// register for an account //////////////////////////////

// to catch the data when client register for an account...
app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,  // read the input of username from register.ejs
    password: req.body.password // read the input of password from register.ejs
  });

  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.render("secrets"); // if no error, render secrets.ejs
    }
  });
});

/////////// log in to account /////////////////////////////////
app.post("/login", function(req, res) {
  const username = req.body.username; // read the input of username from login.ejs
  const password = req.body.password; // read the input of password from login.ejs

  User.findOne({email: username}, function(err, foundUser) {
    if(err) {
      console.log(err);
    } else {
      if (foundUser) { // if the entered username found in registered email list
        if (foundUser.password === password) { // if the entered password equals registered password
          // console.log(foundUser.password);
          res.render("secrets"); // render the secrets.ejs page
        }
      }
    }
  });

});

/////// listen to port 3000 ///////////////////////////////////
app.listen(3000, function(){
  console.log("Server started on port 3000.");
});

var PORT = process.env.PORT || 3000; // take port from heroku or for loacalhost
var express = require("express");
var app = express(),
  path = require("path"),
  cookieParser = require("cookie-parser"),
  session = require("express-session"),
  config = require("./config/config.js"),
  connectMongo = require("connect-mongo")(session),
  mongoose = require('mongoose'),
  passport = require('passport'),
  facebookStrategy = require('passport-facebook').Strategy ;
// tell express where views are
app.set("views", path.join(__dirname, "views"));
// set html as templating
app.engine("html", require("hogan-express"));
// so that file uses this html extension
app.set("view engine", "html");
// try connecting to mongolab
mongoose.connect(config.dbUrl, function(err) {
  if (err != undefined) {
    console.log("MONGOOSE-CONNECT: " + err);

  } else {
    console.log("MONGOOSE-CONNECT: Database connection established");
    // listen to port when connection ok to mongo lab
  }
});



//static files
app.use(express.static(path.join(__dirname, "public")));
// moved to another module

// setup cookie parser
app.use(cookieParser());
/*app.use(session({
  secret: "test"
}));*/

//set confuguration
var mode = process.env.NODE_ENV || "development";
if (mode === "development") {
  app.use(session({
    secret: config.sessionSecret
  }));

} else { // NEED TO SET COOKIE diffrent way
  // database used to store session in production
  console.log("in production url");
  app.use(session({
    secret: config.sessionSecret,
    store: new connectMongo({
      url: config.dbUrl, // this is commented bcoz mongoose already making a connection
      mongoose_connection: mongoose.connections[0],
      stringify: true
    })
  }));

}
// try for the schema
// testing mongoose connections
/*
var userSchema = mongoose.Schema({
  username:String,
  password:String,
  email:String
})
// creating model from schema which acts as collection in db
var User = mongoose.model("users",userSchema);

var Ram = new User({
  username:"Ram",
  password:"secretpassword",
  email:"abc@gmail.com"
});

Ram.save(function(err){
  console.log("Data saved !");
})

*/


// mpved to modules.js
/*
app.route('/').get(function(req, res, next) {
  //res.send("<h1> Hello World <h1>");
  res.render("index", {
    title: "Welcome to Chat "
  });

});
*/

// call module of passport auth

app.use(passport.initialize());
app.use(passport.session());
require('./auth/passportAuth.js')(passport,facebookStrategy,config,mongoose);

require('./modules/modules.js')(express, app, passport);
app.listen(PORT, function() {
  console.log("server started at port 3000");
  console.log(mode);
});

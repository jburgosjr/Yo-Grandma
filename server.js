//Imports
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//Config
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public/dist/public"));
app.use(bodyParser.json());

//Database
mongoose.connect("mongodb://localhost/yogramma");
require("./server/config/mongoose.js");

//Routes
require("./server/config/routes.js")(app);

//Port
app.listen(1337, function(){
    console.log("Listening on part: 1337");
});
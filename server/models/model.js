var mongoose = require("mongoose");

var FamilySchema = new mongoose.Schema({
    name: {type: String},
    format: {type: String},
    number: {type: String},
    email: {type: String}
}, {timestamps: true});

mongoose.model("Family", FamilySchema);
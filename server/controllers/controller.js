var mongoose = require("mongoose");
var Family = mongoose.model("Family");

module.exports = {

    //Used to render family member data in .json format for Lambda function to pull from, adding to array of recipients.
    index: function(req, res){
        console.log("~Controller: index() initialized~");
        Family.find({}, function(err, familyMember){
            if(err){
                res.json({message: "Error!", error: err});
            }else{
                res.json(familyMember);
            }
        })
    },

    //Adds family member to MongoDB
    addFamily: function(req, res){
        console.log("~Controller: addFamily() initialized~");
        Family.findOne({name: req.body.name}, function(err, family){
            if(family == null){
            Family.create({name: req.body.name, format: req.body.format, number: req.body.number, email: req.body.email}, function(err, family){
                if(err){
                    res.json(err);
                }else{
                    res.json({message: "Success!", added: true});
                }
            })
            }else{
                res.json(err);
            }
        })
    },
}
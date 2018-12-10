var controller = require("../controllers/controller.js");
var path = require("path");

module.exports = function(app){

    //Family Schema
    app.get("/api/family", controller.index);

    app.post("/api/family", controller.addFamily);

    //Angular Catch
    app.all("*", (req, res, next) => {
        res.sendFile(path.resolve("./public/dist/public/index.html"));
    });
}
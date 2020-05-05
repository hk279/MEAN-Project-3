const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongo = require("./modules/mongo");

app.use(express.static(__dirname + "/public"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
dotenv.config();

const PORT = process.env.PORT || 5000;

//Routes
app.get("/", function (req, res) {
    res.render("pages/index", { info: "" });
});
app.get("/allgames", async function (req, res) {
    var allGames = await mongo.getAllGames();
    res.render("pages/allgames", { data: allGames });
});
app.get("/add", function (req, res) {
    res.render("pages/add");
});
//Path for adding data through the visual UI.
app.post("/add", async function (req, res) {
    var game = {
        Name: req.body.Name,
        Platform: req.body.Platform,
        Year: req.body.Year,
        Global_Sales: req.body.Global_Sales,
    };
    var message = await mongo.addGame(game);
    res.render("pages/index", { info: message });
});
app.get("/update", function (req, res) {
    res.render("pages/update");
});

//API paths
app.get("/api/getall", async function (req, res) {
    var allGames = await mongo.getAllGames();
    res.status(200).json(allGames);
});

app.get("/api/get/:id", async function (req, res) {
    var game = await mongo.getById(req.params.id);
    res.status(200).json(game);
});
app.get("/api/getbyname/:name", async function (req, res) {
    var games = await mongo.getByName(req.params.name);
    res.status(200).json(games);
});
//A document can be added by giving all fields as URL parameters.
app.post("/api/add/:newname/:newplatform/:newyear/:newglobalsales", function (req, res) {
    var newEntry = {
        Name: req.params.newname,
        Platform: req.params.newplatform,
        Year: req.params.newyear,
        Global_Sales: req.params.newglobalsales,
    };
    mongo.addGame(newEntry);
    res.status(200).json(newEntry);
});
//Another path to add data by sending a JSON object with the request.
app.post("/api/add", async function (req, res) {
    var newEntry = req.body;
    var message = await mongo.addGame(newEntry);
    res.status(200).send(message);
});
//A document can be updated by giving the id and new values for all fields as URL parameters.
app.put("/api/update/:id/:newName/:newPlatform/:newYear/:newGlobalSales", async function (
    req,
    res
) {
    var newData = {
        Name: req.params.newName,
        Platform: req.params.newPlatform,
        Year: req.params.newYear,
        Global_Sales: req.params.newGlobalSales,
    };
    var id = req.params.id;
    var updatedGame = await mongo.updateGame(id, newData);
    res.status(200).json(updatedGame);
});
//Another path to update data by sending a JSON object with the request.
app.put("/api/update", async (req, res) => {
    var newData = req.body;
    var updatedGame = await mongo.updateGame(newData._id, newData);
    res.status(200).json(updatedGame);
});
app.delete("/api/delete/:id", async function (req, res) {
    var info = await mongo.deleteGame(req.params.id);
    res.status(200).send(info);
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT);
});

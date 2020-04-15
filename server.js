const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongo = require("./modules/mongo");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
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

app.post("/api/add", function (req, res) {});

app.put("/api/edit/:id", function (req, res) {});

app.delete("/api/delete/:id", async function (req, res) {
    var info = await mongo.deleteGame(req.params.id);
    res.status(200).send(info);
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT);
});

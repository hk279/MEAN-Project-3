var mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const videoGameSchema = mongoose.Schema(
    {
        Name: String,
        Platform: String,
        Year: String,
        Global_Sales: String,
    },
    {
        strict: false,
        collection: "video_games",
    }
);

exports.getAllGames = async function getAllGames() {
    const Game = mongoose.model("Game", videoGameSchema);

    const uri = process.env.URI;
    mongoose.connect(uri, { dbName: "video_game_sales" });

    var db = mongoose.connection;
    db.on("error", () => {
        console.log("Database connection error");
    });
    db.once("open", () => {
        console.log("Database connection established!");
    });

    var allGames = await Game.find({})
        .catch((err) => {
            console.log(err);
        })
        .then((r) => {
            db.close();
            return r;
        });

    return allGames;
};

exports.getById = async function getById(id) {
    const Game = mongoose.model("Game", videoGameSchema);

    const uri = process.env.URI;
    mongoose.connect(uri, { dbName: "video_game_sales" });

    var db = mongoose.connection;
    db.on("error", () => {
        console.log("Database connection error");
    });
    db.once("open", () => {
        console.log("Database connection established!");
    });

    var identifiedUser = await Game.find({
        _id: id,
    })
        .catch((err) => {
            console.log(err);
        })
        .then((r) => {
            db.close();
            return r;
        });
    console.log(identifiedUser);
    return identifiedUser;
};
exports.addGame = async function addGame(game) {
    const Game = mongoose.model("Game", videoGameSchema);

    const uri = process.env.URI;
    mongoose.connect(uri, { dbName: "video_game_sales" });

    var db = mongoose.connection;
    db.on("error", () => {
        console.log("Database connection error");
    });
    db.once("open", () => {
        console.log("Database connection established!");
    });

    var newGame = new Game(game);

    var message = await newGame
        .save()
        .catch((err) => {
            return err;
        })
        .then(() => {
            db.close();
            return "Document saved successfully.";
        });

    return message;
};

exports.updateGame = function updateGame(id, newData) {
    const Game = mongoose.model("Game", videoGameSchema);

    const uri = process.env.URI;
    mongoose.connect(uri, { dbName: "video_game_sales" });

    var db = mongoose.connection;
    db.on("error", () => {
        console.log("Database connection error");
    });
    db.once("open", () => {
        console.log("Database connection established!");
    });

    Game.findByIdAndUpdate(id, newData)
        .catch((err) => {
            return err;
        })
        .then(() => {
            db.close();
            return "Document updated successfully";
        });
};

exports.deleteGame = async function deleteGame(id) {
    const Game = mongoose.model("Game", videoGameSchema);

    const uri = process.env.URI;
    mongoose.connect(uri, { dbName: "video_game_sales" });

    var db = mongoose.connection;
    db.on("error", () => {
        console.log("Database connection error");
    });
    db.once("open", () => {
        console.log("Database connection established!");
    });

    var message = await Game.findByIdAndDelete(id)
        .catch((err) => {
            return err;
        })
        .then((result) => {
            if (result == null) {
                return "Document not found.";
            } else {
                db.close();
                return (
                    "Document deleted successfully\n" + JSON.stringify(result)
                );
            }
        });

    return message;
};
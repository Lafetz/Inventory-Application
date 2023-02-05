#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require("async");
const Game = require("./models/game");
const Publisher = require("./models/publisher");
const Genre = require("./models/genre");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const publishers = [];
const genres = [];
const games = [];

function publisherCreate(name, cb) {
  publisherdetail = { name: name };

  const publisher = new Publisher(publisherdetail);

  publisher.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }

    publishers.push(publisher);
    console.log("cb is", cb);
    cb(null, publisher);
  });
}

function genreCreate(name, cb) {
  const genre = new Genre({ name: name });

  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Genre: " + genre);
    genres.push(genre);
    cb(null, genre);
  });
}

function gameCreate(title, description, genre, publisher, price, stock, cb) {
  gamedetail = {
    title: title,
    description: description,
    publisher: publisher,
    price: price,
    stock: stock,
  };
  if (genre != false) gamedetail.genre = genre;

  const game = new Game(gamedetail);
  game.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Book: " + game);
    games.push(game);
    cb(null, game);
  });
}

function createGenrePublisher(cb) {
  async.series(
    [
      function (callback) {
        publisherCreate("Ubisoft", callback);
      },
      function (callback) {
        publisherCreate("EA", callback);
      },
      function (callback) {
        publisherCreate("Sony", callback);
      },
      function (callback) {
        genreCreate("Fantasy", callback);
      },
      function (callback) {
        genreCreate("Action", callback);
      },
      function (callback) {
        genreCreate("Open World", callback);
      },
    ],

    cb
  );
}

function createGames(cb) {
  async.series(
    [
      function (callback) {
        gameCreate(
          "call of duty",
          "since 2003 bla bla and the this happened",
          [genres[0]],
          publishers[0],
          60,
          5,
          callback
        );
      },
      function (callback) {
        gameCreate(
          "bioshock",
          "great game",
          [genres[0], genres[1], genres[2]],
          publishers[1],
          60,
          5,
          callback
        );
      },
      function (callback) {
        gameCreate(
          "mass effect",
          "the last one sucks but good overall",
          [genres[1]],
          publishers[0],
          60,
          5,
          callback
        );
      },
      ,
      function (callback) {
        gameCreate(
          "splinter cell",
          "ubisoft forgot about it",
          [genres[2], genres[1]],
          publishers[0],
          60,
          5,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createGenrePublisher, createGames],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log(genres);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);

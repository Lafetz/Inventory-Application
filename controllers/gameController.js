const Game = require("../models/game");
const Publisher = require("../models/publisher");
const Genre = require("../models/genre");
const async = require("async");
const publisher = require("../models/publisher");
const { render } = require("pug");
const genre = require("../models/genre");
const { body, validationResult } = require("express-validator");
exports.list = (req, res, next) => {
  Game.find()
    .populate("publisher")
    .populate("genre")
    .exec((err, gameList) => {
      if (err) {
        next(err);
      }

      res.render("gameList", {
        gameList: gameList,
      });
    });
};
exports.gameDetail = (req, res, next) => {
  Game.find({ _id: req.params.id })
    .populate("genre")
    .populate("publisher")
    .exec((err, gameDetail) => {
      if (err) {
        next(err);
      }

      res.render("gameDetail", {
        gameDetail: gameDetail[0],
      });
    });
};
exports.gameUpdate_get = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.find(callback);
      },
      publisher(callback) {
        Publisher.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        next(err);
      }
      Game.find({ _id: req.params.id })
        .populate("genre")
        .populate("publisher")
        .exec((err, game) => {
          if (err) {
            next(err);
          }

          res.render("gameUpdate", {
            game: game[0],
            publishers: results.publisher,
            genres: results.genre,
          });
        });
    }
  );
};
exports.gameUpdate_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },
  // Validate
  body("title", "incorrect title").trim().isLength({ min: 1 }).escape(),
  body("description", "incorrect description")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "must be number").isNumeric(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      async.parallel(
        {
          genre(callback) {
            Genre.find(callback);
          },
          publisher(callback) {
            Publisher.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            next(err);
          }
          Game.find({ _id: req.params.id })
            .populate("genre")
            .populate("publisher")
            .exec((err, game) => {
              if (err) {
                next(err);
              }

              res.render("gameUpdate", {
                game: game[0],
                publishers: results.publisher,
                genres: results.genre,
                errors: errors.array(),
              });
            });
        }
      );
      return;
    }
    const game = await Game.findById(req.params.id);
    Object.assign(game, req.body);

    game.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(`/games/${game.id}`);
    });
  },
];
exports.gameRemove = (req, res, next) => {
  Game.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      return next();
    }
    res.redirect("/games");
  });
};
exports.gameAdd_get = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.find(callback);
      },
      publisher(callback) {
        Publisher.find(callback);
      },
    },
    (err, results) => {
      res.render("gameAdd", {
        genres: results.genre,
        publishers: results.publisher,
      });
    }
  );
};
exports.gameAdd_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },
  // Validate and sanitize fields.
  body("title", "incorrect title").trim().isLength({ min: 1 }).escape(),
  body("description", "incorrect description")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "must be number").not().isEmpty().isNumeric(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      async.parallel(
        {
          genre(callback) {
            Genre.find(callback);
          },
          publisher(callback) {
            Publisher.find(callback);
          },
        },
        (err, results) => {
          res.render("gameAdd", {
            genres: results.genre,
            publishers: results.publisher,
            errors: errors.array(),
          });
        }
      );
      return;
    }
    const game = new Game(req.body);
    game.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(`/games`);
    });
  },
];

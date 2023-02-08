const Genre = require("../models/genre");
const { body, validationResult } = require("express-validator");
exports.main_get = (req, res, next) => {
  Genre.findById(req.params.id).exec((err, genre) => {
    if (err) {
      return next(err);
    }

    res.render("genreDetail", {
      genre: genre,
    });
  });
};
exports.main_post = async (req, res, next) => {
  const genre = await Genre.findById(req.params.id);
  Object.assign(genre, req.body);
  genre.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect(`/genres`);
  });
};
exports.main_remove = (req, res, next) => {
  Genre.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/genres");
  });
};
exports.list = (req, res, next) => {
  Genre.find().exec((err, genres) => {
    if (err) {
      return next();
    }
    res.render("genreList", {
      genres: genres,
    });
  });
};
exports.genre_post = [
  body("name", "incorrect name").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("genreAdd", {
        errors: errors.array(),
      });
    }
    const genre = new Genre(req.body);
    genre.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/genres");
    });
  },
];
exports.genre_get = (req, res, next) => {
  res.render("genreAdd");
};

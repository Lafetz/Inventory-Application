const { body, validationResult } = require("express-validator");

const Publisher = require("../models/publisher");
exports.main_get = (req, res, next) => {
  Publisher.findById(req.params.id).exec((err, publisher) => {
    if (err) {
      return next();
    }

    res.render("publisherDetail", {
      publisher: publisher,
    });
  });
};
exports.main_post = async (req, res, next) => {
  const publisher = await Publisher.findById(req.params.id);
  Object.assign(publisher, req.body);
  publisher.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect(`/publishers`);
  });
};
exports.main_remove = (req, res, next) => {
  Publisher.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/publishers");
  });
};
exports.list = (req, res, next) => {
  Publisher.find().exec((err, publishers) => {
    if (err) {
      return next();
    }
    res.render("publisherList", {
      publishers: publishers,
    });
  });
};
exports.publisher_post = [
  body("name", "incorrect name").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      res.render("publisherAdd", {
        errors: errors.errors,
      });
      return;
    }
    const publisher = new Publisher(req.body);
    publisher.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/publishers");
    });
  },
];
exports.publisher_get = (req, res, next) => {
  res.render("publisherAdd");
};

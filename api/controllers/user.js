const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length > 0) {
        return res.status(409).json({
          message: "Mail already registed"
        });
      } else {
        bcrypt.hash(req.body.email, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user.save().then(result => {
              res.status(201).json({
                message: "User created"
              });
            });
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_login = (req, res, next) => {
  //findOne est mieux
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Authentification failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, res) => {
        if (err) {
          return res.status(401).json({
            message: "Authentification failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            }
          );
          return res.Status(200).json({
            message: "Authentification Success!",
            token: token
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_get_by_mail = (req, res, next) => {
  User.find({ email: req.params.email })
    .exec()
    .then(result => {
      res.status(200).json({
        //TODO renvoyer l'utilisateur
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_update_user = (req, res, next) => {
  User.udpate({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        //TODO bien coder l'update
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
exports.user_delete_user = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

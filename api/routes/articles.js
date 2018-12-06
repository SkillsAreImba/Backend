const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Article = require("../models/article");
const checkAuth = require("../middleware/check-auth");

//rerouté au niveau de app.js /articles/*

//récupération de la liste des articles
router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Articles were fetched"
  });
});

//création d'un article
router.post("/", (req, res, next) => {
  const article = new Article({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    content: req.body.content
  });
  res.status(201).json({
    message: "Articles were posted"
  });
});

//récupération d'un article par son Id
router.get("/:articleId", (req, res, next) => {
  res.status(200).json({
    message: "Articles details",
    articleId: req.params.articleId
  });
});

router.delete("/:articleId", (req, res, next) => {
  res.status(200).json({
    message: "Articles suppression",
    articleId: req.params.articleId
  });
});

module.exports = router;

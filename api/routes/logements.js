const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const LogementsController = require("../controllers/logements");

//TODO : Move multer to middleware, move logic to controllers.
//TODO : externaliser les catch errors =)

const storageStrategy = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  //accept a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    //reject a file
    cb(null, false);
  }
};

//options possible : limits: { fileSize: }
const upload = multer({
  storage: storageStrategy,
  fileFilter: fileFilter
});

const Logement = require("../models/logement");

//rerouté au niveau de app.js /logements/*

/**
 * Get toutes les logements dans la base de données
 */
router.get("/", LogementsController.logements_get_all);

/**
 * Insère un nouveau logement
 * TODO : ajouter checkAuth en 2ème argument
 */
router.post(
  "/",
  upload.single("logementImage"),
  (req, res, next) => {
    //on récupère les informations en paramètres pour les mettre dans un objet model
    const logement = new Logement({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      logementImage: req.file.path
    });
    //on enregistre l'objet model en base de données
    logement
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Logement successfully created",
          createdLogement: {
            name: result.name,
            price: result.price,
            logementImage: result.logementImage,
            _id: result._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/logements/" + result._id
            }
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
);

/**
 * Get le logement dont l'id est passée en paramètre (via la route)
 */
router.get("/:logementId", (req, res, next) => {
  const id = req.params.logementId;
  Logement.findById(id)
    .select("name price logementImage _id")
    .exec()
    .then(logement => {
      console.log(logement);
      if (logement) {
        res.status(200).json(logement);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided Id" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

/**
 * Met à jour l'logement dont l'id est passée en paramètre (via la route)
 * Les informations sont contenues dans le body avec un tableau [] de "propName": et "value":""
 */
router.patch("/:logementId", (req, res, next) => {
  const id = req.params.logementId;
  const updateLogements = {};
  for (const logs of req.body) {
    updateLogements[logs.propName] = logs.value;
    //updatedAt: now();
  }
  Logement.update({ _id: id }, { $set: updateLogements })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

/**
 * Supprime le logement dont l'id est passé en paramètre (via la route)
 */
router.delete("/:logementId", (req, res, next) => {
  const id = req.params.logementId;
  Logement.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;

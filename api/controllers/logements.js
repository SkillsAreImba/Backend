const mongoose = require("mongoose");
const Logement = require("../models/logement");

exports.logements_get_all = (req, res, next) => {
    Logement.find()
      .select("name price logementImage _id")
      .exec()
      .then(logements => {
        const response = {
          count: logements.length,
          logements: logements.map(logement => {
            return {
              name: logement.name,
              price: logement.price,
              logementImage: logement.logementImage,
              _id: logement.id,
              request: {
                type: "GET",
                url: "http://localhost:3000/logements/" + logement._id
              }
            };
          })
        };
        res.status(200).json(response);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
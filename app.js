const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const logementsRoutes = require("./api/routes/logements");
const articlesRoutes = require("./api/routes/articles");
const userRoutes = require("./api/routes/user");

//connexion à la base de données distante
mongoose.connect(
  "mongodb://parischou:" +
    process.env.MONGO_ATLAS_PW +
    "@parischou-shard-00-00-lmbmk.mongodb.net:27017,parischou-shard-00-01-lmbmk.mongodb.net:27017,parischou-shard-00-02-lmbmk.mongodb.net:27017/test?ssl=true&replicaSet=ParisChou-shard-0&authSource=admin&retryWrites=true",
  {
    useNewUrlParser: true
  }
);

//pour éviter le deprecationWarning
mongoose.Promise = global.Promise;

//connexion à la base de données distante

//gestion des logs/erreurs
app.use(morgan("dev"));

//gestion des accès aux uploads
app.use("/uploads", express.static("uploads"));

//gestion du parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Prévention des CORS errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT",
      "POST",
      "PATCH",
      "DELETE"
    );
    return res.status(200).json({});
  }
  next();
});

//Routes allowed
app.use("/logements", logementsRoutes);
app.use("/articles", articlesRoutes);
app.use("/user", userRoutes);

//si on arrive ici c'est que les routes précédentes ont "fail"
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

//récupère les erreurs de l'application
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

module.exports = app;

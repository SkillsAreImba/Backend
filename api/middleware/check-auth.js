const jwt = require("jsonwebtoken");

// Authorization / Bearer <token> est passé dans le header


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentification Failed"
    });
  }
};

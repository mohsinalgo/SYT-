var jwt = require("jsonwebtoken");

module.exports = function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).send({ status: "error", msg: "Unauthorized" }); // if there isn't any token

  jwt.verify(token, "privateKey", (err, user) => {
    if (err)
      return res.status(403).send({ status: "error", msg: "Unauthenticated user" });
    req.user = user;
    next(); // pass the execution off to whatever request the client intended
  });
};
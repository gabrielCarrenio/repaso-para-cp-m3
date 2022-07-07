const express = require("express");
const server = express();

server.get("/", (req, res, next) => {
  //res.type(),para dale un conten-type especifico!
  //el next nos permite delegar tareas!
  console.log("previo al next");
  next();
});

server.get("/", (req, res) => {
  res.send("Bienvenidos luego de un next");
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});

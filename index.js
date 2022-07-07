const express = require("express");
const server = express();
var morgan = require("morgan");

let idVolatil = 5;

let names = [
  { id: 1, name: "gabi" },
  { id: 2, name: "alastor" },
  { id: 3, name: "ron" },
  { id: 4, name: "sneip" },
];

//middleware => es una funcion, un intermediario entre la data que requiero y los metodos del server
function logger(req, res, next) {
  console.log(req.url);
  next(); // siempre un next!
}
// para decodifcar la info que recibo! ya que js no interpreta json!!! este middleware, nos ayuda para esto! en este caso la info q llega de body!
server.use(express.json());
//para aplicarlo de forma general:
server.use(morgan("tiny")); // a todas las rutas se le aplica este middleware!

server.get("/", logger, (req, res, next) => {
  //res.type(),para dale un conten-type especifico!
  //el next nos permite delegar tareas!
  console.log("previo al next");
  next();
});

server.get("/", (req, res) => {
  res.send("Bienvenidos luego de un next");
});

server.get("/json", logger, (req, res) => {
  // Content-Type: aplication/json
  res.json("hola , ruta /json");
});

server.get("/send", (req, res) => {
  // Content-Type: aplication/json, el send detecta que lo que envia es un obj, entonces manda el type aplication/json
  //por default el content-type por defecto es (text/html)
  res.send({ msj: "hello, i am send route" });
  res.send(undefined); // no se define un content-type! giño giño, send intenta siempre intentar interpretae el content.type!
});

server.post("/uno/:id/:apellido", (req, res) => {
  let { id, apellido } = req.params;
  let { nombre } = req.query;

  if (!nombre) return res.status(404).send("el nombre no vino!");
  if (id > 5) return res.status(404).send("el id es mayor a 5");
  res
    .status(200)
    .send(`El id es: ${id}, nombre: ${nombre} y apellido: ${apellido} `);
});

server.post("/", (req, res) => {
  const data = req.body;
  // se puede destructurar obviamente!!!!!
  res.send(data);
});

server.post("/addName/:name", (req, res) => {
  const { name } = req.params; //no tiene sentido querer validar el name! ya que si no escribe la ruta con ese parametro, directamente no entraria nunca al path que estamos usando en el post!!!!!!!!!!
  const { location, age } = req.body;

  if (!location || !age) return res.status(404);

  names.push({ id: idVolatil++, name, location });

  res.json(names);
  //res.status(200).send(names); //sabe identificar el aplication/json! sabe leer obj!!!!
});
// query
// ?key=value&key1=value1&
server.get("/search/:id", (req, res) => {
  let id = req.params.id;
  id = parseInt(id);
  //console.log(typeof id);
  let encontrado = names.find((n) => n.id === id);
  //devuelvo el nombre
  //por las dudas le pongo el status!!!!!
  if (encontrado) return res.status(200).send(encontrado.name);
  //if (encontrado) return res.json(encontrado);

  // manejo el error:
  //if (!encontrado) return res.status(404).send("No se encontro el id papu!");
  res.sendStatus(404);
});
// en el caso de no haber ninguna url en la cual quieran entrar! lo manejamos con esto:
server.get("*", (req, res) => {
  res.status(404).send("No existe ninguna ruta con dicha url");
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});

require("dotenv").config();
const debug = require("debug")("mi-app:principal");
const express = require("express");
const chalk = require("chalk");
const { program } = require("commander");
const morgan = require("morgan");

program.option("-p, --puerto <puerto>", "Puerto para el servidor");
program.parse(process.argv);
const options = program.opts();

const app = express();

const puerto = options.puerto || process.env.PUERTO || 5000;

const server = app.listen(puerto, () => {
  debug(chalk.yellow(`Servidor escuchando en el puerto ${chalk.green(puerto)}.`));
});

server.on("error", err => {
  debug(chalk.red("Ha ocurrido un error al levantar el servidor"));
  if (err.code === "EADDRINUSE") {
    debug(chalk.red(`El puerto ${puerto} está ocupado`));
  }
});

app.use(morgan("dev"));
app.use(express.static("public"));


app.get("/metro/lineas", (req, res, next) => {

  res.json({
    id: "Venga, hasta luego.",
    linea: "L2",
    despricion: "Descripción de la linea"
  });
});
app.get("/metro/linea/:linea?", (req, res, next) => {
  res.json({
    linea: req.params.linea,
    descripcion: "Descripción de la línea",
    paradas: [
      {
        id: "x",
        nombre: "Nombre parada"
      }
    ]
  });
});

app.put((req, res, next) => {
  res.status(404).json({ error: true, mensaje: "Te pensabas que podías hackearme" });
});

app.post((req, res, next) => {
  res.status(404).json({ error: true, mensaje: "Te pensabas que podías hackearme" });
});
app.delete((req, res, next) => {
  res.status(404).json({ error: true, mensaje: "Te pensabas que podías hackearme" });
});
app.use((req, res, next) => {
  res.status(404).json({ error: true, mensaje: "Recurso no encontrado" });
});

app.use((err, req, res, next) => {
  debug(err);
  res.status(500).send({ error: true, mensaje: "Ha petado algo" });
});

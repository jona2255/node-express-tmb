require("dotenv").config();
const debug = require("debug")("tmb:principal");
const express = require("express");
const chalk = require("chalk");
const { program } = require("commander");
const morgan = require("morgan");
const fetch = require("node-fetch");

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
  fetch(`${process.env.url_api_tmb}?app_id=${process.env.api_id}&app_key=${process.env.api_key}`)
    .then(resp => resp.json())
    .then(lineas => {
      res.json(
        lineas.features.map(linea => ({
          id: linea.properties.ID_LINIA,
          linea: linea.properties.NOM_LINIA,
          despricion: linea.properties.DESC_LINIA
        }))
      );
    });
});
app.get("/metro/linea/:linea?", (req, res, next) => {
  if (!req.params.linea) {
    res.status(404).json({ error: true, mensaje: "Recurso no encontrado" });
  }
  fetch(`${process.env.url_api_tmb}?app_id=${process.env.api_id}&app_key=${process.env.api_key}`)
    .then(resp => resp.json())
    .then(lineas => {
      if (!lineas.features.find(linea => linea.properties.NOM_LINIA === req.params.linea)) {
        res.status(404).json({ error: true, mensaje: "Recurso no encontrado" });
      } else {
        const codiLinia = lineas.features.filter(linea => linea.properties.NOM_LINIA === req.params.linea);
        fetch(`${process.env.url_api_tmb}/${codiLinia[0].properties.CODI_LINIA}/estacions?app_id=${process.env.api_id}&app_key=${process.env.api_key}`)
          .then(resp => resp.json())
          .then(paradas => {
            res.json({
              linea: req.params.linea,
              descripcion: paradas.features[0].properties.DESC_SERVEI,
              paradas: paradas.features.map(parada => ({
                id: parada.properties.ID_ESTACIO,
                nombre: parada.properties.NOM_ESTACIO
              }))
            });
          });
      }
    });
});

app.get("*", (req, res, next) => {
  res.status(404).json({ error: true, mensaje: "Recurso no encontrado" });
});
app.put((req, res, next) => {
  res.status(403).json({ error: true, mensaje: "Te pensabas que podías hackearme" });
});

app.post((req, res, next) => {
  res.status(403).json({ error: true, mensaje: "Te pensabas que podías hackearme" });
});
app.delete((req, res, next) => {
  res.status(403).json({ error: true, mensaje: "Te pensabas que podías hackearme" });
});

app.use((err, req, res, next) => {
  debug(err);
  res.status(500).send({ error: true, mensaje: "Ha petado algo" });
});

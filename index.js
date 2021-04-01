require("dotenv").config();
const debug = require("debug")("mi-app:principal");
const express = require("express");
const chalk = require("chalk");
const { program } = require("commander");
const { reset } = require("chalk");
const morgan = require("morgan");

const app = express();

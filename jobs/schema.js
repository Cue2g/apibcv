const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcvSchema = Schema({
  euro: Number,
  yuan: Number,
  lira: Number,
  rublo: Number,
  dolar: Number,
  fecha: Date
})

const Bcv = bcvSchema

module.exports = Bcv

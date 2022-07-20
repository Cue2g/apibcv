const mongoose = require('mongoose');
require('dotenv').config({path:__dirname+'/../.env'})

let conn = null

exports.bdConnection = async function() {
    try {
      const userbd = process.env.userbd,
      pwbd = process.env.pwbd,
      bdName = process.env.bdname;

      const uri = `mongodb+srv://${userbd}:${pwbd}@cluster0.4qxcs.mongodb.net/${bdName}?retryWrites=true&w=majority`;
      conn = await mongoose.createConnection(uri , {
        serverSelectionTimeoutMS: 5000
      });
      console.log('Connected on ' + bdName)
      return conn;
    } catch (e) {
      console.log(e)
      return 'error'
    }
}

exports.bdDisconnect = mongoose

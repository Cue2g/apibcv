const express = require('express')
const app = express()
const Bcv = require('./jobs/schema')
const mongoose = require('mongoose')
// const cors = require('cors')
require('dotenv').config()

const userbd = process.env.userbd,
pwbd = process.env.pwbd,
bdName = process.env.bdname;

const uri = `mongodb+srv://${userbd}:${pwbd}@cluster0.4qxcs.mongodb.net/${bdName}?retryWrites=true&w=majority`;


app.get('/api/bcv', async function (req, res) {
    console.log('Request')
    try {
      const BcvModel = mongoose.model('registers', Bcv)
      const doc = await BcvModel.find().sort({$natural:-1}).limit(1).select({_id:0, __v:0})
        res.status(200).json({
            status: "ok",
            data: doc[0]
        })
    } catch (error) {
        res.status(400).json({
            estado:400,
            error
        })
    }
})

app.get('/api/bcv/dolar', async function (req, res) {
    try {
      const BcvModel = mongoose.model('registers', Bcv)
      const doc = await BcvModel.find().sort({$natural:-1}).limit(1).select({_id:0,dolar:1,fecha:1})
        res.status(200).json({
            status: "ok",
            data: doc[0]
        })
    } catch (error) {
        res.status(400).json({
            estado:'error',
            error
        })
    }
})


app.get('/api/bcv/filter/date/:since/:until?', async function (req, res) {
    try {
        const since = new Date(req.params.since);
        const until = new Date(req.params.until);
        let doc;
        if(!req.params.until){

            const BcvModel = mongoose.model('registers', Bcv);
            console.log(req.params.since);
             doc = await BcvModel.find()
            .where('fecha')
            .gte(`${req.params.since}T00:00:00`)
            .lt(`${req.params.since}T23:59:59`)
            .sort({$natural:-1}).select({__v:0});

        }else{
            const BcvModel = mongoose.model('registers', Bcv);
            console.log(req.params.since);
             doc = await BcvModel.find()
            .where('fecha')
            .gte(`${req.params.since}T00:00:00`)
            .lt(`${req.params.until}T23:59:59`)
            .sort({$natural:-1}).select({__v:0})
        }

        res.status(200).json({
            status: "ok",
            items:doc.length,
            data: doc
        })

    } catch (error) {
        res.status(400).json({
            estado:'error',
            error: error.message
        })
    }
})

app.get('/api/bcv/all', async function (req, res) {
    try {
        const BcvModel = mongoose.model('registers', Bcv);
        const doc = await BcvModel.find({}).sort({$natural:-1}).select({__v:0});

        res.status(200).json({
            status: "ok",
            items:doc.length,
            data: doc
        })

    } catch (error) {
        res.status(400).json({
            estado:'error',
            error: error.message
        })
    }
})

app.all('*',(req,res) => {
    res.status(404).json({
        status: 'not found',
        message: `Can´t find ${req.method} : ${req.originalUrl} on this API`,
    })
})
mongoose.connect(uri).then(() =>{
    console.log('mongo conected');
    app.listen(5000, () =>{
        console.log(`BVC up. Port:${5000}`)
    })
}).catch((e)=>{
    console.log(e)
})


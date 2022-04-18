const express = require('express')
const app = express()
const cheerio = require('cheerio');
const request = require('request-promise')

app.get('/api/bcv', async function (req, res) {
    try {
        const $ = await request({
            uri: 'http://www.bcv.org.ve/',
            transform: body => cheerio.load(body)
        });
        const euro = $('#euro').find('strong').html()
        const yuan = $('#yuan').find('strong').html()
        const lira = $('#lira').find('strong').html()
        const rublo = $('#rublo').find('strong').html()
        const dolar = $('#dolar').find('strong').html()
        res.status(200).json({
            estado:200,
            data: {
                euro,
                yuan,
                lira,
                rublo,
                dolar
            }
        })
    } catch (error) {
        res.status(400).json({
            estado:400,
            error
        })
    }
})

app.all('*',(req,res) => {
    res.status(404).json({
        status: 'not found',
        message: `Can´t find ${req.method} : ${req.originalUrl} on this API`,
    })
})

app.listen(5000, () =>{
    console.log(`BVC up. Port:${5000}`)
})

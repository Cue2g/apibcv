const cheerio = require('cheerio');
const request = require('request-promise')
const bd = require('./mongo')
const Bcv = require('./schema')
const cron = require('node-cron');
console.log(`inicio del servicio: ${Date.now()}`)
async function updateData() {
  const conn = await bd.bdConnection()
  try {

      const $ = await request({
          uri: 'http://www.bcv.org.ve/',
          transform: body => cheerio.load(body)
      });

      const euro = Number($('#euro').find('strong').html().replace(',', '.'))
      const yuan = Number($('#yuan').find('strong').html().replace(',', '.'))
      const lira = Number($('#lira').find('strong').html().replace(',', '.'))
      const rublo = Number($('#rublo').find('strong').html().replace(',', '.'))
      const dolar = Number($('#dolar').find('strong').html().replace(',', '.'))

      const M = await conn.model('registers', Bcv);
      await M.create({
        euro,
        yuan,
        lira,
        rublo,
        dolar,
        fecha:Date.now()
      });

  } catch (error)  {
      console.log(error)
  } finally {
    bd.bdDisconnect.disconnect()
    console.log(`update all data, the task will be closed`)
  }
}

cron.schedule('0 8 * * *', () => {
  console.log('running updateData');
  updateData()
});

cron.schedule('0 16 * * *', () => {
  console.log('running updateData');
  updateData()
});

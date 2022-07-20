const cheerio = require('cheerio');
const request = require('request-promise')
const bd = require('./mongo');
const Bcv = require('./schema');
const cron = require('node-cron');

console.log(`inicio del servicio: ${Date.now()}`);

async function updateData() {
  const conn = await bd.bdConnection()
  try {

      const $ = await request({
          uri: 'http://www.bcv.org.ve/',
          transform: body => cheerio.load(body)
      });

      const euro = Number($('#euro').find('strong').html().replace(',', '.'));
      const yuan = Number($('#yuan').find('strong').html().replace(',', '.'));
      const lira = Number($('#lira').find('strong').html().replace(',', '.'));
      const rublo = Number($('#rublo').find('strong').html().replace(',', '.'));
      const dolar = Number($('#dolar').find('strong').html().replace(',', '.'));

      const data = {
        euro,
        yuan,
        lira,
        rublo,
        dolar,
        fecha:Date.now()
      }


      const M = await conn.model('registers', Bcv);
      const doc = await M.find().sort({$natural:-1}).limit(1).select({_id:0, __v:0});

      if(doc[0].euro != data.euro || 
        doc[0].yuan != data.yuan || 
        doc[0].lira != data.lira || 
        doc[0].rublo != data.rublo ||
        doc[0].dolar != data.dolar){
          await M.create(data);
          console.log('updated');
        }

  } catch (error)  {
      console.log(error)
  } finally {
    const d = new Date(Date.now());
    bd.bdDisconnect.disconnect()
    console.log(`cron ended at ${d.toString()}`)
  }
}



cron.schedule('* * * * *', () => {
  console.log('running updateData');
  updateData()
});


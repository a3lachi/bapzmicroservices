const amqp = require('amqplib/callback_api')
const path = require ('path')
const fs = require('fs')
const myamqp = require('./myamqp');
const { PrismaClient } = require('@prisma/client');
const { ALL } = require('dns');




const prisma = new PrismaClient();


const fileData = path.join(process.cwd(), './', 'data.txt');
const getData = fs.readFileSync(fileData, 'utf8').split('\n');

const dataTree = {
  'A': [],
  'B': [],
  'C': [],
  'D': [],
  'E': [],
  'F': [],
  'G': [],
  'H': [],
  'I': [],
  'J': [],
  'K': [],
  'L': [],
  'M': [],
  'N': [],
  'O': [],
  'P': [],
  'Q': [],
  'R': [],
  'S': [],
  'T': [],
  'U': [],
  'V': [],
  'W': [],
  'X': [],
  'Y': [],
  'Z': [],
  '1': [],
  '2': [],
  '3': [],
  '4': [],
  '5': [],
  '6': [],
  '7': [],
  '8': [],
  '9': []
};
for (const dt of getData) {
  const char = dt[0]
  if (dataTree.hasOwnProperty(char)) {
    dataTree[char].push(dt);
  }
}
const qIdsRd = 'products.ids.read';
const qImagesRd = 'products.images.read';
const rkIdsRd = 'products.read"';
const rkImagesRd = 'images.read.key'; // use a different routing key here
const exProducts = 'bapz.products.eu';
const qGatewayIds = "gateway.ids.read"
const qGatewayImages = "gateway.images.read"





// channel.queue_declare(queue='hello') declare queue 

const adrGateway = 'amqp://127.0.0.1'

// amqp.connect('amqp://127.0.0.1', (err, conn1) => {
//   if (err) {
//     throw err;
//   }
//   console.log(`[x] - AQMP Server listening`);


//   conn1.createChannel((err, ch1) => {
//     if (err) {
//       throw err;
//     }
//     ch1.prefetch(1); // break even distribution in queue , n-inth worker dont consume from n-int queue element

//     // Queue products.ids.read
//     ch1.assertQueue(qIdsRd, { durable: true });
//     console.log(`[x] - Created queue ${qIdsRd} :`);
//     ch1.consume(qIdsRd, async (msg) => {
//       const message = JSON.parse(msg.content.toString())
//       const headers = msg.properties.headers;
//       const correlationId = headers.myH.correlationId
//       console.log('Server received header :',correlationId)
//       const time = new Date();
//       console.log(`[x] - ${time.getSeconds()} - Received ${msg.content.toString()} from q:${qIdsRd}`);
//       let ids = await prisma.bapz.findMany({
//         select:{
//           id:true,
//         },
//         take: Number(message.limit) || ALL
//       })
//       ids = ids.map(({ id }) => Number(id))
//       myamqp.sendMessageToQueue(adrGateway,{"data":ids},qGatewayIds,correlationId)
//       ch1.ack(msg); 
//     }, { noAck: false });

//     // Queue products.images.read
//     ch1.assertQueue(qImagesRd, { durable: true });
//     console.log(`[x] - Created queue ${qImagesRd} .`);
//     ch1.consume(qImagesRd, async (msg) => {
//       const time = new Date();
//       console.log(`[x] - ${time.getSeconds()} - Received ${msg.content.toString()} from q:${qImagesRd}`);
      
//       myamqp.sendMessageToQueue(adrGateway,{"data":dataTree.Y[1]},qGatewayImages)
//       ch1.ack(msg);
//     }, { noAck: false });
//   });
// });
const bodyParser = require('body-parser');
const cors = require('cors');

const express = require('express');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const araJSON = (bigint) => {
  return(
    {
      'id':Number(bigint.id.toString()),
      'productname':bigint.productname,
      'price':bigint.price,
      'color':bigint.color,
      'category':bigint.category,
      'size':bigint.size,
    }
  )
}


const getSrc = (name,indice) => {
  const nameWithNoSpace = name.split(' ').join('')
  rez = []
  if (indice === 1) { // RETURN JUST 1 ELMENT FOR COMMANDS
    for (const data of dataTree[name[0]]) {
      const dataRay = data.split('__')
      if (`${nameWithNoSpace}0` === dataRay[0]) {
        rez.push(dataRay[1])
        break
      }
    }
  }
  else {
    for (const data of dataTree[name[0]]) {
      const dataRay = data.split('__')
      if (`${nameWithNoSpace}` === dataRay[0].slice(0,-1)) {
        rez.push(dataRay[1])
      }
    }

  }
  return rez
}

app.get('/ids', async (req,res) => {
  try {
    let ids = await prisma.bapz.findMany({
      select:{
        id:true,
      },
      take: Number(req.query?.limit) || ALL
    })
    ids = ids.map(({ id }) => Number(id))
    res.status(200).send({'data':ids})
    return
  }
  catch(error){
    console.log('[x] - Error :',error)
  }
  res.status(400).send({})
})

app.get('/images', async (req,res) => {
  try {
    if (req.query.letter && req.query.letter === req.query.letter.toUpperCase)
      res.status(200).send({'data':dataTree[req.query?.letter]?.slice(0,req.query?.limit || 1000 )})
    else 
      res.status(200).send({'data':dataTree})
    return
  }
  catch(error){
    console.log('[x] - Error :',error)
  }
  res.status(400).send({})
})
app.post('/api/bapz/id', async (req, res) => {
  // get elements from database
  try {
    if(req?.body?.id) {
      const product = await prisma.bapz.findMany({
        where: {
          id: BigInt(req.body.id),
        }
      });
      // deal with element
      if (product.length === 1) {
        const rez = getSrc(product[0].productname.split(' ').join(''),0)
        res.status(200).json({found:'yes', src:rez,data:araJSON(product[0])});
        return
      }
    }
  } catch(error) {
    console.log('[x] - Error :',error)
  }
  res.status(400).json({ data: 0 });
  return
});


app.post('/api/bapz/apparel', async (req, res) => {
  try {
    if(req.body?.cat) {
      const products = await prisma.bapz.findMany({
        where: {
          category: req.body.cat,
        }
      })
      prodsRes = []
      for (const produit of products) {

        prodsRes.push([produit.productname,await getSrc(produit.productname,0).slice(0,2),Number(produit.id.toString()), Number(produit.price.split('$')[1].split('.')[0]) , produit.color  ] )
      }

      res.status(200).json({ data: prodsRes });
      return
    }
    else {
      const tShirts = await prisma.bapz.findMany({
        where: {
          category: 't-shirts',
        },
        take: 2,
      });
      
      const shoes = await prisma.bapz.findMany({
        where: {
          category: 'shoes',
        },
        take: 2,
      });
      
      const pants = await prisma.bapz.findMany({
        where: {
          category: 'pants',
        },
        take: 2,
      });
      
      const watches = await prisma.bapz.findMany({
        where: {
          category: 'watches',
        },
        take: 2,
      });
      
      const bags = await prisma.bapz.findMany({
        where: {
          category: 'bags',
        },
        take: 2,
      });
      
      const sweats = await prisma.bapz.findMany({
        where: {
          category: 'sweats',
        },
        take: 2,
      });
      
      const products = [...tShirts, ...shoes, ...pants, ...watches, ...bags, ...sweats];
      
      prodsRes = []
      for (const produit of products) {
        prodsRes.push([produit.productname,getSrc(produit.productname,0).slice(0,2),Number(produit.id.toString()), Number(produit.price.split('$')[1].split('.')[0]) , produit.color ])
      }

      res.status(200).json({ data: prodsRes });
      return
    }

  }

  catch (error) {
    console.log('[x] - Error :',error)
  }
  res.status(400).json({ data: 0 });
  return

})

app.listen(3001, () => {
  console.log(`[x] - HTTP Server listening on port 3001`);
});


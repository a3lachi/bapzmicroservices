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

amqp.connect('amqp://127.0.0.1', (err, conn1) => {
  if (err) {
    throw err;
  }
  console.log(`AQMP Server listening..`);


  conn1.createChannel((err, ch1) => {
    if (err) {
      throw err;
    }
    ch1.prefetch(1); // break even distribution in queue , n-inth worker dont consume from n-int queue element

    ch1.assertQueue(qIdsRd, { durable: true });
    console.log(`[x] - Created queue ${qIdsRd} :`);
    ch1.consume(qIdsRd, async (msg) => {
      const message = JSON.parse(msg.content.toString())
      console.log(`[x] - Received ${msg.content.toString()} from q : ${qIdsRd}`);
      let ids = await prisma.bapz.findMany({
        select:{
          id:true,
        },
        take: Number(message.limit) || ALL
      })
      ids = ids.map(({ id }) => Number(id))
      myamqp.sendMessageToQueue(adrGateway,{"data":ids},qGatewayIds)
      ch1.ack(msg); // msg was processed and can be removed from queue
    }, { noAck: false });


    ch1.assertQueue(qImagesRd, { durable: true });
    console.log(`[x] - Created queue ${qImagesRd} .`);
    ch1.consume(qImagesRd, async (msg) => {
      const message = JSON.parse(msg.content.toString())
      const time = new Date();
      console.log(`[x] - ${time.getSeconds()} - Received ${msg.content.toString()} from q : ${qImagesRd}`);
      
      myamqp.sendMessageToQueue(adrGateway,{"data":dataTree.Y[1]},qGatewayImages)
      ch1.ack(msg); // msg was processed and can be removed from queue
    }, { noAck: false });
  });
});




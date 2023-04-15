const amqp = require('amqplib/callback_api')
const myamqp = require('./myamqp');
const { PrismaClient } = require('@prisma/client');
const { ALL } = require('dns');




const prisma = new PrismaClient();


const qIdsRd = 'client.login.read';
const qImagesRd = 'products.images.read';
const rkIdsRd = 'products.read"';
const rkImagesRd = 'images.read.key'; // use a different routing key here
const exProducts = 'bapz.products.eu';
const qGatewayIds = "gateway.ids.read"
const qGatewayImages = "gateway.images.read"






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

    // Queue products.ids.read
    ch1.assertQueue(qIdsRd, { durable: true });
    console.log(`[x] - Created queue ${qIdsRd} :`);
    ch1.consume(qIdsRd, async (msg) => {
      const message = JSON.parse(msg.content.toString())
      const time = new Date();
      console.log(`[x] - ${time.getSeconds()} - Received ${msg.content.toString()} from q : ${qIdsRd}`);
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

    
  });
});




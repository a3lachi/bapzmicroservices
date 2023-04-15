const amqp = require('amqplib/callback_api')
const path = require ('path')
const fs = require('fs')
const sendMessageToQueue = require('../send');
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


amqp.connect('amqp://127.0.0.1', (err0, conn) => {
  
  // Create channel
  if (err0) throw err0;
  conn?.createChannel((err1, ch) => {
    if(err1) throw err1 ;
    // Name of the queue
    const qId = "bapzproductids"
    // Declare the queue
    ch.assertQueue(qId, { durable: true })

    // Wait for Queue Messages
    console.log(`AMQP Server listening on queue : ${qId}`)
    ch.consume( qId, async (msg) => {

        const message = JSON.parse(msg.content.toString('utf8'))

        const time = new Date()
        console.log(`[x] - ${time.getSeconds()} - Product Server Received message in Queue ${qId}`)



        if (message.url === '/images') {
          sendMessageToQueue('amqp://127.0.0.1',{'data':dataTree},'bapzgateway')
            .catch((error)=>{
              console.error(`Error sending messages to queue bapzgateway :`, error);
            })
        }
        else if (message.url === '/ids') {
          const products = await prisma.bapz.findMany({
            take: Number(message?.limit) || ALL,
            select: {
              id: true,
            }
          });
          let idiz = []
          for (const product of products)
            idiz.push(product.id.toString())
            sendMessageToQueue('amqp://127.0.0.1',{'data':idiz},'bapzgateway')
            .catch((error)=>{
              console.error(`Error sending messages to queue bapzgateway :`, error);
            })          
          
        
        }
      }, { noAck: true })
    // Wait for Queue Messages
    console.log(`AMQP Server listening on queue : ${qId}`)
    ch.consume( qId, async (msg) => {

        const message = JSON.parse(msg.content.toString('utf8'))

        const time = new Date()
        console.log(`[x] - ${time.getSeconds()} - Product Server Received message in Queue ${qId}`)



        if (message.url === '/images') {
          sendMessageToQueue('amqp://127.0.0.1',{'data':dataTree},'bapzgateway')
            .catch((error)=>{
              console.error(`Error sending messages to queue bapzgateway :`, error);
            })
        }
        else if (message.url === '/ids') {
          const products = await prisma.bapz.findMany({
            take: Number(message?.limit) || ALL,
            select: {
              id: true,
            }
          });
          let idiz = []
          for (const product of products)
            idiz.push(product.id.toString())
            sendMessageToQueue('amqp://127.0.0.1',{'data':idiz},'bapzgateway')
            .catch((error)=>{
              console.error(`Error sending messages to queue bapzgateway :`, error);
            })          
          
        
        }
      }, { noAck: true })
  })
})


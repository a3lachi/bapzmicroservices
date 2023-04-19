const amqp = require('amqplib/callback_api')
const { v4: uuidv4 } = require('uuid');




const consumeMessagesFromQueue = (adr, q, correlationId) => {
  return new Promise((resolve, reject) => {
    amqp.connect(adr, (err0, conn) => {
      if (err0) return reject(err0);

      conn.createChannel((err1, ch) => {
        if (err1) return reject(err1);

        ch.assertQueue(q, { durable: true });


        ch.consume(q, msg => {
          const message = JSON.parse(msg.content.toString('utf8'));
          const headers = msg.properties.headers;
          const msgCorrId = headers.myH.correlationId
          console.log('[x] - Msg correlationId :',msgCorrId)
          console.log('[x] - Wanted correlationId :',correlationId)
          if (msgCorrId === correlationId) {
            const time = new Date();
            console.log(`[x] - ${time.getSeconds()} - Consuming ${msg.content.toString('utf8')} from q : ${q}`);
            resolve(message);
          }
        }, { noAck: true });

        setTimeout(() => {
          conn.close();
        }, 500);
      });
    });
  });
};


const sendMessageToQueue = async (adr, msg, q, corrId) => {
  return new Promise((resolve, reject) => {
    amqp.connect(adr, (err0, conn) => {
      if (err0) {
        reject(err0)
        return
      }
      conn.createChannel((err1, ch) => {
        if (err1) {
          reject(err1)
          return
        }
        ch.assertQueue(q, { durable: true })
        console.log('------',corrId)
        const myHeaders = { 'correlationId':corrId };

        ch.sendToQueue(q, new Buffer.from(JSON.stringify(msg)), {
          persistent: true,
          headers:{myH:myHeaders}
        });

        const time = new Date()
        console.log(`[x] - ${time.getSeconds()} - Sent ${JSON.stringify(msg)} to q:${q}`)

        setTimeout(() => {
          conn.close()
          resolve()
        }, 500)
      })
    })
  })
}

module.exports = {
  sendMessageToQueue,
  consumeMessagesFromQueue,
};

const amqp = require('amqplib/callback_api')


const consumeMessagesFromQueue = (adr,q) => {
  return new Promise((resolve, reject) => {
    amqp.connect(adr, (err0, conn) => {
      if (err0) return reject(err0);

      conn.createChannel((err1, ch) => {
        if (err1) return reject(err1);

        ch.assertQueue(q, { durable: true });
        

        ch.consume(q, msg => {
          const message = JSON.parse(msg.content.toString('utf8'));
          const time = new Date();
          console.log(`[x] - ${time.getSeconds()} - Consuming ${msg.content.toString('utf8')} from q : ${q}`);
          resolve(message);
        }, { noAck: true });

        setTimeout(() => {
          conn.close();
        }, 500);
      });
    });
  });
}


const sendMessageToQueue = async (adr,msg, q) => {
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

        ch.sendToQueue(q, new Buffer.from(JSON.stringify(msg)), {
          persistent: true
        })

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
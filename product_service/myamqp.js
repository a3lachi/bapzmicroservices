const amqp = require('amqplib/callback_api')



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
};
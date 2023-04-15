const amqp = require('amqplib/callback_api')

// Create connection
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

        ch.sendToQueue(q, new Buffer.from(JSON.stringify(msg)))

        const time = new Date()
        console.log(`[x] - ${time.getSeconds()} - Sent message to Queue : ${q}`)

        setTimeout(() => {
          conn.close()
          resolve()
        }, 500)
      })
    })
  })
}

// Create connection
// routingKey : region.us-east, order.created, or customer.deleted.
const sendMessageTo = async (adr, msg, topic, routingKey, queue) => {
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
        ch.assertExchange(topic, 'topic', { durable: true })

        if (queue) {
          ch.assertQueue(queue, { durable: true })
          ch.bindQueue(queue, topic, routingKey)
        }

        ch.publish(topic, routingKey, Buffer.from(JSON.stringify(msg)))

        const time = new Date()
        console.log(`[x] - ${time.getSeconds()} - Sent message to topic: ${topic}, routing key: ${routingKey}`)

        setTimeout(() => {
          conn.close()
          resolve()
        }, 500)
      })
    })
  })
}




module.exports = sendMessageToQueue

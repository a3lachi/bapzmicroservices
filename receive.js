const amqp = require('amqplib/callback_api')


function consumeMessagesFromQueue(adr,q) {
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

const consumeMessageFrom = (adr,topic, routingKey, queue) => {
  return new Promise((resolve, reject) => {
    amqp.connect(adr, (err0, conn) => {
      if (err0) return reject(err0);

      conn.createChannel((err1, ch) => {
        if (err1) return reject(err1);

        // ch.assertExchange(topic, 'direct', { durable: true });

        ch.assertQueue(queue, { durable: true });

        // ch.bindQueue(queue, topic, routingKey);
        ch.consume(queue, msg => {
          const message = JSON.parse(msg.content.toString('utf8'));
          const time = new Date();
          console.log(`[x] - ${time.getSeconds()} - Consuming messages from topic: ${topic}, routing key: ${routingKey}, queue: ${queue}`);
          resolve(message);
        }, { noAck: true });

        setTimeout(() => {
          conn.close();
        }, 500);
      });
    });
  });
}






module.exports = consumeMessagesFromQueue

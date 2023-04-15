#!/usr/bin/env node
const amqp = require('amqplib/callback_api')

amqp.connect('amqp://127.0.0.1', (err0, conn) => {
  if (err0) throw err0;
  conn?.createChannel((err1, ch) => {
    if(err1) throw err1 ;
    const q = 'bapzproduct'
    ch.assertQueue(q, { durable: true })
    console.log(`Waiting for messages in queue : ${q}`)
    ch.consume( q, msg => {
        console.log(` [x] - Received : ${msg.content.toString()}`)
      }, { noAck: true }
    )
  })
})
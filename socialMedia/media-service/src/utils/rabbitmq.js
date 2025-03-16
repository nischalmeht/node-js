const amqp = require("amqplib");
const logger = require("./logger");
let connection= null;
let channel= null;
const Exchange = "media";
async function createConnection() {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
       await channel.assertExchange(Exchange, "fanout", { durable: true });
        logger.info("RabbitMQ connection established successfully");
        return channel;
    } catch (error) {
        logger.error("Failed to connect to RabbitMQ", error);
        throw error;
    }
    
}
async function publishEvent(routingkey, message) {
    if(!channel){ 
        await createConnection()
    }
    try {
        await channel.publish(Exchange, routingkey, Buffer.from(JSON.stringify(message)));
        logger.info(`Published message ${JSON.stringify(message)} to exchange ${Exchange} with routing key ${routingkey}`);
    } catch (error) {
        logger.error("Failed to publish message", error);
        throw error;
    }
}
async function consumeEvent(queueName, callback) {  
    if(!channel){
        await createConnection()
    }
    try {
        await channel.assertQueue(queueName, { durable: true });
        await channel.bindQueue(queueName, Exchange, "");
        await channel.consume(queueName, (message) => {
           if(message!=null){
            const content= JSON.parse(message.content.toString());
            callback(content);
            channel.ack(message);
           }
        });
        logger.info(`Consuming messages from queue ${queueName}`);
    } catch (error) {
        logger.error("Failed to consume message", error);
        throw error;
    }
}

module.exports = { createConnection,publishEvent,consumeEvent };
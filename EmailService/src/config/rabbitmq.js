import amqp from "amqplib";

const EMAIL_QUEUE = "vibespace_email_queue";

const RETRY_QUEUE_1 = "vibespace_email_retry_10s";
const RETRY_QUEUE_2 = "vibespace_email_retry_20s";

const DLQ = "vibespace_email_dlq";

let connection;
let consumerChannel;
let publisherChannel;


const connectRabbitMQ = async () => {

    connection = await amqp.connect(
        process.env.RABBITMQ_URL
    );

    /*
        Channel for consuming messages.
    */
    consumerChannel = await connection.createChannel();


    /*
        Confirm channel for publishing retry/DLQ messages.

        RabbitMQ confirms that the message was accepted
        before we ACK the original message.
    */
    publisherChannel = await connection.createConfirmChannel();


    /*
        ================================
        Q1 - MAIN QUEUE
        ================================
    */

    await consumerChannel.assertQueue(EMAIL_QUEUE,{
            durable: true
        }
    );


    /*
        ================================
        Q2 - RETRY AFTER 10 SECONDS
        ================================
    */

    await consumerChannel.assertQueue(RETRY_QUEUE_1, {
            durable: true,
            arguments: {

                // Wait 10 seconds
                "x-message-ttl": 10000,

                /*
                    After TTL expires:

                    Q2
                     ↓
                    default exchange
                     ↓
                    Q1
                */
                "x-dead-letter-exchange": "",

                "x-dead-letter-routing-key":  EMAIL_QUEUE
            }
        }
    );


    /*
        ================================
        Q3 - RETRY AFTER 20 SECONDS
        ================================
    */

    await consumerChannel.assertQueue(RETRY_QUEUE_2, {
            durable: true,
            arguments: {
                // Wait 20 seconds
                "x-message-ttl": 20000,

                // Send expired message to default exchange
                "x-dead-letter-exchange": "",

                // Default exchange routes using queue name
                "x-dead-letter-routing-key": EMAIL_QUEUE
            }
        }
    );


    /*
        ================================
        DLQ
        ================================
    */

    await consumerChannel.assertQueue(DLQ, {
            durable: true
        }
    );


    console.log("🐇 RabbitMQ connected");

    console.log(`📩 Main Queue: ${EMAIL_QUEUE}`);
    console.log(`🔁 Retry Queue 1: ${RETRY_QUEUE_1} - 10 sec`);
    console.log(`🔁 Retry Queue 2: ${RETRY_QUEUE_2} - 20 sec`);
    console.log(`☠️ DLQ: ${DLQ}`);


    connection.on("error", (error) => {
        console.error("RabbitMQ connection error:", error);
    });

    connection.on("close", () => {
        console.log("RabbitMQ connection closed");
    });
};


/*
    Publish message to retry queue.

    IMPORTANT:
    We don't ACK the original message until
    RabbitMQ confirms this publish.
*/
const publishToRetryQueue = async (queueName, message) => {

    return new Promise((resolve, reject) => {
        publisherChannel.sendToQueue(
            queueName,

            Buffer.from(JSON.stringify(message)), {
                persistent: true,
                contentType: "application/json"
            },

            (error) => {

                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            }
        );
    });
};


/*
    Publish message permanently to DLQ.
*/
const publishToDLQ = async (message) => {

    return new Promise((resolve, reject) => {
        publisherChannel.sendToQueue(
            DLQ,
            Buffer.from(JSON.stringify(message)),{
                persistent: true,
                contentType: "application/json"
            },

            (error) => {

                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            }
        );
    });
};


/*
    Getter for consumer channel.

    The channel is created asynchronously,
    so the worker gets it after connectRabbitMQ().
*/
const getConsumerChannel = () => {

    if (!consumerChannel) {
        throw new Error("RabbitMQ consumer channel not initialized");
    }

    return consumerChannel;
};


export {
    connectRabbitMQ,
    getConsumerChannel,

    publishToRetryQueue,
    publishToDLQ,

    EMAIL_QUEUE,
    RETRY_QUEUE_1,
    RETRY_QUEUE_2,
    DLQ
};
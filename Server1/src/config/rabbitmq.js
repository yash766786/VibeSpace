import amqp from "amqplib";

// ========================================
// MAIN EMAIL QUEUE
// ========================================
const EMAIL_QUEUE = "vibespace_email_queue";

let connection;
let channel;

// ========================================
// CONNECT TO RABBITMQ
// ========================================
const connectRabbitMQ = async () => {
    try {
        /*
            Connect to CloudAMQP / RabbitMQ
        */
        connection = await amqp.connect(
            process.env.RABBITMQ_URL
        );

        /*
            ConfirmChannel

            This allows us to know that RabbitMQ
            accepted our published message.
        */
        channel = await connection.createConfirmChannel();

        /*
            Create main queue if it doesn't exist.

            This is Q1.
            Email Worker consumes from this queue.
        */
        await channel.assertQueue(EMAIL_QUEUE, {
                durable: true
            }
        );


        console.log("🐇 RabbitMQ connected");
        console.log(`📩 Queue: ${EMAIL_QUEUE}`);

        // ========================================
        // CONNECTION EVENTS
        // ========================================
        connection.on("error", (error) => {
            console.error("❌ RabbitMQ connection error:", error.message);
        });


        connection.on("close", () => {
            console.log("🔌 RabbitMQ connection closed");
        });

    }

    catch (error) {
        console.error("❌ Failed to connect to RabbitMQ:", error);
        throw error;
    }
};


// ========================================
// PUBLISH EMAIL EVENT
// ========================================

const publishEmailEvent = async (emailEvent) => {
    /*
        Make sure RabbitMQ is connected.
    */
    if (!channel) {
        throw new Error("RabbitMQ channel is not initialized");
    }

    /*
        Convert JavaScript object
        → JSON
        → Buffer
    */
    const message = Buffer.from(
        JSON.stringify(emailEvent)
    );


    /*
        Send message to Q1.
        persistent: true

        means RabbitMQ should persist the
        message to disk so it can survive
        broker restart more reliably.
    */
    channel.sendToQueue(EMAIL_QUEUE, message,{
            persistent: true,
            contentType: "application/json"
        }
    );


    /*
        Wait until RabbitMQ confirms that
        the message was accepted.

        Because we're using ConfirmChannel.
    */
    await channel.waitForConfirms();

    console.log(`📤 Email event published: ${emailEvent.eventId}`);
};


// ========================================
// EXPORT
// ========================================
export {
    connectRabbitMQ,
    publishEmailEvent
};
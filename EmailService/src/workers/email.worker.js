// import dotenv from "dotenv";
// dotenv.config();

// import {
//     connectRabbitMQ,
//     getConsumerChannel,
//     publishToRetryQueue,
//     publishToDLQ,
//     EMAIL_QUEUE,
//     RETRY_QUEUE_1,
//     RETRY_QUEUE_2
// } from "../config/rabbitmq.js";

// import { sendEmail } from "../services/email.service.js";

// const MAX_RETRIES = 2;

// const startWorker = async () => {

//     await connectRabbitMQ();

//     const channel = getConsumerChannel();

//     channel.prefetch(1);

//     console.log("👷 Email Worker started");

//     channel.consume(EMAIL_QUEUE, async (message) => {

//         if (!message) return;

//         let emailEvent;

//         try {

//             emailEvent = JSON.parse(
//                 message.content.toString()
//             );

//             await sendEmail(emailEvent);

//             channel.ack(message);

//         } catch (error) {

//             console.error(
//                 "Email processing failed:",
//                 error.message
//             );

//             if (!emailEvent) {

//                 await publishToDLQ({
//                     rawMessage: message.content.toString(),
//                     error: "Invalid email event"
//                 });

//                 channel.ack(message);
//                 return;
//             }

//             const retryCount = emailEvent.retryCount ?? 0;

//             if (retryCount === 0) {

//                 emailEvent.retryCount = 1;

//                 await publishToRetryQueue(
//                     RETRY_QUEUE_1,
//                     emailEvent
//                 );

//                 channel.ack(message);
//                 return;
//             }

//             if (retryCount === 1) {

//                 emailEvent.retryCount = 2;

//                 await publishToRetryQueue(
//                     RETRY_QUEUE_2,
//                     emailEvent
//                 );

//                 channel.ack(message);
//                 return;
//             }

//             emailEvent.failedAt = new Date().toISOString();
//             emailEvent.failureReason = error.message;

//             await publishToDLQ(emailEvent);

//             channel.ack(message);
//         }

//     }, { noAck: false });
// };

// startWorker();

import dotenv from "dotenv";
dotenv.config();

import {
    connectRabbitMQ,
    getConsumerChannel,
    publishToRetryQueue,
    publishToDLQ,

    EMAIL_QUEUE,
    RETRY_QUEUE_1,
    RETRY_QUEUE_2
} from "../config/rabbitmq.js";

import { sendEmail } from "../services/email.service.js";

/*
    Maximum number of attempts.
    Attempt 0 = first processing

    retryCount:
        0 → first attempt
        1 → retry through Q2
        2 → retry through Q3
        3 → DLQ
*/
const MAX_RETRIES = 2;


/*
    Start worker
*/
const startWorker = async () => {
    try {
        /*
            Connect to RabbitMQ
            and create queues.
        */
        await connectRabbitMQ();
        const channel = getConsumerChannel();
        /*
            IMPORTANT
            Only one message is given to this worker
            at a time.

            If we have two workers:
                Worker 1 → one message
                Worker 2 → one message
        */
        channel.prefetch(1);


        console.log("👷 Email Worker started");
        console.log(`📥 Listening on ${EMAIL_QUEUE}`);

        /*
            Worker consumes ONLY Q1.
        */
        channel.consume(EMAIL_QUEUE, async (message) => {
                if (!message) {
                    return;
                }

                try {
                    /*
                        Convert RabbitMQ Buffer
                        into JavaScript object.
                    */
                    const emailEvent = JSON.parse(
                            message.content.toString()
                        );


                    console.log("\n📨 Received email job:\n", emailEvent);

                    /*
                        Get retry count.

                        If this field doesn't exist,
                        assume this is the first attempt.
                    */
                    const retryCount = emailEvent.retryCount ?? 0;
                    console.log(`🔢 Retry count: ${retryCount}`);

                    /*
                        ==========================
                        PROCESS EMAIL
                        ==========================
                    */

                    await sendEmail(emailEvent);

                    /*
                        ==========================
                        SUCCESS
                        ==========================
                        Email successfully sent.
                        Now tell RabbitMQ:

                        "I have successfully processed
                         this message."

                        RabbitMQ removes it from Q1.
                    */

                    channel.ack(message);


                    console.log("✅ Email processed successfully");
                }

                catch (error) {
                    console.error("❌ Email processing failed:", error.message);

                    /*
                        We need the original message
                        again so we can determine
                        which retry queue to use.
                    */

                    let emailEvent;
                    try {

                        emailEvent = JSON.parse(
                                message.content.toString()
                            );

                    } catch (parseError) {

                        /*
                            If the message itself is
                            malformed, retrying it is
                            pointless.

                            Send it directly to DLQ.
                        */
                        console.error("❌ Invalid message format. Sending to DLQ.");

                        await publishToDLQ({
                            rawMessage: message.content.toString(),
                            error: "Invalid JSON message"
                        });


                        channel.ack(message);
                        return;
                    }


                    /*
                        Get current retry count.
                    */
                    const retryCount = emailEvent.retryCount ?? 0;


                    /*
                        ==========================
                        RETRY 1
                        ==========================
                        retryCount = 0
                        Send to Q2.
                        Q2 waits 10 seconds.
                        Then RabbitMQ automatically
                        sends it back to Q1.
                    */

                    if (retryCount === 0) {
                        emailEvent.retryCount = 1;

                        await publishToRetryQueue(
                            RETRY_QUEUE_1,
                            emailEvent
                        );


                        /*
                            IMPORTANT:

                            ACK ONLY AFTER retry
                            message has been
                            successfully published.
                        */
                        channel.ack(message);
                        console.log("🔁 Retry #1 scheduled → Q2 → 10 sec → Q1");
                        return;
                    }


                    /*
                        ==========================
                        RETRY 2
                        ==========================
                        retryCount = 1
                        Send to Q3.
                        Q3 waits 20 seconds.
                        Then returns to Q1.
                    */

                    if (retryCount === 1) {
                        emailEvent.retryCount = 2;

                        await publishToRetryQueue(
                            RETRY_QUEUE_2,
                            emailEvent
                        );

                        channel.ack(message);
                        console.log("🔁 Retry #2 scheduled → Q3 → 20 sec → Q1");


                        return;
                    }


                    /*
                        ==========================
                        MAX RETRIES EXCEEDED
                        ==========================
                    */
                    console.log("☠️ Maximum retries reached. Sending to DLQ.");

                    emailEvent.failedAt = new Date().toISOString();
                    emailEvent.failureReason = error.message;

                    /*
                        Send permanently failed
                        message to DLQ.
                    */
                    await publishToDLQ(
                        emailEvent
                    );


                    /*
                        Remove original message
                        from Q1.
                    */
                    channel.ack(message);
                    console.log("☠️ Message moved to DLQ");
                }
            },

            {
                /*
                    Manual ACK.

                    Worker decides when message
                    is successfully processed.
                */
                noAck: false
            }
        );

    }

    catch (error) {
        console.error("❌ Worker failed to start:", error);
        process.exit(1);
    }
};

export default startWorker;
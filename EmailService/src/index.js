import dotenv from "dotenv";
dotenv.config();

import EmailWorker from "./workers/email.worker.js"
EmailWorker();
import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()
router.use(verifyToken)

router.route("/:chatId")
    .get(getMessages)
    .post(upload.array("attachments", 3), sendMessage)
    // .delete(deleteMessage);

export default router;
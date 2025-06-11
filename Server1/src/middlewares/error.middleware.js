// 
import { ApiResponse } from "../utils/ApiResponse.js";

const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, null, message));
};

export { errorMiddleware };

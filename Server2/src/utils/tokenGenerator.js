import Jwt from "jsonwebtoken";

const generateAccessToken = async (user) => {
    return Jwt.sign(
        {
            _id: user._id.toString(),
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

export {generateAccessToken}
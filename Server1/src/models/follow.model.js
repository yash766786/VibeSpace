import mongoose, {Schema} from "mongoose";

const followSchema = new Schema(
    {
        follower: {    //one who follow
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        following: {       //one to whom 'follwer' is subscribing
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    {
        timestamps: true
    }
)

// prevent duplicate follow
followSchema.index({ follower: 1, following: 1 }, { unique: true });

export const Follow = mongoose.model("Follow", followSchema)
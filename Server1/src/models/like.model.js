import mongoose, {Schema} from "mongoose";


const likeSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {
    timestamps: true
})

// 🔥 Prevent duplicate likes
likeSchema.index({ likedBy: 1, post: 1 }, { unique: true, sparse: true });
likeSchema.index(
  { likedBy: 1, comment: 1 },
  { unique: true, partialFilterExpression: { comment: { $exists: true } } }
);


export const Like = mongoose.model("Like", likeSchema)
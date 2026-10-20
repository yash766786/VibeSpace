import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const postSchema = new Schema({
    postFile: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },

    description: {
        type: String,
        trim: true,
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    // 🔥 TAG SYSTEM (for recommendation + search)
    tags: [{
        type: String,
        lowercase: true,
        trim: true,
    }],

    // 🔥 MENTIONS (@user)
    mentions: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],

    // 🔥 AGGREGATED COUNTS (IMPORTANT for performance)
    likesCount: {
        type: Number,
        default: 0,
    },

    commentsCount: {
        type: Number,
        default: 0,
    },

    // 🔥 OPTIONAL (future use)
    shareCount: {
        type: Number,
        default: 0,
    },

    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    }

}, {
    timestamps: true,
});

// 🔥 INDEXES (critical for feed performance)
postSchema.index({ owner: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ likesCount: -1 });
postSchema.index({ tags: 1 });

postSchema.plugin(mongooseAggregatePaginate)

export const Post = mongoose.model("Post", postSchema);


// const postSchema = new Schema({
//     postFile: {
//         public_id: {
//             type: String,
//             required: true,
//         },
//         url: {
//             type: String,
//             required: true,
//         },
//     },
//     description: {
//         type: String,
//     },
//     owner: {
//         type: Schema.Types.ObjectId,
//         ref: "User"
//     }
// },
// {
//     timestamps: true
// })
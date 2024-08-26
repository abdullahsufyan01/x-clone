import mongoose from "mongoose";

const postsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    descriptionText: {
        type: String,
    },
    postImg: {
        type: String,
    },
    likes:[
        {
            type: mongoose.Schema.ObjectId,
        ref: 'User',
        }
    ],
    comments:[
        {
            text:{
                type:String,
                required:true
            },
            user:{
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true,
            }
        }
    ]


}, { timestamps: true })

const Post = mongoose.model("Posts",postsSchema);
export default Post
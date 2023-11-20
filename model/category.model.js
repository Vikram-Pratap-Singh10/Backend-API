import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    image:{
        type:String
    },
    description:{
        type:String
    },
    subcategories: [
        {
            name: {
                type: String,
            },
            image:{
                type:String
            },
            description:{
                type:String
            }
        }
    ],
});

export const Category = mongoose.model("category",categorySchema);

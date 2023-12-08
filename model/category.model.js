import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String
    },
    subcategories: [
        {
            created_by: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
            name: {
                type: String,
            },
            image: {
                type: String
            },
            description: {
                type: String
            },
            status: {
                type: String
            }
        }
    ],
}, { timestamps: true });

export const Category = mongoose.model("category", categorySchema);

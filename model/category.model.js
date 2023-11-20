import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    Categoryname: {
        type: String,
        required: true,
    },
    subcategories: [
        {
            name: {
                type: String,
            },
        }
    ],
});

export const Category = mongoose.model("category",categorySchema);

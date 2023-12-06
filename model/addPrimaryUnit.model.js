import mongoose from "mongoose"

const PrimaryUnitSchema = new mongoose.Schema({
    primaryUnit: {
        type: String
    }
}, { timestamps: true })

export const PrimaryUnit = mongoose.model("primaryUnit", PrimaryUnitSchema)
import { Snowflake } from 'discord.js';
import { Model, Document, Schema, model } from 'mongoose';

export interface AfkFormat extends Document {
    userID: Snowflake;
    reason: string;
}

const AfkSchema = new Schema({
    userID: String,
    reason: {
        type: String,
        default: "Just because"
    }
})

export const Afk = model("Afk", AfkSchema, "Afk") as Model<AfkFormat>;


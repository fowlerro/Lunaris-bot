import { Document, model, Schema } from "mongoose";

export interface IdeaDocument extends Document {
    description: string;
    createdAt: Date;
    updatedAt: Date
}

const IdeaSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true })

export const IdeaModel = model<IdeaDocument>('Ideas', IdeaSchema);
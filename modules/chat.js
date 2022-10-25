import mongoose from 'mongoose';
const { Schema } = mongoose;

export const chatSchema = new Schema({
    email: String,
    date: String,
    message: String,
})
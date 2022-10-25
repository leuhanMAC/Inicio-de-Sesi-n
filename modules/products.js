import mongoose from 'mongoose';
const { Schema } = mongoose;

export const productSchema = new Schema({
    title: String,
    price: Number,
    thumbnail: String,
})
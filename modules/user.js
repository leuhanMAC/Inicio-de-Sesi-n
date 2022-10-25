import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        index: {
            unique: true
        }
    },
    firstName: String,
    lastName: String,
});

export default mongoose.model('user', userSchema);
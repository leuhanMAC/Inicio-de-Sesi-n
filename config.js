import dotenv from 'dotenv';
dotenv.config();

export default {
    mongodb: {
        cnxStr: process.env.MONGO_URI,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        }
    }
}
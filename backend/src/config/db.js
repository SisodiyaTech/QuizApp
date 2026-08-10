import mongoose from 'mongoose';
import dns from 'dns/promises';

const ConnectDb = async () => {
    try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log('Error connecting to MongoDB', error);
        process.exit(1);
    }
};

export default ConnectDb;
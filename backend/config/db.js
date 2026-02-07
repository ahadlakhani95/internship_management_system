import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://ahadlakhani95:ahadlakhani95@cluster0.welzcpw.mongodb.net/internship_management?retryWrites=true&w=majority&appName=Cluster0");

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Stop app if DB fails
    }
};

export default connectDB;

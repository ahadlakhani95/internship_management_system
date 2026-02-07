import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectDB from "./config/db.js";
import internshipRoutes from './routes/internship.routes.js'
import applicationRoutes from './routes/application.routes.js'
import companyRoutes from './routes/companyRoutes.js';
import cors from 'cors';
const app = express();
let port = 4500;
app.use(express.json());
app.use(cors({
    origin: ["https://internship-management-system-first.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/company", companyRoutes); // <-- add this

dotenv.config();
// database connectivity
connectDB();

app.get("/", (req, res) => {
    res.send("server is running");
})

app.listen(port, () => {
    console.log(`server is running at ${port}`);
})
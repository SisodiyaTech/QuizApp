// packages
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Files
import ConnectDb from './src/config/db.js';
import authRoutes from './src/routes/auth.route.js';
import quizRoutes from './src/routes/quiz.route.js';


dotenv.config();

// Establish MongoDB connection in the background so it doesn't block server startup
ConnectDb();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
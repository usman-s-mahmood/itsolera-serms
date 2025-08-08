import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path'
import authRoutes from './routes/authRoutes.js'
import mongoConnection from './db/mongoConnection.js';
import dotenv from 'dotenv';


const PORT = 5000
const __dirname = path.resolve()
dotenv.config();

const app = express()
app.use(express.json())
app.use(cookieParser())

app.get('/test', async (req, res) => {
    return res.send('Testing!')
});

app.use(
    '/api/auth',
    authRoutes
);

app.listen(PORT, () => {
    console.log(`Running on PORT: ${PORT}`);
    mongoConnection();
});
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import userRoutes from './Routes/userRoutes.js';
import producRoutes from './Routes/productRoutes.js'
import orderRoutes from './Routes/orderRoutes.js';
import reportRoutes from './Routes/reportRoutes.js';
import fs from 'fs';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/product', producRoutes)
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);

if(!fs.existsSync('uploads')) fs.mkdirSync('uploads');
connectDB();

app.listen(process.env.PORT , () =>{
    console.log(`Server is running on PORT: ${process.env.PORT}`);
    
})

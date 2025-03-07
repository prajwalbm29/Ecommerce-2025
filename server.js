const express = require('express');
const morgan = require('morgan')
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');

// configuration of env
require('dotenv').config();

// configuration of db
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); 
app.use(morgan('dev'));

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use('/api/v1/product', productRoutes);

app.get('/', (req, res) => {
    res.status(200).send("<h1>Welcome to Ecommerce App</h1>")
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})
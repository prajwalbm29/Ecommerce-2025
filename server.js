const express = require('express');
const morgan = require('morgan')
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// configuration of env
require('dotenv').config();

// configuration of db
connectDB();

const app = express();

// Middlewares
app.use(express.json()); 
app.use(morgan('dev'))

// routes
app.use("/api/v1/auth", authRoutes);

app.get('/', (req, res) => {
    res.status(200).send("<h1>Welcome to Ecommerce App</h1>")
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})
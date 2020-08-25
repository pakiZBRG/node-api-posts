const express = require('express');
const postsRoutes = require('./routes/post');
const productsRoutes = require('./routes/products');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv/config");

const app = express();

app.use(cors())
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Routes
app.use('/posts', postsRoutes);
app.use('/products', productsRoutes)

mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true, useUnifiedTopology: true });

const PORT = process.env.PORT || 5000;
app.listen(PORT);
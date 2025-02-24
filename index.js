const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./Config/db');

const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderhistory = require('./routes/orderhistoryRoutes')
dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use('/api', authRoutes);
app.use('/api', orderRoutes);
app.use('/api',orderhistory)

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
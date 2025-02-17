const express = require('express');
const connectToDb = require('./db/db');
const app = express()
const port = process.env.port ||3000
const  bookRoutes=require('./routes/book-routes');
const authRoutes=require('./routes/auth-routes');
const homeRoutes=require('./routes/home-routes');
const adminRoutes=require('./routes/admin-routes');
require('dotenv').config();
app.use(express.urlencoded({extended:false}));
app.use(express.json())

connectToDb()
app.use('/api/books',bookRoutes);
app.use('/api',homeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
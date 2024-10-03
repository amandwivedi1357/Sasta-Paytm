// backend/index.js
const express = require('express');
const cors = require("cors");
const rootRouter = require("./routes/index");
const { connection } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);

app.listen(8080,async()=>{
    try {
        await connection;
        console.log('connected to db');
        console.log('app is running')
    } catch (error) {
        console.log(error)
        console.log('error connecting to db');
    }
});
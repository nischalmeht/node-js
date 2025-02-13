const express = require('express')

const app = express()
const port = 3000
const path=require('path');
const fs=require('fs');
const userModel = require('./userModel');
const status=require("express-status-monitor");
const cluster = require('node:cluster');
const Os = require("os")
const { pid } = require('process');
app.use(status())
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs')


const numCPUs=  Os.cpus().length;
if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
}else{
  app.get('/',(req,res)=>{
    return res.json({message:`hiii ${pid}`})
    // const stream = fs.createReadStream("./sample.txt", "utf-8");
    // stream.on("data", (chunk) => res.write(chunk));
    // stream.on("end", () => res.end());
  
  })
  
app.listen(port)
}
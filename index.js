// var http = require('http');

// //create a server object:
// http.createServer(function (req, res) {
//   res.write('Hello World!'); //write a response to the client
//   res.end(); //end the response
// }).listen(3000)

const express = require('express')
const app = express()
const port = 3000
const path=require('path');
const fs=require('fs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs')
app.use(function(req,res,next){
  console.log("middleware")
  next()
})
app.get('/', (req, res) => {
  fs.readdir('./files',function(err,files){
    console.log(files,'files')
    res.render('index',{files:files})
  })
})
app.get('/file/:filename', (req, res) => {
  fs.readFile(`./files/${req.params.filename}`,'utf-8',function(err,files){
    console.log(files)
    res.render("show",{filename:req.params.filename,fileData:files})
  })
  
})

app.post('/create', (req, res) => {
 fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,function(err){
   res.redirect('/')
 })
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
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
// app.get('/', (req, res) => {
//   fs.readdir('./files',function(err,files){ 
//     res.render('index',{files:files})
//   })
// })
app.get('/', (req, res) => {
  fs.readdir('./files', (err, files) => {
      if (err) {
          return res.status(500).json({ message: 'Error reading directory', error: err });
      }

      let fileData = [];

      // Read each file and parse its content
      let filesRead = 0;
      files.forEach((file, index) => {
          fs.readFile(`./files/${file}`, 'utf8', (err, data) => {
              filesRead++;
              if (!err) {
                  try {
                      fileData.push(JSON.parse(data)); // Parse JSON data
                  } catch (parseErr) {
                      console.error(`Error parsing file ${file}:`, parseErr);
                  }
              }

              // Send response after reading all files
              if (filesRead === files.length) {
                  res.render('index', { files: fileData }); // Pass file data to template
              }
              console.log(fileData,'fileData')
          });
      });

      // Handle case where there are no files
      if (files.length === 0) {
          res.render('index', { files: [] });
      }
  });
});
app.post('/create', (req, res) => {
  const jsonData = JSON.stringify(req.body, null, 2);
 fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,jsonData,function(err){
   res.redirect('/')
 })
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
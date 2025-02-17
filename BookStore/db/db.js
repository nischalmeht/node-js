const mongoose = require('mongoose');
const connectToDb= async()=>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/learning')
        .then(()=> console.log("MongoDB Connected"))
        .catch((err) => console.log("Mongo Error" , err));
    }catch(e){
        console.log('mongodb failed',e)
        process.exit(1)
    }
}

module.exports=connectToDb
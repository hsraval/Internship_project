const mongoose=require("mongoose");

const connection=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connection successfull");
    }
    catch(err){
        console.log(err.message);
        process.exit(1);
    }
}

module.exports=connection;
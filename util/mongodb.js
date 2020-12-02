const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let db;
const connection = async () =>{
    let client;
    try{
        client = await  MongoClient.connect(`${process.env.MONGO_URI}`, { useUnifiedTopology: true })
        db = client.db(); 
        console.log("Connected to mongoDB server".blue.bold);
        return;
    }
    catch(err){
        console.log(err);
    }
}

const getDB = ()=>{
    if (db) {
        return db;
    }
    else{
        console.log('Failed to get client.db()');
    }
}

module.exports.connection = connection;
module.exports.getDB = getDB;



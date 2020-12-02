//* This file is used for deleting/inserting the documents from data folder into the database.
//*In order to delete all documents from the database, enter -> node seeder.js -d
//*In order to insert all documents to the database, enter => node seeder.js -i


const fs = require('fs');
const getDB = require("./util/mongodb").getDB;
const connection = require("./util/mongodb").connection;
const dotenv = require("dotenv");
const colors = require("colors");

dotenv.config({
    path:'./config/config.env'
})

async function insertAll(data){
    const db = getDB();
    await db.collection('restaurant').insertMany(data);
    console.log('Successfully inserted restaurants');
}

async function insertAllUsers(data){   
    const db = getDB();
    await db.collection('owners').insertMany(data);
    console.log('Successfully inserted owners');
}

async function getIds(){
    const db = getDB();
    const ids = await db.collection('restaurant').find({}, {fields:{_id:1}}).toArray();
    return ids;
}

async function removeAll(){
    const db = getDB();
    await db.collection('restaurant').deleteMany({});
    await db.collection('owners').deleteMany({});
    console.log('Successfully deleted data');
}

async function createGeoJsonIndex(){
    const db = getDB();
    await db.collection('restaurant').createIndex({"address.location":"2dsphere"});
}

connection().then(()=>{
    if (process.argv[2] == '-i') {
        fs.readFile('./data/restaurants2.json', 'utf8',async function(err, data){
            const dataArray = JSON.parse(data);
            await createGeoJsonIndex();
            await insertAll(dataArray);

            fs.readFile('./data/owners-2500.json', 'utf8', async function(err, data){
                const dataArray = JSON.parse(data);
                const ids = await getIds();
                let random;

                for (let i = 0; i < dataArray.length; i++) {
                    dataArray[i].restaurants = [];
                }

                for (let i = 0; i < ids.length; i++) {
                   random = Math.floor(Math.random() * 2500);
                   dataArray[random].restaurants.push(ids[i]);
                }
                insertAllUsers(dataArray);
            })       
        })
    }

    if (process.argv[2] == '-d') {
        removeAll();
    }
})

const mongodb = require("mongodb");
const getDB = require("../util/mongodb").getDB;

class Owner{
    constructor(balance = 0, age, name, gender, email, phone, address, emergencyContacts = []){
        this.balance = balance;
        this.age = age;
        this.name = name;
        this.gender = gender;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.emergencyContacts = emergencyContacts;
        this.registered = new Date().toISOString();
        this.latitude = Math.random() * 30;
        this.longitude = Math.random() * 70;
        this.restaurants = [];
    }


    static async save(owner){
        const db = getDB();
        const newOwner = await db.collection('owners').insertOne(owner);
        return newOwner;
    }

    static async count(){
        const db = getDB();
        const count = await db.collection('owners').find().count();
        return count;
    }

    static async getOwners(filter, projection){
        const db = getDB();
        const data = await db.collection('owners').find(filter, {fields:projection}).toArray();
        return data;
    }

    static async getOwnerById(id, projection){
        const db = getDB();
        const data = await db.collection('owners').findOne(
            {_id:new mongodb.ObjectID(id)},
            {fields:projection}
            );
        return data;
    }

    static async setOwnertById(id, update){
        const db = getDB();
        const data = await db.collection('owners').updateOne({_id:new mongodb.ObjectID(id)},
        {$set:update});
        return data.matchedCount;
    }

    static async deleteOwnerById(id){
        const db = getDB();
        const data = await db.collection('owners').deleteOne({_id:new mongodb.ObjectID(id)});
        return data.deletedCount;
    }
}


module.exports = Owner
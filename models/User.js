const mongodb = require("mongodb");
const getDB = require("../util/mongodb").getDB;

class User{
    constructor(name, email, password){
        this.name = name;
        this.email = email;
        this.password = password;
        this.resetPasswordToken = null;
        this.resetPasswordExpires = null;
        this.createdAt = new Date().toISOString();
    }

    static async save(user){
        const db = getDB();
        const newUser = await db.collection('users').insertOne(user);
        return newUser;
    }

    static async getUsers(){
        const db = getDB();
        const users = await db.collection('users').find({}).toArray();
        return users;
    }

    static async getUserByEmail(email){
        const db = getDB();
        const user = await db.collection('users').findOne({email:email});
        return user;
    }

    static async setToken(email, hashedToken){
        const db = getDB();
        const user = await db.collection('users').updateOne(
            {email:email},
             {$set:{resetPasswordToken:hashedToken, resetPasswordExpires:Date.now()+ 30* 60 * 1000}})
        return user;
    }

    static async findByToken(token){
        const db = getDB();
        const user = await db.collection('users').findOne({resetPasswordToken:token, resetPasswordExpires:{$gt:Date.now()}})
        return user;
    }

    static async setNewPassword(token,password){
        const db = getDB();
        db.collection('users').updateOne(
            {token:token},
            {$set:{password:password,resetPasswordToken:null, resetPasswordExpires:null}}
        )
    }

    static async deleteById(id){
        const db = getDB();
        await db.collection('users').deleteOne({_id:new mongodb.ObjectID(id)});
        return user;
    }

}

module.exports = User;
const mongodb = require("mongodb");
const getDB = require("../util/mongodb").getDB;
const geocoder = require("../util/geocoder");

class Restaurant{
    constructor(address, borough, cuisine, grades, name, restaurant_id){
        this.address = address;
        this.borough = borough;
        this.cuisine = cuisine;
        this.grades = grades;
        this.name = name;
        this.restaurantId = restaurant_id;
        this.createdAt = new Date().toISOString();
    }

    static async save(restaurant){
        const db = getDB();
        const newRestaurant = await db.collection('restaurant').insertOne(restaurant);
        return newRestaurant;
    }

    static async count(){
        const db = getDB();
        const count = await db.collection('restaurant').find().count();
        return count;
    }

    static async getRestaurants(filter, projection, startIndex, limit){
        const db = getDB();
        const data = await db.collection('restaurant').find(
            filter,
            {fields:projection}).skip(startIndex).limit(limit).toArray();
        return data;
    }

    static async getRestaurantById(id, projection){
        const db = getDB();
        const data = await db.collection('restaurant').findOne(
            {_id:new mongodb.ObjectID(id)},
            {fields:projection}
            );
        return data;
    }

    static async setRestaurantById(id, update){
        const db = getDB();
        await db.collection('restaurant').updateOne({_id:new mongodb.ObjectID(id)},
        {$set:update});
    }

    static async deleteRestaurantById(id){
        const db = getDB();
        await db.collection('restaurant').deleteOne({_id:new mongodb.ObjectID(id)});
    }

    static async getWithinDistance(zipcode, maxDistance, filter, projection){
        const db = getDB();
        const res = await geocoder.geocode(parseInt(zipcode));   
        const data = await db.collection('restaurant').find({
            'address.location':{
                $near:{
                    $geometry:{
                        type:'Point',
                        coordinates:[res[0].longitude, res[0].latitude]
                    },
                    $maxDistance:parseInt(maxDistance)
                }
            }, ...filter}, {fields:projection}).toArray(); 
        return data;
    }
}

module.exports = Restaurant;
const catchAsync = require("../middleware/catchAsync");
const Owner = require("../models/Owner");
const ErrorResponse = require("../util/errorResponse");
const Restaurant = require("../models/Restaurant");
const mongodb = require("mongodb");

//*@desc get all owners
//*@route GET /api/v1/owners?
//*@access private
const getOwners = catchAsync(async(req, res, next) =>{
    const data = await Owner.getOwners(req.filter, req.projection);
    res.status(200).json({
        status:'Success',
        count:data.length,
        data:data
    });

});


//*@desc Get one owner
//*@route Get /api/v1/owners/:id?
//*@access public
const getOwner = catchAsync(async(req, res, next) =>{
    const id = req.params.id;
    const data = await Owner.getOwnerById(id, req.projection);
    if(data == null){
        return next(new ErrorResponse('No owner was found', 'Failed', 404))
    }
    res.status(200).json({
        status:'Success',
        data:data
    });
});

//*@desc create owner
//*@route POST /api/v1/owners
//*@access private
const postOwner = catchAsync(async(req, res, next) =>{
    const {balance, age, name, gender, email, phone, address, emergencyContacts} = req.body;
    const newOwner = new Owner(balance, age, name, gender, email, phone, address, emergencyContacts);
    const result = await Owner.save(newOwner);
    if (result) {
        if (result.insertedCount != 0) {
            res.status(201).json({
                status:'Success',
                message:'Owner was successfully created'
            }) 
        }  
    } 
    else{
        return next(new ErrorResponse('Failed to create owner', 'Failed', 500));
    }
    
});


//*@desc update owner
//*@route PATCH /api/v1/owners/:id
//*@access private
const updateOwner = catchAsync(async(req, res, next) =>{
    const id = req.params.id;
    const matchedCount = await Owner.setOwnertById(id, req.body);
    if(matchedCount == 0){
        return next(new ErrorResponse('No owner was found', 'Failed', 404))
    }
    res.status(200).json({
        status:'Success',
        message:'Owner was successfully updated'
    });
});


//*@desc Delete owner
//*@route DELETE /api/v1/owners/:id
//*access private
const deleteOwner = catchAsync(async(req, res, next) =>{
    const id = req.params.id;
    const deleteCount = await Owner.deleteOwnerById(id);
    if(deleteCount == 0){
        return next(new ErrorResponse('No owner was found', 'Failed', 404));
    }
    res.status(200).json({
        status:'Success',
        message:'Owner was deleted successfully'
    });
});


//*@desc Get owner restaurants
//*@route Get /api/v1/owners/:id/restaurants
//*access private
const getOwnerRestaurants = catchAsync(async(req, res, next) =>{
    const id = req.params.id;
    const results = await Owner.getOwnerById(id, {restaurants:1, _id:0});
    if(!results){
        return next(new ErrorResponse('No owner was found', 'Failed', 404))
    }
    const restaurants = results.restaurants.map((item) =>{
        return new mongodb.ObjectID(item._id);
    });

    const data = await Restaurant.getRestaurants(
        {_id:{$in:restaurants}}, req.projection, 0, restaurants.length
    );
    res.status(200).json({
        status:'Success',
        count:data.length,
        data:data
    });
});

module.exports.getOwners = getOwners;
module.exports.getOwner = getOwner;
module.exports.updateOwner = updateOwner;
module.exports.deleteOwner = deleteOwner;
module.exports.getOwnerRestaurants = getOwnerRestaurants;
module.exports.postOwner = postOwner;
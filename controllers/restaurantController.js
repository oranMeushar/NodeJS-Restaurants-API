const catchAsync = require("../middleware/catchAsync");
const Restaurant = require("../models/Restaurant");

//*@desc Get all resturants
//*@route GET /api/v1/resturants?
//*@access public
const getRestaurants = catchAsync(async(req, res, next) =>{ 
    
    //*Pagination
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * limit;
    const totalDocs = await Restaurant.count();
    const endIndex = page * limit;
    let pagination = {limit:limit}

    if (startIndex != 0) {
        pagination.previousPage = page - 1;
    }
    if (endIndex < totalDocs) {
        pagination.nextPage = page + 1;
    }

    const data = await Restaurant.getRestaurants(req.filter, req.projection, startIndex, limit);
    res.status(200).json({
        status:'Success',
        count:data.length,
        pagination:pagination,
        data:data
    });
});


//*@desc Get one restaurant
//*@route Get /api/v1/restaurants/:id?
//*@access public
const getRestaurant = catchAsync(async(req, res, next) =>{
    const id = req.params.id;
    const data = await Restaurant.getRestaurantById(id, req.projection);
    if(data == null){
        return next(new ErrorResponse('No restaurant was found', 'Failed', 404))
    }
    res.status(200).json({
        Success:'Success',
        data:data
    });
});

//*@desc update restaurant
//*@route PATCH /api/v1/restaurants/:id
//*@access private
const updateRestaurant = catchAsync(async(req, res, next) =>{
    const id = req.params.id;
    await Restaurant.setRestaurantById(id, req.body);
    res.status(200).json({
        status:'Success',
        message:'Restaurant was successfully updated'
    });
});



//*@desc Post resturant
//*@route POST /api/v1/resturants
//*@access public
const postRestaurants = catchAsync(async(req, res, next) =>{
    const {address, borough, cuisine, grades, name, restaurant_id} = req.body;
    const newRestaurant = new Restaurant(address, borough, cuisine, grades, name, restaurant_id);
    await Restaurant.save(newRestaurant);
    res.status(201).json({
        status:'Success',
        message:'Restaurant was saved successfully'
    });   
});


//*@desc Delete restaurant
//*@route DELETE /api/v1/restaurants/:id
//*access private
const deleteRestaurant = catchAsync(async(req, res, next) =>{
    const id = req.params.id;
    await Restaurant.deleteRestaurantById(id);
    res.status(200).json({
        status:'Success',
        message:'Restaurant was deleted successfully'
    });

});

//*@desc Get restaurant within maxDistance(units = m)
//*@route GET /api/v1/restaurants/distance/:zipcode/:maxDistance
//*access public
const getWithinDistance = catchAsync(async(req, res, next) =>
{
    const {zipcode, maxDistance} = req.params;
    if(maxDistance < 0){
        const error =  new Error();
        error.name = 'Invalid input';
        throw error;
    }
    const data = await Restaurant.getWithinDistance(zipcode, maxDistance, req.filter, req.projection);
    res.status(200).json({
        status:'Success',
        count:data.length,
        data:data
    });
});

module.exports.getRestaurants = getRestaurants;
module.exports.postRestaurants = postRestaurants;
module.exports.getRestaurant = getRestaurant;
module.exports.updateRestaurant = updateRestaurant;
module.exports.deleteRestaurant = deleteRestaurant;
module.exports.getWithinDistance = getWithinDistance;
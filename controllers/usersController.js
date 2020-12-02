const catchAsync = require("../middleware/catchAsync")
const User = require("../models/User");

const getUsers = catchAsync(async(req, res, next) =>{
    const users = await User.getUsers();
    res.status(200).json({
        status:'Success',
        count:users.length,
        users:users
    })
});

const deleteUser = catchAsync(async(req, res, next) =>{
    const id = req.params.id;
    await User.deleteById(id);
    res.status(200).json({
        status:'Success',
        message:'User was successfuly removed'
    });
});


module.exports.getUsers = getUsers;
module.exports.deleteUser = deleteUser;
const catchAsync = require("../middleware/catchAsync");
const ErrorResponse = require("../util/errorResponse");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../util/sendEmail");


//*@desc create new user
//*@route POST /api/v1/auth/register
//*@access public
const postRegister = catchAsync(async(req, res, next) =>{
    const {name, email, password, confirmedPassword} = req.body;
    if (password != confirmedPassword) {
        return next(new ErrorResponse('passwords dont match', 'Failed', 400));
    }
    const user = await User.getUserByEmail(email);

    if (user) {
        return next(new ErrorResponse('Email is already taken', 'Failed', 400));
    }

    //*hash user password
    const hashedPassword = await bcrypt.hash(password.toString(), 12);
    const newUser = new User(name, email, hashedPassword);
    const result = await User.save(newUser);
    if (result) {    
            res.status(200).json({
                status:'Success',
                message:'User was successfully created'
            });  
    } 
    else{
        return next(new ErrorResponse('Failed to create owner', 'Failed', 500));
    }
});

//*@desc Login user
//*@route POST /api/v1/auth/login
//*@access public
const postLogin = catchAsync(async(req, res, next) =>{
    const {email, password} = req.body;
    const user = await User.getUserByEmail(email);

    if(user){
        const isMatch = await bcrypt.compare(password.toString(), user.password);     
        if(isMatch){
            const token = jwt.sign({
                email:user.email,
                userId:user._id.toString()
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE}
            );
            const options = {
                expires:new Date(Date.now()+1000*60),
                httpOnly:true
            }
           
            res
            .status(200)
            .cookie('token', token, options)
            .json({
                status:'Success',
                userId:user._id,
                data:token
            });
        }
        else{
           return next(new ErrorResponse('Validation failed', 'Failed', 401));
        }
    }
    else{
        return next(new ErrorResponse('Validation failed', 'Failed', 401));
    }
});


//*@desc Reset user password
//*@route POST /api/v1/auth/reset
//*@access public
const forgotPassword = catchAsync(async(req, res, next) =>{
    const email = req.body.email;
    const user = await User.getUserByEmail(email);
    if (!user) {
        return next(new ErrorResponse('User was not found', 'Failed', 404));
    }

    const token = crypto.randomBytes(32).toString('hex');
    await User.setToken(email, token);
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset/${token}`
    await sendEmail(email, resetUrl);

    res.status(200).json({
        status:'Success',
        data:token,
        resetUrl:resetUrl
    })
});

//*@desc logut user
//*@route GET /api/v1/auth/logout
//*@access private
const logout = catchAsync(async(req, res, next) =>{
    const options = {
        expires:new Date(Date.now()+10 * 60 * 1000),
        httpOnly:true
    }

    res
    .status(200)
    .cookie('token', '', options)
    .json({
        status:'Success',
        message:'Successfuly loged out'
    })
})

//*@desc 
//*@route GET /api/v1/auth/reset/:token
//*@access public
const getNewPassword = catchAsync(async(req, res, next) =>{
    const token = req.params.token;
    const user = await User.findByToken(token);
    if (user) {
        return res.status(200).json({
            status:'Success',
            data:token
        })
    }
    return next(new ErrorResponse('Invalid credentials', 'Failed', 400));
});


//*@desc post new password
//*@route POST /api/v1/auth/reset/newPassword
//*@access public
const postNewPassword = catchAsync(async(req, res, next) =>{
    const {password, token} = req.body;
    const user = await User.findByToken(token);
    if(user){
        const hashPassword = await bcrypt.hash(password.toString(), 12);
        await User.setNewPassword(token, hashPassword);
        return res.status(200).json({
            status:'Success',
            message:'Password was successfully changed'
        })
        
    }
    return next(new ErrorResponse('Invalid credentials', 'Failed', 400));
});

module.exports.postRegister = postRegister;
module.exports.postLogin = postLogin;
module.exports.forgotPassword = forgotPassword;
module.exports.logout = logout;
module.exports.getNewPassword = getNewPassword;
module.exports.postNewPassword = postNewPassword;
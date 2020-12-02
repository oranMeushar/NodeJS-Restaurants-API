const jwt = require("jsonwebtoken");
const ErrorResponse = require("../util/errorResponse");
const isAuth = (req, res, next) =>{
    let token = req.get('Authorization');
    let decodedToken;

    if (token && token.startsWith('Bearer')) {
        try{
            token = token.split(' ')[1];
            console.log("token = ", token);
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            console.log("decodedToken = ",decodedToken);
        }
        catch(err){
            return next(err);
        } 

        if (!decodedToken) {
            return next(new ErrorResponse('Not authenticated', 'Failed', 401));
        }
        req.userId = decodedToken.userId;
        return next();
    }
    return next(new ErrorResponse('Not authenticated', 'Failed', 401));  
}


module.exports = isAuth;

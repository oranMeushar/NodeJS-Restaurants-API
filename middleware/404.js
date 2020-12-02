const error404 = (req, res, next) =>{
    const error = new Error(`Cant find ${req.originalUrl} on this server`);
    error.statusCode = 404;
    error.status = 'Failed';
    next(error);
}


module.exports = error404;
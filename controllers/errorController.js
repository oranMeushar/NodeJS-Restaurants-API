const error = (err, req, res, next) =>{
    let statusCode = null;
    let status = null;

    statusCode = err.statusCode || 500;
    status = err.status || 'Server Error';
    res.status(statusCode).json({
        status:status,
        errorType:err.name,
        message:err.message,
        errorStack: err.stack
    })
}

module.exports = error;

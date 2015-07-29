function generalHandler(err, req, res, next) {
    console.error(err.stack);
    if (req.app.get('env') !== 'development') {
        err = {};
    }
    res.status(err.status || 500);
    res.render('error', {
        statusCode: res.statusCode,
        message: err.message,
        error: err.stack
    });
};

function unknownRouteHandler(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}

module.exports.unknownRouteHandler = unknownRouteHandler;
module.exports.generalHandler = generalHandler;
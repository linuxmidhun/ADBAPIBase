function Response(req, res, next) {
    res.Success = function (msg = '', obj = null) {
        if (obj === null) return res.status(200).json({
            status: 200,
            message: msg === '' ? "Request completed successfully." : msg
        });

        // Response with data
        return res.status(200).json({
            status: 200,
            message: msg === '' ? "Request completed successfully." : msg,
            data: obj
        });
    }

    res.Error = (msg = '') => res.status(400).json({
        status: 400,
        message: msg === '' ? "Error in processing request." : msg
    });

    res.NotFound = (msg = '') => res.status(404).json({
        status: 404,
        message: msg === '' ? "Record not found." : msg
    });

    res.Exists = (msg = '') => res.status(409).json({
        status: 409,
        message: msg === '' ? "Record already exists" : msg
    });

    res.NoAuth = (msg = '') => res.status(401).json({
        status: 403,
        message: msg === '' ? "Not Authorized" : msg
    });

    res.Forbidden = (msg = '') => res.status(403).json({
        status: 403,
        message: msg === '' ? "Forbidden request" : msg
    });

    res.Exception = (msg = '') => res.status(500).json({
        status: 500,
        message: msg === '' ? "Unexpectd error" : msg
    });

    next();
}

module.exports = Response;
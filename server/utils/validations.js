const validateParams = function (request) {
    return function (req, res, next) {
        for (let param of request) {
            if (!checkParamPresent(Object.keys(req.body), param) && param.required){
                return res.status(400).send({
                    status: 400,
                    result: `Missing required parameter: ${param.param_name}`
                });
            }
        }
        next();
    }
};

const checkParamPresent = function (reqParams, paramObj) {
    return (reqParams.includes(paramObj.param_key));
};

const isLoggedIn = (req) => {
    return typeof req.session.user === "object" && req.session.user._id;
}

module.exports = {
    validateParams,
    isLoggedIn
};
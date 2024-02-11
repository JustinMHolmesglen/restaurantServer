const debugError500 = require('debug')('app:error500');

class ApiError {
    constructor(code, message, err){
        this.code = code;
        this.message = message;
        this.err = err;
    }

    // 400 bad request
    static badRequest(msg){
        return new ApiError(400, `Bad Request: ${msg}`)
    }

    static denyAccess(msg){
        return new ApiError(401, `Access denied: ${msg}`)
    }

    //403 Forbidden
    static forbidden(msg){
        return new ApiError(403, `Access denied: ${msg}`)
    }
    // 404 Not found
    static notFound(){
        return new ApiError(404, 'Resource Not Found')
    }
    // 413 Error
    static tooLarge(msg){
        return new ApiError(413, `Upload Failes: ${msg}`)
    }

    // 422 Error
    static cannotProcess(msg){
        return new ApiError(422, `Upload Failes: ${msg}`)
    }

    // 500 Internal server error
    static internal(msg, err){
        console.error(err);
        return new ApiError(500, `Internal server error: ${msg}`)
    }
}

module.exports = ApiError;
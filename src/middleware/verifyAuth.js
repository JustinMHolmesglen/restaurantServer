const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const debugJwt = require('debug')('app:jwt');

const auth = (req, res, next) => {
    //load token
    let token = req.header("Authorization")

    //triger 1st 401 - token not passed with header
    if(!token){
        return next(ApiError.denyAccess("No token provided"));
    } else {
        token = token.substring(7, token.length)
        //remove for production
        debugJwt(`Debug returned token: ${token}`);

    }

    //test for valid token
    try{
        const decoded = jwt.verify(token, config.authentication.jwtSecret);
        req.user = decoded;
        debugJwt(`User credentials verified ${req.user.username}`);
        next();

    //catch invalid token 401
    } catch(ex) {
        debugJwt(ex)
        return next(ApiError.denyAccess("Invalid Token"));
    }

}

const admin = (req, res, next) => {
    // 403 ERROR: FORBIDDEN
    if(!req.user.isAdmin){
      debugJwt(req.user);
      return next(ApiError.forbidden("Insufficient permissions"));
    }
    // SUCCESS
    debugJwt(`Admin access granted: ${req.user.isAdmin}`);
    next();
  }
  

const verifyAuth = {
    auth,
    admin

}

module.exports = verifyAuth
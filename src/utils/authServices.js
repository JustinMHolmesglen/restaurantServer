const { db } = require('../config/db');
const config = require('../config/config')
const debugAuth = require('debug')('app:authservices')

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const _ = require("lodash")


module.exports = {
async findUser(email){
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
  
    // SUCCESS: Push object properties to array and send to client
    let users = [];
    snapshot.forEach(doc => {
      users.push({
        id: doc.id,
        username: doc.data().username,
        email: doc.data().email,
        password: doc.data().password,
        isAdmin: doc.data().isAdmin
      });
    });
    // Search the users array for a duplicate
    const userMatch = users.filter(user => 
      email === user.email
    );
    return userMatch;
  },

  async hashPassword(password){
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  },

  async comparePassword(user, password){
    // storing password
    const hashPassword = user[0].password;
    //compare using bcrypt
    const passwordMatch = await bcrypt.compare(
      password,
      hashPassword
    );
    return passwordMatch;
    
  },

  async userDetailsToJSON(id){
    const usersRef = db.collection('users');
    const user = await usersRef.doc(id).get();
    const userJSON = _.omit(
      { id: id, ...user.data() },
      'password'
    );
    debugAuth(userJSON);
    return userJSON;
  },

  jwtSignUser(user){
      const payload = user;
      const secret = "config.authentication.jwtSecret";
      const tokenExpireTime = 60 * 60 * 24;
      
      const token = jwt.sign(payload, secret, {expiresIn: tokenExpireTime })

      return token;
  }
}
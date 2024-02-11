function isAuthenticated(context) {
    if (!context.user) {
      throw new AuthenticationError('User is not authenticated, No token provided');
    }
  }
  
  function isAuthorized(user, context) {
    if (user._id.toString() !== context.user._id) {
      throw new ApolloError('User is not authorized to perform this action', 'FORBIDDEN', {
        httpStatusCode: 403,
      });
    }
  }

module.exports.isAuthenticated = isAuthenticated;
module.exports.isAuthorized = isAuthorized;
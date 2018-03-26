let isRideLeaderAuthorized = function (req, res, next) {
        if(req.user.role === 3 || req.user.role === 2){
               ('user is ride leader or higher', req.user);        
        return next();
        } else {
            res.send('User not authorized for action');
        }
  }

  module.exports = isRideLeaderAuthorized;
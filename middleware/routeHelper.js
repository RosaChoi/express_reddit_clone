var db = require("../models");

var routeHelpers = {
  ensureLoggedIn: function(req, res, next) {
    if (req.session.id !== null) {
      return next();
    }
    else {
     res.redirect('/login');
    }
  },

  ensureCorrectUserForPost: function(req, res, next) {
    db.Post.findById(req.params.id).populate('author').exec(function(err,post){
      console.log(post)
      if (post.author.id !== req.session.id) {
        res.redirect('/posts');
      }
      else {
       return next();
      }
    });

  },
  preventLoginSignup: function(req, res, next) {
    if (req.session.id !== null) {
      res.redirect('/users/index');
    }
    else {
     return next();
    }
  }
};

module.exports = routeHelpers;
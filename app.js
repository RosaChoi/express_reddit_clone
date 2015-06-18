var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    session = require("cookie-session"),
    db = require('./models');
    loginMiddleware = require("./middleware/loginHelper");
    routeMiddleware = require("./middleware/routeHelper");

app.set('view engine', 'ejs');
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  maxAge: 3600000,
  secret: 'supersecretro',
  name: "double chocochip"
}));

app.use(loginMiddleware);

//ROOT
app.get('/', function(req,res){
  res.redirect('/posts');
});

app.get('/users/index', routeMiddleware.preventLoginSignup, function(req,res){
  res.render('users/index')
})

app.get('/login', routeMiddleware.preventLoginSignup, function(req,res){
  res.render('users/login')
})

app.post("/login", function (req, res) {
  db.User.authenticate(req.body.user,
  function (err, user) {
    if (!err && user !== null) {
      req.login(user);
      res.redirect("/posts");
    } else {
      console.log(err)
      res.render('users/login', {err:err});
    }
  });
});

app.get('/signup', routeMiddleware.preventLoginSignup, function(req,res){
  res.render('users/signup')
})

app.post('/signup', function(req,res){
   db.User.create(req.body.user, function(err, user){
    if (user) {
      console.log(user)
      res.redirect('/posts')
    } else {
      console.log(err)
      res.render('errors/404');
    }
  })
})

//USERS SHOW PAGE
app.get('/users/:id',function(req,res){
  // db.User.findById(req.params.id, function(err,user){
  //   res.render('users/show', user:user)
  // }
})


/********* POST ROUTES *********/

//INDEX
app.get('/posts', function(req,res) {
  db.Post.find({}).populate('author', 'username').exec(function(err, posts) {
    if (err) {
      console.log(err);
    } else {
      if(req.session.id == null){
        res.render('posts/index', {posts: posts, currentuser: ""});
      } else {
        db.User.findById(req.session.id, function(err,user){
          res.render('posts/index', {posts: posts, currentuser: user.username});
        })
      }
    }
  });
});

//NEW POST
app.get('/posts/new', routeMiddleware.ensureLoggedIn, function(req,res) {
  console.log(req.session.id)
  res.render("posts/new", {author_id:req.session.id})
});

//CREATE POST
app.post('/posts', function(req,res) {
  db.Post.create(req.body.post, function(err, post){
    if (err) {
      console.log(err)
      res.render('/posts/new')
    } else {
      res.redirect('/posts')
    }
  });
});

//SHOW POST
app.get('/posts/:id', function(req,res){
  db.Post.findById(req.params.id).populate('comments').exec(
    function(err,post){
      res.render('posts/show', {post: post})
    });
});

//EDIT POST
app.get('/posts/:id/edit',routeMiddleware.ensureCorrectUserForPost, function(req,res){
  db.Post.findById(req.params.id, function(err,post){
    if (err) {
      console.log(err);
    }
    res.render('posts/edit', {post: post})
  })
})

//UPDATE POST
app.put('/posts/:id', function(req,res){
  var show_page = "/posts/" + req.params.id
  db.Post.findByIdAndUpdate(req.params.id, req.body.post, function(err,post){
    if (err) {
      console.log(err)
      res.render('posts/edit')
    } else {
    res.redirect(show_page)
    }
  })
})

//DESTROY POST
app.delete('/posts/:id', function(req,res){
  db.Post.findById(req.params.id, function(err, post){
    if (err) {
      console.log(err)
      res.render('posts/show')
    } else {
      post.remove()
      res.redirect('/posts')
    }
  })
})



/********* COMMENT ROUTES *********/
//INDEX
app.get('/posts/:post_id/comments', function(req,res){
  db.Post.findById(req.params.post_id)
    .populate('comments')
    .exec(function(err,post) {
    res.render("comments/index", {post:post});
  });
});

//NEW COMMENT
app.get('/posts/:post_id/comments/new', function(req,res){
  db.Post.findById(req.params.post_id, function (err, post) {
      res.render("comments/new", {post:post});
    });
});


//CREATE COMMENT
app.post('/posts/:post_id/comments', function(req,res) {
  db.Comment.create(req.body.comment, function(err, comments) {
    if(err) {
      console.log(err);
      res.render('comments/new');
    } else {
      db.Post.findById(req.params.post_id, function(err, post) {
        post.comments.push(comments);
        console.log(comments);
        comments.post = post._id;
        comments.save();
        post.save();
        res.redirect("/posts/" + req.params.post_id + "/comments");
      });
    }
  });
});

//EDIT COMMENT
app.get('/comments/:id/edit', function(req,res) {
  db.Comment.findById(req.params.id, function(err, comment) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/edit", {comment:comment});
    }
  });
});

//UPDATE COMMENT
app.put('/comments/:id', function(req,res){
  db.Comment.findByIdAndUpdate(req.params.id, req.body.comment, function(err, comment) {
    if(err){
      res.render('comments/edit');
    } else {
      res.redirect('/posts/' + comment.post + '/comments');
    }
  });
});

//DESTROY
app.delete('/comments/:id', function(req,res) {
  db.Comment.findByIdAndRemove(req.params.id, function(err, comment) {
    if(err) {
      console.log(err);
      res.render('comments/edit');
    }
    else {
      res.redirect('/posts' + comment.post + "/comments");
    }
  });
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});


//CATCH ALL
app.get('*', function(req,res){
  res.render('errors/404');
});


//START SERVER
app.listen(process.env.PORT || 3000, function() {
  "Server is listening on port 3000";
})

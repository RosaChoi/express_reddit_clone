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

//ROOT
app.get('/',routeMiddleware.preventLoginSignup,function(req,res) {
  res.redirect('/posts');
});

//USERS SHOW PAGE
app.get('/users/:id',function(req,res){
  // db.User.findById(req.params.id, function(err,user){
  //   res.render('users/show', user:user)
  // })
})

//INDEX
app.get('/posts', function(req,res) {
  db.Post.find({},
  function(err, posts) {
    res.render('posts/index', {posts: posts});
  });
});

//NEW POST
app.get('/posts/new', function(req,res) {
  res.render("posts/new")
});

//SHOW POST
app.get('/posts/:id', function(req,res){
  console.log(req.params.id)
  db.Post.findById(req.params.id, function(err,post){
    res.render('posts/show', {post: post})
  })
})

//EDIT POST
app.get('/posts/:id/edit', function(req,res){
  db.Post.findById(req.params.id, function(err,post){
    res.render('posts/edit', {post: post})
  })
})

//UPDATE POST
app.put('/posts/:id', function(req,res){
  var show_page = "/posts/" + req.params.id
  db.Post.findByIdAndUpdate(req.params.id, req.body.post, function(err,post){
    if (err) {
      console.log(err)
      res.render('edit')
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

//CREATE POST
app.post('/posts', function(req,res) {
  db.Post.create(req.body.post, function(err, post){
    if (err) { 
      console.log(err)
      res.render('/posts/new')
    } else {
      res.redirect('/posts')
    }
  })
});

//CATCH ALL
app.get('*', function(req,res){
  res.render('errors/404');
});


//START SERVER
app.listen(process.env.PORT || 3000, function() {
  "Server is listening on port 3000";
})

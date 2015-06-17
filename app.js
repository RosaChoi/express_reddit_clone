var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    db = require('./models');

app.set('view engine', 'ejs');
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

//ROOT
app.get('/', function(req,res) {
  res.redirect('/posts');
});

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

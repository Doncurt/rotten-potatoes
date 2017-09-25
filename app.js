/** Express JS set up**/
var express = require('express')
//set up for method override
var methodOverride = require('method-override')
var app = express()


app.listen(process.env.PORT || 3000, function () {
  console.log('Portfolio App listening on port 3000!')
})

/** Handlebars.js set up **/

var exphbs  = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

/**Root route  to render home.handlebars and set it to the homepage **/

app.get('/reviews', function (req, res) {
  res.render('reviews-index', {reviews: reviews});
})
/** Connection for Mongoose ODM **/
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/rotten-potatoes');
/** model for the review **/

app.get('/', function (req, res) {
  Review.find(function(err, reviews) {
    res.render('reviews-index', {reviews: reviews});
  })
})
// NEW
app.get('/reviews/new', function (req, res) {
  res.render('reviews-new', {});
})

// INITIALIZE BODY-PARSER AND ADD IT TO APP
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


// CREATE
app.post('/reviews', function (req, res) {
  Review.create(req.body, function(err, review) {
    res.redirect('/reviews/' + review._id);
  })
})
//Updates the review model
var Review = mongoose.model('Review', {
  title: String,
  description: String,
  movieTitle: String
});

// SHOW
app.get('/reviews/:id', function (req, res) {
  Review.findById(req.params.id).exec(function (err, review) {
    res.render('reviews-show', {review: review});
  })
});

// EDIT
app.get('/reviews/:id/edit', function (req, res) {
  Review.findById(req.params.id, function(err, review) {
    res.render('reviews-edit', {review: review});
  })
})

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))
// UPDATE
app.put('/reviews/:id', function (req, res) {
  Review.findByIdAndUpdate(req.params.id,  req.body, function(err, review) {
    res.redirect('/reviews/' + review._id);
  })
})
// DELETE
app.delete('/reviews/:id', function (req, res) {
  Review.findByIdAndRemove(req.params.id, function(err) {
    res.redirect('/');
  })
})

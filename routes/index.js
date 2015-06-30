var express = require('express');
var router = express.Router();

//database connection
var mongoose = require('mongoose');

//local with local mongo db testing 
//var db = mongoose.connect('mongodb://localhost/nodecrud');
 
//local with remote mongolab DB
//OR remote (heroku) with remote mongolabs DB
try{
    var uristring = require('../data/mongolabinfo.js').name;
    //console.log("trying local mongolab string");
}
catch(err){
    //console.log("no connection file so go on to Heroku config var");
    var uristring = process.env.MONGOLAB_URI;   //if Heroku env
}
console.log("Either way: uristring is "+ uristring);

var db = mongoose.connect(uristring);

//database schema
var User = db.model('user', 
	{
		postname: String,
        username: String,
		email: String,
        organization: String,
        telephone: String,
        postcontent: String
 	});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Suggestion Module' });
});

router.get('/thankyou', function(req, res, next) {
  res.render('thankyou', { title: 'Thank You for Your Message' });
});


/* GET Hello World page. */
router.get('/about', function(req, res) {
    res.render('about', { title: 'Lexitown Does Word Functions' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    User.find( {} , function(err,docs){
        docs.reverse();   //reverse the array before handing to client
        docs = docs.slice(0,5);

        res.render('userlist', {'userlist':docs});
    });
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});



/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    var NewUserDoc = new User({
        postname: req.body.postname,
        username: req.body.username,
        email: req.body.email,
        organization: req.body.organization,
        telephone: req.body.telephone,
        postcontent: req.body.postcontent 
        });

    console.log(NewUserDoc);
    NewUserDoc.save(function(err, callback){
        res.redirect('/thankyou');
    });

});

router.get('/deleteuser/:id', function(req, res){
    console.log(req.params.id);
    User.remove({_id: req.params.id }, function(){
           res.redirect('/userlist');
    });
});

router.get('/edituser/:id', function(req,res){
     User.find({_id: req.params.id}, function(err, docs){
        console.log(docs);
        res.render('edituser.jade', {user : docs});
    });
});

router.post('/update', function(req,res){
    console.log('request body id is '+ req.body.id);   
    console.log('username is  '+ req.body.username);   
    
    User.findOneAndUpdate(
                { _id: req.body.id}, 
                {$set: {
                        _id      : req.body.id,
                        username : req.body.username,
                        email    : req.body.email
                }}, 
                {upsert: false},

                function(err, docs){
                     res.redirect('userlist');
                    }
                );
 });




module.exports = router;

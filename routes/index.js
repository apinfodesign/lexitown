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

var hardadminperson = "joe";
var hardadminpass = "secret";
var cookietime;

var db = mongoose.connect(uristring);

//database schema
var User = db.model('user', 
	{
		postname: String,
        username: String,
		email: String,
        organization: String,
        telephone: String,
        postcontent: String,
        date : {type: Date}
 	});

router.get('/logout', function(req,res){
    res.clearCookie('lexitownlast');
    res.redirect('/');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Suggestion Module' });
});

router.get('/thankyou', function(req, res, next) {
  res.render('thankyou', { title: 'Thank You for Your Message' });
});

/* GET About page. */
router.get('/about', function(req, res) {
    res.render('about', { title: 'Suggestion Module' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {

    var cookietime = req.cookies.lexitownlast;
    console.log("cookietime is " + cookietime);

    if ( recent(cookietime) )
    {    
        User.find( {} , function(err,docs){
        docs.reverse();   //reverse the array before handing to client
        docs = docs.slice(0,10);

        res.render('userlist', {'userlist':docs});
        });
    }
    else
    {
        console.log("admin edit is blocked");
        res.redirect('/');
    }
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    var date = Date.now();
    console.log(date + " is the current date");

    var NewUserDoc = new User({
        postname: req.body.postname,
        username: req.body.username,
        email: req.body.email,
        organization: req.body.organization,
        telephone: req.body.telephone,
        postcontent: req.body.postcontent,
        date: date 
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

router.get('/singleview/:id', function(req,res){
     User.find({_id: req.params.id}, function(err, docs){
        console.log(docs);
        res.render('singleview.jade', {user : docs});
    });
});

router.get('/login', function (req, res){
    res.render('login', {title: "Login Page" });
});

//capture page that is requesting edituser and use 
//to guide if statment 
// for render

router.get('/edituser/:id', function(req,res){
     User.find({_id: req.params.id}, function(err, docs){
        console.log(docs + "inside edituser/:id");
        res.render('edituser.jade', {user : docs});
    });
});

router.post('/update', function(req,res){
    console.log('request body id is '+ req.body.id);   
    console.log('username is  '+ req.body.username);   
    
    User.findOneAndUpdate(
                { _id: req.body.id}, 
                {$set: {
                        _id         : req.body.id,
                        postname    : req.body.postname,
                        username    : req.body.username,
                        email       : req.body.email,
                        organization: req.body.organization,
                        telephone   : req.body.telephone,
                        postcontent : req.body.postcontent
                }}, 
                {upsert: false},

                function(err, docs){
                     res.redirect('userlist');
                    }
                );
 });

router.post('/verify', function(req, res){
    var adminperson = req.body.adminperson;
    var adminpass = req.body.adminpass;
    if (verifyuser(adminperson, adminpass))
        {
        console.log(adminperson + " " + adminpass + " is user ");
        res.cookie('adminperson', req.body.adminperson);
        res.cookie('adminpass', req.body.adminpass);
        res.cookie('lexitownlast', Date.now()); 
        res.redirect('userlist');
        }
    else
        {
        console.log("not a valid login ");
        res.redirect('/');   
        }
});

function verifyuser (adminperson, adminpass){
    if ( (adminperson === hardadminperson) && (adminpass === hardadminpass ) ) 
        {loggedin = true;}
    else
    {loggedin = false;}
    return loggedin;
}

function recent (cookietime){
    var timedif = (  (Date.now()) - cookietime   );
    console.log( timedif + " is dif" );
    if ( (timedif ) <  3600000 )   //should be one hour second valid login
    {return true;}
};



module.exports = router;

// this module wil handle all route logic

module.exports = function(express, app,passport) {
  var router = express.Router();
  router.get('/', function(req, res, next) {
    res.render("index",{title:"Welcome to Chat"});
  });
  router.get('/chatrooms',securePages,function(req,res,next) {
    res.render("chatrooms",{title:"Chat Room",user:req.user});
  });

  //logout
  router.get('/logout',function(req,res,next){
    req.logout();
    res.redirect('/');
  });

  //set route auth
  router.get('/auth/facebook',passport.authenticate('facebook'));
  router.get('/auth/facebook/callback',passport.authenticate('facebook',{
  successRedirect:'/chatrooms',
  failureRedirect:'/'
}));

function securePages(req,res,next)
{
  if (req.isAuthenticated()) {next();}
  else  {res.redirect('/');}
}


  // setting sessoin
  router.get('/setcolor',function(req,res,next){
    //setting session variable;
    req.session.favColor = "Green";
    res.send("Setting fav color");

  });

  router.get('/getcolor',function(req,res,next){
    var color = req.session.favColor || " not set color";
    res.send("your favourite color : " + color);

  });


  app.use('/',router);
}

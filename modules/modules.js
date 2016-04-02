// this module wil handle all route logic

module.exports = function(express, app) {
  var router = express.Router();
  router.get('/', function(req, res, next) {
    res.render("index",{title:"Welcome to Chat"});
  });
  router.get('/chatrooms',function(req,res,next) {
    res.render("chatrooms",{title:"Chat Room"});
  });
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

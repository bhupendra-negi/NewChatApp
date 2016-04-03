module.exports = function(passport,facebookStrategy,config,mongoose) {

 //prepare schema for chatUser
 // will store below fields in our mongodb from fb
 var chatUser = new mongoose.Schema({
   profileID:String,
   fullName:String,
   profilePic:String

 });

 var userModel = mongoose.model("chatUser",chatUser);

 passport.serializeUser(function(user,done){
   done(null,user.id) //this is id genrated by mongo lab
 })

 passport.deserializeUser(function(id,done){
   userModel.findById(id,function(err,result)
   { if (result) done(err,result)
   })

 });

  // use facebookStrategy from passport
  passport.use( new facebookStrategy({
    clientID:config.fb.appID,
    clientSecret:config.fb.appSecret,
    callbackURL:config.fb.callbackURL,
    profileFields: ['id','displayName','photos']
  },function(accessToken,refreshToken,profile,done){
    // check if user exist in our monogo db dtabase , if not create user and send profile
    // else simply return profile
     userModel.findOne({'profileID':profile.id}, function(err,result)
    { if (result) {console.log("user exists");done(null,result);}
      else {
          var newchatUser = new userModel({
            profileID:profile.id,
            fullName:profile.displayName,
            profilePic:profile.photos[0].value || ''// fb returns array of photos getting only profile pic
          });
          newchatUser.save(function(err){
            done(null,newchatUser);
          })

      }

    });

  }
));




}

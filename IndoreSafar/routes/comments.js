var express = require("express");
var router  = express.Router();
var Campground =require("../models/campground");
var Comment =require("../models/comment");
//========================================================//
//              COMMENTS ROUTS                            //
//========================================================//

//comments new
router.get("/campgrounds/:id/comments/new",isLoggedIn ,function(req,res){
    Campground.findById(req.params.id , function(err,campground){
         if(err){
             console.log(err);
         }
         else{
             console.log(campground);
             res.render("comments/new",{campground:campground});
         }
    }); 
});

//comment create
router.post("/campgrounds/:id/comments",isLoggedIn, function(req,res){
    Campground.findById(req.params.id ,function(err,campground){
         if(err){
             console.log(err);
             res.redirect("/campgrounds")
         }
         else{
             Comment.create(req.body.comment,function(err,comment){
                 if(err){
                     console.log(err);
                 }
                 else{
                     //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                   //save comment
                    comment.save();
                     campground.comments.push(comment);
                     campground.save();
                     res.redirect('/campgrounds/'+ campground._id) 
                 }
             });
         }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}
module.exports = router;
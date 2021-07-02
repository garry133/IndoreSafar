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

// COMMENT EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/campgrounds/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/campgrounds/" + req.params.id);
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

function checkCommentOwnership(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
               // req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
       // req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

module.exports = router;
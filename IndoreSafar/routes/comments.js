var express = require("express");
var router  = express.Router();
var Place =require("../models/place");
var Comment =require("../models/comment");
//========================================================//
//              COMMENTS ROUTS                            //
//========================================================//

//comments new
router.get("/places/:id/comments/new",isLoggedIn ,function(req,res){
   var Place =require("../models/place");
    Place.findById(req.params.id , function(err,place){
         if(err){
             console.log(err);
         }
         else{
             console.log(place);
           res.render("comments/new",{place:place});
        }
    }); 
});

//comment create
router.post("/places/:id/comments",isLoggedIn, function(req,res){
    Place.findById(req.params.id ,function(err,place){
         if(err){
             console.log(err);
            res.redirect("/places")
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
                    place.comments.push(comment);
                     place.save();
                     res.redirect('/places/'+ place._id)
                 }
             });
         }
    });
});

// COMMENT EDIT ROUTE
router.get("/places/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){  
Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {place_id: req.params.id, comment: foundComment});
    }
   });
});

// COMMENT UPDATE
router.put("/places/:id/comments/:comment_id", checkCommentOwnership, function(req, res){  
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/places/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/places/:id/comments/:comment_id", checkCommentOwnership, function(req, res){ 
  //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
            res.redirect("/places/" + req.params.id);
       }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
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
               req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
       req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

module.exports = router;
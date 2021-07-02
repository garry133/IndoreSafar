var express = require("express");
var router  = express.Router();
var Campground =require("../models/campground");

//INDEX - SHOW ALL CAMPGROUNDS
router.get("/campgrounds",function(req,res){
     //GET ALL CAMPGROUNDS FROM DB
     Campground.find({}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           }
           else{
               res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
           }
     });
});

//CREATE - ADD NEW CAMPGROUNDS TO DB
router.post("/campgrounds",isLoggedIn, function(req,res){
      //res.send("you hit the post route!!");
      var name = req.body.name;
      var image = req.body.image;
      var desc = req.body.description;
      var author = {
        id: req.user._id,
        username: req.user.username
      }
      var newCampground= {name:name,image:image,description:desc, author:author}
      //campgrounds.push(newCampground);
      //create a new campground and save to database
      Campground.create(newCampground,function(err,newlyCreated){
                if(err){
                    console.log(err);
                }
                else{
                    res.redirect("/campgrounds");
                }
            });

      //redirect to campground page
      
});

//NEW - SHOW FORM TO CREATE NEW CAMPGROUNDS 
router.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new");
});


//SHOW - SHOW PARTICULAR CAMPGROUND INFO
router.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
         if(err){
             console.log(err);
         }
         else{
             //console.log(foundCampground);
             res.render("campgrounds/show",{campground:foundCampground});
         }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit",checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
          res.render("campgrounds/edit", {campground: foundCampground});  
        } 
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id",checkCampgroundOwnership,function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id",checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
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

function checkCampgroundOwnership(req, res, next) {
 if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
               //req.flash("error", "Campground not found");
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
               // req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        //req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

module.exports = router;
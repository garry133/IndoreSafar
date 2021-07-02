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


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = router;
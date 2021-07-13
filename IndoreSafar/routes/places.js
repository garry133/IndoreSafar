var express = require("express");
var router  = express.Router();
// var Campground =require("../models/campground");
var Place =require("../models/place");

//INDEX - SHOW ALL PLACES
// router.get("/campgrounds",function(req,res){
router.get("/places",function(req,res){
     //GET ALL PLACES FROM DB
    //  Campground.find({}, function(err, allCampgrounds){
    Place.find({}, function(err, allPlaces){
           if(err){
               console.log(err);
           }
           else{
            //    res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
               res.render("places/index",{places:allPlaces, currentUser: req.user});
           }
     });
});

//CREATE - ADD NEW PLACES TO DB
// router.post("/campgrounds",isLoggedIn, function(req,res){
router.post("/places",isLoggedIn, function(req,res){
   //res.send("you hit the post route!!");
      var name = req.body.name;
      var image = req.body.image;
      var desc = req.body.description;
      var author = {
        id: req.user._id,
        username: req.user.username
      }
    //   var newCampground= {name:name,image:image,description:desc, author:author}
      var newPlace= {name:name,image:image,description:desc, author:author}
      //campgrounds.push(newCampground);
      //places.push(newCampground);
      //create a new place and save to database
    //   Campground.create(newCampground,function(err,newlyCreated){
        Place.create(newPlace,function(err,newlyCreated){
                if(err){
                    console.log(err);
                }
                else{
                    // res.redirect("/campgrounds");
                    res.redirect("/places");
                }
            });

      //redirect to places page
      
});

//NEW - SHOW FORM TO CREATE NEW PLACES 
// router.get("/campgrounds/new",function(req,res){
//     res.render("campgrounds/new");
router.get("/places/new",function(req,res){
    res.render("places/new");
});


//SHOW - SHOW PARTICULAR PLACE INFO
// router.get("/campgrounds/:id",function(req,res){
router.get("/places/:id",function(req,res){
    // Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
    Place.findById(req.params.id).populate("comments").exec(function(err,foundPlace){     
        if(err){
             console.log(err);
        }
         else{
             //console.log(foundCampground);
             //console.log(foundPlace);
            //  res.render("campgrounds/show",{campground:foundCampground});
             res.render("places/show",{place:foundPlace});
         }
    });
});

// EDIT PLACE ROUTE
// router.get("/campgrounds/:id/edit",checkCampgroundOwnership, function(req, res){
router.get("/places/:id/edit",checkPlaceOwnership, function(req, res){   
    // Campground.findById(req.params.id, function(err, foundCampground){
    Place.findById(req.params.id, function(err, foundPlace){
        if(err){
            // res.redirect("/campgrounds");
            res.redirect("/places");
        }
        else{
        //   res.render("campgrounds/edit", {campground: foundCampground});  
            res.render("places/edit", {place: foundPlace}); 
        } 
    });
});

// UPDATE PLACE ROUTE
// router.put("/campgrounds/:id",checkCampgroundOwnership,function(req, res){
router.put("/places/:id",checkPlaceOwnership,function(req, res){
    // find and update the correct Place
    // Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    Place.findByIdAndUpdate(req.params.id, req.body.place, function(err, updatedPlace){
       if(err){
        //    res.redirect("/campgrounds");
            res.redirect("/places");
       } else {
           //redirect somewhere(show page)
        //    res.redirect("/campgrounds/" + req.params.id);
            res.redirect("/places/" + req.params.id);
       }
    });
});

// DESTROY PLACE ROUTE
// router.delete("/campgrounds/:id",checkCampgroundOwnership, function(req, res){
//    Campground.findByIdAndRemove(req.params.id, function(err){
//       if(err){
//           res.redirect("/campgrounds");
//       } else {
//           res.redirect("/campgrounds");
//       }
//    });
// });
router.delete("/places/:id",checkPlaceOwnership, function(req, res){
   Place.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/places");
      } else {
          res.redirect("/places");
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

// function checkCampgroundOwnership(req, res, next) {
function checkPlaceOwnership(req, res, next) {
 if(req.isAuthenticated()){
        // Campground.findById(req.params.id, function(err, foundCampground){
        Place.findById(req.params.id, function(err, foundPlace){
           if(err){
               req.flash("error", "Place not found");
               res.redirect("back");
           }  else {
               // does user own the place?
            // if(foundCampground.author.id.equals(req.user._id)) {
            if(foundPlace.author.id.equals(req.user._id)) {
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
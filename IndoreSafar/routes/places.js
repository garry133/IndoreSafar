var express = require("express");
var router  = express.Router();
var Place =require("../models/place");

//INDEX - SHOW ALL PLACES
router.get("/places",function(req,res){
     //GET ALL PLACES FROM DB
    Place.find({}, function(err, allPlaces){
           if(err){
               console.log(err);
           }
           else{
               res.render("places/index",{places:allPlaces, currentUser: req.user});
           }
     });
});

//CREATE - ADD NEW PLACES TO DB
router.post("/places",isLoggedIn, function(req,res){
   //res.send("you hit the post route!!");
      var name = req.body.name;
      var image = req.body.image;
      var desc = req.body.description;
      var author = {
        id: req.user._id,
        username: req.user.username
      }
      var newPlace= {name:name,image:image,description:desc, author:author}
      //create a new place and save to database
        Place.create(newPlace,function(err,newlyCreated){
                if(err){
                    console.log(err);
                }
                else{
                    res.redirect("/places");
                }
            });
});

//NEW - SHOW FORM TO CREATE NEW PLACES 
router.get("/places/new",function(req,res){
    res.render("places/new");
});


//SHOW - SHOW PARTICULAR PLACE INFO
router.get("/places/:id",function(req,res){
    Place.findById(req.params.id).populate("comments").exec(function(err,foundPlace){     
        if(err){
             console.log(err);
        }
         else{
             res.render("places/show",{place:foundPlace});
         }
    });
});

// EDIT PLACE ROUTE
router.get("/places/:id/edit",checkPlaceOwnership, function(req, res){  
    Place.findById(req.params.id, function(err, foundPlace){
        if(err){
            res.redirect("/places");
        }
        else{  
            res.render("places/edit", {place: foundPlace}); 
        } 
    });
});

// UPDATE PLACE ROUTE
router.put("/places/:id",checkPlaceOwnership,function(req, res){
    Place.findByIdAndUpdate(req.params.id, req.body.place, function(err, updatedPlace){
       if(err){
            res.redirect("/places");
       } else {
            res.redirect("/places/" + req.params.id);
       }
    });
});

// DESTROY PLACE ROUTE
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

function checkPlaceOwnership(req, res, next) {
 if(req.isAuthenticated()){
        Place.findById(req.params.id, function(err, foundPlace){
           if(err){
               req.flash("error", "Place not found");
               res.redirect("back");
           }  else {
               // does user own the place?
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
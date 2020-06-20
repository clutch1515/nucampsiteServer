const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Favorite = require('../models/favorite');
const cors = require('./cors');

const favoriteRouter = express.Router()

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({user : req.user._id}) //requesting user favorites
    .populate('user')
    .populate('campsites')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Context-Type', 'applications/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Favorite.findOne({user : req.user._id})
   .then(favorite => {
       if(favorite){
           req.body.forEach(  
               fav => {
                   if (!favorite.campsite.includes(fav._id)){
                       favorite.campsite.push(fav._id)
                   }
            });
            favorite.save()
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Context-Type', 'applications/json');
                res.json(favorites);
            })
            .catch(err => next(err));
       } else {
           Favorite.create({user: req.user._id, campsites: req.body})
           .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Context-Type', 'applications/json');
                res.json(favorites);
           })
           .catch(err => next(err));
       }
   })
   .catch(err => next(err)); 
})
.put(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /Favorite')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user : req.user._id})
    .then(favorite => {
        if(favorite){
            favorite.remove()
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Context-Type', 'applications/json');
                res.json(favorites);
            })
            .catch(err => next(err)); 
        } else {
            res.statusCode = 200;
            res.setHeader('Context-Type', 'applications/json');
            res.json(favorite);
        }
   })
   .catch(err => next(err));
});

favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end(`GET operation not supported on /favorite/${req.params.campsiteId}`);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
        Favorite.findOne({user : req.user._id})
            .then(favorite => {
                if(favorite){
                    const favoritedId = req.params.campsiteId;
                    const currentFavorites = favorite.campsites;
                    if(currentFavorites.includes(favoritedId)){
                        res.statusCode = 200;
                        res.setHeader('Context-Type', 'text/plain');
                        res.send('This campsite is already favorited');
                    }else{
                        currentFavorites.push(favoritedId);
                        favorite.save()
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Context-Type', 'applications/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                    }
                }else{
                    Favorite.create({user : req.user._id, campsites: [req.params.campsiteId]})
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Context-Type', 'applications/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                }
            })
            .catch(err => next(err));
    })
    .put(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /favorite/${req.params.campsiteId}`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({user : req.user._id})
        .then(favorite => {
            if (favorite) {
              const favoritedId = req.params.campsiteId;
              const currentFavorites = favorites.campsites;
              const index = currentFavorites.indexOf(favoritedId);
              if (index > -1) {
                  currentFavorites.splice(index, 1);
                  favorite.save()
                  .then(favorite => {
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'applications/json');
                      res.json(favorite)
                  })
                  .catch(err => next(err));
              }
            } else {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            }
          })
          .catch(err => next(err));
      });

    module.exports = favoriteRouter;
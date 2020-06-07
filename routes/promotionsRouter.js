const express = require('express');
const bodyParser = require('body-parser');
const promotion = require('../models/promotions');

const promotionsRouter = express.Router();

promotionsRouter.use(bodyParser.json());

promotionsRouter.route('/')
.get((req, res, next) => {
    promotion.find()
    .then(promotionId => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    promotion.create(req.body)
    .then(promotion => {
        console.log('promotion Created', promotion); 
        res. statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion)
    })
    .catch(err => next(err))
 })
 .put((req, res) => {
     res.statusCode = 403;
     res.end('PUT operation not supported on /promotions');
 })
 .delete((req, res, next) => {
     promotion.deleteMany()
     .then(response => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(response);
     })
     .catch(err => next(err));
 });
 promotionRouter.route('/:promotionId')
 .get((req, res, next) => {
     promotion.findById(req.params.promotionId)
     .then(promotion => {
         if (promotion) {
             res.statusCode = 200;
             res.setHeader('Content-Type', 'application/json');
             res.json(promotion);
         } else {
             err = new Error(`promotion ${req.params.promotionId} not found`);
             err.status = 404;
             return next(err);
         }
     })
     .catch(err => next(err));
 })
 .post((req, res, next) => {
     promotion.findById(req.params.promotionId)
     .then(promotion => {
         if (promotion) {
             promotion.save()
             .then(promotion => {
                 res.statusCode = 200;
                 res.setHeader('Content-Type', 'application/json');
                 res.json(promotion);
             })
             .catch(err => next(err));
         } else {
             err = new Error(`promotion ${req.params.promotionId} not found`);
             err.status = 404;
             return next(err);
         }
     })
     .catch(err => next(err));
 })
 .put((req, res, next) => {
     promotion.findByIdAndUpdate(req.params.promotionId, {
         $set: req.body
     }, { new: true})
     .then(promotion => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(promotion);
     })
     .catch(err => next(err));
 })
 .delete((req, res, next) => {
     promotion.findByIdAndDelete(req.params.promotionId)
     .then(response => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(response);
     })
     .catch(err => next(err));
 })
 module.exports = promotionRouter;
const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET PRODUCTS
router.get('/', (req, res, next) => {
    Product.find()
        .select("-__v")
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc.id,
                        name: doc.name,
                        price: doc.price,
                        url: `${req.protocol}://${req.get('host')}/products/${doc.id}`
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
})

// POST PRODUCT
router.post('/', (req, res, next) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price
    })
    product.save()
        .then(result => {
            res.status(201).json({
                msg: "Product Created",
                body: {
                    _id: result.id,
                    name: result.name,
                    price: result.price
                }
            })
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
})

//GET A PRODUCT
router.get('/:id', (req, res, next) => {
    Product.findById({_id: req.params.id})
        .select('-__v')
        .exec()
        .then(result => {
            res.status(200).json({
                _id: result.id,
                name: result.name,
                price: result.price,
                all_products: `${req.protocol}://${req.get('host')}/products`
            })
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
})

//UPDATE A PRODUCT
router.patch("/:id", (req, res, next) => {
    const updateOps = {}
    for(const ops of req.body){
        updateOps[ops.name] = ops.value;
    }
    Product.updateOne({_id: req.params.id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                msg: "Product Updated",
                url: `${req.protocol}://${req.get('host')}/products/${req.params.id}`
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "Can not update post",
                error: err
            })
        })
})

// DELETE A PRODUCT
router.delete("/:id", (req, res, next) => {
    Product.remove({_id: req.params.id})
        .exec()
        .then(result => {
            res.status(200).json({
                msg: "Product deleted",
                all_Products: `${req.protocol}://${req.get('host')}/products`
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "Can not delete post",
                error: err
            })
        })
})
module.exports = router;
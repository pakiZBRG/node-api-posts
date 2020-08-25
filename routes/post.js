const express = require('express');
const Post = require('../models/Post');
const router = express.Router();

// GET ALL POSTS
router.get('/', (req, res, next) => {
    try{
        Post.find()
            .select('-__v')
            .exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    products: docs.map(doc => {
                        return {
                            _id: doc.id,
                            title: doc.title,
                            description: doc.description,
                            url: `${req.protocol}://${req.get('host')}/posts/${doc.id}`
                        }
                    })
                }
                res.status(200).json(response);
            })
    }
    catch(err){
        res.status(500).json({
            message: "Problem with getting posts",
            error: err
        })
    }
})

// CREATE A POST
router.post('/', (req, res, next) => {
    const post = new Post({
        title: req.body.title, 
        description: req.body.description
    })
    try{
        post.save()
            .then(result => {
            console.log(result);
            res.status(201).json({
                msg: "Post Created",
                body: {
                    _id: result.id,
                    title: result.title,
                    description: result.description
                }
            })
        })
    }
    catch(err){
        res.status(500).json({
            message: "Problem with creating post",
            error: err
        })
    }
})

// GET A UNIQUE POST
router.get('/:id', (req, res, next) => {
    try{
        Post.findById(req.params.id)
        .select('-__v')
        .exec()
        .then(doc => {
            if(doc){
                res.status(200).json({
                    _id: doc.id,
                    title: doc.title,
                    description: doc.description,
                    all_Posts: `${req.protocol}://${req.get('host')}/posts`
                });
            } else {
                res.status(404).json("Non existing post")
            }
        })
    }
    catch(err){
        res.status(500).json({
            message: "Problem with getting a post",
            error: err
        });
    }
})

// UPDATING A UNIQUE POST
router.patch('/:id', (req, res, next) => {
    const updateOps = {};
    for(const ops of req.body){
        // title, description
        updateOps[ops.name] = ops.value;
    }
    Post.updateOne({_id: req.params.id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                msg: "Post updated",
                url: `${req.protocol}://${req.get('host')}/posts/${req.params.id}`
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "Can not update post",
                error: err
            })
        })
})

// DELETE A UNIQUE POST
router.delete('/:id', (req, res, next) => {
    try{
        Post.remove({_id: req.params.id})
        .exec()
        .then(result => {
            res.status(200).json({
                msg: "Post deleted",
                all_Posts: `${req.protocol}://${req.get('host')}/posts`
            })
        })
    }
    catch(err){
        res.status(500).json({
            message: "Can not delete post",
            error: err
        })
    }
})

module.exports = router
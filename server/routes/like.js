const express = require('express');
const router = express.Router();

const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');
//=================================
//             Like
//=================================

//1. 좋아요
router.post('/getLikes', (req, res) => {
    
    let variable = {}
    if(req.body.videoId){
        variable = { videoId: req.body.videoId } //비디오의 좋아요
    } else {
        variable = { commentId: req.body.commentId} //댓글의 좋아요
    }

    Like.find(variable)
    .exec((err, likes) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success: true, likes })
    })

})

//2. 싫어요
router.post('/getDislikes', (req, res) => {
    
    let variable = {}
    if(req.body.videoId){
        variable = { videoId: req.body.videoId } //비디오의 싫어요
    } else {
        variable = { commentId: req.body.commentId} //댓글의 싫어요
    }

    Dislike.find(variable)
    .exec((err, dislikes) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success: true, dislikes })
    })

})


module.exports = router;

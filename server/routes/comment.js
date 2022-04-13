const express = require('express');
const router = express.Router();

const { Comment } = require('../models/Comment');

//=================================
//             Comment
//=================================

//1. 댓글 남기기
router.post('/saveComment', (req, res) => {
    const comment = new Comment(req.body) // comment 모든 정보 가져오기

    comment.save(( err, comment) => { //DB에 저장
        if(err) return res.json({ success: false, err })
        Comment.find({ '_id' : comment._id })
        .populate('writer')
        .exec((err, result) => {
            if(err) return res.json({ success: false, err })
            res.status(200).json({ success: true, result })
        })
        
    })
      
})






module.exports = router;

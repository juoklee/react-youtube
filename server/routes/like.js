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

    if (req.body.videoId) {
        variable = { videoId: req.body.videoId } //비디오의 좋아요
    } else {
        variable = { commentId: req.body.commentId } //댓글의 좋아요
    }

    Like.find(variable) //좋아요 정보찾기
        .exec((err, likes) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, likes })
        })

})

//2. 싫어요
router.post('/getDislikes', (req, res) => {

    let variable = {}

    if (req.body.videoId) {
        variable = { videoId: req.body.videoId } //비디오의 싫어요
    } else {
        variable = { commentId: req.body.commentId } //댓글의 싫어요
    }

    Dislike.find(variable) //싫어요 정보 찾기
        .exec((err, dislikes) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, dislikes })
        })

})


//3. 좋아요 버튼 눌렀을 때
router.post('/upLike', (req, res) => {

    let variable = {}

    if (req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId } //비디오의 좋아요
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId } //댓글의 좋아요
    }

    //Like Collection에다가 클릭 정보를 넣어 줌
    const like = new Like(variable)

    like.save((err, likeResult) => { //좋아요 정보 저장
        if (err) return res.status(400).json({ success: false, err })

        // 만약에 Dislike이 이미 클릭 되어있다면, Dislike -1
        Dislike.findOneAndDelete(variable)
            .exec((err, disLikeResult) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true })
            })
    })
})

//4. 좋아요 버튼 눌렀을 때 (좋아요 취소)
router.post('/unLike', (req, res) => {

    let variable = {}

    if (req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId  } //비디오의 싫어요
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId  } //댓글의 싫어요
    }

   Dislike.findOneAndDelete(variable)
   .exec((err, result) => {
       if(err) return res.status(400).json({ success: false, err})
       res.status(200).json({ success: true })
   })
})


//5. 싫어요 버튼 눌렀을 때 (싫어요 취소)
router.post('/unDislike', (req, res) => {

    let variable = {}
    if (req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId  } //비디오의 좋아요
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId  } //댓글의 좋아요
    }

   Like.findOneAndDelete(variable)
   .exec((err, result) => {
       if(err) return res.status(400).json({ success: false, err})
       res.status(200).json({ success: true })
   })
})


//6. 싫어요 버튼 눌렀을 때
router.post('/upDislike', (req, res) => {

    let variable = {}

    if (req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId  } //비디오의 싫어요
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.userId  } //댓글의 싫어요
    }

    //DisLike Collection에다가 클릭 정보를 넣어 줌
    const dislike = new Dislike(variable)

    dislike.save((err, dislikeResult) => { //좋아요 정보 저장
        if (err) return res.status(400).json({ success: false, err })

        // 만약에 like이 이미 클릭 되어있다면, like -1
        Like.findOneAndDelete(variable)
            .exec((err, likeResult) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true })
            })
    })
})

module.exports = router;
const express = require('express');
const router = express.Router();

const { auth } = require("../middleware/auth");
const multer = require("multer");
const ffmpeg = require('fluent-ffmpeg');
const { Subscriber } = require('../models/Subscriber');

//=================================
//             Subscribe
//=================================

//1. 구독자 수 정보 받아오기
router.post('/subscribeNumber', (req, res) => {

    Subscriber.find({ 'userTo': req.body.userTo })
    .exec((err, subscribe) => { //구독하고 있는 모든 케이스
        if(err) return res.status(400).send(err);
        return res.status(200).json({ success: true, subscribeNumber: subscribe.length })
    })
})

//2. 구독 정보 받아오기
router.post('/subscribed', (req, res) => {

    Subscriber.find({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom })
    .exec((err, subscribe) => { 
        if(err) return res.status(400).send(err);

        let result = false
        if(subscribe.length !== 0) {
            result = true
        }
        
        res.status(200).json({ success: true, subscribed: result })
    })
})





module.exports = router;

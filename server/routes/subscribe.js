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


//3. 이미 구독중이라면 취소
router.post('/unSubscribe', (req, res) => {

    Subscriber.findOneAndDelete({ userTo: req.body.userTo, userFrom: req.body.userFrom })
    .exec((err, doc) => {
        if(err) return res.status(400).json({ success: false, err })
        res.status(200).json({ success: true, doc })
    })
})


//4.구독하기
router.post('/subscribe', (req, res) => {

    const subscribe = new Subscriber(req.body) //모든 userTo, userFrom 정보 가져오기
    
    subscribe.save((err, doc) => {
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })
})







module.exports = router;

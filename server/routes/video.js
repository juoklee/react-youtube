const express = require('express');
const router = express.Router();

const { auth } = require("../middleware/auth");
const multer = require("multer");
const ffmpeg = require('fluent-ffmpeg');
const { Video } = require('../models/Video');


//Storage Multer Config
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/') //uploads라는 폴더에 다 저장이 된다.
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file")

//=================================
//             Video
//=================================

//1. 비디오 저장
router.post('/uploadfiles', (req, res) => {

    //비디오를 서버에 저장한다.
    upload(req, res, err => {
        if(err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName:res.req.file.filename })
    })

})


//2.비디오 썸네일
router.post('/thumbnail', (req, res) => { //썸네일을 생성하고 비디오 정보 가져오기

    let thumbsFilePath ="";
    let fileDuration ="";

    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.filePath, function(err, metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);

        fileDuration = metadata.format.duration;
    })

    //썸네일 생성
    ffmpeg(req.body.filePath)
        .on('filenames', function (filenames) {
            console.log('Will generate ' + filenames.join(', '))
            thumbsFilePath = "uploads/thumbnails/" + filenames[0];
        })
        .on('end', function () {
            console.log('Screenshots taken');
            return res.json({ success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration})
        })
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: 'uploads/thumbnails',
            size:'320x240',
            // %b input basename ( filename w/o extension )
            filename:'thumbnail-%b.png'
        });

})


//3.비디오 업로드
router.post('/uploadVideo', (req, res) => {

    //비디오 정보들을 저장한다.
    const video = new Video(req.body)

    video.save((err, video)=> {
        if(err) return res.status(400).json({ success: false, err })
        return res.status(200).json({
            success: true 
        })
    }) 

})



//4. 랜딩페이지에 비디오 나타나게 하기
router.get('/getVideos', (req, res) => {

    //비디오를 DB에서 가져와서 클라이언트에 보낸다.
    Video.find() //모든 비디오를 가져옴
    .populate('writer')
    .exec((err, videos) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({ success: true, videos })
    })

})



//5. 비디오 디테일 페이지 route
router.post('/getVideoDetail', (req, res) => {
    Video.findOne({ "_id" : req.body.videoId }) //id를 이용해서 비디오를 찾겠다.
    .populate('writer')
    .exec((err, videoDetail) => { //callback function err와 videoDetail 정보 가져오기
        if(err) return res.status(400).send(err) //err 발생시 err 메세지
        return res.status(200).json({ success: true, videoDetail}) //json형태로 정보를 클라이언트로 보내기 
    })


})







module.exports = router;

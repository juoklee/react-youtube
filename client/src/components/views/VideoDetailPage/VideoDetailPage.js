import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar } from 'antd'
import Axios from 'axios'
import SideVideo from './Sections/SideVideo'
import Subscribe from './Sections/Subscribe'
import Comments from './Sections/Comments'
import LikeDislikes from './Sections/LikeDislikes'

//클라이언트
function VideoDetailPage(props) {

    const videoId = props.match.params.videoId

    const [VideoDetail, setVideoDetail] = useState([])
    const [commentLists, setCommentLists] = useState()

    const variable = { videoId: videoId }

    useEffect(() => {

        Axios.post('/api/video/getVideoDetail', variable)
        .then(response => {
            if(response.data.success) {
                // console.log(response.data.videoDetail)
                setVideoDetail(response.data.videoDetail)
            }else {
                alert('비디오 정보를 가져오기 실패했습니다.')
            }
        })

        Axios.post('/api/comment/getComments', variable)
        .then(response => {
            if(response.data.success){
                // console.log(response.data.comments)
                setCommentLists(response.data.comments)
            }else {
                alert('코멘트 정보를 가져오는 것을 실패했습니다.')
            }
        })

    }, [])


    const refreshFunction = (newComment) => {
        setCommentLists(commentLists.concat(newComment))
    }

    if(VideoDetail.writer) {

       const subscribeButton =  VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id } userFrom={localStorage.getItem('userId')} />
        
       return (
            <Row gutter={[16,16]}>
                <Col lg={18} xs={24} >
                <div style={{ width: '100%', padding: '3rem 4rem' }}>
                    <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls></video>
        
                    <List.Item
                        actions={[ <LikeDislikes video userId={localStorage.getItem('userId')} videoId={videoId} />, subscribeButton]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={VideoDetail.writer.image} />}
                            title={VideoDetail.writer.name}
                            description={VideoDetail.description}
                        />
        
                    </List.Item>

                    <Comments refreshFunction={refreshFunction} commentLists={commentLists} postId={videoId} />
        
                </div>
        
                </Col>
                <Col lg={6} xs={24} >
                    <SideVideo />
                </Col>
            </Row>
          )
    } else  {
        return (
            <div>Loading...</div>
        )
    }
}

  

export default VideoDetailPage
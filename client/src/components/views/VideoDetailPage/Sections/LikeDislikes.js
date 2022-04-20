import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd'
import Axios from 'axios'

function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [Dislikes, setDislikess] = useState(0)
    const [DislikeAction, setDislikeAction] =useState(null)

    let variable = { }


    if(props.video) {
        variable = { videoId: props.videoId , userId: props.userId}
    } else {
        variable = {commentId:props.commentId, userId:props.userId}
    }

    

    useEffect(() => {

        //좋아요
        Axios.post('/api/like/getLikes', variable)
        .then(response => {
            if(response.data.success) {
                
                setLikes(response.data.likes.length) //좋아요 개수
                
                response.data.likes.map(like => { //내가 좋아요 를 이미 누른 상태인지
                    if(like.userId === props.userId) {
                        setLikeAction('liked')
                    }
                })

            }else{
                alert('Like에 대한 정보를 가져오지 못했습니다.')
            }
        })

        //싫어요
        Axios.post('/api/like/getDislikes', variable)
        .then(response => {
            if(response.data.success) {
                
                setDislikess(response.data.dislikes.length) //싫어요 개수
                
                response.data.dislikes.map(dislike => { //내가 싫어요를 이미 누른 상태인지
                    if(dislike.userId === props.userId) {
                        setDislikeAction('disliked')
                    }
                })
                
            }else{
                alert('Dislike에 대한 정보를 가져오지 못했습니다.')
            }
        })


    }, [])



    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                            theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                            onClick
                    />
                </Tooltip>
            <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Likes} </span>
            </span>

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon type="dislike"
                            theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                            onClick
                    />
                </Tooltip>
            <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Dislikes} </span>
            </span>

        </div>
    )
}

export default LikeDislikes
import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd'
import Axios from 'axios'

function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [Dislikes, setDislikes] = useState(0)
    const [DislikeAction, setDislikeAction] =useState(null)

    let variable = { }


    if(props.video) {
        variable = { videoId: props.videoId , userId: props.userId}
    } else {
        variable = {commentId:props.commentId, userId:props.userId}
    }

    

    useEffect(() => {

        //좋아요 정보 가져오기
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

        //싫어요 정보 가져오기
        Axios.post('/api/like/getDislikes', variable)
        .then(response => {
            if(response.data.success) {
                
                setDislikes(response.data.dislikes.length) //싫어요 개수
                
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


    //좋아요 버튼 눌렀을 때
    const onLike = () => {
        //1. 좋아요 버튼 누른적 없을 때 => 좋아요
        if(LikeAction === null) { 
            Axios.post('/api/like/upLike', variable)
            .then(response => {
                if(response.data.success) {
                    setLikes(Likes + 1) //좋아요 수 +1
                    setLikeAction('liked') 

                    if(DislikeAction !== null) { //싫어요 버튼이 이미 눌러져있을 때
                        setDislikeAction(null)
                        setDislikes(Dislikes -1)
                    }
                } else {
                    alert('like를 올리지 못했습니다.')
                }
            })
        //2. 좋아요 버튼이 이미 눌러져 있을 때 => 좋아요 취소
        } else { 
            Axios.post('/api/like/unLike', variable)
            .then(response => {
                if(response.data.success) {
                    setLikes(Likes - 1) //좋아요 수 -1
                    setLikeAction(null) 
                } else {
                    alert('like를 내리지 못했습니다.')
                }
            })
        }
    }


    //싫어요 버튼 눌렀을 때
    const onDislike = () => {
        //1. 싫어요 버튼이 이미 눌러져 있을 때 => 싫어요 취소
        if(DislikeAction !== null) {
            Axios.post('/api/like/unDislike', variable)
            .then(response => {
                if(response.data.success) {
                    setDislikes(Dislikes - 1) //싫어요 수 -1
                    setDislikeAction(null)
                } else {
                    alert('dislike를 내리지 못했습니다.')
                }
            })
        //2. 싫어요 버튼 누른적 없을 때 => 싫어요
        } else { 
            Axios.post('/api/like/upDislike', variable)
            .then(response => {
                if(response.data.success) {
                    setDislikes(DislikeAction + 1)
                    setDislikeAction('disliked')

                    if(LikeAction !== null) { //좋아요 버튼이 이미 눌러져있을 때
                        setLikeAction(null)
                        setLikes(Likes - 1)
                    }
                } else {
                    alert('dislike를 내리지 못했습니다.')
                }
            })
        }
    }

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                            theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                            onClick={onLike}
                    />
                </Tooltip>
            <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Likes} </span>
            </span>&nbsp;&nbsp;

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon type="dislike"
                            theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                            onClick={onDislike}
                    />
                </Tooltip>
            <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Dislikes} </span>
            </span>&nbsp;&nbsp;

        </div>
    )
}

export default LikeDislikes
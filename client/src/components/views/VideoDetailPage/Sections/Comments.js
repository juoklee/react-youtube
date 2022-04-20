import React, { useState } from 'react'
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comments(props) {

    const user = useSelector(state => state.user)
    const [Comment, setComment] = useState("")

    const handleClick = (e) => {
        setComment(e.currentTarget.value)
    }

    //기본: refresh
    const onSubmit = (e) => {
        e.preventDefault() //refresh 방지

        const variables = {
            content: Comment,
            writer: user.userData._id,
            postId: props.postId
        }

        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if(response.data.success) {
                // console.log(response.data.result)
                setComment("")
                props.refreshFunction(response.data.result)
            } else {
                alert('커멘트를 저장하지 못했습니다.')
            }
        })

    }

  return (
    <div>
        <br />
        <p> Replies</p>
        <hr />

        {props.commentLists && props.commentLists.map((comment, index) => (
            (!comment.responseTo && 
                <React.Fragment>
                    <SingleComment refreshFunction={props.refreshFunction}  comment={comment} postId={props.postId} />
                    <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} postId={props.postId} commentLists={props.commentLists}/>
                </React.Fragment>
                )
        ))}
        



        <form style={{ display: 'flex' }} onSubmit={onSubmit} >
            <textarea
                style={{ width: '100%', borderRadius: '5px' }}
                onChange={handleClick}
                value={Comment}
                placeholder="코멘트를 작성해 주세요"
            />
            <br/>
            <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
        </form>
    </div>
  )
}

export default Comments
import Axios from 'axios'
import React, {useState} from 'react'
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';

function Comment(props) {

    const user = useSelector(state => state.user)
    const videoId = props.postId
    const [commentValue, setcommentValue] = useState("")

    const handleClick = (e) => {
        setcommentValue(e.currentTarget.value)
    }

    //기본: refresh
    const onSubmit = (e) => {
        e.preventDefault() //refresh 방지

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: videoId
        }

        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if(response.data.success) {
                console.log(response.data)
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
                <SingleComment comment={comment} postId={videoId}/>
            )
        ))}
        



        <form style={{ display: 'flex' }} onSubmit={onSubmit} >
            <textarea
                style={{ width: '100%', borderRadius: '5px' }}
                onChange={handleClick}
                value={commentValue}
                placeholder="코멘트를 작성해 주세요"
            />
            <br/>
            <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
        </form>
    </div>
  )
}

export default Comment
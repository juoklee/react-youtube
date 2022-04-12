import React, { useEffect, useState } from 'react'
import Axios from 'axios'

function SideVideo() {

    const [sideVideos, setsideVideos] = useState([])


    useEffect(() => {
         //비디오 가져오기
         Axios.get('/api/video/getVideos')
         .then(response => {
             if(response.data.success){
                 console.log(response.data)
                 setsideVideos(response.data.videos)
             } else {
                 alert('비디오 가져오기를 실패 했습니다.')
             }
         })

    }, [])

    const renderSidevideo = sideVideos.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);


        return <div key={index} style={{ display: 'flex',  marginTop: '1rem', padding: '0 2rem' }}>
            <div style={{ width: '40%', marginRight:'1rem' }}>
                <a href={'/video/${video._id}'} style={{ color: 'gray'}}>
                    <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                </a>
            </div>

            <div style={{ width:'50%' }}>
                <a href={'/video/${video._id}'} style={{ color: 'gray'}}>
                    <span style={{ fontSize: '1rem', color:'black' }}>{video.title}</span><br/>
                    <span>{video.writer.name}</span><br/>
                    <span>{video.views} views</span><br/>
                    <span>{minutes}: {seconds}</span><br/>
                </a>
            </div>
        </div>
    })

    //map method: 화면에 여러개의 화면을 띄우기 위해서
    return (

        <React.Fragment>
            <div style={{ marginTop:'3rem' }}></div>
            {renderSidevideo}
            
        </React.Fragment>     
    )
}

export default SideVideo
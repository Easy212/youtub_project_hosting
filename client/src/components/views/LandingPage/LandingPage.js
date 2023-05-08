import React, { useEffect, useState } from 'react'
import { Card, Avatar, Col, Typography, Row } from 'antd';
import axios from 'axios';
import moment from 'moment';
const { Title } = Typography;
const { Meta } = Card;
function LandingPage() {

    const [Videos, setVideos] = useState([]) //비디오 정보 배열에 저장

    useEffect(() => { //몽고DB에서 DOM이 로드 되자마자 실행
        axios.get('/api/video/getVideos') //db에서 비디오정보 가져오기 = axios 라이브러리를 사용하여 비동기 GET 요청
            .then(response => {//요청에대한 응답
                if (response.data.success) {  //성공시
                    console.log(response.data.videos)
                    setVideos(response.data.videos) // Videos 상태 변수를 videos 속성 값으로 업데이트
                } else { //실패시
                    alert('비디오 가져오기를 실패했습니다')
                }
            })
    }, []) //[] =  배열을 useEffect의 두 번째 인자로 전달함으로써 DOM실행됬을때 한번만 실행 

    const viewClick = (videoId) => {
      axios.post('/api/video/updateViews', { videoId })
        .then(response => {
          if (response.data.success) {
            console.log(response.data.views)
          } else {
            alert('조회수 업데이트를 실패했습니다.')
          }
        })
    }
    const renderCards = Videos.map((video, index) => { // map형식으로 

        var minutes = Math.floor(video.duration / 60); //video.duration(러닝타임)/60 = 분
        var seconds = Math.floor(video.duration - minutes * 60); //minutes/60 = 초

        return (
            <Col key={video._id} lg={6} md={8} xs={24}>
      <div style={{ position: "relative" }}>
        <a href={`/video/${video._id}`} onClick={() => onClickVideo(video._id)}>
          <img
            style={{ width: "100%" }}
            alt="thumbnail"
            src={`http://52.79.243.27:5000/${video.thumbnail}`}
          />
          <div
            className="duration"
            style={{
              bottom: 0,
              right: 0,
              position: "absolute",
              margin: "4px",
              color: "#fff",
              backgroundColor: "rgba(17, 17, 17, 0.8)",
              opacity: 0.8,
              padding: "2px 4px",
              borderRadius: "2px",
              letterSpacing: "0.5px",
              fontSize: "12px",
              fontWeight: "500",
              lineHeight: "12px",
            }}
          >
            <span>
              {minutes} : {seconds}
            </span>
          </div>
        </a>
      </div>
      <br />
      <Meta
        avatar={<Avatar src={video.writer.image} />}
        title={video.title}
      />
      <span>{video.writer.name} </span>
      <br />
      <span style={{ marginLeft: "3rem" }}> {video.views}</span>
      <span style={{ marginLeft: '3rem' }}> 조회수: {video.views}</span>  {/* 비디오 조회수*/}

      {video.updatedAt ? (
          <div style={{ marginLeft: "3rem" }}> 
              <span>최초 업로드일: {moment(video.createdAt).format("YYYY.MM.DD")}</span><br/>
              <span>최종 수정일: {moment(video.updatedAt).format("YYYY.MM.DD")}</span>
          </div>
          
      ) : (
          <span> 최초 업로드일: {moment(video.createdAt).format("YYYY.MM.DD")}</span>
      )}
    </Col>
        )

    })



    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2} > 추천 동영상 </Title>
            <hr />

            <Row gutter={16}>
                {renderCards}
            </Row>
        </div>
    )
}

export default LandingPage

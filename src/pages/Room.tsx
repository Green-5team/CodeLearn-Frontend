import { useCallback, useEffect, useState } from 'react';
import { BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs';
import { ImExit } from 'react-icons/im';
import { LuSettings2 } from 'react-icons/lu';
import { PiSpeakerSimpleHighFill, PiSpeakerSimpleSlashFill } from 'react-icons/pi';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { gameSocket, socket } from '@/apis/socketApi';
import Badge from '@/components/Room/Badge';
import useSocketConnect from '@/hooks/useSocketConnect';
import { RoomStatus, userInfo } from '@/types/room';
import Peer, { MediaConnection } from 'peerjs';

const Room = () => {
  useSocketConnect();
  const location = useLocation();
  const { title, member_count, max_members, user_info, nickname } = location.state;
  const [ableStart, setAbleStart] = useState<boolean>(false);
  const [isSpeaker, setIsSpeaker] = useState<boolean>(true);
  const [isMicrophone, setIsMicrophone] = useState<boolean>(true);
  const [roomName, setRoomName] = useState<string>(title);
  const [people, setPeople] = useState<number>(member_count);
  const [myIndex, setMyIndex] = useState<number>(0);
  const [ownerIndex, setOwnerIndex] = useState<number>(0);
  const [maxPeople, setMaxPeople] = useState<number>(max_members);
  const [userInfos, setUserInfos] = useState<userInfo[]>(user_info);

  const navigate = useNavigate();

  const handleSpeaker = () => {
    setIsSpeaker(!isSpeaker);
  };

  const handleMicrophone = () => {
    setIsMicrophone(!isMicrophone);
  };

  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string>("");
  const videoGrid = document.getElementById("video-grid");
  const myVideo = document.createElement("video");
  myVideo.muted = true;

  useEffect(() => {

    var newpeer = new Peer({
      host: 'localhost',
      port: 3030,
      path: '/peerjs',
      config: {
        'iceServers': [
          { url: 'stun:stun01.sipphone.com' },
          { url: 'stun:stun.ekiga.net' },
          { url: 'stun:stunserver.org' },
          { url: 'stun:stun.softjoys.com' },
          { url: 'stun:stun.voiparound.com' },
          { url: 'stun:stun.voipbuster.com' },
          { url: 'stun:stun.voipstunt.com' },
          { url: 'stun:stun.voxgratia.org' },
          { url: 'stun:stun.xten.com' },
          {
            url: 'turn:192.158.29.39:3478?transport=udp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
          },
          {
            url: 'turn:192.158.29.39:3478?transport=tcp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
          }
        ]
      },
    
      debug: 3
    });  
    setPeer(newpeer);  

    newpeer.on("open", (id) => {
      setPeerId(id);
      const currentPeerId = id; // Use the generated ID.
      socket.emit("voice-join-room", { title: roomName, peerid: currentPeerId });
      console.log("currentPeerId : "+ currentPeerId);  
    });

  }, []);

  useEffect(() => {
    const roomHandler = (response: RoomStatus) => {
      const { title, member_count, max_members, user_info } = response;
      setRoomName(title);
      setPeople(member_count);
      let countReady = 0;
      user_info.forEach((user: userInfo, index: number) => {
        if (user === 'LOCK' || user === 'EMPTY') return;
        if (user.nickname === nickname) {
          setMyIndex(index);
        }
        if (user.owner) {
          setOwnerIndex(index);
        }
        if (user.status) {
          countReady += 1;
        }
      });
      setAbleStart(member_count === countReady + 1);
      setMaxPeople(max_members);
      setUserInfos(user_info);
    };

    let countReady = 0;
    setRoomName(title);
    setPeople(member_count);
    user_info.forEach((user: userInfo, index: number) => {
      if (user === 'LOCK' || user === 'EMPTY') return;
      if (user.nickname === nickname) {
        setMyIndex(index);
      }
      if (user.owner) {
        setOwnerIndex(index);
      }
    });
    setAbleStart(member_count === countReady + 1);
    setMaxPeople(max_members);
    setUserInfos(user_info);

    socket.on('room-status-changed', roomHandler);
    socket.on('start', (response) => {
      gameSocket.emit('codingtest-join', { nickname });
      navigate('/game', { state: { nickname: nickname, title: response.title } });
    });
    return () => {
      socket.off('start');
      socket.off('room-status-changed', roomHandler);
    };
  }, []);

  const handleLeaveRoom = () => {
    const answer = confirm('정말 나가시겠습니까?');
    if (answer) {
      onLeaveRoom();
    }
  };

  const onLeaveRoom = useCallback(() => {
    socket.emit('leave-room', { title: roomName }, () => {
      navigate('/lobby', { state: { nickname } });
    });
  }, [navigate, roomName]);

  const onCustomRoom = () => {};

  const onReady = () => {
    socket.emit('ready', { title: roomName });
  };

  const onGameRoom = () => {
    socket.emit('start', { title: roomName });
  };

  useEffect(() => {
    if (!peer) return;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        //addVideoStream(myVideo, stream);

        peer.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on('stream', (remoteStream) => {
            addVideoStream(video, remoteStream);
          });
        });

        socket?.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });
      });
  }, [peer]);

  const connectToNewUser = (userId:any, stream:any) => {
    console.log('I call someone' + userId);
    const call = peer?.call(userId, stream);
    const video = document.createElement("video");
    call?.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  };

  useEffect(() => { 
    socket.emit("voice-join-room", { title: roomName, peerid: peerId });
  }, []);

  const addVideoStream = (video:any, stream:any) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
      videoGrid?.append(video);
    });
  };


  return (
    <MainContainer>
      <MainFrame>
        <div className='part1'>
          <HeaderLogo onClick={() => navigate('/lobby')}>CODE LEARN</HeaderLogo>
          <RoomName>{title}</RoomName>

          <OptionSection>
            <button onClick={handleSpeaker}>
              {isSpeaker ? (
                <PiSpeakerSimpleHighFill size={'2rem'} />
              ) : (
                <PiSpeakerSimpleSlashFill size={'2rem'} />
              )}
            </button>
            <button onClick={handleMicrophone}>
              {isMicrophone ? <BsFillMicFill size={'2rem'} /> : <BsFillMicMuteFill size={'2rem'} />}
            </button>
          </OptionSection>
        </div>
        <div className='part2'>
          {userInfos &&
            Array.from({ length: 10 }).map((_, index) => {
              return (
                <Badge
                  key={index}
                  isMine={index === myIndex}
                  isOwner={index === ownerIndex}
                  isRoomAuth={myIndex === ownerIndex}
                  user={userInfos[index]}
                  title={roomName}
                  badgeNumber={index}
                />
              );
            })}
        </div>
        <div className='part3'>
          <RoomButtons>
            <button onClick={handleLeaveRoom}>
              <ImExit size={'2rem'} />
            </button>
            <button onClick={onCustomRoom}>
              <LuSettings2 size={'2rem'} />
            </button>
          </RoomButtons>
          <People>
            <label className='countReady'>{people}</label>
            <label className='countPeople'>/ {maxPeople}</label>
          </People>
          {myIndex === ownerIndex ? (
            ableStart ? (
              <ButtonStart onClick={onGameRoom}>시작</ButtonStart>
            ) : (
              <ButtonStartLock>시작</ButtonStartLock>
            )
          ) : (
            <Ready onClick={onReady}>준비</Ready>
          )}
        </div>
      </MainFrame>
      <div id="video-grid" style={{display: 'none'}} >
      </div>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const HeaderLogo = styled.div`
  transition: all 0.5s ease;
  font-size: 2rem;
  padding: 2rem;
  font-weight: 500;
  cursor: pointer;
`;

const RoomName = styled.div`
  font-family: 'Black Han Sans', sans-serif;
  font-size: 2.5rem;
  padding: 2rem 1rem 1rem 1rem;
  margin: 0 1rem 0 1rem;
  border-bottom: 3px solid #fff;
  text-align: center;
  letter-spacing: 10px;
  font-style: italic;
  width: fit-content;
`;
const OptionSection = styled.div`
  height: 100%;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-shadow: inset -0.0625rem 0 #172334;
  button {
    transition: all 0.3s ease;
    padding: 1rem;
    width: fit-content;
    &:hover {
      filter: drop-shadow(0 0 10px #e0e0e0);
    }
  }
`;
const RoomButtons = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3rem 0 0 4rem;
  button {
    transition: all 0.3s ease;
    margin: 2rem;
    width: fit-content;
    &:hover {
      filter: drop-shadow(0 0 10px #e0e0e0);
    }
  }
`;
const People = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Black Han Sans', sans-serif;
  font-size: 60px;
  text-shadow: #3f3d4d 5px 6px 3px;

  .countPeople {
    color: #789;
    padding: 0 0 0 1rem;
  }
  .countReady {
    padding: 3rem 0 0 0;
    font-size: 10rem;
  }
`;

const ButtonStartLock = styled.button`
  margin-left: 1rem;
  transition: all 0.3s ease;
  font-size: xx-large;
  font-weight: bolder;
  width: fit-content;
  text-align: center;
  height: 3rem;
  margin-bottom: 30%;
  padding: 0 1rem 0;
  color: #bebebe;
  border-left: 5px solid #bebebe;
  cursor: default;
`;

const ButtonStart = styled.button`
  margin-left: 1rem;
  transition: all 0.3s ease;
  font-size: xx-large;
  font-weight: bolder;
  width: fit-content;
  text-align: center;
  height: 3rem;
  margin-bottom: 30%;
  padding: 0 1rem 0;
  border-left: 5px solid #fff;
  &:hover {
    text-shadow:
      0 0 5px #bebebe,
      0 0 10px #bebebe,
      0 0 15px #bebebe,
      0 0 20px #bebebe,
      0 0 35px #bebebe;
  }
`;

const Ready = styled.button`
  margin-left: 1rem;
  transition: all 0.3s ease;
  font-size: xx-large;
  font-weight: bolder;
  width: fit-content;
  text-align: center;
  height: 3rem;
  margin-bottom: 30%;
  padding: 0 1rem 0;
  border-left: 5px solid #fff;
  &:hover {
    text-shadow:
      0 0 5px #bebebe,
      0 0 10px #bebebe,
      0 0 15px #bebebe,
      0 0 20px #bebebe,
      0 0 35px #bebebe;
  }
`;

const MainFrame = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  justify-content: space-between;

  min-width: 900px;

  border: 1px solid #fff;
  border-top: 0px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 1);
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);

  .part1 {
    height: 100%;
    width: 25%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    word-break: break-word;
  }
  .part2 {
    height: 100%;
    width: 55%;
    display: flex;
    flex-wrap: wrap;
  }
  .part3 {
    height: 100%;
    width: 20%;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
`;

export default Room;

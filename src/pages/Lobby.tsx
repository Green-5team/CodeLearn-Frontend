import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ErrorPage from './Error';

import IconLogout from '/images/lobby/button_logout.png';
import IconSetting from '/images/lobby/button_setting.png';

import { postLogout } from '@/apis/authApi';

import { PATH_ROUTE, USER_TOKEN_KEY } from '@/constants';

import { socket } from '@/apis/socketApi';
import Button from '@/components/Lobby/Button';
import CreateRoom from '@/components/Lobby/CreateRoom';
import DropBox from '@/components/Lobby/DropBox';
import IconButton from '@/components/Lobby/IconButton';
import RoomList from '@/components/Lobby/RoomList';
import { useInput } from '@/hooks/useInput';
import useSocketConnect from '@/hooks/useSocketConnect';
import { RoomResponse } from '@/types/lobby';

const Lobby = () => {
  const [isShownCreateRoom, setShownCreateRoom] = useState(false);
  useSocketConnect();

  const navigate = useNavigate();
  const location = useLocation();
  if (!location.state) {
    return <ErrorPage />;
  }
  const { nickname } = location.state;
  const { value: roomInfo, setValue: setRoomInfo } = useInput({
    title: '',
    password: '',
    status: 'PUBLIC',
    max_members: 2,
    level: 1,
    mode: 'STUDY',
  });

  const LEVEL_OPTIONS = ['ALL', '1', '2', '3', '4', '5'];

  const handleChange = (e: { target: { name: string; value: string } }) => {
    if (e.target.name === 'password') {
      const publicState = e.target.value === '' ? 'PUBLIC' : 'PRIVATE';
      setRoomInfo({ ...roomInfo, [e.target.name]: e.target.value, ['status']: publicState });
    } else {
      setRoomInfo({ ...roomInfo, [e.target.name]: e.target.value });
    }
  };
  const onCreateRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit('create-room', roomInfo, (response: RoomResponse) => {
      if (!response.success) return alert(response.payload);
      if (roomInfo.mode === 'STUDY') {
        navigate(`/room/${roomInfo.title}`, {
          state: { ...response.payload.roomInfo, nickname },
        });
      } else {
        navigate(`/cooproom/${roomInfo.title}`, {
          state: { ...response.payload.roomInfo, nickname },
        });
      }
    });
  };

  const handleShowCreateRoom = () => {
    setShownCreateRoom(!isShownCreateRoom);
  };

  const handleLogout = () => {
    if (confirm('정말 떠나실건가요?'))
      try {
        postLogout();
        localStorage.removeItem(USER_TOKEN_KEY);
        alert('로그아웃 되었습니다.');
        navigate(PATH_ROUTE.login);
      } catch (error) {
        console.error(error);
      }
  };

  const handleSetting = () => {};

  const handleQuickStart = () => {};

  return (
    <MainContainer>
      {isShownCreateRoom && (
        <CreateRoom
          roomInfo={roomInfo}
          handleChange={handleChange}
          onCreateRoom={onCreateRoom}
          handleShowCreateRoom={handleShowCreateRoom}
        />
      )}
      <LeftFrame>
        <HeaderSection>
          <HeaderLogo onClick={() => navigate('/lobby')}>CODE LEARN</HeaderLogo>
        </HeaderSection>
      </LeftFrame>
      <MainFrame>
        <HeaderSection>
          <RoomButtonBox>
            <Button onClick={handleShowCreateRoom} title='방 만들기' />
            <Button title='빠른 시작' onClick={handleQuickStart} />
            <DropBox options={LEVEL_OPTIONS} />
          </RoomButtonBox>
          <RoomButtonBox>
            <IconButton icon={IconSetting} alt='setting' onClick={handleSetting} />
            <IconButton icon={IconLogout} alt='setting' onClick={handleLogout} />
          </RoomButtonBox>
        </HeaderSection>
        <RoomList nickname={nickname} />
      </MainFrame>
      <RightFrame>
        <HeaderSection></HeaderSection>
      </RightFrame>
    </MainContainer>
  );
};

const HeaderLogo = styled.div`
  transition: all 0.5s ease;
  font-size: 2.5rem;
  font-weight: 500;
  margin-top: 25px;
  margin-left: 80px;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;
  color: #8883ff;
`;

const MainContainer = styled.div`
  background: url('./background_lobby.png');
  background-size: contain;
  font-family: 'Noto Sans KR', sans-serif;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const LeftFrame = styled.div`
  width: 25%;
  height: 100%;
`;

const MainFrame = styled.div`
  min-width: 988px;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const RightFrame = styled.div`
  width: 25%;
  height: 100%;
`;

const HeaderSection = styled.div`
  padding-top: 80px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const RoomButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 78px;
  gap: 24px;
`;

export default Lobby;

import styled from 'styled-components';

const TimerBar = ({ seconds }: { seconds: number }) => {
  return (
    <Container>
      <TimeBar />
      <TimerBox>
        <SecondBar seconds={seconds}>
          <img src='/icon/public/timer.svg' alt='timer' />
        </SecondBar>
      </TimerBox>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100px;
  position: relative;
`;

const TimeBar = styled.div`
  position: absolute;
  width: 100%;
  height: 10px;
  background: #838393;
`;

const TimerBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const SecondBar = styled.div<{ seconds: number }>`
  position: relative;
  width: 100%;
  height: 10px;
  background: #6bd9a4;
  animation: timer 10s linear;
  animation-fill-mode: forwards;
  animation-play-state: ${(props) => (props.seconds > 0 ? 'running' : 'paused')};
  object-fit: contain;
  img {
    width: 90px;
    height: 90px;
    position: absolute;
    padding-top: 20px;
    right: -45px;
    top: 5px;
  }
  @keyframes timer {
    0% {
      width: 100%;
    }
    100% {
      width: 0%;
    }
  }
`;

export default TimerBar;

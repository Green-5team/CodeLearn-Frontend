import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Header = ({ handleShowLogout }: { handleShowLogout: () => void }) => {
  const navigate = useNavigate();

  return (
    <>
      <HeaderLogo onClick={() => navigate('/lobby')}>CODE LEARN</HeaderLogo>
      <HeaderLeftBox>
        <button>내 정보 수정</button>
        <button onClick={handleShowLogout}>게임 나가기</button>
      </HeaderLeftBox>
    </>
  );
};

const HeaderLogo = styled.div`
  transition: all 0.5s ease;
  font-size: 2rem;
  font-weight: 500;
  cursor: pointer;
`;

const HeaderLeftBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    margin-left: 1rem;
    transition: all 0.3s ease;
    &:hover {
      text-shadow:
        0 0 5px #bebebe,
        0 0 10px #bebebe,
        0 0 15px #bebebe,
        0 0 20px #bebebe,
        0 0 35px #bebebe;
    }
  }
`;

export default Header;

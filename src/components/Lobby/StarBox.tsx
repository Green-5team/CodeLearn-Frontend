import styled from 'styled-components';

import StarIcon from '/icon/lobby/star.svg';

interface Props {
  level: number;
  isOpacity?: boolean;
}

const StarBox = ({ level, isOpacity = true }: Props) => {
  return Array.from({ length: level }).map((_, idx) => (
    <Container key={idx} opacity={isOpacity ? ((idx + 1) / 5).toString() : ''}>
      <img src={StarIcon} alt='' />
    </Container>
  ));
};

const Container = styled.div<{ opacity?: string }>`
  width: 15px;
  height: 12px;
  object-fit: contain;
  opacity: ${(props) => props.opacity};
  img {
    height: 100%;
  }
`;

export default StarBox;

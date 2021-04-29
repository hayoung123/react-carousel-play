import './App.css';
import Carousel from './lib/Carousel';
import styled from 'styled-components';
function App() {
  const list = new Array(10).fill();
  const itemList = list.map((v, idx) => <Item key={idx}>{idx + 1}</Item>);

  const settings = {
    slideToScroll: 3,
    speed: 500,
    defaultArrow: true,
  };
  return (
    <CarouselContainer>
      <Carousel {...settings}>{itemList}</Carousel>
    </CarouselContainer>
  );
}

const CarouselContainer = styled.div`
  margin-top: 200px;
  width: 500px;
  height: 100px;
  position: absolute;
  left: 100px;
`;

const Item = styled.div`
  width: 90px;
  height: 100px;
  background-color: green;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  user-select: none;
`;

export default App;

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styled from 'styled-components';
import { IoChevronBackSharp, IoChevronForwardSharp } from 'react-icons/io5';
import CarouselItem from './item/CarouselItem';
import CarouselPage from './page/CarouselPage';

const Carousel = forwardRef(
  (
    {
      children,
      slideToScroll,
      animationType = 'ease',
      speed = 500,
      defaultArrow,
      defaultPaging,
      PagingComp,
      infinity = false,
    },
    ref
  ) => {
    const [locationX, setLocationX] = useState(0);
    const [currIdx, setCurrIdx] = useState(0);
    const [leftItem, setLeftItem] = useState();
    const [itemWidth, setItemWidth] = useState();
    const [animation, setAnimation] = useState();
    const carouselContainerRef = useRef();
    const isCarouselWidth = () => carouselContainerRef.current && itemWidth;
    const containerWidth = isCarouselWidth() && carouselContainerRef.current.offsetWidth;
    const slideToShow = isCarouselWidth() && Math.floor(containerWidth / itemWidth);
    const marginRigthForItem =
      isCarouselWidth() && (containerWidth - slideToShow * itemWidth) / (slideToShow - 1);

    //초기 설정
    useEffect(() => {
      setAnimation(`${speed / 1000}s ${animationType}`);
    }, [infinity, slideToScroll, speed, animationType]);

    const setAnimationType = (animationSpeed, type) => {
      setAnimation(`${animationSpeed / 1000}s ${type}`);
    };

    const handleClickPrev = () => {
      let possibleMove = currIdx >= slideToScroll ? slideToScroll : currIdx;
      setLocationX(locationX + (itemWidth + marginRigthForItem) * possibleMove);
      setCurrIdx(currIdx - possibleMove);
      setLeftItem(leftItem + possibleMove);
    };

    const infinityhandleClickNext = () => {
      const totalItemCount = children.length;
      const newLeftItem = totalItemCount - (currIdx + slideToShow);
      let possibleMove = newLeftItem >= slideToScroll ? slideToScroll : newLeftItem;
      if (infinity && possibleMove === 0) possibleMove = slideToScroll;
      setLocationX(locationX - (itemWidth + marginRigthForItem) * possibleMove);
      setCurrIdx(currIdx + possibleMove);
      setLeftItem(newLeftItem - possibleMove);
    };

    const handleClickNext = () => {
      const totalItemCount = children.length;
      const newLeftItem = totalItemCount - (currIdx + slideToShow);
      let possibleMove = newLeftItem >= slideToScroll ? slideToScroll : newLeftItem;
      if (infinity && possibleMove === 0) possibleMove = slideToScroll;
      setLocationX(locationX - (itemWidth + marginRigthForItem) * possibleMove);
      setCurrIdx(currIdx + possibleMove);
      setLeftItem(newLeftItem - possibleMove);
    };

    useImperativeHandle(ref, () => ({
      handleClickPrev,
      handleClickNext,
      currentIdx: currIdx,
    }));

    const carouselItemList =
      children &&
      children.map((item, idx) => {
        if (idx === 0)
          return <CarouselItem key={idx} {...{ item, idx, setItemWidth, marginRigthForItem }} />;
        return <CarouselItem key={idx} {...{ item, idx, marginRigthForItem }} />;
      });

    return (
      <StyledCarousel
        locationX={locationX}
        animation={animation}
        currIdx={currIdx}
        leftItem={leftItem}
        infinity={infinity}
      >
        <div className='carouselWrapper'>
          <div className='carouselList' ref={carouselContainerRef}>
            {/* {infinity && carouselItemList.slice(slideToScroll * -1 - 1, -1)} */}
            {carouselItemList}
            {infinity && carouselItemList.slice(0, slideToScroll)}
          </div>
        </div>
        {defaultArrow && (
          <>
            <IoChevronBackSharp onClick={handleClickPrev} className='leftArrow arrow' />
            <IoChevronForwardSharp onClick={handleClickNext} className='rightArrow arrow' />
          </>
        )}
        {defaultPaging && (
          <CarouselPage current={currIdx + slideToShow} total={children && children.length} />
        )}
        {PagingComp && (
          <PagingComp current={currIdx + slideToShow} total={children && children.length} />
        )}
      </StyledCarousel>
    );
  }
);

export default Carousel;

export const StyledCarousel = styled.div`
  position: relative;
  .carouselWrapper {
    overflow: hidden;
  }
  .carouselList {
    display: flex;
    transition: ${({ animation }) => `transform ${animation}`};
    transform: ${({ locationX }) => `translateX(${locationX}px)`};
  }
  .arrow {
    position: absolute;
    font-size: 2rem;
    top: 40%;
    cursor: pointer;
  }
  .leftArrow {
    left: -50px;
    opacity: ${({ currIdx, infinity }) => (!infinity && currIdx === 0 ? '0.3' : '1')};
  }
  .leftArrow:hover {
    color: ${({ currIdx, infinity }) => (!infinity && currIdx === 0 ? '' : 'red')};
  }
  .rightArrow {
    right: -50px;
    opacity: ${({ leftItem, infinity }) => (!infinity && leftItem === 0 ? '0.3' : '1')};
  }
  .rightArrow :hover {
    color: ${({ leftItem, infinity }) => (!infinity && leftItem === 0 ? '' : 'red')};
  }
`;

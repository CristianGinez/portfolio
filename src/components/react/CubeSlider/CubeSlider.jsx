import React, { useRef, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCube, Mousewheel, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import './CubeSlider.css';

import HeroSlide from './slides/HeroSlide';
import AboutSlide from './slides/AboutSlide';
import ProjectsSlide from './slides/ProjectsSlide';
import StackSlide from './slides/StackSlide';
import ContactSlide from './slides/ContactSlide';

export default function CubeSlider() {
  const swiperRef    = useRef(null);
  const touchStartY  = useRef(0);
  const mouseStartY  = useRef(0);
  const mouseDown    = useRef(false);
  const [showContact, setShowContact] = useState(false);

  const onSlideChange    = useCallback((s) => { if (s.activeIndex !== 4) setShowContact(false); }, []);
  const onTransitionEnd  = useCallback((s) => { if (s.activeIndex === 4) setShowContact(true);  }, []);

  const goBack = useCallback(() => {
    if (!swiperRef.current) return;
    setShowContact(false);
    swiperRef.current.slidePrev();
  }, []);

  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchEnd   = (e) => {
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    if (dy < -50) goBack();
  };

  const handleWheel      = (e) => { if (e.deltaY < -30) goBack(); };
  const handleMouseDown  = (e) => { mouseStartY.current = e.clientY; mouseDown.current = true; };
  const handleMouseUp    = (e) => {
    if (!mouseDown.current) return;
    mouseDown.current = false;
    if (mouseStartY.current - e.clientY < -50) goBack();
  };

  return (
    <div className="relative h-full w-full bg-neutral-900">
      <Swiper
        onSwiper={(s) => { swiperRef.current = s; }}
        onSlideChange={onSlideChange}
        onTransitionEnd={onTransitionEnd}
        effect={'cube'}
        grabCursor={true}
        cubeEffect={{
          shadow: false,
          slideShadows: false,
          shadowOffset: 20,
          shadowScale: 0.94,
        }}
        direction={'vertical'}
        mousewheel={true}
        speed={1000}
        loop={false}
        modules={[EffectCube, Mousewheel, Pagination]}
        className="mySwiper h-full w-full"
        threshold={20}
        touchStartPreventDefault={false}
        preventClicks={false}
        preventClicksPropagation={false}
        noSwiping={true}
        noSwipingClass="swiper-no-swiping"
        touchReleaseOnEdges={true}
      >
        <SwiperSlide className="bg-white text-black">
          <HeroSlide />
        </SwiperSlide>

        <SwiperSlide className="bg-zinc-50 text-black">
          <AboutSlide />
        </SwiperSlide>

        <SwiperSlide className="bg-white text-black">
          <ProjectsSlide swiperRef={swiperRef} />
        </SwiperSlide>

        <SwiperSlide className="bg-zinc-50 text-black">
          <StackSlide />
        </SwiperSlide>

        {/* ContactSlide dentro del cubo solo para la animación visual — el overlay de abajo maneja los clicks */}
        <SwiperSlide className="bg-black text-white">
          <ContactSlide />
        </SwiperSlide>
      </Swiper>

      {/* ContactSlide fuera del contexto 3D del Swiper para que pointer-events funcionen en mobile */}
      {showContact && (
        <div
          className="absolute inset-0 z-50 bg-black text-white"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <ContactSlide />
        </div>
      )}
    </div>
  );
}
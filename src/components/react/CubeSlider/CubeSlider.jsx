import React from 'react';
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
  return (
    <div className="h-full w-full bg-neutral-900">
      <Swiper
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
        
        // --- 🔴 LA SOLUCIÓN DEFINITIVA PARA MÓVIL ---
        
        // 1. UMBRAL (La clave): Swiper ignorará movimientos menores a 20px.
        // Esto permite que el dedo tiemble un poco al hacer clic sin que Swiper lo cancele.
        threshold={20} 

        // 2. Permisividad de Eventos:
        touchStartPreventDefault={false} 
        preventClicks={false}
        preventClicksPropagation={false}
        
        // 3. Bloqueo de zonas específicas
        noSwiping={true} 
        noSwipingClass="swiper-no-swiping"
        
        // 4. Force release: Ayuda a que suelte el evento más rápido
        touchReleaseOnEdges={true}
      >
        <SwiperSlide className="bg-white text-black">
          <HeroSlide />
        </SwiperSlide>

        <SwiperSlide className="bg-zinc-50 text-black">
          <AboutSlide />
        </SwiperSlide>

        {/* Slide de Proyectos (Donde ocurre el problema) */}
        <SwiperSlide className="bg-white text-black">
          <ProjectsSlide />
        </SwiperSlide>

        <SwiperSlide className="bg-zinc-50 text-black">
          <StackSlide />
        </SwiperSlide>

        <SwiperSlide className="bg-black text-white">
          <ContactSlide />
        </SwiperSlide>

      </Swiper>
    </div>
  );
}
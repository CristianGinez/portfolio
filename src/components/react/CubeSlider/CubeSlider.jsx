// src/components/react/CubeSlider/CubeSlider.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCube, Mousewheel, Pagination } from 'swiper/modules';

// Estilos
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import './CubeSlider.css';

// Importamos las CARAS (Componentes)
import HeroSlide from './slides/HeroSlide';
import AboutSlide from './slides/AboutSlide';
import ProjectsSlide from './slides/ProjectsSlide';
import StackSlide from './slides/StackSlide';
import ContactSlide from './slides/ContactSlide';

export default function CubeSlider() {
  return (
    <div className="h-full w-full bg-neutral-900"> {/* Fondo oscuro general */}
      <Swiper
        effect={'cube'}
        grabCursor={true}
        cubeEffect={{
          shadow: false,
          slideShadows: false, // Flat design
          shadowOffset: 20,
          shadowScale: 0.94,
        }}
        direction={'vertical'}
        mousewheel={true}
        speed={1000}
        loop={false}
        modules={[EffectCube, Mousewheel, Pagination]}
        className="mySwiper h-full w-full"
      >
        {/* CARA 1: HERO (Inicio) */}
        <SwiperSlide className="bg-white text-black">
          <HeroSlide />
        </SwiperSlide>

        {/* CARA 2: ABOUT (Sobre mí) */}
        <SwiperSlide className="bg-zinc-50 text-black">
          <AboutSlide />
        </SwiperSlide>

        {/* CARA 3: PROJECTS (Tus trabajos) */}
        <SwiperSlide className="bg-white text-black">
          <ProjectsSlide />
        </SwiperSlide>

        {/* CARA 4: STACK (Tecnologías) */}
        <SwiperSlide className="bg-zinc-50 text-black">
          <StackSlide />
        </SwiperSlide>

        {/* CARA 5: CONTACT (Cierre) */}
        <SwiperSlide className="bg-black text-white">
          <ContactSlide />
        </SwiperSlide>

      </Swiper>
    </div>
  );
}
import React from 'react';
import { useSwiperSlide } from 'swiper/react';
import cv from '@cv';

export default function ContactSlide() {
  const swiperSlide = useSwiperSlide();
  const isActive = swiperSlide ? swiperSlide.isActive : true;

  return (
    <div
      // 1. Contenedor base idéntico al root de ProjectsSlide
      className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center text-white"
      style={{
        opacity: isActive ? 1 : 0,
        visibility: isActive ? 'visible' : 'hidden',
        transition: isActive
          ? 'opacity 0.4s ease 0.3s, visibility 0s'
          : 'opacity 0.2s ease, visibility 0.2s step-end',
      }}
    >
      {/* 2. Contenedor equivalente a tu "ProjectCard" o "TrabajoCard".
          Aquí aplicamos la detención de Swiper y la manipulación táctil */}
      <div 
        className="swiper-no-swiping flex flex-col items-center justify-center w-full max-w-3xl p-6"
        style={{ touchAction: 'manipulation' }}
      >
        <h2 className="text-6xl font-black mb-6 text-center">¿Hablamos?</h2>
        <p className="text-xl mb-12 text-gray-400 max-w-lg text-center">
          Estoy disponible para nuevos retos y colaboraciones técnicas.
        </p>

        {/* 3. Enlaces con z-10, flex y stopPropagation(), idéntico a tus proyectos */}
        <a
          href={`mailto:${cv.basics.email}`}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 flex items-center text-2xl border-b-2 border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-all mb-12"
        >
          {cv.basics.email}
        </a>

        <div className="flex flex-wrap items-center justify-center gap-6 px-4 w-full">
          {cv.basics.profiles.map((profile) => (
            <a
              key={profile.network}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 flex items-center p-2 text-sm font-mono hover:underline transition-all"
            >
              {profile.network}
            </a>
          ))}

          <a
            href="/cv.pdf"
            download="Cristian Paolo Ginez Campos - Curriculum Vitae.pdf"
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 flex items-center px-4 py-2 text-sm font-mono font-bold text-black bg-white rounded hover:bg-gray-300 transition-colors"
          >
            Descargar CV
          </a>
        </div>
      </div>
    </div>
  );
}
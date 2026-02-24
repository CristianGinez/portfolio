import React from 'react';
import { useSwiperSlide } from 'swiper/react';
import cv from '@cv';

export default function ContactSlide() {
  const swiperSlide = useSwiperSlide();
  const isActive = swiperSlide ? swiperSlide.isActive : true;

  return (
    <div
      className="flex flex-col items-center justify-center w-full text-white"
      style={{
        position: 'absolute',
        inset: 0,
        opacity: isActive ? 1 : 0,
        visibility: isActive ? 'visible' : 'hidden',
        transition: isActive
          ? 'opacity 0.4s ease 0.3s, visibility 0s'
          : 'opacity 0.2s ease, visibility 0.2s step-end',
      }}
    >
      {/* 1. EL SECRETO: Envolvemos TODO en un contenedor "escudo" con swiper-no-swiping. 
             Así Swiper ignora los arrastres aquí, PERO no "toca" los enlaces directamente. */}
      <div className="swiper-no-swiping flex flex-col items-center justify-center w-full z-10 relative">
        <h2 className="text-6xl font-black mb-6">¿Hablamos?</h2>
        <p className="text-xl mb-10 text-gray-400 max-w-lg text-center">
          Estoy disponible para nuevos retos y colaboraciones técnicas.
        </p>

        <a
          href={`mailto:${cv.basics.email}`}
          onClick={(e) => e.stopPropagation()}
          // 2. Eliminamos swiper-no-swiping del <a>. 
          // 3. Usamos inline-flex, z-10 y relative (igual que en tus ProjectsSlide)
          className="inline-flex items-center justify-center cursor-pointer text-2xl border-b-2 border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-all z-10 relative"
        >
          {cv.basics.email}
        </a>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 px-4">
          {cv.basics.profiles.map((profile) => (
            <a
              key={profile.network}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              // Aplicamos exactamente la misma arquitectura física
              className="inline-flex items-center justify-center cursor-pointer text-sm font-mono hover:underline z-10 relative"
            >
              {profile.network}
            </a>
          ))}

          <a
            href="/cv.pdf"
            download="Cristian Paolo Ginez Campos - Curriculum Vitae.pdf"
            onClick={(e) => e.stopPropagation()}
            // Botón intacto visualmente, pero blindado contra Safari
            className="inline-flex items-center justify-center cursor-pointer px-4 py-2 text-sm font-mono font-bold text-black bg-white rounded hover:bg-gray-300 transition-colors z-10 relative"
          >
            Descargar CV
          </a>
        </div>
      </div>
    </div>
  );
}
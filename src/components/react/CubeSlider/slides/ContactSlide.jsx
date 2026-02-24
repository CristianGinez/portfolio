import React from 'react';
import { useSwiperSlide } from 'swiper/react';
import cv from '@cv';

export default function ContactSlide() {
  const swiperSlide = useSwiperSlide();
  const isActive = swiperSlide ? swiperSlide.isActive : true;

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full h-full text-white"
      style={{
        opacity: isActive ? 1 : 0,
        visibility: isActive ? 'visible' : 'hidden',
        transition: isActive
          ? 'opacity 0.4s ease 0.3s, visibility 0s'
          : 'opacity 0.2s ease, visibility 0.2s step-end',
      }}
    >
      {/* Añadimos translateZ para "sacar" el contenedor del bug 3D de Safari/Chrome 
      */}
      <div 
        className="swiper-no-swiping flex flex-col items-center justify-center w-full max-w-lg px-6"
        style={{ 
          transform: 'translateZ(20px)', 
          WebkitTransform: 'translateZ(20px)' 
        }}
      >
        <h2 className="text-5xl md:text-6xl font-black mb-6 text-center drop-shadow-md">¿Hablamos?</h2>
        <p className="text-lg md:text-xl mb-12 text-gray-400 text-center drop-shadow-sm">
          Estoy disponible para nuevos retos y colaboraciones técnicas.
        </p>

        {/* Cada botón es empujado aún más al frente en el eje Z */}
        <a
          href={`mailto:${cv.basics.email}`}
          className="relative block text-center text-xl md:text-2xl border-b-2 border-white pb-2 mb-12 hover:text-gray-300 transition-all cursor-pointer"
          style={{ transform: 'translateZ(30px)', WebkitTransform: 'translateZ(30px)' }}
        >
          {cv.basics.email}
        </a>

        <div className="flex flex-wrap items-center justify-center gap-4 w-full">
          {cv.basics.profiles.map((profile) => (
            <a
              key={profile.network}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-mono hover:bg-white/10 rounded-lg transition-all cursor-pointer"
              style={{ transform: 'translateZ(30px)', WebkitTransform: 'translateZ(30px)' }}
            >
              {profile.network}
            </a>
          ))}

          <a
            href="/cv.pdf"
            download="Cristian Paolo Ginez Campos - Curriculum Vitae.pdf"
            className="px-6 py-3 text-sm font-mono font-bold text-black bg-white rounded shadow-xl hover:bg-gray-200 transition-colors cursor-pointer ml-2"
            style={{ transform: 'translateZ(30px)', WebkitTransform: 'translateZ(30px)' }}
          >
            Descargar CV
          </a>
        </div>
      </div>
    </div>
  );
}
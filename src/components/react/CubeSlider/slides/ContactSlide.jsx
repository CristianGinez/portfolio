import React from 'react';
import { useSwiperSlide } from 'swiper/react';
import cv from '@cv';

export default function ContactSlide() {
  const swiperSlide = useSwiperSlide();
  const isActive = swiperSlide ? swiperSlide.isActive : true;

  return (
    <div
      className="relative w-full h-full text-white"
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
      <div className="w-full h-full overflow-y-auto swiper-no-swiping flex flex-col items-center px-4">
        
        {/* Contenedor interior para centrar verticalmente sin romper el scroll en pantallas pequeñas */}
        <div className="flex flex-col items-center justify-center w-full max-w-3xl my-auto py-12 min-h-full">
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-center">¿Hablamos?</h2>
          <p className="text-lg md:text-xl mb-12 text-gray-400 max-w-lg text-center">
            Estoy disponible para nuevos retos y colaboraciones técnicas.
          </p>

          <a
            href={`mailto:${cv.basics.email}`}
            onClick={(e) => e.stopPropagation()}
            className="relative z-50 inline-flex items-center text-xl md:text-2xl border-b-2 border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-all mb-12"
          >
            {cv.basics.email}
          </a>

          <div className="flex flex-wrap items-center justify-center gap-6 w-full relative z-50">
            {cv.basics.profiles.map((profile) => (
              <a
                key={profile.network}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center p-2 text-sm md:text-base font-mono hover:underline transition-all"
              >
                {profile.network}
              </a>
            ))}

            <a
              href="/cv.pdf"
              download="Cristian Paolo Ginez Campos - Curriculum Vitae.pdf"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center px-6 py-3 text-sm md:text-base font-mono font-bold text-black bg-white rounded-md hover:bg-gray-300 transition-colors"
            >
              Descargar CV
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
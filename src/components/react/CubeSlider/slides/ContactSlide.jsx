import React from 'react';
import { useSwiperSlide } from 'swiper/react';
import cv from '@cv';

export default function ContactSlide() {
  const swiperSlide = useSwiperSlide();
  const isActive = swiperSlide ? swiperSlide.isActive : true;

  return (
    <div
      // Agregamos h-full para que tome el alto sin necesidad de "absolute"
      className="flex flex-col items-center justify-center w-full h-full text-white"
      style={{
        // ELIMINADO: position: 'absolute' e inset: 0
        opacity: isActive ? 1 : 0,
        visibility: isActive ? 'visible' : 'hidden',
        transition: isActive
          ? 'opacity 0.4s ease 0.3s, visibility 0s'
          : 'opacity 0.2s ease, visibility 0.2s step-end',
        touchAction: 'manipulation',
      }}
    >
      <h2 className="text-6xl font-black mb-6">¿Hablamos?</h2>
      <p className="text-xl mb-10 text-gray-400 max-w-lg text-center">
        Estoy disponible para nuevos retos y colaboraciones técnicas.
      </p>

      <a
        href={`mailto:${cv.basics.email}`}
        // Agregamos: relative z-10
        className="swiper-no-swiping relative z-10 text-2xl border-b-2 border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-all"
        style={{ touchAction: 'manipulation' }}
      >
        {cv.basics.email}
      </a>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 px-4">
        {cv.basics.profiles.map((profile) => (
          <a
            key={profile.network}
            href={profile.url}
            // Agregamos: relative z-10
            className="swiper-no-swiping relative z-10 text-sm font-mono hover:underline"
            style={{ touchAction: 'manipulation' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {profile.network}
          </a>
        ))}

        <a
          href="/cv.pdf"
          download="Cristian Paolo Ginez Campos - Curriculum Vitae.pdf"
          // Agregamos: relative z-10
          className="swiper-no-swiping relative z-10 px-4 py-2 text-sm font-mono font-bold text-black bg-white rounded hover:bg-gray-300 transition-colors"
          style={{ touchAction: 'manipulation' }}
        >
          Descargar CV
        </a>
      </div>
    </div>
  );
}
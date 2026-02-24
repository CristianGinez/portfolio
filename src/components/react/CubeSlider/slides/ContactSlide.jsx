import React from 'react';
import { useSwiperSlide } from 'swiper/react';
import cv from '@cv';

export default function ContactSlide() {
  const swiperSlide = useSwiperSlide();
  const isActive = swiperSlide ? swiperSlide.isActive : true;

  // Esta función evita que Swiper "robe" el toque en móviles
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full text-white"
      style={{
        opacity: isActive ? 1 : 0,
        visibility: isActive ? 'visible' : 'hidden',
        transition: isActive
          ? 'opacity 0.4s ease 0.3s, visibility 0s'
          : 'opacity 0.2s ease, visibility 0.2s step-end',
      }}
    >
      <h2 className="text-6xl font-black mb-6">¿Hablamos?</h2>
      <p className="text-xl mb-10 text-gray-400 max-w-lg text-center">
        Estoy disponible para nuevos retos y colaboraciones técnicas.
      </p>

      <a
        href={`mailto:${cv.basics.email}`}
        className="swiper-no-swiping relative z-50 text-2xl border-b-2 border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-all cursor-pointer"
        onTouchStart={stopPropagation}
        onPointerDown={stopPropagation}
        onClick={stopPropagation}
      >
        {cv.basics.email}
      </a>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 px-4">
        {cv.basics.profiles.map((profile) => (
          <a
            key={profile.network}
            href={profile.url}
            className="swiper-no-swiping relative z-50 text-sm font-mono hover:underline cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
            onTouchStart={stopPropagation}
            onPointerDown={stopPropagation}
            onClick={stopPropagation}
          >
            {profile.network}
          </a>
        ))}

        <a
          href="/cv.pdf"
          download="Cristian Paolo Ginez Campos - Curriculum Vitae.pdf"
          className="swiper-no-swiping relative z-50 px-4 py-2 text-sm font-mono font-bold text-black bg-white rounded hover:bg-gray-300 transition-colors cursor-pointer"
          onTouchStart={stopPropagation}
          onPointerDown={stopPropagation}
          onClick={stopPropagation}
        >
          Descargar CV
        </a>
      </div>
    </div>
  );
}
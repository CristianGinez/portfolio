import React from 'react';
import { useSwiperSlide } from 'swiper/react';
import cv from '@cv';

export default function ContactSlide() {
  const swiperSlide = useSwiperSlide();
  const isActive = swiperSlide ? swiperSlide.isActive : true;

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
      <div className="swiper-no-swiping flex flex-col items-center justify-center w-full max-w-lg px-6 relative z-10">
        <h2 className="text-5xl md:text-6xl font-black mb-6 text-center drop-shadow-md">¿Hablamos?</h2>
        <p className="text-lg md:text-xl mb-12 text-gray-400 text-center drop-shadow-sm">
          Estoy disponible para nuevos retos y colaboraciones técnicas.
        </p>

        <a
          href={`mailto:${cv.basics.email}`}
          onClick={(e) => e.stopPropagation()}
          className="relative z-20 block text-center text-xl md:text-2xl border-b-2 border-white pb-2 mb-12 hover:text-gray-300 transition-all cursor-pointer"
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
              onClick={(e) => e.stopPropagation()}
              className="relative z-20 px-4 py-2 text-sm font-mono hover:bg-white/10 rounded-lg transition-all cursor-pointer"
            >
              {profile.network}
            </a>
          ))}

          <a
            href="/cv.pdf"
            download="Cristian Paolo Ginez Campos - Curriculum Vitae.pdf"
            onClick={(e) => e.stopPropagation()}
            className="relative z-20 px-6 py-3 text-sm font-mono font-bold text-black bg-white rounded shadow-xl hover:bg-gray-200 transition-colors cursor-pointer ml-2"
          >
            Descargar CV
          </a>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { useSwiperSlide } from 'swiper/react';
import cv from '@cv';

export default function ContactSlide() {
  const swiperSlide = useSwiperSlide();
  const isActive = swiperSlide ? swiperSlide.isActive : true;

  const linkStyle = {
    touchAction: 'manipulation',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTapHighlightColor: 'rgba(255,255,255,0.1)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  };

  return (
    <div
      className="swiper-no-swiping flex flex-col items-center justify-center w-full text-white select-none"
      style={{
        position: 'absolute',
        inset: 0,
        opacity: isActive ? 1 : 0,
        visibility: isActive ? 'visible' : 'hidden',
        transition: isActive
          ? 'opacity 0.4s ease 0.3s, visibility 0s'
          : 'opacity 0.2s ease, visibility 0.2s step-end',
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      <h2
        className="text-6xl font-black mb-6"
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        ¿Hablamos?
      </h2>

      <p
        className="text-xl mb-10 text-gray-400 max-w-lg text-center px-4"
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        Estoy disponible para nuevos retos y colaboraciones técnicas.
      </p>

      <a
        href={`mailto:${cv.basics.email}`}
        className="swiper-no-swiping text-xl md:text-2xl border-b-2 border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-all px-2"
        style={linkStyle}
      >
        {cv.basics.email}
      </a>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4 px-6">
        {cv.basics.profiles.map((profile) => (
          <a
            key={profile.network}
            href={profile.url}
            className="swiper-no-swiping text-sm font-mono px-3 hover:underline"
            style={linkStyle}
            target="_blank"
            rel="noopener noreferrer"
          >
            {profile.network}
          </a>
        ))}

        <a
          href="/cv.pdf"
          download="Cristian Paolo Ginez Campos - Curriculum Vitae.pdf"
          className="swiper-no-swiping px-5 py-3 text-sm font-mono font-bold text-black bg-white rounded hover:bg-gray-300 transition-colors"
          style={linkStyle}
        >
          Descargar CV
        </a>
      </div>
    </div>
  );
}
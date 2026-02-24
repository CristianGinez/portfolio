import React from 'react';
import { useSwiperSlide } from 'swiper/react';
import cv from '@cv';

export default function ContactSlide() {
  const swiperSlide = useSwiperSlide();
  const isActive = swiperSlide ? swiperSlide.isActive : true;

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full text-white"
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
        href="mailto:contacto@cristianginez.com"
        className="text-2xl border-b-2 border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-all"
      >
        {cv.basics.email}
      </a>
      
      <div className="mt-12 flex items-center gap-8">
        {cv.basics.profiles.map((profile) => (
          <a
            key={profile.network}
            href={profile.url}
            className="text-sm font-mono hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {profile.network}
          </a>
        ))}
        
        <a
          href="/cv.pdf"
          download="Cristian Paolo Ginez Campos - Curriculum Vitae.pdf"
          className="px-4 py-2 text-sm font-mono font-bold text-black bg-white rounded hover:bg-gray-300 transition-colors"
        >
          Descargar CV
        </a>
      </div>
    </div>
  );
}
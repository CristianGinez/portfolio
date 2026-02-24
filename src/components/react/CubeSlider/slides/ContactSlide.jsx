import React from 'react';
import { useSwiperSlide } from 'swiper/react';
import cv from '@cv';

export default function ContactSlide() {
  const swiperSlide = useSwiperSlide();
  const isActive = swiperSlide ? swiperSlide.isActive : true;

  const handleMail = (e) => {
    e.stopPropagation();
    window.location.href = `mailto:${cv.basics.email}`;
  };

  const handleLink = (e, url) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = '/cv.pdf';
    link.download = 'Cristian Paolo Ginez Campos - Curriculum Vitae.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center text-white"
      style={{
        opacity: isActive ? 1 : 0,
        visibility: isActive ? 'visible' : 'hidden',
        pointerEvents: isActive ? 'auto' : 'none', 
        transition: isActive
          ? 'opacity 0.4s ease 0.3s, visibility 0s'
          : 'opacity 0.2s ease, visibility 0.2s step-end',
      }}
    >
      <div 
        className="swiper-no-swiping flex flex-col items-center justify-center w-full px-4 z-50 relative" 
      >
        <h2 className="text-5xl md:text-6xl font-black mb-6 text-center">¿Hablamos?</h2>
        <p className="text-lg md:text-xl mb-10 text-gray-400 max-w-lg text-center">
          Estoy disponible para nuevos retos y colaboraciones técnicas.
        </p>

        <button
          onClick={handleMail}
          onTouchEnd={handleMail} 
          className="inline-flex items-center justify-center text-xl md:text-2xl border-b-2 border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-all cursor-pointer relative z-50 bg-transparent"
        >
          {cv.basics.email}
        </button>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          {cv.basics.profiles.map((profile) => (
            <button
              key={profile.network}
              onClick={(e) => handleLink(e, profile.url)}
              onTouchEnd={(e) => handleLink(e, profile.url)}
              className="inline-flex items-center justify-center p-2 text-sm font-mono hover:underline cursor-pointer relative z-50 bg-transparent"
            >
              {profile.network}
            </button>
          ))}

          <button
            onClick={handleDownload}
            onTouchEnd={handleDownload}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-mono font-bold text-black bg-white rounded hover:bg-gray-300 transition-colors cursor-pointer relative z-50"
          >
            Descargar CV
          </button>
        </div>
      </div>
    </div>
  );
}
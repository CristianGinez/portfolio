import React from 'react';
import cv from '@cv';

export default function ContactSlide() {
  return (
    // Copiamos la MISMA estructura exacta de AboutSlide: flex, h-full, w-full, p-12...
    <div className="flex flex-col items-center justify-center h-full w-full p-8 md:p-12 max-w-4xl mx-auto text-white">

      <h2 className="text-3xl md:text-6xl font-black mb-4 md:mb-6 text-center drop-shadow-md">
        ¿Hablamos?
      </h2>

      <p className="text-sm md:text-xl mb-8 md:mb-12 text-gray-400 max-w-lg text-center drop-shadow-sm">
        Estoy disponible para nuevos retos y colaboraciones técnicas.
      </p>

      <a
        href={`mailto:${cv.basics.email}`}
        className="text-base md:text-2xl border-b-2 border-white pb-2 mb-8 md:mb-12 hover:text-gray-300 transition-all cursor-pointer"
      >
        {cv.basics.email}
      </a>

      <div className="flex flex-wrap items-center justify-center gap-6 w-full">
        {cv.basics.profiles.map((profile) => (
          <a
            key={profile.network}
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono hover:underline transition-all cursor-pointer"
          >
            {profile.network}
          </a>
        ))}

        <a
          href="/cv.pdf"
          download="Cristian Paolo Ginez Campos - Curriculum Vitae.pdf"
          className="px-6 py-3 text-sm font-mono font-bold text-black bg-white rounded shadow-xl hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Descargar CV
        </a>
      </div>

    </div>
  );
}
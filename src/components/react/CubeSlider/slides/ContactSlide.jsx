import React from 'react';
import cv from '@cv';

export default function ContactSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-white">
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

      <div className="mt-12 flex gap-8">
        {cv.basics.profiles.map((profile) => (
        <a 
      key={profile.network}
      href={profile.url} 
      className="text-sm font-mono hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      title={profile.network}
        >
      {profile.network}
        </a>
      ))}
      </div>
    </div>
  );
}
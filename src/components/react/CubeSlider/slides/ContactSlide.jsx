import React from 'react';

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
        contacto@cristianginez.com
      </a>

      <div className="mt-12 flex gap-8">
        <a href="#" className="text-sm font-mono hover:underline">LINKEDIN</a>
        <a href="#" className="text-sm font-mono hover:underline">GITHUB</a>
        <a href="#" className="text-sm font-mono hover:underline">TWITTER</a>
      </div>
    </div>
  );
}
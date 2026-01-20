import React from 'react';

export default function AboutSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-12 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mb-8 border-b-4 border-blue-600 pb-2">
        PROFILE_INIT
      </h2>
      
      <p className="text-xl md:text-2xl leading-relaxed text-center font-light text-gray-700">
        "No solo escribo código, diseño soluciones."
      </p>

      <div className="mt-8 text-center md:text-lg text-gray-600 space-y-4">
        <p>
          Soy <strong>Ingeniero de Sistemas e Informática</strong> especializado en desarrollo web Full Stack. 
          Me apasiona transformar problemas complejos en arquitecturas escalables y experiencias de usuario fluidas.
        </p>
        <p>
          Enfoque en Clean Code, SOLID y rendimiento.
        </p>
      </div>
    </div>
  );
}
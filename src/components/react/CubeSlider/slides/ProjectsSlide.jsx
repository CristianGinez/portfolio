import React from 'react';

export default function ProjectsSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8">
      <h2 className="text-5xl font-black uppercase tracking-widest mb-12 text-transparent bg-clip-text bg-linear-to-r from-black to-gray-500">
        Proyectos
      </h2>

      {/* Grid de proyectos placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Proyecto 1 */}
        <div className="group border-2 border-black p-6 hover:bg-black hover:text-white transition-all duration-300 cursor-pointer">
          <h3 className="text-2xl font-bold mb-2">E-Commerce Core</h3>
          <p className="text-sm font-mono opacity-70">Next.js / Node / SQL</p>
        </div>

        {/* Proyecto 2 */}
        <div className="group border-2 border-black p-6 hover:bg-black hover:text-white transition-all duration-300 cursor-pointer">
          <h3 className="text-2xl font-bold mb-2">SaaS Dashboard</h3>
          <p className="text-sm font-mono opacity-70">React / Tailwind / AWS</p>
        </div>
        
        {/* Más proyectos... */}
      </div>
    </div>
  );
}
import React from 'react';
// Asegúrate de tener react-icons instalado: npm install react-icons
import { FaReact, FaNodeJs, FaDocker, FaDatabase } from 'react-icons/fa';
import { SiAstro, SiTailwindcss, SiTypescript } from 'react-icons/si';

export default function StackSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-10">
      <h2 className="text-4xl font-bold mb-10 tracking-[0.5em] uppercase">
        Tech Stack
      </h2>

      <div className="flex flex-wrap justify-center gap-8 text-5xl md:text-7xl text-gray-800">
        <SiAstro className="hover:text-orange-500 transition-colors" title="Astro" />
        <FaReact className="hover:text-blue-500 transition-colors" title="React" />
        <SiTailwindcss className="hover:text-cyan-400 transition-colors" title="Tailwind" />
        <SiTypescript className="hover:text-blue-600 transition-colors" title="TypeScript" />
        <FaNodeJs className="hover:text-green-500 transition-colors" title="Node.js" />
        <FaDocker className="hover:text-blue-400 transition-colors" title="Docker" />
      </div>

      <p className="mt-12 text-sm font-mono bg-gray-100 px-4 py-2 rounded">
        MERN Stack • Architecture • Cloud Native
      </p>
    </div>
  );
}
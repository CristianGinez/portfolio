// src/components/react/CubeSlider/slides/HeroSlide.jsx
import React from 'react';
import cv from '@cv';

export default function HeroSlide() {
  const [firstName, ...rest] = cv.basics.name.split(' ');
  const lastName = rest.join(' ');

  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center p-8">
      <div className="border-4 border-black p-10 relative">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">
            {firstName}<br/>{lastName}
        </h1>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-4">
            <span className="text-sm font-bold tracking-[0.3em] text-gray-500 whitespace-nowrap">
                SYSTEMS ENGINEER
            </span>
        </div>
      </div>
      
      <div className="mt-12 animate-bounce">
        <p className="text-xs font-mono text-gray-400">SCROLL DOWN ↓</p>
      </div>
    </div>
  );
}
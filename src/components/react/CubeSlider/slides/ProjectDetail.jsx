import React, { useEffect, useRef, useState } from 'react';
import { useSwiper } from 'swiper/react';
import gsap from 'gsap';
import { FaTimes, FaCalendarAlt, FaExternalLinkAlt, FaDesktop } from 'react-icons/fa';

import ProjectGallery from './ProjectGallery'; 

export default function ProjectDetail({ project, onClose }) {
  const containerRef = useRef(null);
  const swiper = useSwiper();
  const [showEmbed, setShowEmbed] = useState(false);

  useEffect(() => {
    if (swiper) {
      if (swiper.mousewheel) swiper.mousewheel.disable();
      if (swiper.keyboard) swiper.keyboard.disable();
      swiper.allowTouchMove = false;
    }
    return () => {
      if (swiper) {
        if (swiper.mousewheel) swiper.mousewheel.enable();
        if (swiper.keyboard) swiper.keyboard.enable();
        swiper.allowTouchMove = true;
      }
    };
  }, [swiper]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current, 
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
      
      gsap.from(".anim-item", {
        y: 40, opacity: 0, duration: 0.5, stagger: 0.1, delay: 0.2, ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleClose = () => {
    gsap.to(containerRef.current, {
      x: '100%', opacity: 0, duration: 0.4, ease: 'power3.in',
      onComplete: () => onClose() 
    });
  };

  if (!project) return null;

  return (
    <div 
        ref={containerRef}
        className="absolute inset-0 bg-zinc-900 text-white z-50 p-6 md:p-12 flex flex-col overflow-y-auto scrollbar-hide"
    >
        <button 
            onClick={handleClose}
            className="cursor-pointer fixed top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-white hover:rotate-90 transition-all z-50 p-2 mix-blend-difference"
        >
            <FaTimes size={40} />
        </button>

        <div className="max-w-5xl mx-auto w-full mt-10 md:mt-16 pb-20">
            
            <div className="flex flex-wrap items-center gap-6 mb-4 text-gray-400 font-mono text-sm tracking-widest anim-item">
                <span className="flex items-center gap-2">
                    <FaCalendarAlt /> {project.year}
                </span>
                <span className="w-px h-4 bg-gray-700"></span>
                <span className="uppercase text-blue-400">
                    {project.tech}
                </span>
            </div>

            <h2 className="text-5xl md:text-8xl font-black mb-10 uppercase leading-[0.9] tracking-tighter anim-item">
                {project.title}
            </h2>

            <div className="flex flex-wrap gap-6 mb-16 anim-item">
                {project.previewUrl && (
                    <button 
                        onClick={() => setShowEmbed(!showEmbed)}
                        className={`cursor-pointer flex items-center gap-3 px-8 py-4 font-bold text-sm tracking-widest transition-all border-2 ${
                            showEmbed 
                            ? 'bg-white text-black border-white' 
                            : 'bg-transparent text-white border-white hover:bg-white hover:text-black'
                        }`}
                    >
                        <FaDesktop /> {showEmbed ? 'CERRAR PREVIEW' : 'VER DEMO LIVE'}
                    </button>
                )}
                
                {project.link && (
                     <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-3 px-8 py-4 font-bold text-sm tracking-widest border-2 border-transparent text-gray-400 hover:text-white hover:border-gray-600 transition-all"
                    >
                        <FaExternalLinkAlt /> VISITAR SITIO
                    </a>
                )}
            </div>

            {showEmbed && project.previewUrl ? (
                <div className="w-full h-[70vh] border border-gray-800 rounded-sm overflow-hidden animate-fade-in anim-item relative bg-black">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-mono text-xs z-0">
                        CARGANDO PREVIEW...
                    </div>
                    <iframe 
                        src={project.previewUrl} 
                        className="w-full h-full relative z-10 bg-white"
                        title="Live Preview"
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 anim-item">
                    
                    <div className="lg:col-span-2 space-y-8">
                        <p className="text-xl md:text-2xl leading-relaxed text-gray-300 font-light">
                            {project.description}
                        </p>
                        <div className="text-gray-400 leading-loose font-mono text-sm border-t border-gray-800 pt-8">
                            {project.fullDetails || "Detalles confidenciales."}
                        </div>
                    </div>

                    <div className="lg:col-span-1 w-full min-w-0"> 
                         <ProjectGallery images={project.gallery} />
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}
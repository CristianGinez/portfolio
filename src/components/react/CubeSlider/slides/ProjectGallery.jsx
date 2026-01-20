// src/components/react/CubeSlider/slides/ProjectGallery.jsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
// Importamos módulos necesarios
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';
import { FaTimes, FaExpand, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import gsap from 'gsap';

// Estilos
import 'swiper/css';
import 'swiper/css/effect-fade';

export default function ProjectGallery({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [lightboxSwiper, setLightboxSwiper] = useState(null); // Para controlar el Swiper del Lightbox
  
  const lightboxRef = useRef(null);

  // Sincronizar el Swiper del Lightbox cuando abrimos una imagen específica
  useEffect(() => {
    if (lightboxSwiper && selectedIndex !== null) {
      lightboxSwiper.slideTo(selectedIndex, 0); // 0ms para que sea instantáneo al abrir
    }
  }, [lightboxSwiper, selectedIndex]);

  // --- ANIMACIONES DE ENTRADA (GSAP) ---
  useEffect(() => {
    if (selectedIndex !== null && lightboxRef.current) {
        const ctx = gsap.context(() => {
            gsap.fromTo(lightboxRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: "power2.out" }
            );
        }, lightboxRef);
        return () => ctx.revert();
    }
  }, [selectedIndex === null]);

  const closeLightbox = () => {
    if (!lightboxRef.current) return;
    gsap.to(lightboxRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setSelectedIndex(null);
        setLightboxSwiper(null); // Limpiamos la instancia
      }
    });
  };

  if (!images || images.length === 0) return null;

  // --- RENDERIZADO DEL LIGHTBOX (PORTAL) ---
  const renderLightbox = () => {
    if (selectedIndex === null) return null;

    return createPortal(
        <div 
            ref={lightboxRef}
            className="fixed inset-0 z-9999 bg-[rgba(0,0,0,0.96)] backdrop-blur-sm flex flex-col h-screen w-screen"
        >
            {/* 1. BARRA SUPERIOR */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-end z-10002">
                 <button 
                    onClick={closeLightbox}
                    className="cursor-pointer text-white/70 hover:text-white hover:rotate-90 transition-all p-3 rounded-full hover:bg-white/10"
                >
                    <FaTimes size={32} />
                </button>
            </div>

            {/* 2. CONTENEDOR CENTRAL (SWIPER) */}
            <div className="flex-1 flex items-center justify-center h-full w-full relative z-10000">
                
                {/* Flecha Izquierda (Controla el Swiper) */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        lightboxSwiper?.slidePrev();
                    }}
                    className="hidden md:flex absolute left-4 md:left-10 items-center justify-center w-12 h-12 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-10002"
                >
                    <FaChevronLeft size={30} />
                </button>

                {/* --- SWIPER PRINCIPAL DEL LIGHTBOX --- */}
                <Swiper
                    modules={[Navigation, EffectFade]}
                    effect={'fade'} // Transición suave tipo desvanecimiento (opcional, quítalo si prefieres slide normal)
                    fadeEffect={{ crossFade: true }}
                    spaceBetween={40}
                    slidesPerView={1}
                    initialSlide={selectedIndex} // Abre en la foto correcta
                    onSwiper={setLightboxSwiper} // Guardamos la instancia para controlarla
                    onSlideChange={(swiper) => setSelectedIndex(swiper.activeIndex)} // Sincronizamos estado al deslizar
                    className="h-full w-full flex items-center justify-center"
                >
                    {images.map((img, index) => (
                        <SwiperSlide key={index} className="flex items-center justify-center h-full w-full p-4 md:p-10">
                            <img 
                                src={img} 
                                alt={`Full Screen ${index}`} 
                                className="max-h-[85vh] max-w-full md:max-w-[85vw] object-contain shadow-2xl shadow-black select-none"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                 {/* Flecha Derecha */}
                 <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        lightboxSwiper?.slideNext();
                    }} 
                    className="cursor-pointer hidden md:flex absolute right-4 md:right-10 items-center justify-center w-12 h-12 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-10002"
                >
                    <FaChevronRight size={30} />
                </button>
            </div>
            
            {/* 3. PAGINACIÓN (CÍRCULOS) */}
            {/* Ajuste: Cambiado de bottom-8 a bottom-12 para subirlos */}
            <div 
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10002 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => lightboxSwiper?.slideTo(index)}
                        className={`rounded-full transition-all duration-300 shadow-lg ${
                            index === selectedIndex 
                            ? 'w-3 h-3 bg-white scale-125 shadow-white/50' 
                            : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
                        }`}
                    />
                ))}
            </div>
        </div>,
        document.body
    );
  };

  return (
    <div className="w-full mt-8">
      {/* HEADER GALERÍA */}
      <div className="flex justify-between items-end mb-6 border-b border-gray-800 pb-2">
         <h4 className="font-mono text-sm text-gray-400 uppercase tracking-widest">
            Galería
         </h4>
         <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-mono text-[10px] text-gray-600 uppercase">
                Auto-Play
            </span>
         </div>
      </div>

      {/* CARRUSEL MINIATURAS (MARQUEE) */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-zinc-900 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-zinc-900 to-transparent z-10 pointer-events-none"></div>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1.1}
          loop={true}
          speed={5000}
          autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
            640: { slidesPerView: 1.5 },
            1024: { slidesPerView: 1.8 },
          }}
          className="w-full mySwiper-marquee"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div 
                onClick={() => setSelectedIndex(index)}
                className="aspect-4/3 w-full border border-gray-800 hover:border-white transition-colors cursor-pointer relative overflow-hidden group/slide rounded-sm"
              >
                <img 
                  src={img} 
                  alt={`Gallery ${index}`} 
                  className="w-full h-full object-cover transition-transform duration-2000 ease-linear group-hover/slide:scale-110 grayscale group-hover/slide:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/slide:opacity-100 transition-opacity flex items-center justify-center">
                   <FaExpand className="text-white text-3xl drop-shadow-md transform scale-0 group-hover/slide:scale-100 transition-transform duration-300" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {renderLightbox()}
    </div>
  );
}
// src/components/react/CubeSlider/slides/StackSlide.jsx
import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

// 1. IMPORTAMOS LOS ICONOS (Corregido para evitar errores)
import { FaReact, FaNodeJs, FaDocker, FaJava, FaPython, FaGitAlt, FaGithub, FaAngular } from 'react-icons/fa';
// Nota: Usamos TbBrandCSharp porque SiCsharp a veces falla
import { RiNextjsFill } from "react-icons/ri";
import { TbBrandCSharp } from "react-icons/tb"; 
import { SiAstro, SiTailwindcss, SiTypescript, SiSpringboot, SiDotnet, SiPostgresql, SiMongodb, SiRedis, SiMysql, SiPostman} from 'react-icons/si';

// --- DATA: Agrupamos las tecnologías por "Cartas" ---
const stacks = [
  {
    id: 1,
    title: "Modern Web",
    icons: [
      { Comp: SiAstro, color: "text-orange-500", name: "Astro" },
      { Comp: FaReact, color: "text-blue-500", name: "React" },
      { Comp: FaAngular, color: "text-red-500", name: "Angular" },
      { Comp: RiNextjsFill, color: "text-black", name: "Next.JS" },
      { Comp: SiTailwindcss, color: "text-cyan-400", name: "Tailwind" },
      { Comp: SiTypescript, color: "text-blue-600", name: "TypeScript" },
      { Comp: FaNodeJs, color: "text-green-500", name: "Node.js" },
      { Comp: FaDocker, color: "text-blue-400", name: "Docker" },
    ],
    tag: "MERN Stack • Architecture • Cloud Native"
  },
  {
    id: 2,
    title: "Enterprise Backend",
    icons: [
      { Comp: FaJava, color: "text-red-600", name: "Java" },
      { Comp: SiSpringboot, color: "text-green-600", name: "Spring Boot" },
      { Comp: SiDotnet, color: "text-purple-600", name: ".NET Core" },
      // Aquí usamos el icono corregido de C#
      { Comp: TbBrandCSharp, color: "text-purple-500", name: "C#" },
      { Comp: SiMysql, color: "text-blue-500", name: "MySQL" },
      { Comp: SiPostgresql, color: "text-blue-400", name: "PostgreSQL" },
    ],
    tag: "Microservices • SOLID • High Performance"
  },
  {
    id: 3,
    title: "Data & DevOps",
    icons: [
      { Comp: FaPython, color: "text-yellow-500", name: "Python" },
      { Comp: SiPostman, color: "text-orange-500", name: "Postman" },
      { Comp: SiRedis, color: "text-red-500", name: "Redis" },
      { Comp: SiMongodb, color: "text-green-500", name: "MongoDB" },
      { Comp: FaGithub, color: "text-blue-600", name: "GitHub" },
      { Comp: FaGitAlt, color: "text-orange-600", name: "Git" },
    ],
    tag: "CI/CD • Cloud Infrastructure • NoSQL"
  }
];

export default function StackSlide() {
  // El índice 0 es siempre la carta visible (Top Card)
  const [cards, setCards] = useState(stacks);
  const isAnimating = useRef(false);

  const handleCardClick = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    // Seleccionamos la carta superior visualmente
    const topCard = document.getElementById(`card-${cards[0].id}`);
    
    // Animación: Sale volando y reaparece al fondo
    const tl = gsap.timeline({
      onComplete: () => {
        // Rotamos el array: el primero pasa al final
        setCards((prev) => {
          const newOrder = [...prev];
          const first = newOrder.shift();
          newOrder.push(first);
          return newOrder;
        });
        
        // Reset instantáneo para que aparezca atrás sin animación rara
        gsap.set(topCard, { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 });
        isAnimating.current = false;
      }
    });

    // 1. Vuela a la derecha y rota
    tl.to(topCard, {
      x: 300,        
      y: 50,         
      rotation: 15,  
      opacity: 0,    
      scale: 0.9,
      duration: 0.4,
      ease: "power2.in"
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-zinc-100 overflow-hidden relative select-none">
      
      {/* Contenedor de cartas apiladas */}
      <div className="relative w-full max-w-4xl h-125 flex items-center justify-center">
        
        {/* Invertimos el array para renderizar de atrás hacia adelante (Z-Index natural) */}
        {[...cards].reverse().map((stack, index) => {
            // "isTop" es verdadero si es el último elemento renderizado (el que está hasta arriba)
            const isTop = index === cards.length - 1;
            
            return (
              <div
                key={stack.id}
                id={`card-${stack.id}`}
                onClick={isTop ? handleCardClick : undefined} // Solo click en la de arriba
                style={{
                    zIndex: index,
                    // Efecto de profundidad matemática
                    transform: `scale(${1 - (cards.length - 1 - index) * 0.05}) translateY(${(cards.length - 1 - index) * 15}px)`,
                    opacity: isTop ? 1 : 0.5, 
                    filter: isTop ? 'none' : 'grayscale(100%) blur(1px)', 
                    touchAction: 'manipulation' // Vital para móvil
                }}
                className={`
                    absolute top-0 
                    flex flex-col items-center justify-center 
                    w-full max-w-3xl h-full p-6 md:p-10 
                    bg-white border border-gray-200 shadow-xl rounded-2xl
                    transition-all duration-500 ease-out
                    ${isTop ? 'cursor-pointer hover:shadow-2xl' : 'pointer-events-none'}
                `}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-[0.3em] uppercase text-center">
                    {stack.title}
                </h2>

                <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-5xl md:text-7xl text-gray-800">
                    {stack.icons.map((item, idx) => (
                        <div key={idx} className="group relative">
                            <item.Comp 
                                className={`${item.color} transition-colors duration-300`} 
                            />
                            {/* Tooltip simple */}
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black text-white px-2 py-1 rounded">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>

                <p className="mt-10 text-xs md:text-sm font-mono bg-gray-100 px-4 py-2 rounded uppercase text-center">
                    {stack.tag}
                </p>
                
                {/* Indicador para barajar */}
                {isTop && (
                    <div className="absolute bottom-4 right-6 text-[10px] text-gray-400 font-mono animate-pulse">
                        CLICK TO SHUFFLE ↻
                    </div>
                )}
              </div>
            );
        })}
      </div>
    </div>
  );
}
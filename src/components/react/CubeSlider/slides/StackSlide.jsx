import React, { useState, useRef, useMemo } from 'react';
import { useSwiperSlide } from 'swiper/react';
import gsap from 'gsap';
import cv from '@cv';

const TechIcon = ({ name }) => {
  const getSlugs = (rawName) => {
    const lower = rawName.toLowerCase();
    const base = lower.replace(/\s+/g, '');
    const variations = {
      base,
      simpleIcon: base.replace(/\./g, 'dot').replace(/\+/g, 'plus').replace(/#/g, 'sharp'),
      hyphenated: lower.replace(/\s+/g, '-').replace(/\./g, '-').replace(/\+/g, 'cpp').replace(/#/g, 'sharp'),
    };
    if (base === 'nextjs') variations.simpleIcon = 'nextdotjs';
    if (base === 'nodejs') variations.simpleIcon = 'nodedotjs';
    if (base === 'dotnet' || base === '.net') { variations.base = 'dotnet'; variations.simpleIcon = 'dotnet'; }
    if (base === 'c++') { variations.simpleIcon = 'cplusplus'; variations.base = 'cpp'; }
    if (base === 'sql') { variations.base = 'database'; }
    return variations;
  };

  const { base, simpleIcon, hyphenated } = getSlugs(name);
  const sources = [
    `https://cdn.simpleicons.org/${simpleIcon}`,
    `https://skillicons.dev/icons?i=${base}`,
    `https://api.iconify.design/devicon:${base}.svg`,
    `https://api.iconify.design/logos:${base}.svg`,
    `https://api.iconify.design/logos:${hyphenated}.svg`,
    `https://api.iconify.design/vscode-icons:file-type-${base}.svg`,
    `https://api.iconify.design/skill-icons:${base}.svg`,
    `https://api.iconify.design/fa6-brands:${base}.svg`,
    `https://api.iconify.design/mdi:${base}.svg`,
  ];

  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (currentSrcIndex < sources.length - 1) setCurrentSrcIndex(prev => prev + 1);
    else setHasError(true);
  };

  if (hasError) {
    return (
      <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-gray-200 rounded-full border border-gray-300 shadow-sm">
        <span className="font-mono font-bold text-gray-500 text-xs">{name.substring(0, 3).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <img
      src={sources[currentSrcIndex]}
      alt={name}
      onError={handleError}
      loading="lazy"
      className="w-10 h-10 md:w-12 md:h-12 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
      key={name}
    />
  );
};

export default function StackSlide() {
  const swiperSlide = useSwiperSlide();
  const isActive = swiperSlide ? swiperSlide.isActive : true;

  const stacks = useMemo(() => {
    const frontend = cv.skills.filter(s => s.keywords.some(k => k.includes("Frontend") || k.includes("CSS") || k.includes("UI") || k.includes("Diseño")));
    const backend  = cv.skills.filter(s => s.keywords.some(k => k.includes("Backend") || k.includes("Bases de Datos") || k.includes("API") || k.includes("Servidor")));
    const tools    = cv.skills.filter(s => s.keywords.some(k => k.includes("Git") || k.includes("DevOps") || k.includes("Cloud") || k.includes("Control")));
    const others   = cv.skills.filter(s => !frontend.includes(s) && !backend.includes(s) && !tools.includes(s));
    const result = [
      { id: 1, title: "Frontend Core",      skills: frontend, tag: "UI • UX • Responsive" },
      { id: 2, title: "Backend & Data",      skills: backend,  tag: "APIs • SQL • Logic" },
      { id: 3, title: "Tools & Versioning",  skills: tools,    tag: "Git • CI/CD • Workflow" },
    ];
    if (others.length > 0) result.push({ id: 4, title: "Other Skills", skills: others, tag: "Learning • Extras" });
    return result.filter(r => r.skills.length > 0);
  }, []);

  const [cards, setCards] = useState(stacks);
  const isAnimating = useRef(false);

  const handleCardClick = () => {
    if (isAnimating.current || cards.length <= 1) return;
    isAnimating.current = true;
    const topCard = document.getElementById(`card-${cards[0].id}`);

    gsap.timeline({
      onComplete: () => {
        setCards(prev => { const n = [...prev]; n.push(n.shift()); return n; });
        gsap.set(topCard, { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 });
        isAnimating.current = false;
      },
    }).to(topCard, { x: '120%', y: 20, rotation: 15, opacity: 0, scale: 0.9, duration: 0.35, ease: 'power2.in' });
  };

  if (!cards.length) return null;

  return (
    <div
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
      className="flex flex-col items-center justify-center w-full bg-zinc-50 select-none"
    >
      <div
        className="relative w-full max-w-4xl h-[60vh] md:h-[50vh] min-h-75 flex items-center justify-center perspective-1000"
        style={{
          opacity: isActive ? 1 : 0,
          visibility: isActive ? 'visible' : 'hidden',
          transition: isActive
            ? 'opacity 0.4s ease 0.3s, visibility 0s'
            : 'opacity 0.2s ease, visibility 0.2s step-end',
        }}
      >
        {[...cards].reverse().map((stack, index) => {
          const isTop = index === cards.length - 1;
          return (
            <div
              key={stack.id}
              id={`card-${stack.id}`}
              onClick={isTop ? handleCardClick : undefined}
              style={{
                zIndex: index,
                transform: `scale(${1 - (cards.length - 1 - index) * 0.05}) translateY(${(cards.length - 1 - index) * 10}px)`,
                opacity: isTop ? 1 : 0.6,
                touchAction: 'manipulation',
                willChange: isTop ? 'transform, opacity' : 'auto',
              }}
              className={`
                absolute top-0 flex flex-col items-center justify-center
                w-[85%] md:w-full max-w-3xl h-full p-4 md:p-10
                bg-white border border-gray-200 shadow-xl rounded-2xl
                transition-all duration-300 ease-out
                ${isTop ? 'cursor-pointer' : 'pointer-events-none'}
              `}
            >
              <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4 tracking-[0.2em] uppercase text-center">
                {stack.title}
              </h2>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 content-center flex-1 overflow-y-auto scrollbar-hide py-2">
                {stack.skills.map((skill, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 group">
                    <TechIcon name={skill.name} />
                    <span className="text-[9px] md:text-[10px] font-mono text-gray-500 uppercase text-center max-w-17.5 leading-tight">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-2 md:mt-4 text-[9px] md:text-sm font-mono bg-gray-100 px-3 py-1 md:px-4 md:py-2 rounded uppercase text-center w-fit">
                {stack.tag}
              </p>
              {isTop && cards.length > 1 && (
                <div className="absolute bottom-2 right-4 text-[9px] md:text-[10px] text-gray-400 font-mono animate-pulse">
                  CLICK ↻
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
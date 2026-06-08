import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useSwiperSlide } from 'swiper/react';
import gsap from 'gsap';
import cv from '@cv';

const ICON_MAP = {
  'HTML':        'html',
  'CSS':         'css',
  'JavaScript':  'javascript',
  'TypeScript':  'typescript',
  'Tailwind':    'tailwind',
  'Java':        'java',
  'Spring Boot': 'spring',
  'C#':          'csharp',
  '.NET':        'dotnet',
  'NestJS':      'nestjs',
  'Express':     'express',
  'Node.js':     'nodejs',
  'MySQL':       'mysql',
  'PostgreSQL':  'postgresql',
  'Git':         'git',
  'GitHub':      'github',
  'Next.js':     'nextjs',
  'React':       'react',
  'Astro':       'astro',
  'Angular':     'angular',
  'Expo':        'expo',
  'Electron':    'electron',
  'Supabase':    'supabase',
  'Cloudinary':  'cloudinary',
  'Cloudflare':  'cloudflare',
  'GSAP':        'gsap',
  'Vite':        'vite',
  'Prisma':      'prisma',
};

const TechIcon = ({ name }) => {
  const slug = ICON_MAP[name];
  if (!slug) {
    return (
      <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-gray-200 rounded-full border border-gray-300 shadow-sm">
        <span className="font-mono font-bold text-gray-500 text-xs">{name.substring(0, 3).toUpperCase()}</span>
      </div>
    );
  }
  return (
    <img
      src={`/icons/${slug}.svg`}
      alt={name}
      loading="eager"
      className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-sm"
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

  const [cards, setCards]   = useState(stacks);
  const isAnimating         = useRef(false);
  const topCardRef          = useRef(null);
  const secondCardRef       = useRef(null);
  const dragState           = useRef({ active: false, startX: 0, startY: 0, currentX: 0, locked: false });
  const cardsRef            = useRef(cards);
  cardsRef.current          = cards;

  useEffect(() => {
    // Listener en document con capture:true → dispara antes que CUALQUIER handler
    // de Swiper. Verificamos bounds manualmente para saber si el click cayó en la carta.
    const onDown = (e) => {
      const card = topCardRef.current;
      if (!card || isAnimating.current) return;

      const rect = card.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right &&
                     e.clientY >= rect.top  && e.clientY <= rect.bottom;
      if (!inside) return;

      e.stopPropagation(); // Swiper no ve este pointerdown
      dragState.current = { active: true, startX: e.clientX, startY: e.clientY, currentX: 0, locked: false };

      const onMove = (ev) => {
        if (!dragState.current.active) return;
        const dx = ev.clientX - dragState.current.startX;
        const dy = ev.clientY - dragState.current.startY;

        if (!dragState.current.locked) {
          if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
          if (Math.abs(dy) > Math.abs(dx)) {
            // Drag vertical → abortar sin mover la carta
            onUp();
            return;
          }
          dragState.current.locked = true;
        }

        dragState.current.currentX = dx;
        if (topCardRef.current) gsap.set(topCardRef.current, { x: dx, rotation: dx * 0.06 });
      };

      // onUp se auto-remueve: nunca se acumula entre drags
      const onUp = () => {
        dragState.current.active = false;
        document.removeEventListener('pointermove',   onMove, { capture: true });
        document.removeEventListener('pointerup',     onUp,   { capture: true });
        document.removeEventListener('pointercancel', onUp,   { capture: true });

        if (!dragState.current.locked) return; // era drag vertical → no hacer nada

        const dx  = dragState.current.currentX;
        const top = topCardRef.current;
        if (!top) return;

        if (Math.abs(dx) > 90 && cardsRef.current.length > 1) {
          isAnimating.current = true;
          const dir    = dx > 0 ? 1 : -1;
          const second = secondCardRef.current;

          // Animar la segunda carta hacia adelante al mismo tiempo
          if (second) {
            gsap.fromTo(second,
              { scale: 0.95, y: 14, opacity: 0.9 },
              { scale: 1,    y: 0,  opacity: 1, duration: 0.3, ease: 'power2.out' }
            );
          }

          gsap.to(top, {
            x: dir * window.innerWidth,
            rotation: dir * 28,
            opacity: 0,
            scale: 0.9,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
              setCards(prev => { const n = [...prev]; n.push(n.shift()); return n; });
              // Resetear estado interno de GSAP en la carta vieja (React pone su transform)
              gsap.set(top, { x: 0, rotation: 0, scale: 1 });
              isAnimating.current = false;
            },
          });
        } else {
          gsap.to(top, { x: 0, rotation: 0, duration: 0.5, ease: 'back.out(2)' });
        }
      };

      document.addEventListener('pointermove',   onMove, { capture: true });
      document.addEventListener('pointerup',     onUp,   { capture: true });
      document.addEventListener('pointercancel', onUp,   { capture: true });
    };

    document.addEventListener('pointerdown', onDown, { capture: true });
    return () => document.removeEventListener('pointerdown', onDown, { capture: true });
  }, []); // sin dependencias — cardsRef.current siempre es fresco

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
        {[...cards].reverse().map((stack, visIndex, arr) => {
          const isTop    = visIndex === arr.length - 1;
          const isSecond = visIndex === arr.length - 2;
          const offset   = arr.length - 1 - visIndex; // 0=top, 1=second, 2+=hidden
          // Todas las cartas ocultas se posicionan igual que la segunda
          // → cuando una pasa de hidden a second, solo cambia opacity (sin salto de tamaño)
          const visualOffset = Math.min(offset, 1);
          return (
            <div
              key={stack.id}
              ref={isTop ? topCardRef : isSecond ? secondCardRef : null}

              style={{
                zIndex: visIndex,
                // Top card: sin transform → GSAP tiene control exclusivo (sin conflicto en re-renders)
                ...(offset > 0 && { transform: `scale(${1 - visualOffset * 0.05}) translateY(${visualOffset * 14}px)` }),
                opacity: isTop ? 1 : isSecond ? 0.9 : 0,
                touchAction: isTop ? 'none' : 'auto',
                willChange: isTop ? 'transform, opacity' : 'auto',
              }}
              className={`
                absolute top-0 flex flex-col items-center justify-center
                w-[85%] md:w-full max-w-3xl h-full p-4 md:p-10
                bg-white border border-gray-200 shadow-xl rounded-2xl
                ${isTop ? 'cursor-grab active:cursor-grabbing swiper-no-swiping' : 'pointer-events-none transition-opacity duration-300 ease-out'}
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
                  ← DESLIZA →
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
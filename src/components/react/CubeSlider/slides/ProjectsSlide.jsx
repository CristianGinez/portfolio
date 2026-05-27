import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useSwiperSlide } from 'swiper/react';
import ProjectDetail from './ProjectDetail';
import cv from '@cv';
import gsap from 'gsap';

const trabajos = cv.work ?? [];
const clientes = cv.freelance ?? [];
const MODES = ['PROPIOS', 'CLIENTES', 'TRABAJOS'];
const TOTAL_MODES = MODES.length;

const SWITCH_THRESHOLD = 150;
const MAX_DRAG_FREE    = 100;
const RUBBER_FACTOR    = 0.20;
const TICK_COUNT       = 30;
const TICK_SPACING     = 20;

function rubberBand(x, limit, factor) {
  if (Math.abs(x) <= limit) return x;
  const overflow = Math.abs(x) - limit;
  return (x < 0 ? -1 : 1) * (limit + overflow * factor);
}

function Ruler({ rulerRef }) {
  return (
    <div
      ref={rulerRef}
      style={{
        display: 'flex', alignItems: 'flex-end', gap: TICK_SPACING,
        position: 'absolute', bottom: 0,
        left: `calc(50% - ${(TICK_COUNT / 2) * (TICK_SPACING + 2)}px)`,
        paddingBottom: 10, willChange: 'transform',
      }}
    >
      {Array.from({ length: TICK_COUNT }).map((_, i) => {
        const isMajor = i % 5 === 0;
        const isMid   = i % 5 === 2 || i % 5 === 3;
        const h       = isMajor ? 22 : isMid ? 13 : 8;
        const w       = isMajor ? 2.5 : isMid ? 1.8 : 1.2;
        const dist    = Math.abs(i - TICK_COUNT / 2);
        const opacity = Math.max(0.07, 1 - dist * 0.09);
        return (
          <div key={i} style={{
            flexShrink: 0, width: w, height: h, borderRadius: 3,
            background: isMajor ? '#222' : '#666',
            opacity, alignSelf: 'flex-end',
          }} />
        );
      })}
    </div>
  );
}

function DragDial({ mode, onSwitch, swiperRef }) {
  const rulerRef  = useRef(null);
  const needleRef = useRef(null);
  const dotRef    = useRef(null);
  const modeRef   = useRef(mode);

  const drag = useRef({ active: false, startX: 0, startY: 0, startModeX: 0, locked: false });
  // liveRaw drives the needle in real-time during drag (unresisted position)
  const [liveRaw, setLiveRaw] = useState(() => -mode * SWITCH_THRESHOLD);

  useEffect(() => {
    if (!drag.current.active) {
      modeRef.current = mode;
      setLiveRaw(-mode * SWITCH_THRESHOLD);
    }
  }, [mode]);

  const modePercents  = MODES.map((_, i) => (i * 2 + 1) / (TOTAL_MODES * 2) * 100);
  const totalRange    = (TOTAL_MODES - 1) * SWITCH_THRESHOLD;
  const rawProgress   = totalRange > 0 ? -liveRaw / totalRange : 0;
  const needlePercent = modePercents[0] + Math.max(0, Math.min(1, rawProgress)) * (modePercents[TOTAL_MODES - 1] - modePercents[0]);

  const flashNeedle = useCallback(() => {
    gsap.timeline()
      .to([needleRef.current, dotRef.current], { scaleY: 2.8, scaleX: 1.4, background: '#000', duration: 0.06, ease: 'power3.out' })
      .to([needleRef.current, dotRef.current], { scaleY: 1, scaleX: 1, background: '#111', duration: 0.35, ease: 'elastic.out(1.8,0.4)' });
  }, []);

  const snapToMode = useCallback(() => {
    const target = -modeRef.current * SWITCH_THRESHOLD;
    gsap.to(rulerRef.current, { x: target, duration: 0.45, ease: 'elastic.out(1,0.6)' });
    setLiveRaw(target); // needle springs to final stop via CSS transition
    if (swiperRef?.current) swiperRef.current.allowTouchMove = true;
  }, [swiperRef]);

  const startDrag = useCallback((clientX, clientY) => {
    gsap.killTweensOf(rulerRef.current);
    const modeX = -modeRef.current * SWITCH_THRESHOLD;
    gsap.set(rulerRef.current, { x: modeX }); // cancel any in-flight snap, lock to mode position
    setLiveRaw(modeX);
    drag.current = {
      active: true, startX: clientX, startY: clientY,
      startModeX: modeX,
      locked: false,
    };
  }, [setLiveRaw]);

  const moveDrag = useCallback((clientX, clientY) => {
    if (!drag.current.active) return;
    const deltaX = clientX - drag.current.startX;
    const deltaY = clientY - drag.current.startY;

    if (!drag.current.locked) {
      if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) return;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        drag.current.active = false;
        if (swiperRef?.current) swiperRef.current.allowTouchMove = true;
        return;
      }
      drag.current.locked = true;
      if (swiperRef?.current) swiperRef.current.allowTouchMove = false;
    }

    const raw  = drag.current.startModeX + deltaX;
    const minX = -(TOTAL_MODES - 1) * SWITCH_THRESHOLD;
    const maxX = 0;

    // dist = displacement from current mode origin (not total travel)
    const dist    = deltaX;
    const absDist = Math.abs(dist);

    // Soft resistance zone before each mode boundary (lighter than edge rubber-band)
    const SOFT_START  = SWITCH_THRESHOLD - 50; // free travel before resistance kicks in
    const SOFT_FACTOR = 0.18;                  // speed inside soft zone (heavy resistance)

    let visual;
    if (raw > maxX) {
      // Left edge: full rubber-band
      visual = maxX + (raw - maxX) * 0.12;
    } else if (raw < minX) {
      // Right edge: full rubber-band
      visual = minX + (raw - minX) * 0.12;
    } else if (absDist > SOFT_START) {
      // Approaching next mode: soft resistance (same feel as edge, but lighter)
      const excess = absDist - SOFT_START;
      visual = drag.current.startModeX + Math.sign(dist) * (SOFT_START + excess * SOFT_FACTOR);
    } else {
      // Free zone: 1-to-1 with finger
      visual = raw;
    }

    gsap.set(rulerRef.current, { x: visual });
    setLiveRaw(visual); // needle follows visual — slows in soft zone, reinforcing the boundary feel

    // Mode switch fires at full SWITCH_THRESHOLD from origin (not midpoint)
    if (dist < -SWITCH_THRESHOLD) {
      const newMode = Math.min(TOTAL_MODES - 1, modeRef.current + 1);
      if (newMode !== modeRef.current) {
        drag.current.startX     = clientX;
        drag.current.startModeX = -newMode * SWITCH_THRESHOLD;
        modeRef.current = newMode;
        flashNeedle();
        onSwitch(newMode);
      }
    } else if (dist > SWITCH_THRESHOLD) {
      const newMode = Math.max(0, modeRef.current - 1);
      if (newMode !== modeRef.current) {
        drag.current.startX     = clientX;
        drag.current.startModeX = -newMode * SWITCH_THRESHOLD;
        modeRef.current = newMode;
        flashNeedle();
        onSwitch(newMode);
      }
    }
  }, [swiperRef, flashNeedle, onSwitch]);

  const endDrag = useCallback(() => {
    if (!drag.current.active) return;
    drag.current.active = false;
    snapToMode();
  }, [snapToMode]);

  const onPointerDown = (e) => { startDrag(e.clientX, e.clientY); e.currentTarget.setPointerCapture(e.pointerId); };
  const onPointerMove = (e) => moveDrag(e.clientX, e.clientY);
  const onPointerUp   = ()  => endDrag();
  const onTouchStart  = (e) => { const t = e.touches[0]; startDrag(t.clientX, t.clientY); };
  const onTouchMove   = (e) => { const t = e.touches[0]; moveDrag(t.clientX, t.clientY); if (drag.current.locked) e.preventDefault(); };
  const onTouchEnd    = ()  => endDrag();

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'ew-resize', userSelect: 'none', touchAction: 'pan-y' }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchCancel={onTouchEnd}
    >
      {/* Ruler with zone separators */}
      <div style={{ position: 'relative', width: 310, height: 48, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 60, background: 'linear-gradient(to right, white, transparent)', zIndex: 3, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 60, background: 'linear-gradient(to left, white, transparent)', zIndex: 3, pointerEvents: 'none' }} />
        {MODES.slice(1).map((_, i) => (
          <div key={i} style={{
            position: 'absolute', zIndex: 4, pointerEvents: 'none',
            left: `${(i + 1) / TOTAL_MODES * 100}%`,
            top: 8, bottom: 8, width: 1, background: '#e0e0e0',
          }} />
        ))}
        <div ref={needleRef} style={{
          position: 'absolute', zIndex: 5,
          left: `${needlePercent}%`, bottom: 10,
          transform: 'translateX(-50%)',
          width: 2.5, height: 26, background: '#111',
          borderRadius: '2px 2px 0 0', transformOrigin: 'bottom center',
          transition: drag.current.active ? 'left 0.04s linear' : 'left 0.38s cubic-bezier(0.34,1.56,0.64,1)',
        }} />
        <div ref={dotRef} style={{
          position: 'absolute', zIndex: 5,
          left: `${needlePercent}%`, bottom: 6,
          transform: 'translateX(-50%)',
          width: 7, height: 7, borderRadius: '50%', background: '#111',
          transformOrigin: 'center',
          transition: drag.current.active ? 'left 0.04s linear' : 'left 0.38s cubic-bezier(0.34,1.56,0.64,1)',
        }} />
        <Ruler rulerRef={rulerRef} />
      </div>

      {/* Mode labels — discrete active/inactive */}
      <div style={{ width: 310, display: 'flex', marginTop: 10 }}>
        {MODES.map((label, i) => (
          <div key={label} style={{ width: `${100 / TOTAL_MODES}%`, display: 'flex', justifyContent: 'center' }}>
            <span style={{
              fontSize: 10, letterSpacing: 3, fontWeight: 900, fontFamily: 'monospace', color: '#111',
              opacity: i === mode ? 1 : 0.18,
              transition: 'opacity 0.2s ease',
              whiteSpace: 'nowrap',
            }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 9, color: '#c8c8c8', letterSpacing: 3, fontFamily: 'monospace', marginTop: 8 }}>
        ← ARRASTRA →
      </div>
    </div>
  );
}

function ProjectCard({ project, onClick }) {
  return (
    <div onClick={onClick} style={{ touchAction: 'manipulation' }}
      className="swiper-no-swiping group border-2 border-black p-6 hover:bg-black hover:text-white transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl md:text-2xl font-bold">{project.name}</h3>
          <span className="text-sm font-mono border border-gray-300 group-hover:border-white px-2 py-0.5 rounded-full shrink-0">
            {new Date(project.startDate).getFullYear()}
          </span>
        </div>
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-blue-600 group-hover:text-blue-300 text-xs font-mono mb-4 hover:underline z-10 relative break-all"
          >
            <FaExternalLinkAlt size={10} className="shrink-0" /> {project.url}
          </a>
        )}
        <p className="text-sm font-mono opacity-70 group-hover:opacity-100 transition-opacity mt-2">
          {project.keywords.join(' / ')}
        </p>
      </div>
      <div className="mt-4">
        <span className="text-xs font-bold tracking-widest border-b border-transparent group-hover:border-white pb-1 opacity-0 group-hover:opacity-100 transition-all">
          VER DETALLES +
        </span>
      </div>
    </div>
  );
}

function TrabajoCard({ trabajo }) {
  const [open, setOpen] = useState(false);
  const start = new Date(trabajo.startDate).getFullYear();
  const end   = trabajo.endDate ? new Date(trabajo.endDate).getFullYear() : 'Presente';
  return (
    <div onClick={() => setOpen(!open)} style={{ touchAction: 'manipulation' }}
      className="swiper-no-swiping group border-2 border-black p-6 hover:bg-black hover:text-white transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-xl font-bold">{trabajo.name}</h3>
          <span className="text-sm font-mono border border-gray-300 group-hover:border-white px-2 py-0.5 rounded-full shrink-0 ml-2">
            {start}–{end}
          </span>
        </div>
        <p className="text-sm font-mono text-gray-500 group-hover:text-gray-300 mb-3">{trabajo.position}</p>
        {trabajo.url && (
          <a href={trabajo.url} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-blue-600 group-hover:text-blue-300 text-xs font-mono mb-3 hover:underline z-10 relative break-all"
          >
            <FaExternalLinkAlt size={10} className="shrink-0" /> {trabajo.url}
          </a>
        )}
        <p className="text-sm font-mono opacity-70 group-hover:opacity-100 transition-opacity">{trabajo.summary}</p>
        {open && trabajo.highlights?.length > 0 && (
          <ul className="mt-3 space-y-1">
            {trabajo.highlights.map((h, i) => (
              <li key={i} className="text-xs font-mono opacity-80 group-hover:opacity-100 flex gap-2">
                <span>→</span><span>{h}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-4">
        <span className="text-xs font-bold tracking-widest border-b border-transparent group-hover:border-white pb-1 opacity-0 group-hover:opacity-100 transition-all">
          {open ? 'CERRAR −' : 'VER MÁS +'}
        </span>
      </div>
    </div>
  );
}

export default function ProjectsSlide({ swiperRef }) {
  const swiperSlide = useSwiperSlide();
  const isActive    = swiperSlide ? swiperSlide.isActive : true;

  const [mode, setMode]           = useState(0);
  const [displayMode, setDisplay] = useState(0);
  const [selectedProject, setSel] = useState(null);
  const contentRef = useRef(null);
  const titleRef   = useRef(null);

  const handleSwitch = useCallback((next) => {
    if (next === mode) return;
    const dir = next > mode ? 1 : -1;
    gsap.to(titleRef.current, {
      y: dir * -12, opacity: 0, duration: 0.16, ease: 'power2.in',
      onComplete: () => {
        setMode(next);
        gsap.fromTo(titleRef.current, { y: dir * 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out' });
      },
    });
    gsap.to(contentRef.current, {
      x: dir * -55, opacity: 0, duration: 0.2, ease: 'power2.in',
      onComplete: () => {
        setDisplay(next);
        gsap.fromTo(contentRef.current, { x: dir * 55, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: 'power3.out' });
      },
    });
  }, [mode]);

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center"
      style={{
        // Hide entire slide content when not active — this is what stops the bleed
        opacity: isActive ? 1 : 0,
        visibility: isActive ? 'visible' : 'hidden',
        transition: isActive
          ? 'opacity 0.4s ease 0.3s, visibility 0s'
          : 'opacity 0.2s ease, visibility 0.2s step-end',
      }}
    >
      <div style={{ marginTop: '3rem', marginBottom: '0.1rem', textAlign: 'center', flexShrink: 0 }}>
        <h2
          ref={titleRef}
          className="font-black uppercase tracking-widest text-transparent bg-clip-text"
          style={{ backgroundImage: 'linear-gradient(135deg, #111 0%, #555 100%)', fontSize: 'clamp(2.6rem, 6vw, 4.2rem)', lineHeight: 1 }}
        >
          {MODES[mode]}
        </h2>
      </div>

      <div style={{ marginBottom: '0.8rem', flexShrink: 0 }}>
        <DragDial mode={mode} onSwitch={handleSwitch} swiperRef={swiperRef} />
      </div>

      <div ref={contentRef} className="w-full max-w-5xl overflow-y-auto flex-1 px-4 md:px-8 pb-4">
        {displayMode === 0 && (
          <div className="swiper-no-swiping grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
            {cv.projects.map((p, i) => <ProjectCard key={i} project={p} onClick={() => setSel(p)} />)}
          </div>
        )}
        {displayMode === 1 && (
          <div className="swiper-no-swiping grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
            {clientes.map((p, i) => <ProjectCard key={i} project={p} onClick={() => setSel(p)} />)}
          </div>
        )}
        {displayMode === 2 && (
          <div className="swiper-no-swiping grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
            {trabajos.map((t, i) => <TrabajoCard key={i} trabajo={t} />)}
          </div>
        )}
      </div>

      <div className="md:hidden text-[10px] text-gray-400 mb-2 animate-pulse font-mono" style={{ flexShrink: 0 }}>
        ↕ SCROLL EN LISTA
      </div>

      {selectedProject && (
        <ProjectDetail
          project={{
            title: selectedProject.name,
            year: new Date(selectedProject.startDate).getFullYear(),
            tech: selectedProject.keywords.join(' / '),
            link: selectedProject.url,
            description: selectedProject.description,
            fullDetails: selectedProject.fullDetails,
            gallery: selectedProject.gallery,
            previewUrl: selectedProject.url,
          }}
          onClose={() => setSel(null)}
        />
      )}
    </div>
  );
}
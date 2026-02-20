import React, { useState, useRef, useCallback } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import ProjectDetail from './ProjectDetail';
import cv from '@cv';
import gsap from 'gsap';

const trabajos = cv.work ?? [];
const MODES = ['PROYECTOS', 'TRABAJOS'];
const TOTAL_MODES = MODES.length;

const SWITCH_THRESHOLD = 70;
const MAX_DRAG_FREE    = 100;
const RUBBER_FACTOR    = 0.20;
const TICK_COUNT       = 30;
const TICK_SPACING     = 20;

function rubberBand(x, limit, factor) {
  if (Math.abs(x) <= limit) return x;
  const overflow = Math.abs(x) - limit;
  return (x < 0 ? -1 : 1) * (limit + overflow * factor);
}

// ── Ruler ticks ───────────────────────────────────────────────────────────────
function Ruler({ rulerRef }) {
  return (
    <div
      ref={rulerRef}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: TICK_SPACING,
        position: 'absolute',
        bottom: 0,
        left: `calc(50% - ${(TICK_COUNT / 2) * (TICK_SPACING + 2)}px)`,
        paddingBottom: 10,
        willChange: 'transform',
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

// ── Drag Dial ─────────────────────────────────────────────────────────────────
function DragDial({ mode, onSwitch, swiperRef }) {
  const rulerRef    = useRef(null);
  const needleRef   = useRef(null);
  const dotRef      = useRef(null);
  const dialRef     = useRef(null);
  const drag        = useRef({ active: false, startX: 0, startY: 0, offset: 0, hasSwitched: false, locked: false });
  const [liveOffset, setLiveOffset] = useState(0);

  const atStart = mode === 0;
  const atEnd   = mode === TOTAL_MODES - 1;

  const flashNeedle = useCallback(() => {
    gsap.timeline()
      .to([needleRef.current, dotRef.current], {
        scaleY: 1.5, background: '#000', duration: 0.08, ease: 'power3.out',
      })
      .to([needleRef.current, dotRef.current], {
        scaleY: 1, background: '#111', duration: 0.25, ease: 'elastic.out(1,0.4)',
      });
  }, []);

  const snapBack = useCallback(() => {
    gsap.to(rulerRef.current, { x: 0, duration: 0.5, ease: 'elastic.out(1,0.55)' });
    setLiveOffset(0);
    // Re-enable swiper
    if (swiperRef?.current) {
      swiperRef.current.allowTouchMove = true;
    }
  }, [swiperRef]);

  // ── Touch / Pointer handlers ──────────────────────────────────────────────
  // We use both touch and pointer events to cover all mobile browsers

  const startDrag = useCallback((clientX, clientY) => {
    gsap.killTweensOf(rulerRef.current);
    drag.current = {
      active: true,
      startX: clientX,
      startY: clientY,
      offset: 0,
      hasSwitched: false,
      locked: false, // direction not yet determined
    };
  }, []);

  const moveDrag = useCallback((clientX, clientY) => {
    if (!drag.current.active) return;

    const deltaX = clientX - drag.current.startX;
    const deltaY = clientY - drag.current.startY;

    // Direction lock: determine if this is a horizontal or vertical drag
    if (!drag.current.locked) {
      if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) return; // wait
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        // Vertical drag → let swiper handle it, abort dial
        drag.current.active = false;
        if (swiperRef?.current) swiperRef.current.allowTouchMove = true;
        return;
      }
      // Horizontal drag confirmed → lock dial, disable swiper
      drag.current.locked = true;
      if (swiperRef?.current) swiperRef.current.allowTouchMove = false;
    }

    // Compute bounded offset
    let bounded = deltaX;
    if (atStart && deltaX > 0) {
      bounded = rubberBand(deltaX, 28, 0.10);
    } else if (atEnd && deltaX < 0) {
      bounded = rubberBand(deltaX, 28, 0.10);
    } else {
      bounded = rubberBand(deltaX, MAX_DRAG_FREE, RUBBER_FACTOR);
    }

    drag.current.offset = bounded;
    gsap.set(rulerRef.current, { x: bounded });
    setLiveOffset(bounded);

    // Switch check
    if (!drag.current.hasSwitched && Math.abs(deltaX) >= SWITCH_THRESHOLD) {
      const nextMode = deltaX < 0 ? mode + 1 : mode - 1;
      if (nextMode >= 0 && nextMode < TOTAL_MODES) {
        drag.current.hasSwitched = true;
        drag.current.startX = clientX;
        flashNeedle();
        onSwitch(nextMode);
      }
    }
  }, [mode, atStart, atEnd, onSwitch, flashNeedle, swiperRef]);

  const endDrag = useCallback(() => {
    if (!drag.current.active) return;
    drag.current.active = false;
    snapBack();
  }, [snapBack]);

  // Pointer events (desktop + some mobile)
  const onPointerDown = (e) => {
    startDrag(e.clientX, e.clientY);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => moveDrag(e.clientX, e.clientY);
  const onPointerUp   = () => endDrag();

  // Touch events (iOS Safari fallback)
  const onTouchStart = (e) => {
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  };
  const onTouchMove = (e) => {
    const t = e.touches[0];
    moveDrag(t.clientX, t.clientY);
    // If drag is locked horizontal, prevent page scroll
    if (drag.current.locked) e.preventDefault();
  };
  const onTouchEnd = () => endDrag();

  const progress = Math.min(1, Math.abs(liveOffset) / SWITCH_THRESHOLD);

  return (
    <div
      ref={dialRef}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        cursor: 'ew-resize', userSelect: 'none',
        // Don't set touchAction: 'none' globally — we handle it dynamically
        touchAction: 'pan-y',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      {/* ── Labels ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 360, marginBottom: 8, height: 28,
      }}>
        {/* Left slot — PROYECTOS */}
        <div style={{ width: 160, display: 'flex', justifyContent: 'flex-end', paddingRight: 16, overflow: 'hidden' }}>
          <span style={{
            fontSize: 11, letterSpacing: 4, fontWeight: 900, fontFamily: 'monospace', color: '#111',
            opacity: mode === 0 ? 1 : (liveOffset > 0 ? 0.14 + progress * 0.65 : 0.14),
            transition: drag.current.active ? 'none' : 'opacity 0.4s ease',
            whiteSpace: 'nowrap', display: 'block',
          }}>
            PROYECTOS
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 14, background: '#ddd', flexShrink: 0 }} />

        {/* Right slot — TRABAJOS */}
        <div style={{ width: 160, display: 'flex', justifyContent: 'flex-start', paddingLeft: 16, overflow: 'hidden' }}>
          <span style={{
            fontSize: 11, letterSpacing: 4, fontWeight: 900, fontFamily: 'monospace', color: '#111',
            opacity: mode === 1 ? 1 : (liveOffset < 0 ? 0.14 + progress * 0.65 : 0.14),
            transition: drag.current.active ? 'none' : 'opacity 0.4s ease',
            whiteSpace: 'nowrap', display: 'block',
          }}>
            TRABAJOS
          </span>
        </div>
      </div>

      {/* ── Ruler track ── */}
      <div style={{ position: 'relative', width: 310, height: 48, overflow: 'hidden' }}>
        {/* Edge fades */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: 60,
          background: 'linear-gradient(to right, white, transparent)',
          zIndex: 3, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: 60,
          background: 'linear-gradient(to left, white, transparent)',
          zIndex: 3, pointerEvents: 'none',
        }} />

        {/* Needle */}
        <div ref={needleRef} style={{
          position: 'absolute', left: '50%', bottom: 10,
          transform: 'translateX(-50%)',
          width: 2.5, height: 26, background: '#111',
          borderRadius: '2px 2px 0 0', zIndex: 5, transformOrigin: 'bottom center',
        }} />
        <div ref={dotRef} style={{
          position: 'absolute', bottom: 6, left: '50%',
          transform: 'translateX(-50%)',
          width: 7, height: 7, borderRadius: '50%',
          background: '#111', zIndex: 5, transformOrigin: 'center',
        }} />

        <Ruler rulerRef={rulerRef} />
      </div>

      {/* ── Position indicator ── */}
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        {MODES.map((label, i) => {
          const isActive   = i === mode;
          const approaching = (i === 1 && liveOffset < 0) || (i === 0 && liveOffset > 0);

          return (
            <React.Fragment key={label}>
              {i > 0 && (
                <div style={{
                  position: 'relative', width: 48, height: 2,
                  background: '#e8e8e8', borderRadius: 2,
                }}>
                  <div style={{
                    position: 'absolute', top: '50%',
                    left: mode === 0
                      ? `${liveOffset < 0 ? progress * 100 : 0}%`
                      : `${liveOffset > 0 ? (1 - progress) * 100 : 100}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#111',
                    transition: drag.current.active ? 'none' : 'left 0.45s cubic-bezier(0.34,1.56,0.64,1)',
                  }} />
                </div>
              )}
              <div style={{
                width: isActive ? 9 : 7,
                height: isActive ? 9 : 7,
                borderRadius: '50%',
                background: isActive ? '#111' : '#d0d0d0',
                border: isActive ? 'none' : '1.5px solid #ccc',
                opacity: isActive ? 1 : (approaching ? 0.4 + progress * 0.5 : 0.22),
                transition: drag.current.active ? 'none' : 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                flexShrink: 0,
              }} />
            </React.Fragment>
          );
        })}
      </div>

      {/* Hint */}
      <div style={{
        fontSize: 9, color: '#c8c8c8', letterSpacing: 3,
        fontFamily: 'monospace', marginTop: 8,
      }}>
        ← ARRASTRA →
      </div>
    </div>
  );
}

// ── Project Card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, onClick }) {
  return (
    <div onClick={onClick} style={{ touchAction: 'manipulation' }}
      className="swiper-no-swiping group border-2 border-black p-6 hover:bg-black hover:text-white transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold">{project.name}</h3>
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

// ── Trabajo Card ──────────────────────────────────────────────────────────────
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

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ProjectsSlide({ swiperRef }) {
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
        gsap.fromTo(titleRef.current,
          { y: dir * 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out' }
        );
      },
    });

    gsap.to(contentRef.current, {
      x: dir * -55, opacity: 0, duration: 0.2, ease: 'power2.in',
      onComplete: () => {
        setDisplay(next);
        gsap.fromTo(contentRef.current,
          { x: dir * 55, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }
        );
      },
    });
  }, [mode]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      <div className="flex flex-col items-center h-full w-full">

        {/* Single big title */}
        <div style={{ marginTop: '3rem', marginBottom: '0.1rem', textAlign: 'center' }}>
          <h2
            ref={titleRef}
            className="font-black uppercase tracking-widest text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(135deg, #111 0%, #555 100%)',
              fontSize: 'clamp(2.6rem, 6vw, 4.2rem)',
              lineHeight: 1,
            }}
          >
            {MODES[mode]}
          </h2>
        </div>

        {/* Dial — only rendered here, never bleeds to other slides */}
        <div style={{ marginBottom: '0.8rem' }}>
          <DragDial mode={mode} onSwitch={handleSwitch} swiperRef={swiperRef} />
        </div>

        {/* Content */}
        <div ref={contentRef} className="w-full max-w-5xl overflow-y-auto flex-1 px-8 pb-4">
          {displayMode === 0 ? (
            <div className="swiper-no-swiping grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
              {cv.projects.map((p, i) => (
                <ProjectCard key={i} project={p} onClick={() => setSel(p)} />
              ))}
            </div>
          ) : (
            <div className="swiper-no-swiping grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
              {trabajos.map((t, i) => (
                <TrabajoCard key={i} trabajo={t} />
              ))}
            </div>
          )}
        </div>

        <div className="md:hidden text-[10px] text-gray-400 mb-2 animate-pulse font-mono">
          ↕ SCROLL EN LISTA
        </div>
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
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      dot.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
    };

    const animate = () => {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.12;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.12;
      cursor.style.transform = `translate(${posRef.current.x - 20}px, ${posRef.current.y - 20}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener('mousemove', onMouseMove);

    // Hover effects
    const handleEnterImage = () => {
      cursor.classList.add('cursor-expand');
      if (cursorTextRef.current) cursorTextRef.current.style.opacity = '1';
    };
    const handleLeaveImage = () => {
      cursor.classList.remove('cursor-expand');
      if (cursorTextRef.current) cursorTextRef.current.style.opacity = '0';
    };
    const handleEnterLink = () => cursor.classList.add('cursor-hover');
    const handleLeaveLink = () => cursor.classList.remove('cursor-hover');

    const imageEls = document.querySelectorAll('[data-cursor="view"]');
    const linkEls = document.querySelectorAll('a, button, [data-cursor="hover"]');

    imageEls.forEach(el => {
      el.addEventListener('mouseenter', handleEnterImage);
      el.addEventListener('mouseleave', handleLeaveImage);
    });
    linkEls.forEach(el => {
      el.addEventListener('mouseenter', handleEnterLink);
      el.addEventListener('mouseleave', handleLeaveLink);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Outer ring */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(197, 160, 89, 0.6)',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, background 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform',
        }}
        className="custom-cursor-ring"
      >
        <span
          ref={cursorTextRef}
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.5rem',
            letterSpacing: '0.15em',
            color: '#C5A059',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            textTransform: 'uppercase',
            userSelect: 'none',
          }}
        >
          ВИЖ
        </span>
      </div>
      {/* Inner dot */}
      <div
        ref={cursorDotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#C5A059',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
        }}
      />
      <style>{`
        .custom-cursor-ring.cursor-expand {
          width: 80px !important;
          height: 80px !important;
          background: rgba(197, 160, 89, 0.08) !important;
          border-color: rgba(197, 160, 89, 0.9) !important;
        }
        .custom-cursor-ring.cursor-hover {
          width: 56px !important;
          height: 56px !important;
          background: rgba(197, 160, 89, 0.1) !important;
        }
      `}</style>
    </>
  );
}
